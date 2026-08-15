"use client"

import { X, Edit, Trash2, UserPlus, Users } from "lucide-react"
import { deleteRoomUnitAction } from "@/app/actions/room-actions"

type RoomItem = {
  id: string
  roomNumber: string
  typeName: string
  price: number
  status: string
  occupantCount: number
  capacity: number
  tenants: { id: string; name: string }[]
}

type RoomDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  room: RoomItem | null
  onAddTenant: () => void // Function to trigger the Add Tenant modal
}

export default function RoomDetailsModal({ isOpen, onClose, room, onAddTenant }: RoomDetailsModalProps) {
  if (!isOpen || !room) return null

  const handleDelete = async () => {
    if (room.occupantCount > 0) {
      alert("You must reassign or remove the active tenants before deleting this room.")
      return
    }
    
    if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}? This cannot be undone.`)) {
      await deleteRoomUnitAction(room.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-900">Room {room.roomNumber}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                room.status === 'Available' ? 'bg-green-100 text-green-700' :
                room.status === 'Occupied' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {room.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{room.typeName} • ₹{room.price.toLocaleString('en-IN')}/mo</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* TENANTS LIST */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} />
              Current Occupants
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {room.occupantCount} / {room.capacity} filled
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {room.tenants.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 font-medium">
                This room is currently empty.
              </div>
            ) : (
              room.tenants.map(tenant => (
                <div key={tenant.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {tenant.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">{tenant.name}</span>
                  </div>
                  <button className="text-xs text-indigo-600 font-semibold hover:underline">View Profile</button>
                </div>
              ))
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => { onAddTenant(); }}
              disabled={room.occupantCount >= room.capacity}
              className="col-span-2 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus size={18} />
              Add Tenant to Room
            </button>
            
            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl transition text-sm">
              <Edit size={16} />
              Edit Details
            </button>
            
            <button 
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl transition text-sm"
            >
              <Trash2 size={16} />
              Delete Room
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}