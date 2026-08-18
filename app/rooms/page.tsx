import { getFlattenedRooms, getRoomTypesList } from "@/app/queries/room-queries"
import { getUnassignedTenantsList } from "@/app/queries/tenant-queries" // <--- Import
import RoomInventoryGrid from "./components/RoomInventoryGrid"

export default async function RoomInventoryPage() {
  const pgId = "4f3c2b81-9d11-4a5e-b287-73c09r3e4b1a"

  const [rooms, roomTypes, unassignedTenants] = await Promise.all([
          getFlattenedRooms(pgId),
          getRoomTypesList(pgId),
           getUnassignedTenantsList(pgId) ,
  ])

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-white min-h-screen">
      <RoomInventoryGrid 
        initialRooms={rooms} 
        roomTypes={roomTypes} 
        unassignedTenants={unassignedTenants} 
        pgId={pgId} 
      />
    </div>
  )
}