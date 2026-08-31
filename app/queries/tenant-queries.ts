import { prisma } from "@/lib/prisma/prisma"

export async function getRentLedgerData(pgId: string) {
  // 1. Fetch all invoices for the PG
  const invoices = await prisma.invoice.findMany({
    where: { pgId },
    include: { 
      tenant: {
        include: { room: true } // Fetch room details to display room number
      }
    }
  });

  // 2. Define your custom sort priority map
  const statusPriority: Record<string, number> = {
    OVERDUE: 1,
    PENDING: 2,
    PARTIAL: 3,
    PAID: 4,
  };

  // 3. Sort the array using JavaScript based on the priority map
  const sortedInvoices = invoices.sort((a, b) => {
    const priorityA = statusPriority[a.status?.toUpperCase()] || 99;
    const priorityB = statusPriority[b.status?.toUpperCase()] || 99;
    return priorityA - priorityB;
  });

  // 4. Map the sorted invoices to your table's expected format
  return sortedInvoices.map(inv => ({
    id: inv.id,
    billingMonth: inv.billingMonth,
    tenantId: inv.tenant.id,
    name: inv.tenant.name,
    phone: inv.tenant.phone,
    room: inv.tenant.room?.roomNumber || "Unassigned",
    amount: inv.totalAmount,
    amountPaid: inv.amountPaid,
    baseRent: inv.baseRent,
    accumulatedFine: inv.accumulatedFine,
    dueDate: new Date(inv.dueDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    status: inv.status,
  }));
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

export async function getAllTenantsDirectory(pgId: string) {
  const tenants = await prisma.tenant.findMany({
    where: { pgId },
    include: {
      room: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return tenants.map(tenant => ({
    id: tenant.id,
    name: tenant.name,
    phone: tenant.phone,
    email: tenant.email,
    rent: tenant.rent,
    room: tenant.room?.roomNumber || "Unassigned",
    joinedDate: new Date(tenant.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }));
}
