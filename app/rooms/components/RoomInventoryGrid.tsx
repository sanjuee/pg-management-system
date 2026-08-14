"use client"

import { useState } from "react"
import AddRoomModal from "./AddRoomModal" // Adjust import path as necessary
import { Plus } from "lucide-react"


type RoomItem = {
  id: string
  roomNumber: string
  typeName: string
  price: number
  status: 'Available' | 'Occupied' | 'Maintenance'
  occupantCount: number
  capacity: number
  tenants: { id: string; name: string }[]
}

type RoomInventoryGridProps = {
  initialRooms: any[]
  roomTypes: any[]
  pgId: string
}

export default function RoomInventoryGrid({ initialRooms, roomTypes, pgId }: RoomInventoryGridProps) {
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredRooms = initialRooms.filter(room => {
    if (statusFilter === "All Statuses") return true
    return room.status === statusFilter
  })
  


  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-50 text-green-700 border-green-200'
      case 'Occupied': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Maintenance': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-slate-50 text-slate-700'
    }
  }



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[40px] font-headline font-bold tracking-tight text-slate-900">Room Inventory</h1>
          <p className="text-slate-500 mt-1">Manage all property units and monitor occupancy status.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 text-white py-2.5 px-5 rounded-full font-semibold transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          Add Room Asset
        </button>
      </div>
      {/* FILTER BAR ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-500">Filters:</span>
          
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        
        <span className="text-sm font-medium text-slate-500">
          Showing 1–{filteredRooms.length} of {initialRooms.length} Rooms
        </span>
      </div>

      {/* CARDS INVENTORY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div 
            key={room.id}
            className="bg-white border border-slate-200/80   rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition relative overflow-hidden group"
          >
            <div>
              {/* Card Top Row */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-slate-900 tracking-tight">
                    {room.roomNumber}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">{room.typeName}</p>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(room.status)}`}>
                  {room.status}
                </span>
              </div>

              {/* Monthly Cost Area */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Rent</p>
                  <p className="text-lg font-bold text-slate-800">
                    {room.status === 'Maintenance' ? '--' : `₹${room.price.toLocaleString('en-IN')}`}
                  </p>
                </div>

                {/* More Options / Context Actions Trigger */}
                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition">
                  •••
                </button>
              </div>
            </div>

            {/* Occupant Quick Indicator Badge */}
            <div className="mt-4 text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              {room.status === 'Maintenance' ? 'Under Review' : `${room.occupantCount} / ${room.capacity} beds filled`}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No matching properties found for this active criteria selection filter.</p>
        </div>

      )}

      <AddRoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pgId={pgId}
        roomTypes={roomTypes}
      />
    </div>
  )
}