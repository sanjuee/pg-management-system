"use server"

import { prisma } from "@/lib/prisma"
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
  revalidatePath("/dashboard/rooms")
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

  revalidatePath("/dashboard/rooms")
}
