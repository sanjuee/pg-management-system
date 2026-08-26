"use client";

import { useState } from "react";
import { createPGAction } from "@/app/actions/pg-actions";
import { Building2, CreditCard, Loader2, CalendarDays, Banknote } from "lucide-react";

type Props = {
  /** If true, renders a compact inline card (for Settings page). 
   *  If false (default), renders as a full-screen setup page form. */
  compact?: boolean;
  onCancel?: () => void;
};

export default function AddPGForm({ compact = false, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    const result = await createPGAction(formData);
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
    // On success, the server action redirects — no client-side handling needed
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? "" : "space-y-5"}>
      <div className={compact ? "space-y-4" : "space-y-5"}>
        {/* PG Name */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            PG Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 size={16} className="text-slate-400" />
            </div>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Sunrise Boys PG"
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 bg-white"
            />
          </div>
        </div>

        {/* UPI ID */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            UPI ID <span className="text-slate-400 font-normal">(for rent collection)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard size={16} className="text-slate-400" />
            </div>
            <input
              name="upiId"
              type="text"
              required
              placeholder="e.g. yourname@upi"
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 bg-white"
            />
          </div>
        </div>

        {/* Billing Cycle Date */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            Billing Cycle Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays size={16} className="text-slate-400" />
            </div>
            <input
              name="billingCycleDate"
              type="number"
              min="1"
              max="31"
              defaultValue="1"
              required
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 bg-white"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The day of the month when rent is generated (e.g., 1 for the 1st of every month).
          </p>
        </div>

        {/* Rent Due Date */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            Rent Due Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays size={16} className="text-slate-400" />
            </div>
            <input
              name="rentDueDate"
              type="number"
              min="0"
              max="31"
              defaultValue="0"
              required
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 bg-white"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The day of the month when rent becomes overdue. Enter <strong>0</strong> if there is no specific due date.
          </p>
        </div>

        {/* Daily Late Fee */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            Daily Late Fee (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Banknote size={16} className="text-slate-400" />
            </div>
            <input
              name="dailyLateFee"
              type="number"
              min="0"
              step="any"
              defaultValue="0"
              required
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 bg-white"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The penalty amount added automatically for each day the rent is overdue. Enter <strong>0</strong> to disable late fees.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className={`flex items-center gap-3 ${compact ? "mt-4" : "mt-2"}`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-1/3 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${onCancel ? "w-2/3" : "w-full"} flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm`}
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSubmitting ? "Creating..." : "Create PG"}
        </button>
      </div>
    </form>
  );
}
