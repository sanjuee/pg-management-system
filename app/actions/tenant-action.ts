"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTenantAction(formData: FormData) {
  const pgId = formData.get("pgId") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const rent = parseFloat(formData.get("rent") as string)
  const roomId = formData.get("roomId") as string // This might be empty if unassigned

  if (!pgId || !name || !phone || isNaN(rent)) {
    throw new Error("Missing required fields for Tenant")
  }

  await prisma.tenant.create({
    data: {
      pgId,
      name,
      phone,
      rent,
      ...(roomId ? { roomId } : {})
    }
  })

  revalidatePath("/rent")
  revalidatePath("/rooms")
}

export async function unassignTenantAction(tenantId: string) {
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { roomId: null }
  })

  // Refresh both pages to reflect the vacancy
  revalidatePath("/rooms")
  revalidatePath("/rent")
}

export async function assignExistingTenantAction(tenantId: string, roomId: string) {
  if (!tenantId || !roomId) throw new Error("Missing tenant or room ID");

  await prisma.tenant.update({
    where: { id: tenantId },
    data: { roomId }
  })

  revalidatePath("/rooms")
  revalidatePath("/rent")
}

