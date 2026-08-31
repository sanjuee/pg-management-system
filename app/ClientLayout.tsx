"use client";

import { useState } from "react";
import {
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
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { logout } from "@/app/actions/auth-actions";
import Image from "next/image";

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
  const [isPGSwitcherOpen, setIsPGSwitcherOpen] = useState(false);
  const pathname = usePathname();

  // Extract pgId from pathname
  const pgIdMatch = pathname.match(/^\/pg\/([^/]+)/);
  const activePgId = pgIdMatch ? pgIdMatch[1] : pgId;
  const currentPG = pgs.find((p) => p.id === activePgId) ?? pgs[0];

  const navLinks = [
    {
      href: `/pg/${activePgId}/dashboard`,
      label: "Dashboard",
      icon: LayoutGrid,
      match: `/pg/${activePgId}/dashboard`,
    },
    {
      href: `/pg/${activePgId}/rent`,
      label: "Rent",
      icon: Banknote,
      match: `/pg/${activePgId}/rent`,
    },
    {
      href: `/pg/${activePgId}/expenses`,
      label: "Profit & Loss",
      icon: TrendingUp,
      match: `/pg/${activePgId}/expenses`,
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
    <div className="flex h-screen bg-surface-soft font-sans text-primary overflow-hidden">
      {/* MOBILE HEADER (Minimal, just logo and PG switcher) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="PG Lord"
            width={32}
            height={32}
            className="object-contain"
          />
          <h1 className="text-lg font-bold tracking-tight text-primary">
            pglord
          </h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsPGSwitcherOpen(!isPGSwitcherOpen)}
            className="flex items-center gap-1 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-gray-200"
          >
            <Building2 size={14} />
            <span className="max-w-[100px] truncate">
              {currentPG?.name ?? "Select PG"}
            </span>
            <ChevronDown size={14} />
          </button>
          {isPGSwitcherOpen && pgs.length > 1 && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md border border-gray-200 shadow-lg z-50 overflow-hidden">
              {pgs.map((pg) => (
                <Link
                  key={pg.id}
                  href={`/pg/${pg.id}/dashboard`}
                  onClick={() => setIsPGSwitcherOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${pg.id === activePgId ? "text-accent bg-blue-50/50" : "text-slate-700"}`}
                >
                  <Building2 size={14} />
                  {pg.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-[260px] bg-white flex-col justify-between border-r border-gray-200">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="PG Lord Logo"
              width={40}
              height={40}
              className="object-contain "
              priority
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-primary/60">
                pglord
              </h1>
            </div>
          </div>

          {/* PG Switcher */}
          <div className="px-4 mb-4">
            <div className="relative">
              <button
                onClick={() => {
                  if (pgs.length > 1) setIsPGSwitcherOpen(!isPGSwitcherOpen);
                }}
                className={`w-full flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-md px-3 py-2.5 transition-colors ${pgs.length > 1 ? "hover:border-gray-300 cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 size={16} className="text-slate-500 shrink-0" />
                  <span className="text-xl font-semibold text-primary truncate">
                    {currentPG?.name ?? "Select PG"}
                  </span>
                </div>
                {pgs.length > 1 && (
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 shrink-0 transition-transform ${isPGSwitcherOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {isPGSwitcherOpen && pgs.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-gray-200 shadow-lg z-10 overflow-hidden">
                  {pgs.map((pg) => (
                    <Link
                      key={pg.id}
                      href={`/pg/${pg.id}/dashboard`}
                      onClick={() => setIsPGSwitcherOpen(false)}
                      className={`flex items-center gap-2 px-6 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${pg.id === activePgId ? "text-accent bg-blue-50/50" : "text-slate-700"}`}
                    >
                      <Building2 size={14} />
                      <span className="truncate">{pg.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="px-4">
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon, match }) => {
                const isActive = pathname === match;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`mr-3 ${isActive ? "text-white" : "text-slate-400"}`}
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* BOTTOM SECTION: Actions & Settings */}
        <div className="p-4 space-y-4">
          <div className="pt-4 border-t border-gray-200 space-y-1">
            <button
              onClick={() => logout()}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} className="mr-3 text-red-500" />
              Logout
            </button>
            <Link
              href="/settings"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === "/settings" ? "bg-slate-100 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-primary"}`}
            >
              <Settings size={16} className="mr-3 text-slate-400" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-40 pb-safe">
        {navLinks.slice(0, 4).map(({ href, label, icon: Icon, match }) => {
          const isActive = pathname === match;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                isActive ? "text-accent" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon size={20} className={isActive ? "text-accent" : ""} />
              <span className="text-[10px] font-medium">
                {label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pt-14 pb-16 lg:pt-0 lg:pb-0 lg:ml-[260px] w-full relative z-0 bg-surface-soft">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 6000,
            style: {
              background: "#000",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />
        {children}
      </main>
    </div>
  );
}
