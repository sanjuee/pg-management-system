"use client"

import { useState } from "react"
import { List, BarChart3 } from "lucide-react" // Changed icon to BarChart3
import RentLedgerTable from "./RentLedgerTable"
import MonthlyCashFlow from "./MontlyCashFlow"

type RentViewsContainerProps = {
  ledgerData: any[]
  revenueData: any[] // Changed prop name
}

export default function RentViewsContainer({ ledgerData, revenueData }: RentViewsContainerProps) {
  const [activeView, setActiveView] = useState<'list' | 'cashflow'>('list')
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* THE VIEW TOGGLE */}
      <div className="flex justify-end">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeView === 'list' 
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <List size={16} />
            Ledger
          </button>
          <button
            onClick={() => setActiveView('cashflow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeView === 'cashflow' 
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <BarChart3 size={16} />
            Cash Flow
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDERING */}
      {activeView === 'list' ? (
        <RentLedgerTable 
          filteredData={ledgerData} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <MonthlyCashFlow data={revenueData} />
      )}
      
    </div>
  )
}