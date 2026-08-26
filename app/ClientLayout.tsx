"use client";

import { useState } from "react";
import {
  Menu,
  X,
  BedDouble,
  LayoutGrid,
  Banknote,
  Settings,
  HelpCircle,
  Plus,
  Building2,
  Users,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { logout } from "@/app/actions/auth-actions";
import AddTenantModal from "@/app/components/AddTenantModal";

type PG = { id: string; name: string };

export default function ClientLayout({
  children,
  pgId,
  pgs,
  availableRooms,
}: {
  children: React.ReactNode;
  pgId: string;
  pgs: PG[];
  availableRooms: { id: string; roomNumber: string; price: number }[];
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPGSwitcherOpen, setIsPGSwitcherOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const pathname = usePathname();

  // Extract pgId from pathname so it updates instantly during client-side navigation
  const pgIdMatch = pathname.match(/^\/pg\/([^/]+)/);
  const activePgId = pgIdMatch ? pgIdMatch[1] : pgId;

  const currentPG = pgs.find((p) => p.id === activePgId) ?? pgs[0];

  const navLinks = [
    {
      href: `/pg/${activePgId}/rent`,
      label: "Tenant Rent",
      icon: Banknote,
      match: `/pg/${activePgId}/rent`,
    },
    {
      href: `/pg/${activePgId}/rooms`,
      label: "Room Inventory",
      icon: BedDouble,
      match: `/pg/${activePgId}/rooms`,
    },
    {
      href: `/pg/${activePgId}/tenants`,
      label: "Tenants Directory",
      icon: Users,
      match: `/pg/${activePgId}/tenants`,
    },
  ];

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#f4f5f9] border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Building2 size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Proton
          </h1>
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
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#f4f5f9] flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none border-r border-gray-200
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* TOP SECTION: Logo & Nav */}
        <div>
          {/* Logo */}
          <div className="p-8 flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white mt-1 shadow-sm">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  Proton
                </h1>
                <p className="text-sm font-semibold text-indigo-600 mt-1">
                  Management
                </p>
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

          {/* PG Switcher */}
          <div className="px-4 mb-2">
            <div className="relative">
              <button
                onClick={() => {
                  if (pgs.length > 1) setIsPGSwitcherOpen(!isPGSwitcherOpen);
                }}
                className={`w-full flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm transition-colors ${pgs.length > 1 ? "hover:border-indigo-300 cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Building2 size={14} className="text-indigo-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 truncate">
                    {currentPG?.name ?? "Select PG"}
                  </span>
                </div>
                {pgs.length > 1 && (
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 flex-shrink-0 transition-transform ${isPGSwitcherOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {isPGSwitcherOpen && pgs.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-slate-200 shadow-lg z-10 overflow-hidden">
                  {pgs.map((pg) => (
                    <Link
                      key={pg.id}
                      href={`/pg/${pg.id}/rent`}
                      onClick={() => {
                        setIsPGSwitcherOpen(false);
                        setIsSidebarOpen(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-indigo-50 transition-colors ${pg.id === activePgId ? "text-indigo-600 bg-indigo-50/50" : "text-slate-700"}`}
                    >
                      <Building2 size={14} />
                      {pg.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-4 px-4">
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ href, label, icon: Icon, match }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-full font-medium transition-all ${
                      pathname === match
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* BOTTOM SECTION: Actions & Settings */}
        <div className="p-6 space-y-4">
          {/* Add New Tenant Button */}
          <button
            onClick={() => setIsAddTenantModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-900 text-white py-3 px-4 rounded-full font-semibold transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add New Tenant
          </button>

          <div className="pt-4 border-t border-gray-200 space-y-1">
            <Link
              href="/settings"
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center transition-colors w-full font-medium px-4 py-2.5 rounded-lg hover:bg-slate-200/50 ${pathname === "/settings" ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-slate-900"}`}
            >
              <Settings size={20} className="mr-3 opacity-70" />
              Settings
            </Link>

            <button className="flex items-center text-slate-600 hover:text-slate-900 transition-colors w-full font-medium px-4 py-2.5 rounded-lg hover:bg-slate-200/50">
              <HelpCircle size={20} className="mr-3 opacity-70" />
              Support
            </button>

            <button
              onClick={() => logout()}
              className="flex items-center text-red-600 hover:text-red-700 transition-colors w-full font-medium px-4 py-2.5 rounded-lg hover:bg-red-50"
            >
              <LogOut size={20} className="mr-3 opacity-70" />
              Logout
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
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />
        {children}
      </main>

      {/* ADD TENANT MODAL */}
      {activePgId && availableRooms && (
        <AddTenantModal
          isOpen={isAddTenantModalOpen}
          onClose={() => setIsAddTenantModalOpen(false)}
          pgId={activePgId}
          availableRooms={availableRooms}
        />
      )}
    </div>
  );
}
