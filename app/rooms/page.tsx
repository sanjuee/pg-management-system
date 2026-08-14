// app/dashboard/rooms/page.tsx
import { getFlattenedRooms, getRoomTypesList } from "@/app/queries/room-queries"
import RoomInventoryGrid from "./components/RoomInventoryGrid"

export default async function RoomInventoryPage() {
  const CURRENT_PG_ID = "4f3c2b81-9d11-4a5e-b287-73c09r3e4b1a"
  
  const rooms = await getFlattenedRooms(CURRENT_PG_ID)
  const roomTypes = await getRoomTypesList(CURRENT_PG_ID) // Fetch categories list for the creation dropdown

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-white min-h-screen">
      <RoomInventoryGrid initialRooms={rooms} roomTypes={roomTypes} pgId={CURRENT_PG_ID} />
    </div>
  )
}