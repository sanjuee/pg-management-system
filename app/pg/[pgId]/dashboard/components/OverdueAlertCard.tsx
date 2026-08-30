"use client";

import { AlertTriangle } from "lucide-react";

export default function OverdueAlertCard({
  totalPendingLateFees,
  defaultingTenants,
}: {
  totalPendingLateFees: number;
  defaultingTenants: number;
}) {
  const isClean = defaultingTenants === 0;

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition-colors relative overflow-hidden ${
        isClean ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
      }`}
    >
      {!isClean && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {!isClean && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <p
            className={`text-sm font-medium ${
              isClean ? "text-slate-500" : "text-red-700"
            }`}
          >
            Critical Overdue Alerts
          </p>
        </div>
        
        <h2
          className={`text-3xl font-black ${
            isClean ? "text-slate-900" : "text-red-700"
          }`}
        >
          {defaultingTenants} <span className="text-xl font-bold">tenant{defaultingTenants !== 1 ? 's' : ''}</span>
        </h2>
        
        <div className="mt-4">
          <p className={`text-sm font-semibold ${isClean ? 'text-slate-400' : 'text-red-600/80'}`}>
            Pending Late Fees
          </p>
          <p className={`text-xl font-bold ${isClean ? 'text-slate-600' : 'text-red-700'}`}>
            ₹{totalPendingLateFees.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}
