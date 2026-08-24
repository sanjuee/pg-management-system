import { getAllTenantsDirectory } from "@/app/queries/tenant-queries";
import { getRoomBasicDetails } from "@/app/queries/room-queries";
import TenantsTable from "./components/TenantsTable";
import AddTenantButton from "../components/AddTenantButton";

export default async function TenantsPage() {
  const pgId = "4f3c2b81-9d11-4a5e-b287-73c09r3e4b1a"; // Keeping the hardcoded ID for now as per the existing pattern

  const [tenantsData, availableRooms] = await Promise.all([
    getAllTenantsDirectory(pgId),
    getRoomBasicDetails(pgId),
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Tenants Directory
          </h1>
          <p className="text-slate-500 font-medium">
            Manage all tenant profiles and view their assigned rooms.
          </p>
        </div>
        <AddTenantButton pgId={pgId} availableRooms={availableRooms} />
      </div>

      {/* THE TENANTS DIRECTORY TABLE */}
      <TenantsTable initialData={tenantsData} />
    </div>
  );
}
