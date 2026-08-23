import { prisma } from "@/lib/prisma"

export async function getLedgerMatrixData(pgId: string, year: number) {
  // 1. Fetch all tenants and their invoices for the given year
  const tenants = await prisma.tenant.findMany({
    where: { pgId },
    include: {
      room: true,
      invoices: {
        where: {
          billingMonth: {
            endsWith: year.toString() // Matches "August 2026", "September 2026", etc.
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  // 2. Define our X-Axis (Columns)
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const columns = monthNames.map(m => `${m} ${year}`);
  const shortColumns = monthNames.map(m => m.substring(0, 3)); // "Jan", "Feb", etc.

  // 3. Pivot the data: Y-Axis = Tenants, X-Axis = Months
  const matrix = tenants.map(tenant => {
    const monthData: Record<string, any> = {};
    
    // Fill in the matching invoices
    tenant.invoices.forEach(inv => {
      monthData[inv.billingMonth] = inv;
    });

    return {
      id: tenant.id,
      name: tenant.name,
      room: tenant.room?.roomNumber || "N/A",
      months: monthData
    }
  });

  return { columns, shortColumns, matrix };
}