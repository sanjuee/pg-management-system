import { getMonthlyProfitHistory } from "@/app/queries/dashboard-queries";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { prisma } from "@/lib/prisma/prisma";
import ExpenseLogger from "./components/ExpenseLogger";
import HistoryTable from "./components/HistoryTable";
import ExpensePieChart from "./components/ExpensePieChart";
import { COLORS } from "./components/constants";

export default async function ExpensesHistoryPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const [history, currentExpenses, invoices, allExpenses, allInvoices, currentIncomes, allIncomes] = await Promise.all([
    getMonthlyProfitHistory(pgId),
    prisma.expense.findMany({
      where: { pgId, month: currentMonth },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { pgId, billingMonth: currentMonth },
    }),
    prisma.expense.findMany({
      where: { pgId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { pgId },
      include: { tenant: { select: { name: true } } },
    }),
    prisma.income.findMany({
      where: { pgId, month: currentMonth },
      orderBy: { createdAt: "desc" },
    }),
    prisma.income.findMany({
      where: { pgId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Build per-month details for expandable rows
  const monthDetails: Record<string, { expenses: { category: string; amount: number; note: string | null }[]; payments: { tenantName: string; amount: number; baseRent: number }[]; incomes: { category: string; amount: number; note: string | null }[] }> = {};

  allExpenses.forEach((exp: any) => {
    if (!monthDetails[exp.month]) monthDetails[exp.month] = { expenses: [], payments: [], incomes: [] };
    monthDetails[exp.month].expenses.push({ category: exp.category, amount: exp.amount, note: exp.note });
  });

  allInvoices.forEach((inv: any) => {
    const month = inv.billingMonth;
    if (!monthDetails[month]) monthDetails[month] = { expenses: [], payments: [], incomes: [] };
    if (inv.amountPaid > 0) {
      monthDetails[month].payments.push({ tenantName: inv.tenant?.name || "Unknown", amount: inv.amountPaid, baseRent: inv.baseRent });
    }
  });

  allIncomes.forEach((inc: any) => {
    if (!monthDetails[inc.month]) monthDetails[inc.month] = { expenses: [], payments: [], incomes: [] };
    monthDetails[inc.month].incomes.push({ category: inc.category, amount: inc.amount, note: inc.note });
  });

  let totalBaseRentCollected = 0;
  let totalLateFinesCollected = 0;
  invoices.forEach((inv: any) => {
    const rentPaid = Math.min(inv.amountPaid, inv.baseRent);
    const finePaid = Math.max(0, inv.amountPaid - inv.baseRent);
    totalBaseRentCollected += rentPaid;
    totalLateFinesCollected += finePaid;
  });
  const totalRentCollected = totalBaseRentCollected + totalLateFinesCollected;
  const totalOtherIncome = currentIncomes.reduce((sum: number, inc: any) => sum + inc.amount, 0);
  const totalCollected = totalRentCollected + totalOtherIncome;
  const totalExpenses = currentExpenses.reduce(
    (sum: number, exp: any) => sum + exp.amount,
    0,
  );
  const netProfit = totalCollected - totalExpenses;
  const isProfit = netProfit >= 0;

  // Category breakdown for current month (Expenses)
  const categoryMap: Record<string, number> = {};
  currentExpenses.forEach((exp: any) => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Category breakdown for current month (Incomes)
  const incomeCategoryMap: Record<string, number> = {
    "Rent": totalBaseRentCollected,
  };
  if (totalLateFinesCollected > 0) {
    incomeCategoryMap["Late Rent Fines"] = totalLateFinesCollected;
  }
  currentIncomes.forEach((inc: any) => {
    incomeCategoryMap[inc.category] = (incomeCategoryMap[inc.category] || 0) + inc.amount;
  });
  const incomeCategoryBreakdown = Object.entries(incomeCategoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          Profit & Loss
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Financial overview for{" "}
          <span className="text-primary font-bold">{currentMonth}</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Revenue
            </p>
            <div className="p-2 rounded-lg bg-emerald-50">
              <ArrowUpRight size={16} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">
            ₹{totalCollected.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Collected this month
          </p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Expenses
            </p>
            <div className="p-2 rounded-lg bg-red-50">
              <ArrowDownRight size={16} className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {currentExpenses.length} expense
            {currentExpenses.length !== 1 ? "s" : ""} logged
          </p>
        </div>

        {/* Net Profit Card */}
        <div
          className={`rounded-xl border p-5 shadow-sm ${isProfit ? "bg-emerald-50/40 border-emerald-200" : "bg-red-50/40 border-red-200"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Net Profit
            </p>
            <div
              className={`p-2 rounded-lg ${isProfit ? "bg-emerald-100" : "bg-red-100"}`}
            >
              <Wallet
                size={16}
                className={isProfit ? "text-emerald-600" : "text-red-500"}
              />
            </div>
          </div>
          <p
            className={`text-2xl font-black flex items-center gap-1.5 ${isProfit ? "text-emerald-700" : "text-red-600"}`}
          >
            {isProfit ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {isProfit ? "" : "-"}₹{Math.abs(netProfit).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Revenue − Expenses
          </p>
        </div>
      </div>

      {/* Category Breakdown (Expenses vs Income) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {incomeCategoryBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-700">
                Income Breakdown — {currentMonth}
              </h3>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start flex-1">
              <div className="shrink-0">
                <ExpensePieChart data={incomeCategoryBreakdown} total={totalCollected} centerLabel="Revenue" />
              </div>

              <div className="flex-1 w-full space-y-3">
                {incomeCategoryBreakdown.map(({ category, amount }, index) => {
                  const percent =
                    totalCollected > 0
                      ? Math.round((amount / totalCollected) * 100)
                      : 0;
                  const barColor = COLORS[index % COLORS.length];
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-slate-700">
                          {category}
                        </span>
                        <span className="text-sm font-bold text-slate-600">
                          ₹{amount.toLocaleString("en-IN")}{" "}
                          <span className="text-xs text-slate-400 font-medium">
                            ({percent}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%`, backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {categoryBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-red-400" />
              <h3 className="font-bold text-sm text-slate-700">
                Expense Breakdown — {currentMonth}
              </h3>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start flex-1">
              <div className="shrink-0">
                <ExpensePieChart data={categoryBreakdown} total={totalExpenses} centerLabel="Expenses" />
              </div>

              <div className="flex-1 w-full space-y-3">
                {categoryBreakdown.map(({ category, amount }, index) => {
                  const percent =
                    totalExpenses > 0
                      ? Math.round((amount / totalExpenses) * 100)
                      : 0;
                  const barColor = COLORS[index % COLORS.length];
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-slate-700">
                          {category}
                        </span>
                        <span className="text-sm font-bold text-slate-600">
                          ₹{amount.toLocaleString("en-IN")}{" "}
                          <span className="text-xs text-slate-400 font-medium">
                            ({percent}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%`, backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Logger */}
      <div>
        <ExpenseLogger
          pgId={pgId}
          currentMonth={currentMonth}
          expenses={currentExpenses}
          incomes={currentIncomes}
        />
      </div>

      {/* Link to history */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800">All Months</h2>
      </div>

      <HistoryTable history={history} monthDetails={monthDetails} />
    </div>
  );
}
