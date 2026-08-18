// app/dashboard/rent/page.tsx
import { getRentLedgerData } from "@/app/queries/tenant-queries";
import { getAvailableRoomsList } from "@/app/queries/room-queries";
import RentDashboardClient from "./components/RentDashboardClient";

export default async function RentPage() {
  const CURRENT_PG_ID = "4f3c2b81-9d11-4a5e-b287-73c09r3e4b1a";

  // Fetch real data in parallel for maximum speed
  const [tenants, availableRooms] = await Promise.all([
    getRentLedgerData(CURRENT_PG_ID),
    getAvailableRoomsList(CURRENT_PG_ID),
  ]);

  return (
    <RentDashboardClient 
      initialTenants={tenants} 
      availableRooms={availableRooms} 
      pgId={CURRENT_PG_ID} 
    />
  );
}