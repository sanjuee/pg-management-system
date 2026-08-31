import { CheckCircle2 } from "lucide-react";

export default function RecentActivityCard() {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-primary text-lg">Recent Activity</h3>
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          New
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="mt-0.5 w-8 h-8 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
            <CheckCircle2 size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 leading-tight">
              Rahul Sharma (Room 101-A) paid ₹8,500 rent
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Just now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
