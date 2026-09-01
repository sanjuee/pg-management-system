"use client";

import {
  X,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import ExpensePieChart from "./ExpensePieChart";

type MonthDetail = {
  expenses: { category: string; amount: number; note: string | null }[];
  payments: { tenantName: string; amount: number; baseRent: number }[];
  incomes: { category: string; amount: number; note: string | null }[];
};

type ExpenseDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  details: MonthDetail | null;
  collected: number;
  totalExpenses: number;
};

// Height for 4 items: each item ~52px (py-3 + border + gap)
const LIST_MAX_HEIGHT = "max-h-[220px]";

export default function ExpenseDetailsModal({
  isOpen,
  onClose,
  month,
  details,
  collected,
  totalExpenses,
}: ExpenseDetailsModalProps) {
  if (!isOpen || !details) return null;

  const profit = collected - totalExpenses;
  const isProfit = profit >= 0;

  // Group expenses by category
  const expenseCategoryMap: Record<string, number> = {};
  details.expenses.forEach((exp) => {
    expenseCategoryMap[exp.category] =
      (expenseCategoryMap[exp.category] || 0) + exp.amount;
  });
  const groupedExpenses = Object.entries(expenseCategoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
  const totalExpAmt = groupedExpenses.reduce((s, e) => s + e.amount, 0);

  // Group revenue as "Rent" and add Incomes
  const incomeCategoryMap: Record<string, number> = {};
  let totalRentAmt = 0;
  let totalFineAmt = 0;
  
  details.payments.forEach((p) => {
    const rentPaid = Math.min(p.amount, p.baseRent);
    const finePaid = Math.max(0, p.amount - p.baseRent);
    totalRentAmt += rentPaid;
    totalFineAmt += finePaid;
  });

  if (totalRentAmt > 0) incomeCategoryMap["Rent"] = totalRentAmt;
  if (totalFineAmt > 0) incomeCategoryMap["Late Rent Fines"] = totalFineAmt;

  details.incomes.forEach((inc) => {
    incomeCategoryMap[inc.category] = (incomeCategoryMap[inc.category] || 0) + inc.amount;
  });

  const revenueData = Object.entries(incomeCategoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
  
  const totalRevAmt = revenueData.reduce((s, e) => s + e.amount, 0);
  
  const revenueList = [
    ...details.payments.map((p) => {
      const rentPaid = Math.min(p.amount, p.baseRent);
      const finePaid = Math.max(0, p.amount - p.baseRent);
      const parts = [];
      if (rentPaid > 0) parts.push({ name: `${p.tenantName} (Rent)`, amount: rentPaid });
      if (finePaid > 0) parts.push({ name: `${p.tenantName} (Late Fine)`, amount: finePaid });
      return parts;
    }).flat(),
    ...details.incomes.map((i) => ({ name: i.category, amount: i.amount })),
  ].sort((a, b) => b.amount - a.amount);

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-4xl max-h-[92vh] md:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 md:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-900">
              {month}
            </h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
              <span className="text-xs md:text-sm font-medium text-emerald-600">
                ↑ ₹{collected.toLocaleString("en-IN")}
              </span>
              <span className="text-xs md:text-sm font-medium text-red-500">
                ↓ ₹{totalExpenses.toLocaleString("en-IN")}
              </span>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold text-xs ${
                  isProfit
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {isProfit ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                ₹{Math.abs(profit).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT — scrolls on mobile, side-by-side on desktop */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Expenses breakdown */}
            <div>
              <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ArrowDownRight size={16} className="text-red-400" />
                Expenses by Category
              </h4>
              {groupedExpenses.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  No expenses recorded
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <ExpensePieChart
                      data={groupedExpenses}
                      total={totalExpAmt}
                      size="small"
                      centerLabel="Expenses"
                    />
                  </div>
                  {/* Scrollable list capped at ~4 items */}
                  <div className="relative">
                    <div
                      className={`space-y-2 overflow-y-auto ${LIST_MAX_HEIGHT} pr-1`}
                    >
                      {groupedExpenses.map((exp, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                        >
                          <span className="text-sm font-semibold text-slate-700">
                            {exp.category}
                          </span>
                          <span className="text-sm font-bold text-red-600">
                            -₹{exp.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Fade hint when scrollable */}
                    {groupedExpenses.length > 4 && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-1">
                        <ChevronDown
                          size={14}
                          className="text-slate-300 animate-bounce"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Revenue breakdown */}
            <div>
              <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ArrowUpRight size={16} className="text-emerald-400" />
                Revenue
              </h4>
              {revenueList.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  No revenue recorded
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <ExpensePieChart
                      data={revenueData}
                      total={totalRevAmt}
                      size="small"
                      centerLabel="Revenue"
                    />
                  </div>
                  {/* Scrollable list capped at ~4 items */}
                  <div className="relative">
                    <div
                      className={`space-y-2 overflow-y-auto ${LIST_MAX_HEIGHT} pr-1`}
                    >
                      {revenueList.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                        >
                          <span className="text-sm font-semibold text-slate-700">
                            {item.name}
                          </span>
                          <span className="text-sm font-bold text-emerald-600">
                            +₹{item.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Fade hint when scrollable */}
                    {revenueList.length > 4 && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-1">
                        <ChevronDown
                          size={14}
                          className="text-slate-300 animate-bounce"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
