"use client";

import { Wallet, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import Link from "next/link";

export default function NetProfitCard({
  pgId,
  totalCollected,
  totalExpenses,
  netProfit,
}: {
  pgId: string;
  totalCollected: number;
  totalExpenses: number;
  netProfit: number;
}) {
  const isProfit = netProfit >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-500">
          Estimated Net Profit
        </p>
        <div className="flex items-center gap-2">
          <Link 
            href={`/pg/${pgId}/expenses`}
            className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus size={14} />
            Add Expense
          </Link>
          <div className={`p-2 rounded-xl ${isProfit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <Wallet size={20} />
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          ₹{netProfit.toLocaleString("en-IN")}
        </h2>
        
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-emerald-600">
            <ArrowUpRight size={14} />
            <span>In: ₹{totalCollected.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <ArrowDownRight size={14} />
            <span>Out: ₹{totalExpenses.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
