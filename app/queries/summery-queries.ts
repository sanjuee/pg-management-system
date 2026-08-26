import { prisma } from "@/lib/prisma/prisma"

export async function getRentSummaryStats(pgId: string) {
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

  const invoices = await prisma.invoice.findMany({
    where: { 
      pgId,
      billingMonth: currentMonth
    }
  })

  let totalCollected = 0
  let pendingAmount = 0
  let pendingTenants = 0
  let overdueAmount = 0

  invoices.forEach(inv => {
    totalCollected += inv.amountPaid
    
    const remainingBalance = inv.totalAmount - inv.amountPaid

    if (inv.status === "PENDING" || inv.status === "PARTIAL") {
      pendingAmount += remainingBalance
      pendingTenants += 1
    } else if (inv.status === "OVERDUE") {
      overdueAmount += remainingBalance
    }
  })

  return { totalCollected, pendingAmount, pendingTenants, overdueAmount, currentMonth }
}