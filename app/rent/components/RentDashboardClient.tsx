// app/dashboard/rent/components/RentDashboardClient.tsx
"use client";

import { useState } from "react";
import { TriangleAlert, UserPlus, Search } from "lucide-react";
import RentLedgerTable from "./RentLedgerTable";
import AddTenantModal from "@/app/components/AddTenantModal"; // Adjust path if needed

type TenantRent = {
  id: string;
  name: string;
  room: string;
  amount: number;
  dueDate: string;
  status: string;
  phone: string;
}

type AvailableRoom = {
  id: string;
  roomNumber: string;
  price: number;
}

type Props = {
  initialTenants: TenantRent[];
  availableRooms: AvailableRoom[];
  pgId: string;
}

export default function RentDashboardClient({ initialTenants, availableRooms, pgId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);

  // 1. Filter the data based on the search bar
  const filteredTenants = initialTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Calculate Stats (Using all tenants, not just filtered ones, so totals remain accurate)
  const totalCollected = initialTenants.filter((t) => t.status === "Paid").reduce((sum, t) => sum + t.amount, 0);
  const pendingTenants = initialTenants.filter((t) => t.status === "Pending");
  const pendingAmount = pendingTenants.reduce((sum, t) => sum + t.amount, 0);
  const overdueTenants = initialTenants.filter((t) => t.status === "Overdue");
  const overdueAmount = overdueTenants.reduce((sum, t) => sum + t.amount, 0);

return (
  <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
    
    {/* HEADER WITH SEARCH AND ADD BUTTON */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tenant Rent</h1>
        <p className="text-gray-500 mt-1">Manage rent collection and monitor payment statuses.</p>
      </div>
      
      <div className="flex flex-row gap-3 w-full lg:w-auto items-center">
        {/* Working Search Bar - HIDDEN ON MOBILE using 'hidden sm:block' */}
        <div className="relative w-full sm:w-64 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tenants or rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors"
          />
        </div>
        
        {/* Add Tenant Button - Stays full width on mobile or scales nicely */}
        <button 
          onClick={() => setIsAddTenantOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-sm w-full sm:w-auto"
        >
          <UserPlus size={18} />
          Add Tenant
        </button>
      </div>
    </div>
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Collected (This Month)</p>
          <h2 className="text-3xl font-bold text-gray-900">₹{totalCollected.toLocaleString("en-IN")}</h2>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Pending Payments</p>
          <h2 className="text-3xl font-bold text-gray-900">₹{pendingAmount.toLocaleString("en-IN")}</h2>
          <p className="text-sm text-gray-500 font-medium mt-2">From {pendingTenants.length} tenants</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="text-sm text-red-600 font-bold mb-1 flex items-center gap-1.5">
            <TriangleAlert size={16} /> Overdue Rent
          </div>
          <h2 className="text-3xl font-bold text-gray-900">₹{overdueAmount.toLocaleString("en-IN")}</h2>
          <p className="text-sm text-red-500 font-medium mt-2">
            {overdueTenants.length > 0 ? `Requires immediate action (${overdueTenants.length})` : "All caught up!"}
          </p>
        </div>
      </div>

      {/* TABLE (Receives the pre-filtered data) */}
      <RentLedgerTable 
      filteredData={filteredTenants} 
      searchTerm={searchTerm} 
      setSearchTerm={setSearchTerm} 
    />
      {/* MODAL */}
      <AddTenantModal 
        isOpen={isAddTenantOpen}
        onClose={() => setIsAddTenantOpen(false)}
        pgId={pgId}
        availableRooms={availableRooms}
      />
    </div>
  );
}