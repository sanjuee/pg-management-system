import { DoorClosed } from "lucide-react";

export default function OccupancyCard({
  totalCapacity,
  occupiedBeds,
}: {
  totalCapacity: number;
  occupiedBeds: number;
}) {
  const percentage = Math.round((occupiedBeds / totalCapacity) * 100) || 0;

  return (
    <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-slate-500">Occupancy Rate</p>
          <div className="p-2 rounded bg-slate-50 text-slate-600">
            <DoorClosed size={20} />
          </div>
        </div>

        <h2 className="text-2xl xl:text-3xl font-bold text-primary tracking-tight mb-4">
          {percentage}%
        </h2>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
        <div
          className="bg-indigo-600   h-1.5 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs font-semibold text-slate-500">
        {occupiedBeds}/{totalCapacity} Beds Occupied
      </p>
    </div>
  );
}
