"use client"

import { useState } from "react"
import { createRoomTypeAction, createRoomUnitAction } from "@/app/actions/room-actions"
import { X, Layers, Bed } from "lucide-react"

type AddRoomModalProps = {
  isOpen: boolean
  onClose: () => void
  pgId: string
  roomTypes: { id: string; name: string; price: number }[]
}

export default function AddRoomModal({ isOpen, onClose, pgId, roomTypes }: AddRoomModalProps) {
  const [activeTab, setActiveTab] = useState<"type" | "unit">("type")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER AREA */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Property Assets</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Expand your PG infrastructure</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-slate-100 bg-slate-50/30 p-2 gap-2">
          <button
            onClick={() => setActiveTab("type")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === "type" ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers size={16} />
            1. Room Category
          </button>
          <button
            onClick={() => setActiveTab("unit")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === "unit" ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bed size={16} />
            2. Physical Unit
          </button>
        </div>

        {/* FORMS CONTENT CONTAINER */}
        <div className="p-6">
          {activeTab === "type" ? (
            /* FORM A: CREATE ROOM TYPE */
            <form action={async (formData) => {
              await createRoomTypeAction(formData)
              setActiveTab("unit") // Automatically nudge them to step 2
            }} className="space-y-4">
              <input type="hidden" name="pgId" value={pgId} />
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category Label</label>
                <input type="text" name="name" placeholder="e.g., Single Room, 2-Sharing AC" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rent / Bed (₹)</label>
                  <input type="number" name="price" placeholder="8500" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Beds</label>
                  <input type="number" name="capacity" defaultValue="2" min="1" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50" />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm transition mt-2">
                Create Category
              </button>
            </form>
          ) : (
            /* FORM B: CREATE PHYSICAL ROOM UNIT */
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
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl shadow-sm transition mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Deploy Room Unit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}