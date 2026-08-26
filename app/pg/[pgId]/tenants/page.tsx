import { getAllTenantsDirectory } from "@/app/queries/tenant-queries";
import { getRoomBasicDetails } from "@/app/queries/room-queries";
import TenantsTable from "@/app/tenants/components/TenantsTable";
import AddTenantButton from "@/app/components/AddTenantButton";

export default async function TenantsPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;

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
