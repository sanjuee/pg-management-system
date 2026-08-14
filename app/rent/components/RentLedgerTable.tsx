"use client"

import { useState } from "react"
import TenantDetailsModal from "./TenantDetailsModal"

// Define the type based on the data structure
type TenantRent = {
  id: string
  name: string
  room: string
  amount: number
  dueDate: string
  status: string
  phone: string
}

export default function RentLedgerTable({ initialData }: { initialData: TenantRent[] }) {
  const [selectedTenant, setSelectedTenant] = useState<TenantRent | null>(null)

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ Paid</span>
      case 'Pending': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">◷ Pending</span>
      case 'Overdue': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">⚠ Overdue</span>
      default: return null
    }
  }

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <h3 className="text-xl font-bold text-gray-900">Rent Ledger</h3>
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Export CSV ⬇
        </button>
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
            {initialData.map((tenant) => (
              <tr 
                key={tenant.id} 
                onClick={() => setSelectedTenant(tenant)}
                className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${tenant.status === 'Overdue' ? 'bg-red-50/30' : ''}`}
              >
                <td className="p-4 pl-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(tenant.name)}
                  </div>
                  <span className="font-medium text-gray-900">{tenant.name}</span>
                </td>
                <td className="p-4 text-gray-600">{tenant.room}</td>
                <td className="p-4 font-medium text-gray-900">₹{tenant.amount}</td>
                <td className="p-4 text-gray-600">{tenant.dueDate}</td>
                <td className="p-4">{getStatusBadge(tenant.status)}</td>
                <td className="p-4 text-right pr-6">
                  {tenant.status === 'Paid' && (
                    <button className="text-gray-400 hover:text-indigo-600 p-2" onClick={(e) => { e.stopPropagation(); /* view receipt logic */ }}>📄</button>
                  )}
                  {tenant.status === 'Pending' && (
                    <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); /* mark paid logic */ }}>Mark as Paid</button>
                  )}
                  {tenant.status === 'Overdue' && (
                    <button className="px-4 py-2 bg-[#b24c1e] text-white rounded-full text-sm font-medium hover:bg-[#8e3b15]" onClick={(e) => { e.stopPropagation(); /* send reminder logic */ }}>✉ Send Reminder</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW (Card Layout) */}
      <div className="md:hidden flex flex-col">
        {initialData.map((tenant) => (
          <div 
            key={tenant.id} 
            onClick={() => setSelectedTenant(tenant)}
            className={`p-4 border-b border-gray-100 flex flex-col gap-3 active:bg-gray-50 ${tenant.status === 'Overdue' ? 'bg-red-50/30' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {getInitials(tenant.name)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{tenant.name}</h4>
                  <p className="text-sm text-gray-500">Room {tenant.room} • ₹{tenant.amount}</p>
                </div>
              </div>
              {getStatusBadge(tenant.status)}
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Due: {tenant.dueDate}</span>
              {tenant.status === 'Pending' && (
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium" onClick={(e) => { e.stopPropagation(); }}>Mark Paid</button>
              )}
              {tenant.status === 'Overdue' && (
                <button className="px-3 py-1.5 bg-[#b24c1e] text-white rounded-lg text-xs font-medium" onClick={(e) => { e.stopPropagation(); }}>Send Reminder</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 bg-white">
        <span>Showing 1 to {initialData.length} of 24 entries</span>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">{'<'}</button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-[#b24c1e] text-white font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">{'>'}</button>
        </div>
      </div>

      {/* The Pop-up Modal Component */}
      {selectedTenant && (
        <TenantDetailsModal 
          tenant={selectedTenant} 
          onClose={() => setSelectedTenant(null)} 
        />
      )}
    </div>
  )
}