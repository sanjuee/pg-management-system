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
    <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Est. Net Profit
          </p>
          <Link href={`/pg/${pgId}/expenses`} className="text-xs text-accent hover:underline font-medium flex items-center mt-1">
            <Plus size={14} className="mr-0.5" />
            Add Expense
          </Link>
        </div>
        <div className={`p-2 rounded ${isProfit ? 'bg-blue-50 text-accent' : 'bg-red-50 text-red-600'}`}>
          <Wallet size={20} />
        </div>
      </div>
        
        <h2 className="text-2xl xl:text-3xl font-bold text-primary tracking-tight mb-2">
          {isProfit ? "" : "-"}₹{Math.abs(netProfit).toLocaleString("en-IN")}
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
  );
}
