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
    <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-slate-500">
            Monthly Revenue
          </p>
          <div className="p-2 rounded bg-blue-50 text-accent">
            <TrendingUp size={20} />
          </div>
        </div>
        
        <h2 className="text-2xl xl:text-3xl font-bold text-primary tracking-tight mb-2">
          ₹{totalCollected.toLocaleString("en-IN")}
        </h2>
        
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mb-4">
          <TrendingUp size={14} />
          <span>{percentage}%</span>
          <span className="text-slate-400 font-medium">collected</span>
        </div>
      </div>

      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
            isComplete ? "bg-emerald-500" : "bg-accent"
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
