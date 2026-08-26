import { getAuthUser } from "@/lib/supabase/get-user";
import { getOwnerPGs } from "@/app/queries/pg-queries";
import SettingsAddPGSection from "./components/SettingsAddPGSection";
import Link from "next/link";
import { Building2, Mail, ChevronRight } from "lucide-react";

export default async function SettingsPage() {
  const user = await getAuthUser();
  const pgs = await getOwnerPGs(user.id);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage your account and PG properties.
        </p>
      </div>

      {/* OWNER DETAILS */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Owner Details</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                PGs Managed
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {pgs.length} PG{pgs.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MY PGs LIST */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">My PGs</h2>
        </div>

        {pgs.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <Building2 size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">
              No PGs added yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pgs.map((pg) => (
              <li key={pg.id}>
                <Link
                  href={`/pg/${pg.id}/rent`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Building2 size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {pg.name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        UPI: {pg.upiId}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-slate-500 transition-colors"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ADD NEW PG (TOGGLEABLE) */}
      <SettingsAddPGSection />
    </div>
  );
}
