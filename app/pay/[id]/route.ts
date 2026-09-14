import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    if (invoice.status === "PAID") {
      return new NextResponse("This invoice has already been paid.", { status: 400 });
    }

    if (invoice.paymentLinkUrl) {
      return NextResponse.redirect(invoice.paymentLinkUrl);
    } else {
      return new NextResponse("Payment link not available for this invoice.", { status: 404 });
    }
  } catch (error) {
    console.error("Error finding invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
