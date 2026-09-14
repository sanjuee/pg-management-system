import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma/prisma";
import { WhatsApp } from "@/lib/whatsapp/whatsapp";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");
    const rawBody = await request.text();

    console.log("=== RAW WEBHOOK RECEIVED ===");
    console.log("Raw Body:", rawBody);
    console.log("Signature header:", signature);
    console.log("Timestamp header:", timestamp);

    if (!signature || !timestamp) {
      return new NextResponse("Missing signature or timestamp", { status: 400 });
    }

    const secret = process.env.CASHFREE_CLIENT_SECRET;
    if (!secret) {
      console.error("Missing CASHFREE_CLIENT_SECRET environment variable");
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // Verify Cashfree Signature
    const data = timestamp + rawBody;
    const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("base64");

    console.log("=== Webhook Debug ===");
    console.log("Timestamp:", timestamp);
    console.log("Expected Sig:", expectedSignature);
    console.log("Received Sig:", signature);

    if (expectedSignature !== signature) {
      console.error("Signature mismatch!");
      return new NextResponse("Invalid Signature", { status: 401 });
    }

    const body = JSON.parse(rawBody);
    console.log("Webhook Type:", body.type);
    console.log("Link Status:", body.data?.link_status); // link_status is directly on data, not data.link

    // Process Payment Success Event (can be PAYMENT_LINK_EVENT or PAYMENT_SUCCESS_WEBHOOK)
    const isPaymentLinkPaid = body.type === "PAYMENT_LINK_EVENT" && body.data?.link_status === "PAID";
    const isOrderPaid = body.type === "PAYMENT_SUCCESS_WEBHOOK" && body.data?.payment?.payment_status === "SUCCESS";

    console.log("isPaymentLinkPaid:", isPaymentLinkPaid, "isOrderPaid:", isOrderPaid);

    if (isPaymentLinkPaid || isOrderPaid) {
      // For PAYMENT_LINK_EVENT: link_id and link_amount_paid are directly on body.data
      // For PAYMENT_SUCCESS_WEBHOOK: our link_id is in body.data.order.order_tags.link_id
      let linkId = body.data?.link_id                         // PAYMENT_LINK_EVENT
                || body.data?.order?.order_tags?.link_id      // PAYMENT_SUCCESS_WEBHOOK
                || body.data?.order?.order_id;                // fallback
      console.log("Raw extracted linkId:", linkId);

      const amountPaid = body.data?.link_amount_paid           // PAYMENT_LINK_EVENT
                        || body.data?.payment?.payment_amount  // PAYMENT_SUCCESS_WEBHOOK
                        || body.data?.link_amount;
      
      const paymentMethod = body.data?.payment?.payment_group || "ONLINE";
      const referenceId = body.data?.payment?.bank_reference || body.data?.order?.order_id || null;

      // Find the invoice in the database by linkId
      const invoice = await prisma.invoice.findFirst({
        where: { paymentLinkId: linkId },
        include: { tenant: true, pg: true }
      });

      console.log("Found invoice:", invoice?.id || "NULL");

      if (!invoice) {
        console.error("Invoice not found for linkId:", linkId);
        return new NextResponse("Invoice not found", { status: 404 });
      }

      // Check if already paid to prevent duplicate processing
      if (invoice.status === "PAID") {
        return NextResponse.json({ success: true, message: "Invoice already marked as PAID" });
      }

      // 1. Update Invoice status to PAID
      const updatedInvoice = await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: "PAID",
          amountPaid: invoice.totalAmount, // or use amountPaid from webhook if partial payments are allowed
        }
      });

      // 2. Create Transaction Record
      await prisma.transaction.create({
        data: {
          amount: parseFloat(amountPaid),
          paymentMethod: paymentMethod,
          referenceId: referenceId,
          invoiceId: invoice.id,
        }
      });

      // 3. Send WhatsApp Receipt
      try {
        await WhatsApp.sendPaymentReceipt(
          invoice.tenant, 
          updatedInvoice, 
          invoice.pg, 
          amountPaid, 
          referenceId || "CASHFREE"
        );
      } catch (waError) {
        console.error("Failed to send WhatsApp receipt:", waError);
      }

      return NextResponse.json({ success: true, message: "Payment processed successfully" });
    }

    // Acknowledge other events (like PAYMENT_LINK_EVENT with status PENDING, etc) without processing
    return NextResponse.json({ success: true, message: "Event ignored" });
  } catch (error) {
    console.error("Cashfree Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
