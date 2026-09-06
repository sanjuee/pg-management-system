import {
  getFlattenedRooms,
  getRoomTypesList,
} from "@/app/queries/room-queries";
import { getUnassignedTenantsList } from "@/app/queries/tenant-queries";
import RoomInventoryGrid from "./components/RoomInventoryGrid";

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;

  const [rooms, roomTypes, unassignedTenants] = await Promise.all([
    getFlattenedRooms(pgId),
    getRoomTypesList(pgId),
    getUnassignedTenantsList(pgId),
  ]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-white min-h-screen">
      <RoomInventoryGrid
        initialRooms={rooms}
        roomTypes={roomTypes}
        unassignedTenants={unassignedTenants}
        pgId={pgId}
      />
    </div>
  );
}
