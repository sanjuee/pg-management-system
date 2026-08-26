"use server"

import { prisma } from "@/lib/prisma/prisma"
import { revalidatePath } from "next/cache"


// ------------------------------------------------------------------
// 2. CREATE: Add a new Room Type (e.g., "3-Sharing Non-AC")
// ------------------------------------------------------------------
export async function createRoomTypeAction(formData: FormData) {
  const pgId = formData.get("pgId") as string
  const name = formData.get("name") as string
  const price = parseFloat(formData.get("price") as string)
  const capacity = parseInt(formData.get("capacity") as string, 10)

  if (!pgId || !name || !price || !capacity) {
    throw new Error("Missing required fields for Room Type")
  }

  await prisma.roomType.create({
    data: { pgId, name, price, capacity }
  })

  // Refreshes the page data instantly
  revalidatePath("/rooms")
}

// ------------------------------------------------------------------
// 3. CREATE: Add a new Physical Room Unit (e.g., "Room 101")
// ------------------------------------------------------------------
export async function createRoomUnitAction(formData: FormData) {
  const pgId = formData.get("pgId") as string
  const roomTypeId = formData.get("roomTypeId") as string
  const roomNumber = formData.get("roomNumber") as string

  if (!pgId || !roomTypeId || !roomNumber) {
    throw new Error("Missing required fields for Room Unit")
  }

  // Application-level check to prevent duplicate room numbers in the same PG
  const existingRoom = await prisma.roomUnit.findFirst({
    where: { pgId, roomNumber }
  })

  if (existingRoom) {
    throw new Error(`Room number ${roomNumber} already exists in this PG.`)
  }

  await prisma.roomUnit.create({
    data: { pgId, roomTypeId, roomNumber }
  })

  revalidatePath("/rooms")
}


// ------------------------------------------------------------------
// 5. UPDATE: Edit a physical room unit
// ------------------------------------------------------------------
export async function updateRoomUnitAction(roomId: string, formData: FormData) {
  const roomNumber = formData.get("roomNumber") as string
  const roomTypeId = formData.get("roomTypeId") as string

  const currentRoom = await prisma.roomUnit.findUnique({
    where: { id: roomId },
    include: {
      _count: {
        select: { tenants: true }
      }
    }
  })

  const targetCategory = await prisma.roomType.findUnique({
    where: { id: roomTypeId }
  })

  const currentOccupancy = currentRoom?._count.tenants || 0
  const targetCapacity = targetCategory?.capacity || 0

  if (targetCapacity < currentOccupancy) {
    return {
      success: false,
      error: `Cannot switch to this category. Room currently has ${currentOccupancy} living occupants, but the chosen category layout only permits a maximum of ${targetCapacity} beds.`
    }
  }

  await prisma.roomUnit.update({
    where: { id: roomId },
    data: { roomNumber, roomTypeId }
  })

  revalidatePath("/rooms")
  return { success: true }
}

// ------------------------------------------------------------------
// 6. DELETE: Remove a physical room unit
// ------------------------------------------------------------------
export async function deleteRoomUnitAction(roomId: string) {
  // Check if room has active tenants before deleting
  const room = await prisma.roomUnit.findUnique({
    where: { id: roomId },
    include: { tenants: true }
  })

  if (room && room.tenants.length > 0) {
    throw new Error("Cannot delete a room that has active tenants. Reassign them first.")
  }

  await prisma.roomUnit.delete({
    where: { id: roomId }
  })

  revalidatePath("/rooms")
}


// ------------------------------------------------------------------
// 7. UPDATE: Edit a Room Type (Category) with Safety Guardrails
// ------------------------------------------------------------------
// app/actions/room-actions.ts

export async function updateRoomTypeAction(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const price = parseFloat(formData.get("price") as string)
  const capacity = parseInt(formData.get("capacity") as string, 10)

  const roomsOfType = await prisma.roomUnit.findMany({
    where: { roomTypeId: id },
    include: { _count: { select: { tenants: true } } }
  })

  const maxCurrentOccupancy = roomsOfType.reduce((max, room) => {
    return room._count.tenants > max ? room._count.tenants : max
  }, 0)

  if (capacity < maxCurrentOccupancy) {
    return {
      success: false,
      error: `Cannot lower capacity to ${capacity}. One of your physical rooms in this category already has ${maxCurrentOccupancy} tenants living in it.`
    }
  }

  await prisma.roomType.update({
    where: { id },
    data: { name, price, capacity }
  })

  revalidatePath("/dashboard/rooms")
  return { success: true } // ✅ Let the client know it worked!
}


// ------------------------------------------------------------------
// 8. DELETE: Remove a Room Type (Category)
// ------------------------------------------------------------------
export async function deleteRoomTypeAction(id: string) {
  // SAFETY CHECK: Are there any physical rooms using this category?
  const linkedRooms = await prisma.roomUnit.count({
    where: { roomTypeId: id }
  })

  if (linkedRooms > 0) {
    throw new Error(`Cannot delete this category because ${linkedRooms} physical room(s) are using it. Reassign them first.`)
  }

  await prisma.roomType.delete({
    where: { id }
  })

  revalidatePath("/rooms")
}