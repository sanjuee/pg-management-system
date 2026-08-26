"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronRight, Edit2, Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import AddPGForm from "@/app/components/AddPGForm";
import { deletePGAction } from "@/app/actions/pg-actions";

type PG = {
  id: string;
  name: string;
  upiId: string;
  billingCycleDate: number;
  rentDueDate: number;
  dailyLateFee: number;
};

export default function PGListItem({ pg }: { pg: PG }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    setError(null);
    const result = await deletePGAction(pg.id);
    if (result?.error) {
      setError(result.error);
      setIsDeleteLoading(false);
    } else {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <li className="p-6 bg-slate-50 border-b border-slate-100 last:border-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Edit PG: {pg.name}</h3>
          <button 
            onClick={() => setIsEditing(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <AddPGForm compact onCancel={() => setIsEditing(false)} initialData={pg} />
      </li>
    );
  }

  if (isDeleting) {
    return (
      <li className="p-6 bg-red-50/50 border-b border-slate-100 last:border-0">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Delete {pg.name}?</h3>
            <p className="text-sm text-slate-600 mt-1">
              Are you sure you want to delete this PG? This action cannot be undone. Make sure all tenants and rooms are cleared first.
            </p>
            {error && <p className="text-sm text-red-600 font-medium mt-2">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsDeleting(false)}
                disabled={isDeleteLoading}
                className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleteLoading}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleteLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {isDeleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
      <Link href={`/pg/${pg.id}/rent`} className="flex-1 flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-indigo-600" />
        </div>
        <div className="truncate">
          <p className="text-sm font-bold text-slate-900 truncate">
            {pg.name}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
            UPI: {pg.upiId}
          </p>
        </div>
      </Link>
      
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Edit PG"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => setIsDeleting(true)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete PG"
        >
          <Trash2 size={16} />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <Link 
          href={`/pg/${pg.id}/rent`}
          className="p-2 text-slate-300 hover:text-slate-500 rounded-lg transition-colors"
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </li>
  );
}
