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