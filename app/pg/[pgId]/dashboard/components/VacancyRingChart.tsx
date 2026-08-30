"use client";

export default function VacancyRingChart({
  totalCapacity,
  occupiedBeds,
}: {
  totalCapacity: number;
  occupiedBeds: number;
}) {
  const percentage =
    totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;
  const strokeDasharray = `${percentage} ${100 - percentage}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center">
      <h3 className="text-sm font-medium text-slate-500 w-full text-left mb-4">
        Occupancy Rate
      </h3>
      
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path
            className="text-slate-100"
            strokeWidth="3.8"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-indigo-600 transition-all duration-1000 ease-out"
            strokeDasharray={strokeDasharray}
            strokeWidth="3.8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900">{percentage}%</span>
        </div>
      </div>
      
      <div className="flex gap-4 mt-4 w-full justify-center">
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium">Occupied</p>
          <p className="font-bold text-slate-800">{occupiedBeds}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium">Vacant</p>
          <p className="font-bold text-slate-800">{totalCapacity - occupiedBeds}</p>
        </div>
      </div>
    </div>
  );
}
