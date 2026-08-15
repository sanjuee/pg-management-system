// app/queries/tenant-queries.ts
import { prisma } from "@/lib/prisma"

export async function getRentLedgerData(pgId: string) {
  const tenants = await prisma.tenant.findMany({
    where: { pgId },
    include: { room: true },
    orderBy: { createdAt: 'desc' }
  })

  // Format dates to look nice (e.g., "1 Oct 2026")
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const formattedDate = currentMonthStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return tenants.map(tenant => ({
    id: tenant.id,
    name: tenant.name,
    room: tenant.room ? tenant.room.roomNumber : "Unassigned",
    amount: tenant.rent,
    dueDate: formattedDate,
    status: "Pending", // Default for now until we build the payment update logic
    phone: tenant.phone
  }))
}