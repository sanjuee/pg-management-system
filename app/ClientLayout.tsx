'use client'

import { useState } from 'react'
import { 
  Menu, X, BedDouble, LayoutGrid, Banknote, 
  Settings, HelpCircle, Plus, Building2, Users
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' 
import { Toaster } from 'react-hot-toast'

export default function ClientLayout({ 
  children,
  userEmail
}: { 
  children: React.ReactNode,
  userEmail: string
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname() 
  const router = useRouter()

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#f4f5f9] border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Building2 size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Proton</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-md active:bg-slate-200"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#f4f5f9] flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none border-r border-gray-200
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* TOP SECTION: Logo & Nav */}
        <div>
          <div className="p-8 flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white mt-1 shadow-sm">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Proton</h1>
                <p className="text-sm font-semibold text-indigo-600 mt-1">Management</p>
                <p className="text-xs text-gray-500 mt-0.5">Admin Portal</p>
              </div>
            </div>
            
            <button 
              className="lg:hidden p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-900 rounded-md transition-colors" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="mt-4 px-4">
            <ul className="flex flex-col gap-2">
              
              {/* Dashboard Link */}
              <li>
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-full font-medium transition-all ${
                    pathname === '/dashboard' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <LayoutGrid size={20} className="mr-3" />
                  Dashboard
                </Link>
              </li>

              {/* Room Inventory Link */}
              <li>
                <Link 
                  href="/rooms" 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-full font-medium transition-all ${
                    pathname === '/rooms' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <BedDouble size={20} className="mr-3" />
                  Room Inventory
                </Link>
              </li>

              {/* Tenants Directory Link */}
              <li>
                <Link 
                  href="/tenants" 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-full font-medium transition-all ${
                    pathname === '/tenants' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <Users size={20} className="mr-3" />
                  Tenants Directory
                </Link>
              </li>

              {/* Tenant Rent Link */}
              <li>
                <Link 
                  href="/rent" 
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-full font-medium transition-all ${
                    pathname === '/rent' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <Banknote size={20} className="mr-3" />
                  Tenant Rent
                </Link>
              </li>

            </ul>
          </nav>
        </div>

        {/* BOTTOM SECTION: Actions & Settings */}
        <div className="p-6 space-y-4">
          
          {/* Add New Room Button (Matching the screenshot) */}
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-900 text-white py-3 px-4 rounded-full font-semibold transition-colors shadow-sm">
            <Plus size={20} />
            Add New Room
          </button>

          <div className="pt-4 border-t border-gray-200 space-y-1">
            <button className="flex items-center text-slate-600 hover:text-slate-900 transition-colors w-full font-medium px-4 py-2.5 rounded-lg hover:bg-slate-200/50">
              <Settings size={20} className="mr-3 opacity-70" /> 
              Settings
            </button>
            
            <button className="flex items-center text-slate-600 hover:text-slate-900 transition-colors w-full font-medium px-4 py-2.5 rounded-lg hover:bg-slate-200/50">
              <HelpCircle size={20} className="mr-3 opacity-70" /> 
              Support
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 w-full relative z-0 bg-white">
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 6000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500'
            },
          }} 
        />
        {children}
      </main>

    </div>
  )
}