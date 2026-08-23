import { prisma } from "@/lib/prisma"

export async function getRentLedgerData(pgId: string) {
  // 1. Fetch all invoices for the PG
  const invoices = await prisma.invoice.findMany({
    where: { pgId },
    include: { 
      tenant: {
        include: { room: true } // Fetch room details to display room number
      }
    },
    orderBy: [
      { status: "desc" }, // PENDING > PARTIAL > PAID > OVERDUE (alphabetically reversed)
    ]
  })

  // 2. Map them into the flat structure your UI Table expects
  return invoices.map((inv) => ({
    id: inv.id, // IMPORTANT: This is now the INVOICE ID, not the tenant ID
    tenantId: inv.tenant.id,
    name: inv.tenant.name,
    room: inv.tenant.room?.roomNumber || "Unassigned",
    amount: inv.totalAmount,         // Total they owe
    amountPaid: inv.amountPaid,      // How much they've paid so far
    baseRent: inv.baseRent,
    accumulatedFine: inv.accumulatedFine,
    dueDate: inv.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: inv.status,              // "PENDING", "PARTIAL", "PAID", "OVERDUE"
    phone: inv.tenant.phone
  }))
}

export async function getUnassignedTenantsList(pgId: string) {
  return await prisma.tenant.findMany({
    where: { 
      pgId, 
      roomId: null // Only fetch people without a room
    },
    select: { id: true, name: true, phone: true }
  })
}


