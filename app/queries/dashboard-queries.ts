import { prisma } from "@/lib/prisma/prisma"

export async function getRevenueTracker(pgId: string) {
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })
  const invoices = await prisma.invoice.findMany({
    where: { 
      pgId,
      billingMonth: currentMonth
    }
  })

  let totalExpected = 0
  let totalCollected = 0

  invoices.forEach(inv => {
    totalExpected += inv.totalAmount
    totalCollected += inv.amountPaid
  })

  return { totalExpected, totalCollected }
}

export async function getOverdueAlerts(pgId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { 
      pgId,
      status: "OVERDUE"
    }
  })

  let totalPendingLateFees = 0
  let defaultingTenants = 0

  invoices.forEach(inv => {
    totalPendingLateFees += inv.accumulatedFine
    defaultingTenants++
  })

  return { totalPendingLateFees, defaultingTenants }
}

export async function getNetProfit(pgId: string) {
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })
  
  const invoices = await prisma.invoice.findMany({
    where: { 
      pgId,
      billingMonth: currentMonth
    }
  })

  const expenses = await prisma.expense.findMany({
    where: {
      pgId,
      month: currentMonth
    }
  })

  let totalCollected = 0
  invoices.forEach(inv => totalCollected += inv.amountPaid)

  let totalExpenses = 0
  expenses.forEach((exp: any) => totalExpenses += exp.amount)

  return { totalCollected, totalExpenses, netProfit: totalCollected - totalExpenses }
}

export async function getOccupancyMetrics(pgId: string) {
  const units = await prisma.roomUnit.findMany({
    where: { pgId },
    include: {
      roomType: true,
      tenants: true
    }
  })

  let totalCapacity = 0
  let occupiedBeds = 0

  units.forEach(unit => {
    totalCapacity += unit.roomType.capacity
    occupiedBeds += unit.tenants.length
  })

  return { totalCapacity, occupiedBeds, emptyBeds: totalCapacity - occupiedBeds }
}

export async function getOrphanedTenants(pgId: string) {
  return await prisma.tenant.findMany({
    where: { 
      pgId, 
      roomId: null 
    },
    select: { id: true, name: true, phone: true }
  })
}

export async function getRecentPayments(pgId: string) {
  return await prisma.transaction.findMany({
    where: {
      invoice: {
        pgId
      }
    },
    include: {
      invoice: {
        include: {
          tenant: {
            include: {
              room: true
            }
          }
        }
      }
    },
    orderBy: {
      dateReceived: 'desc'
    },
    take: 5
  }).then(transactions => transactions.map(t => ({
    id: t.id,
    amount: t.amount,
    date: t.dateReceived,
    tenantName: t.invoice.tenant.name,
    roomNumber: t.invoice.tenant.room?.roomNumber || 'Unassigned'
  })))
}


export async function getMonthlyProfitHistory(pgId: string) {
  const invoices = await prisma.invoice.findMany({
    where: { pgId }
  })
  const expenses = await prisma.expense.findMany({
    where: { pgId }
  })

  const monthlyData: Record<string, { collected: number, expenses: number, month: string }> = {}

  invoices.forEach(inv => {
    if (!monthlyData[inv.billingMonth]) {
      monthlyData[inv.billingMonth] = { collected: 0, expenses: 0, month: inv.billingMonth }
    }
    monthlyData[inv.billingMonth].collected += inv.amountPaid
  })

  expenses.forEach((exp: any) => {
    if (!monthlyData[exp.month]) {
      monthlyData[exp.month] = { collected: 0, expenses: 0, month: exp.month }
    }
    monthlyData[exp.month].expenses += exp.amount
  })

  // Convert to array and sort by date (descending approx)
  const result = Object.values(monthlyData)
  result.sort((a, b) => {
     // rudimentary sort by parsing the string e.g. "August 2026"
     const dateA = new Date(a.month)
     const dateB = new Date(b.month)
     return dateB.getTime() - dateA.getTime()
  })

  return result
}
