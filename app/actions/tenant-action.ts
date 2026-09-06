"use server"

import { prisma } from "@/lib/prisma/prisma"
import { revalidatePath } from "next/cache"

export async function createTenantAction(formData: FormData) {
  const pgId = formData.get("pgId") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  if (!pgId || !name || !phone) {
    throw new Error("Missing required fields for Tenant")
  }

  // If no room is selected, rent starts at 0 (will be set when a room is assigned)
  const rent = parseFloat(formData.get("rent") as string) || 0
  const roomId = formData.get("roomId") as string
  const skipCurrentMonth = formData.get("skipCurrentMonth") === "on"

  const newTenant = await prisma.tenant.create({
  data: {
    name,
    phone,
    rent,
    pgId: pgId,
    roomId: roomId || null,
    
    // Only create an invoice for the current month if not skipped AND a room is assigned
    ...(!skipCurrentMonth && roomId && {
      invoices: {
        create: {
          billingMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          baseRent: rent,
          totalAmount: rent, // baseRent + 0 fines
          status: "PENDING",
          dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
          pgId: pgId
        }
      }
    })
  }
})

  revalidatePath("/pg/[pgId]/rent", "page")
  revalidatePath("/pg/[pgId]/rooms", "page")
  revalidatePath("/pg/[pgId]/tenants", "page")
}

export async function unassignTenantAction(tenantId: string) {
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { roomId: null }
  })

  // Refresh both pages to reflect the vacancy
  revalidatePath("/pg/[pgId]/rooms", "page")
  revalidatePath("/pg/[pgId]/rent", "page")
  
}

export async function assignExistingTenantAction(tenantId: string, roomId: string, skipCurrentMonth: boolean = false) {
  if (!tenantId || !roomId) throw new Error("Missing tenant or room ID");

  // Look up the room's price to auto-set the tenant's rent
  const room = await prisma.roomUnit.findUnique({
    where: { id: roomId },
    include: { roomType: true }
  })

  const rent = room?.roomType?.price ?? 0

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: { roomId, rent }
  })

  if (!skipCurrentMonth) {
    await prisma.invoice.create({
      data: {
        tenantId,
        pgId: tenant.pgId,
        billingMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        baseRent: rent,
        totalAmount: rent,
        status: "PENDING",
        dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      }
    });
  }

  revalidatePath("/pg/[pgId]/rooms", "page")
  revalidatePath("/pg/[pgId]/rent", "page")
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

    revalidatePath("/pg/[pgId]/rent", "page");
    revalidatePath("/pg/[pgId]/rooms", "page");
    revalidatePath("/pg/[pgId]/tenants", "page");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update tenant details." };
  }
}

export async function deleteTenantAction(tenantId: string) {
      if (!tenantId) throw new Error("Tenant ID is required");

      try {
        await prisma.tenant.delete({
          where: { id: tenantId }
        });

        revalidatePath("/pg/[pgId]/rent", "page");
        revalidatePath("/pg/[pgId]/rooms", "page");
        revalidatePath("/pg/[pgId]/tenants", "page");
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to delete tenant." };
      }
    }

