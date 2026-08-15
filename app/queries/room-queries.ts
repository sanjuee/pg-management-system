import { prisma } from "@/lib/prisma"

export async function getFlattenedRooms(pgId: string) {
  const units = await prisma.roomUnit.findMany({
    where: { pgId },
    include: {
      roomType: true,
      tenants: { select: { id: true, name: true } }
    },
    orderBy: { roomNumber: 'asc' }
  })

  return units.map(unit => {
    const occupantCount = unit.tenants.length
    const capacity = unit.roomType.capacity
    let status: 'Available' | 'Occupied' | 'Maintenance' = occupantCount >= capacity ? 'Occupied' : 'Available'

    return {
      id: unit.id,
      roomNumber: unit.roomNumber,
      typeName: unit.roomType.name,
      price: unit.roomType.price,
      status,
      occupantCount,
      capacity,
      tenants: unit.tenants
    }
  })
}

export async function getRoomTypesList(pgId : string){
    const types = await prisma.roomType.findMany({
        where: { pgId },
        orderBy: {price: 'desc'}
    })

    return types
}


export async function getAvailableRoomsList(pgId: string) {
  const rooms = await prisma.roomUnit.findMany({
    where: { pgId },
    include: { 
      roomType: true,
      tenants: { select: { id: true } }
    },
    orderBy: { roomNumber: 'asc' }
  })

  // Only return rooms that have less tenants than their capacity
  return rooms
    .filter(room => room.tenants.length < room.roomType.capacity)
    .map(room => ({
      id: room.id,
      roomNumber: room.roomNumber,
      price: room.roomType.price
    }))
}