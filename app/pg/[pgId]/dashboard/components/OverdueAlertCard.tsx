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
      className={`rounded-md border p-5 shadow-sm flex flex-col justify-between h-full transition-colors relative overflow-hidden ${
        isClean ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
      }`}
    >
      {!isClean && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
      )}
      
      <div className="relative z-10 flex flex-col h-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {!isClean && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
            )}
            <p
              className={`text-sm font-medium ${
                isClean ? "text-slate-500" : "text-red-700"
              }`}
            >
              Critical Overdue
            </p>
          </div>
          
          <h2
            className={`text-2xl xl:text-3xl font-bold tracking-tight mb-4 ${
              isClean ? "text-primary" : "text-red-700"
            }`}
          >
            {defaultingTenants} <span className="text-lg xl:text-xl font-semibold">Tenant{defaultingTenants !== 1 ? 's' : ''}</span>
          </h2>
        </div>
        
        <div className="mt-auto">
          {!isClean ? (
            <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-2">
              Action required →
            </p>
          ) : (
            <p className="text-xs font-semibold text-slate-400 mt-2">
              All caught up!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
