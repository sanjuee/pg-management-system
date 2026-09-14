import { Tenant } from "@/app/generated/prisma";

export async function createPaymentLink(invoice: any, tenant: any, totalAmount: number) {
  const baseUrl = process.env.CASHFREE_ENV === "SANDBOX" 
    ? "https://sandbox.cashfree.com/pg/links" 
    : "https://api.cashfree.com/pg/links";

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": process.env.CASHFREE_CLIENT_ID!,
      "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
    },
    body: JSON.stringify({
      // Shorten the invoice ID to ensure link_id is under 50 characters
      link_id: `inv_${invoice.id.split('-')[0]}_${Date.now()}`,
      link_amount: totalAmount,
      link_currency: "INR",
      link_purpose: `Rent for Room ${tenant.room?.roomNumber ||  "TBA"} - ${invoice.billingMonth}`,
      customer_details: {
        customer_name: tenant.name,
        customer_phone: tenant.phone,
      },
      link_notify: {
        send_sms: false, // You handle notifications via WhatsApp
        send_email: false
      },
      // When the tenant pays successfully, redirect them here
      link_meta: {
        return_url: `https://bash-legwork-uphill.ngrok-free.dev/pay/${invoice.id}/success`,
        notify_url: `https://bash-legwork-uphill.ngrok-free.dev/api/webhooks/cashfree`
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cashfree Error: ${error.message}`);
  }

  return response.json();
}