import { prisma } from "@/lib/prisma/prisma"

export async function getRentLedgerData(pgId: string) {
  // 1. Fetch all invoices for the PG with transactions for PAID invoices
  const invoices = await prisma.invoice.findMany({
    where: { pgId },
    include: { 
      tenant: {
        include: { room: true } // Fetch room details to display room number
      },
      pg: {
        select: { name: true, upiId: true, address: true, phone: true }
      },
      transactions: {
        orderBy: { dateReceived: 'desc' },
        take: 1, // Most recent payment
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  // Build a sequential invoice number map per PG
  const invoiceNumberMap = new Map<string, number>();
  invoices.forEach((inv, index) => {
    invoiceNumberMap.set(inv.id, index + 1);
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
    dueDateRaw: inv.dueDate.toISOString(),
    status: inv.status,
    // PDF Invoice data
    pgName: inv.pg.name,
    pgUpiId: inv.pg.upiId,
    pgAddress: inv.pg.address,
    pgPhone: inv.pg.phone,
    invoiceNumber: invoiceNumberMap.get(inv.id) || 1,
    invoiceYear: inv.createdAt.getFullYear(),
    createdAt: inv.createdAt.toISOString(),
    lastPaymentMethod: inv.transactions[0]?.paymentMethod || null,
    lastPaymentDate: inv.transactions[0]?.dateReceived?.toISOString() || null,
    lastPaymentRef: inv.transactions[0]?.referenceId || null,
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
