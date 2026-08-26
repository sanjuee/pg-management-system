import { prisma } from "@/lib/prisma/prisma"

/**
 * Returns all PGs owned by a specific owner (Supabase user ID).
 */
export async function getOwnerPGs(ownerId: string) {
  return await prisma.pG.findMany({
    where: { ownerId },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      upiId: true,
      billingCycleDate: true,
      rentDueDate: true,
      dailyLateFee: true,
    }
  })
}

/**
 * Returns a single PG by ID, but only if it belongs to the given owner.
 * Returns null if not found or not authorized.
 */
export async function getPGById(pgId: string, ownerId: string) {
  return await prisma.pG.findFirst({
    where: { id: pgId, ownerId },
    select: {
      id: true,
      name: true,
      upiId: true,
      billingCycleDate: true,
      rentDueDate: true,
      dailyLateFee: true,
    }
  })
}
