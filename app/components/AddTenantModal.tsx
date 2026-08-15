"use client"

import { createTenantAction } from "../actions/tenant-queries" // Make sure this matches your file name
import { X, UserPlus } from "lucide-react"

type AddTenantModalProps = {
  isOpen: boolean
  onClose: () => void
  pgId: string
  availableRooms: { id: string; roomNumber: string; price: number }[]
  initialRoomId?: string | null // The magic prop!
}

export default function AddTenantModal({ isOpen, onClose, pgId, availableRooms, initialRoomId }: AddTenantModalProps) {
  if (!isOpen) return null

  // Find the room object to pre-fill the rent amount
  console.log(initialRoomId)
  const preSelectedRoom = initialRoomId 
    ? availableRooms.find(r => r.id === initialRoomId) 
    : null
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">

        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add New Tenant</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Register a new resident to your PG</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form action={async (formData) => {
              await createTenantAction(formData)
              onClose() 
          }} className="space-y-4">

            <input type="hidden" name="pgId" value={pgId} />

            {/* THE PRE-CHOSEN DROPDOWN */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Assign to Room
              </label>
              <select 
                name="roomId" 
                defaultValue={initialRoomId || ""} // <--- THIS PRE-CHOOSES THE ROOM
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Do not assign a room yet</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} (Base Rent: ₹{room.price})
                  </option>
                ))}
              </select>
            </div>

            {/* TENANT DETAILS */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input type="text" name="name" required placeholder="e.g., Rahul Sharma" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                <input type="tel" name="phone" required placeholder="98765 43210" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Agreed Rent (₹)</label>
                {/* Pre-fill the rent amount based on the selected room's base price! */}
                <input type="number" name="rent" required defaultValue={preSelectedRoom?.price || ""} placeholder="8000" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm transition mt-4">
              Register Tenant
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}