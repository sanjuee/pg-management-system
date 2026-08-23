import { prisma } from "@/lib/prisma"

export async function getMonthlyRevenueData(pgId: string, year: number) {
  // 1. Fetch all invoices for the year
  const invoices = await prisma.invoice.findMany({
    where: { 
      pgId,
      billingMonth: {
        endsWith: year.toString() // e.g., matches "August 2026"
      }
    }
  })

  // 2. Setup our 12 months
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  
  // 3. Aggregate the math per month
  const monthlyData = monthNames.map(month => {
    const targetMonth = `${month} ${year}`
    
    // Filter invoices for this specific month
    const monthInvoices = invoices.filter(inv => inv.billingMonth === targetMonth)
    
    // Calculate totals
    const totalExpected = monthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const totalCollected = monthInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0)
    const totalPending = totalExpected - totalCollected
    
    // Calculate collection percentage for the progress bar
    const collectionRate = totalExpected === 0 ? 0 : Math.round((totalCollected / totalExpected) * 100)

    return {
      month,
      fullMonthString: targetMonth,
      totalExpected,
      totalCollected,
      totalPending,
      collectionRate,
      invoiceCount: monthInvoices.length
    }
  })

  // 4. Reverse it so the most recent months (or current month) can be viewed easily, 
  // or just return the standard chronological order. Chronological is usually best.
  return monthlyData
}