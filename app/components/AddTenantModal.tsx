"use client";

import { useState } from "react";
import { createTenantAction } from "../actions/tenant-action";
import { X, UserPlus } from "lucide-react";

type AddTenantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pgId: string;
  availableRooms: { id: string; roomNumber: string; price: number }[];
  initialRoomId?: string | null; // The magic prop!
};

export default function AddTenantModal({
  isOpen,
  onClose,
  pgId,
  availableRooms,
  initialRoomId,
}: AddTenantModalProps) {
  if (!isOpen) return null;

  // Find the room object to pre-fill the rent amount
  const preSelectedRoom = initialRoomId
    ? availableRooms.find((r) => r.id === initialRoomId)
    : null;

  const [selectedRoomPrice, setSelectedRoomPrice] = useState<number>(
    preSelectedRoom?.price || 0,
  );
  const [skipCurrentMonth, setSkipCurrentMonth] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-accent p-2 rounded-md">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary tracking-tight">
                Add New Tenant
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Register a new resident to your PG
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="p-5">
          <form
            action={async (formData) => {
              await createTenantAction(formData);
              onClose();
            }}
            className="space-y-4"
          >
            <input type="hidden" name="pgId" value={pgId} />

            {/* THE PRE-CHOSEN DROPDOWN */}
            <div className="bg-slate-50/70 p-4 rounded-md border border-gray-100 mb-5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Assign to Room
              </label>
              <select
                name="roomId"
                defaultValue={initialRoomId || ""}
                onChange={(e) => {
                  const room = availableRooms.find(
                    (r) => r.id === e.target.value,
                  );
                  setSelectedRoomPrice(room?.price || 0);
                }}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent bg-white"
              >
                <option value="">Do not assign a room yet</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} — ₹{room.price}/mo
                  </option>
                ))}
              </select>
              {/* Rent is silently derived from the selected room's price */}
              <input type="hidden" name="rent" value={selectedRoomPrice} />
              {selectedRoomPrice > 0 && (
                <p className="text-xs font-semibold text-slate-500 mt-2">
                  Rent will be set to{" "}
                  <span className="text-primary">
                    ₹{selectedRoomPrice.toLocaleString("en-IN")}/mo
                  </span>
                </p>
              )}
            </div>

            {/* TENANT DETAILS */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., Rahul Sharma"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent bg-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="98765 43210"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent bg-white placeholder:text-slate-400"
              />
            </div>

            {/* BILLING START OPTION */}
            {selectedRoomPrice > 0 && (
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-md p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="skipCurrentMonth"
                    checked={skipCurrentMonth}
                    onChange={(e) => setSkipCurrentMonth(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent/30 accent-accent"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-700">
                      Apply rent from next month
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {skipCurrentMonth
                        ? "No invoice will be created for the current month. "
                        : "If unchecked, Rent invoice for the current month will be generated immediately."}
                    </p>
                  </div>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-slate-800 text-white font-semibold py-2.5 rounded-md shadow-sm transition mt-2 text-sm"
            >
              Register Tenant
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
