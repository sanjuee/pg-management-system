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

  const newTenant = await prisma.tenant.create({
  data: {
    name,
    phone,
    rent,
    pgId: pgId,
    roomId: roomId || null,
    
    // 👇 NEW: Generate their very first invoice instantly 👇
    invoices: {
      create: {
        billingMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        baseRent: rent,
        totalAmount: rent, // baseRent + 0 fines
        status: "PENDING",
        dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5), // Sets due date to the 5th
        pgId: pgId
      }
    }
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

export async function updateTenantDetailsAction(tenantId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const rent = parseFloat(formData.get("rent") as string);

  if (!name || !phone || isNaN(rent)) {
    return { success: false, error: "All fields are required." };
  }

  try {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { name, phone, rent }
    });

    revalidatePath("/dashboard/rent");
    revalidatePath("/dashboard/rooms");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update tenant details." };
  }
}

