import { getAuthUser } from "@/lib/supabase/get-user";
import { getOwnerPGs } from "@/app/queries/pg-queries";
import { redirect } from "next/navigation";
import AddPGForm from "@/app/components/AddPGForm";
import { Building2 } from "lucide-react";

export default async function SetupPage() {
  const user = await getAuthUser();
  const pgs = await getOwnerPGs(user.id);

  // If the owner already has PGs, send them to the first one
  if (pgs.length > 0) {
    redirect(`/pg/${pgs[0].id}/rent`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome to Proton
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Let&apos;s set up your first PG to get started.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Add your PG details
          </h2>
          <AddPGForm />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          You can add more PGs later from Settings.
        </p>
      </div>
    </div>
  );
}
