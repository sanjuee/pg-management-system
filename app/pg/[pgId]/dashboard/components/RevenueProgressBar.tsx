"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function RevenueProgressBar({
  totalExpected,
  totalCollected,
}: {
  totalExpected: number;
  totalCollected: number;
}) {
  const percentage =
    totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
  const isComplete = percentage >= 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">
            Monthly Revenue
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-slate-900">
              ₹{totalCollected.toLocaleString("en-IN")}
            </h2>
            <span className="text-sm font-semibold text-slate-400">
              / ₹{totalExpected.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
            isComplete
              ? "bg-emerald-100 text-emerald-700"
              : "bg-indigo-100 text-indigo-700"
          }`}
        >
          {isComplete ? <TrendingUp size={16} /> : <TrendingUp size={16} />}
          {percentage}%
        </div>
      </div>

      <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
            isComplete ? "bg-emerald-500" : "bg-indigo-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-3 font-medium">
        {totalExpected - totalCollected > 0
          ? `₹${(totalExpected - totalCollected).toLocaleString("en-IN")} remaining to collect`
          : "Target reached!"}
      </p>
    </div>
  );
}
