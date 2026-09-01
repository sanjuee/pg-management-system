"use client";

import { Cpu, CheckCircle2 } from "lucide-react";

export default function CronLogFeed({
  logs,
}: {
  logs: {
    id: string;
    ranAt: Date;
    details: string[];
  }[];
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Cpu size={18} className="text-emerald-400" />
          <h3 className="font-bold font-mono text-sm uppercase tracking-wider">Automated Engine Log</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-900 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Engine Active
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 font-mono text-xs text-slate-400 pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic">No automated actions logged yet...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="space-y-1.5 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-500 flex justify-between">
                <span>[SYSTEM RUN]</span>
                <span suppressHydrationWarning>{new Date(log.ranAt).toLocaleString()}</span>
              </div>
              {log.details.length === 0 ? (
                <div className="text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500" /> No actions required.
                </div>
              ) : (
                log.details.map((detail, idx) => (
                  <div key={idx} className="text-emerald-400">
                    &gt; {detail}
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
