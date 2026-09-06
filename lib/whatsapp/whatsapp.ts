const WA_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
const WA_TOKEN = process.env.WHATSAPP_SYSTEM_TOKEN;

async function sendTemplate(phone: string, templateName: string, components: any[]) {
  const isDev = process.env.NODE_ENV === "development";
  const targetPhone = isDev ? process.env.TEST_RECIPIENT_PHONE : phone;

  const response = await fetch(WA_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: `91${targetPhone}`,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en_US" },
        components,
      },
    }),
  });
  
  const data = await response.json();
  if (!response.ok) console.error("WA API Error:", data);
  return data;
}

export const WhatsApp = {
  // CASE 1: Rent Generated (1st of the month)
  async sendRentGenerated(tenant: any, invoice: any, pg: any) {
    console.log("Template Payload:", JSON.stringify(invoice, null, 2));
    const dueDate = new Date(invoice.dueDate);
    const dueDateFormatted = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const billingMonth = dueDate.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    return sendTemplate(tenant.phone, "payment_due_reminder_v1", [
      {
        type: "body",
        parameters: [
          { type: "text", text: tenant.name },
          { type: "text", text: billingMonth },
          { type: "text", text: pg.name },
          { type: "text", text: invoice.baseRent.toString() },
          { type: "text", text: dueDateFormatted },
        ]
      },
      {
        type: "button", sub_type: "url", index: "0",
        parameters: [{ type: "text", text: invoice.id }] // Resolves to pglord.in/pay/{id}
      }
    ]);
  },

  // CASE 2: Urgent Warning (1 day before due)
  async sendUrgentWarning(tenant: any, invoice: any, pg: any) {
    const dueDate = new Date(invoice.dueDate);
    const dueDateFormatted = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const billingMonth = dueDate.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    return sendTemplate(tenant.phone, "urgent_rent_payment", [
      {
        type: "body",
        parameters: [
          { type: "text", text: tenant.name },
          { type: "text", text: invoice.baseRent.toString() },
          { type: "text", text: pg.name },
          { type: "text", text: billingMonth },
          { type: "text", text: pg.dailyLateFee.toString() },
          { type: "text", text: dueDateFormatted },
        ]
      },
      {
        type: "button", sub_type: "url", index: "0",
        parameters: [{ type: "text", text: invoice.id }]
      }
    ]);
  },

  // CASE 3: Overdue Notice (Dynamic Fines)
  async sendOverdueNotice(tenant: any, invoice: any, pg: any) {
    const dueDate = new Date(invoice.dueDate);
    const dueDateFormatted = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const billingMonth = dueDate.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    return sendTemplate(tenant.phone, "rent_payment_overdue_1 ", [
      {
        type: "body",
        parameters: [
          { type: "text", text: tenant.name },
          { type: "text", text: billingMonth },
          { type: "text", text: pg.name },
          { type: "text", text: dueDateFormatted },
          { type: "text", text: pg.dailyLateFee.toString() },
        ]
      },
      {
        type: "button", sub_type: "url", index: "0",
        parameters: [{ type: "text", text: invoice.id }]
      }
    ]);
  },

  // CASE 4: Payment Receipt (With PDF link attached)
  async sendPaymentReceipt(tenant: any, invoice: any, pg: any, amountPaid: number, utr: string) {
    return sendTemplate(tenant.phone, "rent_payment_receipt", [
      {
        type: "header",
        parameters: [
          {
            type: "document",
            document: {
              link: `https://pglord.in/api/invoices/${invoice.id}/pdf`,
              filename: `Rent_Receipt_${invoice.billingMonth}.pdf`
            }
          }
        ]
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: tenant.name },
          { type: "text", text: amountPaid.toString() },
          { type: "text", text: utr },
          { type: "text", text: pg.name },
          { type: "text", text: invoice.billingMonth },
        ]
      }
    ]);
  },

  // CASE 5: Registration Complete
  async sendRegistrationComplete(tenant: any, pg: any, roomName?: string) {
    return sendTemplate(tenant.phone, "payment_due_reminder_v2", [
      {
        type: "body",
        parameters: [
          { type: "text", text: tenant.name || "Tenant" },
          { type: "text", text: pg.name || "PG Accommodations" },
          { type: "text", text: roomName || tenant.roomId || "TBD" },
          { type: "text", text: tenant.rent?.toString() || "0" },
          { type: "text", text: tenant.rent?.toString() || "0" },
        ]
      }
    ]);
  }
};