"use client"

import { useState } from "react"
import { createRoomUnitAction } from "@/app/actions/room-actions"
import { X, Bed, Loader2 } from "lucide-react"

type AddRoomModalProps = {
  isOpen: boolean
  onClose: () => void
  pgId: string
  roomTypes: { id: string; name: string; price: number }[]
}

export default function AddRoomModal({ isOpen, onClose, pgId, roomTypes }: AddRoomModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER AREA */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-primary tracking-tight">Add Room Unit</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Deploy a new physical room</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* FORM CONTENT CONTAINER */}
        <div className="p-5">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setIsSubmitting(true)
              try {
                await createRoomUnitAction(formData)
                onClose() // Close modal on success
              } finally {
                setIsSubmitting(false)
              }
            }} className="space-y-4">
              <input type="hidden" name="pgId" value={pgId} />

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Base Configuration</label>
                <select name="roomTypeId" required className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent bg-white appearance-none">
                  <option value="">Choose category layout...</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} (₹{type.price}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Room Number Designation</label>
                <input type="text" name="roomNumber" placeholder="e.g., 101-A, 304" required className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent bg-white placeholder:text-slate-400" />
              </div>

              <button 
                type="submit" 
                disabled={roomTypes.length === 0 || isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-slate-800 text-white font-semibold py-2.5 rounded-md shadow-sm transition mt-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Deploying..." : "Deploy Room Unit"}
              </button>
            </form>
        </div>
      </div>
    </div>
  )
}