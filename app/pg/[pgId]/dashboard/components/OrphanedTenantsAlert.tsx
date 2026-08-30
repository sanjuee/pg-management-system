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
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={20} className="text-yellow-600" />
        <h3 className="text-sm font-bold text-yellow-800">
          Action Required: Unassigned Tenants
        </h3>
      </div>
      <p className="text-sm text-yellow-700 mb-4">
        {orphans.length} active tenant{orphans.length > 1 ? "s" : ""} in your system hasn't been assigned to a physical room yet. This may affect occupancy metrics.
      </p>
      
      <div className="space-y-2 mb-4">
        {orphans.slice(0, 3).map((orphan) => (
          <div key={orphan.id} className="flex justify-between items-center text-sm font-medium text-yellow-900 bg-yellow-100/50 px-3 py-2 rounded-lg">
            <span>{orphan.name}</span>
            <span className="text-yellow-600">{orphan.phone}</span>
          </div>
        ))}
        {orphans.length > 3 && (
          <p className="text-xs font-semibold text-yellow-600 text-center">
            + {orphans.length - 3} more
          </p>
        )}
      </div>

      <Link
        href={`/pg/${pgId}/tenants`}
        className="mt-auto w-full text-center bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold py-2 rounded-xl transition-colors text-sm"
      >
        Assign Rooms Now
      </Link>
    </div>
  );
}
