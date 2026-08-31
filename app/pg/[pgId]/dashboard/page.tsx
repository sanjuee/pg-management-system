import {
  getRevenueTracker,
  getOverdueAlerts,
  getNetProfit,
  getOccupancyMetrics,
  getOrphanedTenants,
  getRecentPayments,
} from "@/app/queries/dashboard-queries";
import { getRoomBasicDetails } from "@/app/queries/room-queries";

import RevenueProgressBar from "./components/RevenueProgressBar";
import OverdueAlertCard from "./components/OverdueAlertCard";
import NetProfitCard from "./components/NetProfitCard";
import OccupancyCard from "./components/OccupancyCard";
import OrphanedTenantsAlert from "./components/OrphanedTenantsAlert";
import PaymentFeed from "./components/PaymentFeed";
import QuickActionsCard from "./components/QuickActionsCard";
import RecentActivityCard from "./components/RecentActivityCard";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;

  const [revenue, overdue, profit, occupancy, orphaned, payments, rooms] =
    await Promise.all([
      getRevenueTracker(pgId),
      getOverdueAlerts(pgId),
      getNetProfit(pgId),
      getOccupancyMetrics(pgId),
      getOrphanedTenants(pgId),
      getRecentPayments(pgId),
      getRoomBasicDetails(pgId),
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

      {/* TOP ROW: Financials & Occupancy (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <OccupancyCard
          totalCapacity={occupancy.totalCapacity}
          occupiedBeds={occupancy.occupiedBeds}
        />
        <OverdueAlertCard
          totalPendingLateFees={overdue.totalPendingLateFees}
          defaultingTenants={overdue.defaultingTenants}
        />
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full flex flex-col">
          <PaymentFeed payments={payments} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <QuickActionsCard pgId={pgId} availableRooms={rooms} />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
