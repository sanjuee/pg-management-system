"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  ArrowDownRight,
  ArrowUpRight,
  Search,
} from "lucide-react";
import ExpenseDetailsModal from "./ExpenseDetailsModal";

type HistoryRow = {
  month: string;
  collected: number;
  expenses: number;
};

type MonthDetail = {
  expenses: { category: string; amount: number; note: string | null }[];
  payments: { tenantName: string; amount: number; baseRent: number }[];
  incomes: { category: string; amount: number; note: string | null }[];
};

export default function HistoryTable({
  history,
  monthDetails,
}: {
  history: HistoryRow[];
  monthDetails: Record<string, MonthDetail>;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<
    "month" | "collected" | "expenses" | "profit"
  >("month");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRowMonth, setSelectedRowMonth] = useState<string | null>(null);

  const itemsPerPage = 10;

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter((h) => h.month.toLowerCase().includes(query));
  }, [history, searchQuery]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort((a, b) => {
      let valA: number | string;
      let valB: number | string;

      if (sortField === "profit") {
        valA = a.collected - a.expenses;
        valB = b.collected - b.expenses;
      } else if (sortField === "month") {
        valA = new Date(a.month).getTime();
        valB = new Date(b.month).getTime();
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredHistory, sortField, sortDirection]);

  // Reset page when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
        <p className="text-slate-500">No financial data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Financial History</h3>
        <div className="relative flex items-center w-full sm:w-auto">
          <Search size={16} className="text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search month or year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-gray-200 text-sm text-slate-500">
            <tr>
              <th
                className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("month")}
              >
                <div className="flex items-center gap-1">
                  Month{" "}
                  <ArrowUpDown
                    size={14}
                    className={sortField === "month" ? "text-primary" : ""}
                  />
                </div>
              </th>
              <th
                className="px-4 py-4 font-semibold text-right cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("collected")}
              >
                <div className="flex items-center justify-end gap-1">
                  Revenue{" "}
                  <ArrowUpDown
                    size={14}
                    className={sortField === "collected" ? "text-primary" : ""}
                  />
                </div>
              </th>
              <th
                className="px-4 py-4 font-semibold text-right cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("expenses")}
              >
                <div className="flex items-center justify-end gap-1">
                  Expenses{" "}
                  <ArrowUpDown
                    size={14}
                    className={sortField === "expenses" ? "text-primary" : ""}
                  />
                </div>
              </th>
              <th
                className="px-4 py-4 font-semibold text-right cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("profit")}
              >
                <div className="flex items-center justify-end gap-1">
                  Net Profit{" "}
                  <ArrowUpDown
                    size={14}
                    className={sortField === "profit" ? "text-primary" : ""}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((row) => {
              const profit = row.collected - row.expenses;
              const isProfit = profit >= 0;

              return (
                <tr
                  key={row.month}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRowMonth(row.month)}
                >
                  <td className="px-6 py-5 font-bold text-slate-800">
                    {row.month}
                  </td>
                  <td className="px-6 py-5 text-right font-medium text-slate-700">
                    ₹{row.collected.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-5 text-right font-medium text-slate-700">
                    ₹{row.expenses.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-sm ${
                        isProfit
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {isProfit ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      ₹{Math.abs(profit).toLocaleString("en-IN")}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <span className="text-sm text-slate-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, sortedHistory.length)} of{" "}
            {sortedHistory.length} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {selectedRowMonth && (
        <ExpenseDetailsModal
          isOpen={!!selectedRowMonth}
          onClose={() => setSelectedRowMonth(null)}
          month={selectedRowMonth}
          details={monthDetails[selectedRowMonth] || null}
          collected={
            history.find((h) => h.month === selectedRowMonth)?.collected || 0
          }
          totalExpenses={
            history.find((h) => h.month === selectedRowMonth)?.expenses || 0
          }
        />
      )}
    </div>
  );
}
