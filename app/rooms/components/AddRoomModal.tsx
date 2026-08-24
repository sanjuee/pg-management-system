"use client"

import { createRoomUnitAction } from "@/app/actions/room-actions"
import { X, Bed } from "lucide-react"

type AddRoomModalProps = {
  isOpen: boolean
  onClose: () => void
  pgId: string
  roomTypes: { id: string; name: string; price: number }[]
}

export default function AddRoomModal({ isOpen, onClose, pgId, roomTypes }: AddRoomModalProps) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER AREA */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Room Unit</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Deploy a new physical room</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* FORM CONTENT CONTAINER */}
        <div className="p-6">
            <form action={async (formData) => {
              await createRoomUnitAction(formData)
              onClose() // Close modal on success
            }} className="space-y-4">
              <input type="hidden" name="pgId" value={pgId} />

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Select Base Configuration</label>
                <select name="roomTypeId" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 appearance-none">
                  <option value="">Choose category layout...</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} (₹{type.price}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Room Number Designation</label>
                <input type="text" name="roomNumber" placeholder="e.g., 101-A, 304" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" />
              </div>

              <button 
                type="submit" 
                disabled={roomTypes.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-3 rounded-xl shadow-sm transition mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Deploy Room Unit
              </button>
            </form>
        </div>
      </div>
    </div>
  )
}