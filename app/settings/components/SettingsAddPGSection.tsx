"use client";

import { useState } from "react";
import AddPGForm from "@/app/components/AddPGForm";
import { Plus, X, Building2 } from "lucide-react";

export default function SettingsAddPGSection() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Add New PG
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Configure a new PG property to manage rent, rooms, and tenants
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
            + Add PG
          </span>
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-indigo-100 shadow-md overflow-hidden transition-all animate-in fade-in duration-200">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Building2 size={15} className="text-indigo-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Add New PG</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          title="Close form"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-6">
        <AddPGForm compact onCancel={() => setIsOpen(false)} />
      </div>
    </section>
  );
}
