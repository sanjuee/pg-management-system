import {
  getRevenueTracker,
  getOverdueAlerts,
  getNetProfit,
  getOccupancyMetrics,
  getOrphanedTenants,
  getRecentPayments,
} from "@/app/queries/dashboard-queries";

import RevenueProgressBar from "./components/RevenueProgressBar";
import OverdueAlertCard from "./components/OverdueAlertCard";
import NetProfitCard from "./components/NetProfitCard";
import VacancyRingChart from "./components/VacancyRingChart";
import OrphanedTenantsAlert from "./components/OrphanedTenantsAlert";
import PaymentFeed from "./components/PaymentFeed";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;

  const [revenue, overdue, profit, occupancy, orphaned, payments] =
    await Promise.all([
      getRevenueTracker(pgId),
      getOverdueAlerts(pgId),
      getNetProfit(pgId),
      getOccupancyMetrics(pgId),
      getOrphanedTenants(pgId),
      getRecentPayments(pgId),
    ]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 font-medium">
          Overview of your property's performance.
        </p>
      </div>

      <OrphanedTenantsAlert pgId={pgId} orphans={orphaned} />

      {/* TOP ROW: Financials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueProgressBar
          totalExpected={revenue.totalExpected}
          totalCollected={revenue.totalCollected}
        />
        <NetProfitCard
          pgId={pgId}
          totalCollected={profit.totalCollected}
          totalExpenses={profit.totalExpenses}
          netProfit={profit.netProfit}
        />
        <OverdueAlertCard
          totalPendingLateFees={overdue.totalPendingLateFees}
          defaultingTenants={overdue.defaultingTenants}
        />
      </div>

      {/* MIDDLE ROW: Occupancy & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-full flex flex-col">
          <PaymentFeed payments={payments} />
        </div>
        <div className="h-full flex flex-col">
          <VacancyRingChart
            totalCapacity={occupancy.totalCapacity}
            occupiedBeds={occupancy.occupiedBeds}
          />
        </div>
      </div>
    </div>
  );
}
