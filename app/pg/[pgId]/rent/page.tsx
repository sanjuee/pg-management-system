import { getRentLedgerData } from "@/app/queries/tenant-queries";
import { getRentSummaryStats } from "@/app/queries/summery-queries";
import RentLedgerTable from "@/app/rent/components/RentLedgerTable";

export default async function RentPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;

  const [ledgerData, stats] = await Promise.all([
    getRentLedgerData(pgId),
    getRentSummaryStats(pgId),
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Tenant Rent</h1>
          <p className="text-slate-500 font-medium">
            Manage rent collection and monitor payment statuses.
          </p>
        </div>
      </div>

      {/* THE 3 SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Collected */}
        <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-slate-500 mb-2">
            Total Collected ({stats.currentMonth})
          </p>
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            ₹{stats.totalCollected.toLocaleString("en-IN")}
          </h2>
        </div>

        {/* Card 2: Pending Payments */}
        <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-slate-500 mb-2">
            Pending Payments
          </p>
          <div>
            <h2 className="text-3xl font-bold text-primary tracking-tight">
              ₹{stats.pendingAmount.toLocaleString("en-IN")}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              From {stats.pendingTenants} tenant
              {stats.pendingTenants !== 1 && "s"}
            </p>
          </div>
        </div>

        {/* Card 3: Overdue Rent */}
        <div
          className={`rounded-md border p-6 shadow-sm flex flex-col justify-between transition-colors ${stats.overdueAmount > 0 ? "bg-red-50/50 border-red-200" : "bg-white border-gray-200"}`}
        >
          <p
            className={`text-sm font-medium mb-2 flex items-center gap-2 ${stats.overdueAmount > 0 ? "text-red-700" : "text-slate-500"}`}
          >
            {stats.overdueAmount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            )}
            Overdue Rent
          </p>
          <div>
            <h2
              className={`text-3xl font-bold tracking-tight ${stats.overdueAmount > 0 ? "text-red-700" : "text-primary"}`}
            >
              ₹{stats.overdueAmount.toLocaleString("en-IN")}
            </h2>
            {stats.overdueAmount === 0 && (
              <p className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1">
                All caught up!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* THE LEDGER TABLE */}
      <RentLedgerTable filteredData={ledgerData} />
    </div>
  );
}
