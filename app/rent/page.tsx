// app/dashboard/rent/page.tsx
import { getRentLedgerData } from "@/app/queries/tenant-queries"
import { getAvailableRoomsList } from "@/app/queries/room-queries"
import RentLedgerTable from "./components/RentLedgerTable"
import { TriangleAlert } from "lucide-react"

export default async function RentPage() {
  const CURRENT_PG_ID = "4f3c2b81-9d11-4a5e-b287-73c09r3e4b1a" // Use the ID you generated in Prisma Studio

  // Fetch real data from the database
  const tenants = await getRentLedgerData(CURRENT_PG_ID)
  const availableRooms = await getAvailableRoomsList(CURRENT_PG_ID)

  // Dynamically calculate the summary statistics
  const totalCollected = tenants.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0)
  
  const pendingTenants = tenants.filter(t => t.status === 'Pending')
  const pendingAmount = pendingTenants.reduce((sum, t) => sum + t.amount, 0)
  
  const overdueTenants = tenants.filter(t => t.status === 'Overdue')
  const overdueAmount = overdueTenants.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Rent</h1>
          <p className="text-gray-500">Manage rent collection and monitor payment statuses.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search tenants..." 
            className="border border-gray-300 rounded-full px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button className="border border-gray-300 rounded-full px-4 py-2 bg-white hover:bg-gray-50 flex items-center gap-2">
            Filter
          </button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Collected (This Month)</p>
          <h2 className="text-3xl font-black text-gray-900">₹{totalCollected.toLocaleString('en-IN')}</h2>
          <p className="text-sm text-gray-400 font-medium mt-2">
            Updated just now
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Pending Payments</p>
          <h2 className="text-3xl font-black text-gray-900">₹{pendingAmount.toLocaleString('en-IN')}</h2>
          <p className="text-sm text-gray-500 font-medium mt-2">From {pendingTenants.length} tenants</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="text-lg text-red-600 font-bold mb-1 flex items-center gap-2">
            <TriangleAlert/> Overdue Rent
          </div>
          <h2 className="text-3xl font-black text-gray-900">₹{overdueAmount.toLocaleString('en-IN')}</h2>
          <p className="text-sm text-red-500 font-medium mt-2">
            {overdueTenants.length > 0 ? `Requires immediate action (${overdueTenants.length})` : "All caught up!"}
          </p>
        </div>
      </div>

      {/* The Interactive Table Component */}
      <RentLedgerTable 
        initialData={tenants} 
        availableRooms={availableRooms} 
        pgId={CURRENT_PG_ID} 
      />
    </div>
  )
}