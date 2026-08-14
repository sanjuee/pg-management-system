// app/dashboard/rent/page.tsx
import { prisma } from "@/lib/prisma"
import RentLedgerTable from "./components/RentLedgerTable"

// A dummy action to simulate fetching rent data for the UI
async function getRentData(pgId: string) {
  // In a real app, this queries your Prisma database:
  // return await prisma.tenant.findMany({ where: { pgId }, include: { room: true, payments: true } })
  
  return [
    { id: "1", name: "Rahul Sharma", room: "101", amount: 8000, dueDate: "2023-10-01", status: "Paid", phone: "9876543210" },
    { id: "2", name: "Priya Patel", room: "204", amount: 7500, dueDate: "2023-10-05", status: "Pending", phone: "9123456789" },
    { id: "3", name: "Amit Kumar", room: "312", amount: 8500, dueDate: "2023-09-01", status: "Overdue", phone: "9988776655" },
    { id: "4", name: "Sneha Reddy", room: "105", amount: 8000, dueDate: "2023-10-01", status: "Paid", phone: "9898989898" },
  ]
}

export default async function RentPage() {
  const tenants = await getRentData("YOUR_PG_ID")

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Total Collected (This Month)</p>
          <h2 className="text-3xl font-black text-gray-900">₹84,500</h2>
          <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
            ↑ +5% vs last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Pending Payments</p>
          <h2 className="text-3xl font-black text-gray-900">₹15,000</h2>
          <p className="text-sm text-gray-500 font-medium mt-2">From 2 tenants</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <p className="text-sm text-red-600 font-bold mb-1 flex items-center gap-2">
            <span>⚠️</span> Overdue Rent
          </p>
          <h2 className="text-3xl font-black text-gray-900">₹8,500</h2>
          <p className="text-sm text-red-500 font-medium mt-2">Requires immediate action (1 tenant)</p>
        </div>
      </div>

      {/* The Interactive Table Component */}
      <RentLedgerTable initialData={tenants}  />
    </div>
  )
}