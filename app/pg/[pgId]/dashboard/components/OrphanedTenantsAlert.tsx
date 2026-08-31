"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function OrphanedTenantsAlert({
  pgId,
  orphans,
}: {
  pgId: string;
  orphans: { id: string; name: string; phone: string }[];
}) {
  if (orphans.length === 0) return null;

  return (
    <div className="bg-red-50/50 border-l-4 border-red-500 rounded-md p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={18} className="text-red-600" />
        <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">
          Action Required: Unassigned Tenants
        </h3>
      </div>
      <p className="text-sm text-red-700 mb-4 font-medium">
        {orphans.length} active tenant{orphans.length > 1 ? "s" : ""} haven't been assigned to a physical room yet. This affects occupancy metrics.
      </p>
      
      <div className="space-y-2 mb-4">
        {orphans.slice(0, 3).map((orphan) => (
          <div key={orphan.id} className="flex justify-between items-center text-sm font-medium text-red-900 bg-white border border-red-100 px-3 py-2 rounded">
            <span>{orphan.name}</span>
            <span className="text-red-600">{orphan.phone}</span>
          </div>
        ))}
        {orphans.length > 3 && (
          <p className="text-xs font-semibold text-red-600 text-center mt-2">
            + {orphans.length - 3} more
          </p>
        )}
      </div>

      <Link
        href={`/pg/${pgId}/tenants`}
        className="mt-auto w-fit px-4 text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors text-sm"
      >
        Assign Rooms Now
      </Link>
    </div>
  );
}
