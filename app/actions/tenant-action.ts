"use server"

import { prisma } from "@/lib/prisma/prisma"
import { revalidatePath } from "next/cache"
import { WhatsApp } from "@/lib/whatsapp/whatsapp"

export async function createTenantAction(formData: FormData) {
  const pgId = formData.get("pgId") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  if (!pgId || !name || !phone) {
    throw new Error("Missing required fields for Tenant")
  }

  // If no room is selected, rent starts at 0 (will be set when a room is assigned)
  const rent = parseFloat(formData.get("rent") as string) || 0
  const securityDeposit = parseFloat(formData.get("securityDeposit") as string) || 0
  const roomId = formData.get("roomId") as string
  const skipCurrentMonth = formData.get("skipCurrentMonth") === "on"

  const pg = await prisma.pG.findUnique({ where: { id: pgId } })
  const rentDueDateDays = pg?.rentDueDate || 0
  
  const today = new Date()
  const dueDate = new Date(today)
  dueDate.setDate(today.getDate() + rentDueDateDays)

  const newTenant = await prisma.tenant.create({
  data: {
    name,
    phone,
    rent,
    securityDeposit,
    pgId: pgId,
    roomId: roomId || null,
    
    // Only create an invoice for the current month if not skipped AND a room is assigned
    ...(!skipCurrentMonth && roomId && {
      invoices: {
        create: {
          billingMonth: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
          baseRent: rent,
          totalAmount: rent, // baseRent + 0 fines
          status: "PENDING",
          dueDate: dueDate,
          pgId: pgId
        }
      }
    })
  },
  include: {
    invoices: true,
    room: true,
    pg: true
  }
})

  if (roomId && newTenant.room) {
    try {
      await WhatsApp.sendRegistrationComplete(newTenant, newTenant.pg, newTenant.room.roomNumber);
    } catch (err) {
      console.error("Error sending registration WhatsApp message:", err);
    }
  }

  if (!skipCurrentMonth && roomId && newTenant.invoices && newTenant.invoices.length > 0) {
    try {
      await WhatsApp.sendRentGenerated(newTenant, newTenant.invoices[0], newTenant.pg);
    } catch (err) {
      console.error("Error sending rent generation WhatsApp message:", err);
    }
  }

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
    data: { roomId, rent },
    include: { pg: true, room: true }
  })

  let invoice = null;

  if (!skipCurrentMonth) {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + (tenant.pg?.rentDueDate || 0));

    invoice = await prisma.invoice.create({
      data: {
        tenantId,
        pgId: tenant.pgId,
        billingMonth: today.toLocaleString('default', { month: 'long', year: 'numeric' }),
        baseRent: rent,
        totalAmount: rent,
        status: "PENDING",
        dueDate: dueDate,
      }
    });
  }

  if (roomId && tenant.room) {
    try {
      await WhatsApp.sendRegistrationComplete(tenant, tenant.pg, tenant.room.roomNumber);
    } catch (err) {
      console.error("Error sending registration WhatsApp message:", err);
    }
  }

  if (invoice) {
    try {
      await WhatsApp.sendRentGenerated(tenant, invoice, tenant.pg);
    } catch (err) {
      console.error("Error sending rent generation WhatsApp message:", err);
    }
  }

  revalidatePath("/pg/[pgId]/rooms", "page")
  revalidatePath("/pg/[pgId]/rent", "page")
}

export async function updateTenantDetailsAction(tenantId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const rent = parseFloat(formData.get("rent") as string);
  const securityDeposit = parseFloat(formData.get("securityDeposit") as string);

  if (!name || !phone || isNaN(rent)) {
    return { success: false, error: "All fields are required." };
  }

  try {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { name, phone, rent, ...(isNaN(securityDeposit) ? {} : { securityDeposit }) }
    });

    revalidatePath("/pg/[pgId]/rent", "page");
    revalidatePath("/pg/[pgId]/rooms", "page");
    revalidatePath("/pg/[pgId]/tenants", "page");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update tenant details." };
  }
}

export async function deleteTenantAction(tenantId: string, refundAmount: number = 0, refundMethod: string = 'Cash', refundNote: string = '') {
      if (!tenantId) throw new Error("Tenant ID is required");

      try {
        const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) throw new Error("Tenant not found");

        if (refundAmount > 0) {
          const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
          await prisma.expense.create({
            data: {
              pgId: tenant.pgId,
              category: "Deposit Refund",
              amount: refundAmount,
              note: `Refunded to ${tenant.name} (${refundMethod}) - ${refundNote}`,
              month: currentMonth
            }
          });
        }

        await prisma.tenant.delete({
          where: { id: tenantId }
        });

        revalidatePath("/pg/[pgId]/rent", "page");
        revalidatePath("/pg/[pgId]/rooms", "page");
        revalidatePath("/pg/[pgId]/tenants", "page");
        revalidatePath("/pg/[pgId]/expenses", "page");
        return { success: true };
      } catch (error) {
        return { success: false, error: "Failed to delete tenant." };
      }
    }

