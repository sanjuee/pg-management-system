import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";
import { WhatsApp } from "@/lib/whatsapp/whatsapp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get("key");
  const authHeader = request.headers.get("Authorization");

  const isAuthorized =
    process.env.NODE_ENV === "development" || // 👈 Allows running freely on localhost
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    secretKey === process.env.CRON_SECRET;

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch all unpaid invoices
  const unpaidInvoices = await prisma.invoice.findMany({
    where: { status: { in: ["PENDING", "PARTIAL"] } },
    include: { tenant: true, pg: true },
  });

  for (const invoice of unpaidInvoices) {
    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    try {
      if (diffDays === 5) {
        // CASE 1: 5 days before due date (Standard Reminder)
        await WhatsApp.sendRentGenerated(invoice.tenant, invoice, invoice.pg);
      } 
      else if (diffDays === 1) {
        // CASE 2: 1 day before due (Urgent Warning)
        await WhatsApp.sendUrgentWarning(invoice.tenant, invoice, invoice.pg);
      } 
      else if (diffDays === -1 || diffDays === -3 || diffDays === -7) {
        // CASE 3: Overdue Notice (Triggered 1st, 3rd, and 7th day after due date)
        await WhatsApp.sendOverdueNotice(invoice.tenant, invoice, invoice.pg);
      }
    } catch (error) {
      console.error(`Failed to message tenant ${invoice.tenant.phone}:`, error);
    }
  }

  return NextResponse.json({ success: true, processed: unpaidInvoices.length });
}