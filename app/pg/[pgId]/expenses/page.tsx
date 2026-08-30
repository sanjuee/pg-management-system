import { getMonthlyProfitHistory } from "@/app/queries/dashboard-queries";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma/prisma";
import ExpenseLogger from "./components/ExpenseLogger";

export default async function ExpensesHistoryPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;
  
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  
  const [history, currentExpenses] = await Promise.all([
    getMonthlyProfitHistory(pgId),
    prisma.expense.findMany({ where: { pgId, month: currentMonth }, orderBy: { createdAt: 'desc' } })
  ]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <Link 
          href={`/pg/${pgId}/dashboard`} 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900">Profit & Loss History</h1>
        <p className="text-slate-500 font-medium">Month-by-month financial breakdown.</p>
      </div>

      <div className="mb-8">
        <ExpenseLogger pgId={pgId} currentMonth={currentMonth} expenses={currentExpenses} />
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-slate-500">No financial data available yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Month</th>
                <th className="px-6 py-4 font-semibold text-right">Revenue</th>
                <th className="px-6 py-4 font-semibold text-right">Expenses</th>
                <th className="px-6 py-4 font-semibold text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map((row) => {
                const profit = row.collected - row.expenses;
                const isProfit = profit >= 0;

                return (
                  <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-slate-800">{row.month}</td>
                    <td className="px-6 py-5 text-right font-medium text-slate-700">
                      ₹{row.collected.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-5 text-right font-medium text-slate-700">
                      ₹{row.expenses.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-black ${
                        isProfit ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        ₹{Math.abs(profit).toLocaleString("en-IN")}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
