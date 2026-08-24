"use client"

import { useState } from "react"
import { Plus, X, User, Phone, IndianRupee, DoorOpen, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
// IMPORT YOUR ACTION HERE (Update the path to wherever your action lives)
import { createTenantAction } from "@/app/actions/tenant-action"

export default function AddTenantModal({ pgId }: { pgId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const toastId = toast.loading("Adding tenant & generating invoice...")
    
    try {
      const formData = new FormData(e.currentTarget)
      await createTenantAction(formData)
      
      toast.success("Tenant added successfully!", { id: toastId })
      setIsOpen(false)
    } catch (error) {
      toast.error("Failed to add tenant. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* THE TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
      >
        <Plus size={18} /> Add Tenant
      </button>

      {/* THE MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New Tenant</h2>
                <p className="text-sm text-slate-500 font-medium">This will automatically generate their first invoice.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:bg-slate-200 hover:text-slate-700 p-2 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Hidden PG ID required by your action */}
              <input type="hidden" name="pgId" value={pgId} />

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input type="text" name="name" required className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Ryan Gosling" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-slate-400" />
                  </div>
                  <input type="tel" name="phone" required className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 9876543210" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base Rent (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee size={18} className="text-slate-400" />
                    </div>
                    <input type="number" name="rent" required className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="8000" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Room ID (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DoorOpen size={18} className="text-slate-400" />
                    </div>
                    <input type="text" name="roomId" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Room UUID" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                  {isSubmitting ? "Processing..." : "Save & Generate Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}