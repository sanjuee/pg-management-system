import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  try {
    // 1. Security Check
    // const authHeader = request.headers.get("authorization");
    // if (authHeader !== `Bearer ${CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const today = new Date();
    const currentMonthName = today.toLocaleString("default", { month: "long", year: "numeric" }); // e.g., "August 2026"
    
    // Fetch all PGs and their tenants
    const pgs = await prisma.pG.findMany({
      include: { tenants: true }
    });

    let newInvoicesCreated = 0;
    let finesApplied = 0;

    for (const pg of pgs) {
      // 2. AUTOMATIC INVOICE GENERATION
      // Check if today matches or is past the billing cycle date (default is 1st of the month)
      if (today.getDate() >= pg.billingCycleDate) {
        for (const tenant of pg.tenants) {
          // Check if an invoice for this month already exists for this tenant
          const existingInvoice = await prisma.invoice.findFirst({
            where: {
              tenantId: tenant.id,
              billingMonth: currentMonthName,
            },
          });

          if (!existingInvoice) {
            // Calculate due date 
            const dueDate = new Date(today.getFullYear(), today.getMonth(), pg.rentDueDate);

            await prisma.invoice.create({
              data: {
                billingMonth: currentMonthName,
                baseRent: tenant.rent,
                accumulatedFine: 0,
                totalAmount: tenant.rent,
                amountPaid: 0,
                status: "PENDING",
                dueDate: dueDate,
                tenantId: tenant.id,
                pgId: pg.id,
              },
            });
            newInvoicesCreated++;
          }
        }
      }

      // 3. DAILY LATE FEE & OVERDUE ENGINE
      // Find all invoices that are not fully paid yet
      const activeInvoices = await prisma.invoice.findMany({
        where: {
          pgId: pg.id,
          status: { not: "PAID" },
        },
      });

      for (const inv of activeInvoices) {
        if (today > new Date(inv.dueDate)) {
          // It's past the due date! Apply the daily late fee if not already accounted for today
          const newFine = inv.accumulatedFine + pg.dailyLateFee;
          const newTotal = inv.baseRent + newFine;

          await prisma.invoice.update({
            where: { id: inv.id },
            data: {
              accumulatedFine: newFine,
              totalAmount: newTotal,
              status: "OVERDUE", // Flip status to overdue
            },
          });
          finesApplied++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Billing engine ran successfully",
      newInvoicesCreated,
      finesApplied,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}