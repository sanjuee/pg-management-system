"use client"

import { useState } from "react"
import { UserPlus, FileDown, CircleCheckBig, CalendarClock, TriangleAlert } from "lucide-react"
import TenantDetailsModal from "./TenantDetailsModal"
import AddTenantModal from "@/app/components/AddTenantModal" // Ensure this path matches where you saved the modal

// Define types based on what the page.tsx is sending
type TenantRent = {
  id: string
  name: string
  room: string
  amount: number
  dueDate: string
  status: string
  phone: string
}

type AvailableRoom = {
  id: string
  roomNumber: string
  price: number
}

type RentLedgerTableProps = {
  initialData: TenantRent[]
  availableRooms: AvailableRoom[]
  pgId: string
}

export default function RentLedgerTable({ initialData, availableRooms, pgId }: RentLedgerTableProps) {
  // State for the modals
  const [selectedTenant, setSelectedTenant] = useState<TenantRent | null>(null)
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <div className="px-1 py-1   bg-green-100 text-green-700 rounded-full text-sm font-semibold flex flex-row justify-center gap-1">  <CircleCheckBig/> Paid</div>
      case 'Pending': return <span className="px-1 py-1  bg-gray-100 text-gray-700 rounded-full text-sm font-semibold flex flex-row justify-center gap-1"> <CalendarClock/> Pending</span>
      case 'Overdue': return <span className="px-1 py-1  bg-red-100 text-red-700 rounded-full text-sm font-semibold flex flex-row justify-center gap-1"> <TriangleAlert/> Overdue</span>
      default: return null
    }
  }
 
  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (!name) return "XX"
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* TABLE HEADER & ACTIONS */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white flex-wrap gap-4">
        <h3 className="text-xl font-bold text-gray-900">Rent Ledger</h3>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
            <FileDown size={16} />
            Export CSV
          </button>
          
          <button 
            onClick={() => setIsAddTenantOpen(true)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-full text-sm font-semibold transition"
          >
            <UserPlus size={16} />
            Add Tenant
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW (Hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-semibold">
              <th className="p-4 pl-6">Tenant Name</th>
              <th className="p-4">Room</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                  No tenants found. Click "Add Tenant" to get started!
                </td>
              </tr>
            ) : (
              initialData.map((tenant) => (
                <tr 
                  key={tenant.id} 
                  onClick={() => setSelectedTenant(tenant)}
                  className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${tenant.status === 'Overdue' ? 'bg-red-50/30' : ''}`}
                >
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(tenant.name)}
                    </div>
                    <span className="font-medium text-gray-900">{tenant.name}</span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{tenant.room}</td>
                  <td className="p-4 font-bold text-gray-900">₹{tenant.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">{tenant.dueDate}</td>
                  <td className="p-4">{getStatusBadge(tenant.status)}</td>
                  <td className="p-4 text-right pr-6">
                    {tenant.status === 'Pending' && (
                      <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); /* future logic */ }}>Mark as Paid</button>
                    )}
                    {tenant.status === 'Overdue' && (
                      <button className="px-4 py-2 bg-[#b24c1e] text-white rounded-full text-sm font-medium hover:bg-[#8e3b15]" onClick={(e) => { e.stopPropagation(); /* future logic */ }}>✉ Remind</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW (Card Layout) */}
      <div className="md:hidden flex flex-col">
        {initialData.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-medium">
             No tenants found.
          </div>
        )}
        
        {initialData.map((tenant) => (
          <div 
            key={tenant.id} 
            onClick={() => setSelectedTenant(tenant)}
            className={`p-4 border-b border-gray-100 flex flex-col gap-3 active:bg-gray-50 ${tenant.status === 'Overdue' ? 'bg-red-50/30' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                  {getInitials(tenant.name)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{tenant.name}</h4>
                  <p className="text-sm text-gray-500">Room {tenant.room} • ₹{tenant.amount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              {getStatusBadge(tenant.status)}
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Due: {tenant.dueDate}</span>
              {tenant.status === 'Pending' && (
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium" onClick={(e) => { e.stopPropagation(); }}>Mark Paid</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      {selectedTenant && (
        <TenantDetailsModal 
          tenant={selectedTenant} 
          onClose={() => setSelectedTenant(null)} 
        />
      )}

      <AddTenantModal 
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
        pgId={pgId}
        availableRooms={availableRooms}
      />
    </div>
  )
}