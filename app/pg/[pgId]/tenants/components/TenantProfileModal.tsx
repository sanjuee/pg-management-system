"use client"

import { useState } from "react"
import { Edit2, X, Save, Trash2, Loader2, Phone } from "lucide-react"

import toast from "react-hot-toast"
import { updateTenantDetailsAction, deleteTenantAction } from "@/app/actions/tenant-action"

type TenantProfileModalProps = {
  tenant: any
  onClose: () => void
}

export default function TenantProfileModal({ 
  tenant, 
  onClose, 
}: TenantProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    refundAmount: number | string;
    refundMethod: string;
    refundNote: string;
  }>({
    isOpen: false,
    refundAmount: 0,
    refundMethod: 'Cash',
    refundNote: ''
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isEditing) {
      onClose()
    }
  }

  const handleSave = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await updateTenantDetailsAction(tenant.id, formData)
      
      if (result?.success === false) {
        toast.error(result.error || "Failed to update tenant")
      } else {
        toast.success("Tenant details updated!")
        setIsEditing(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    const toastId = toast.loading("Deleting tenant...")

    try {
      await deleteTenantAction(
        tenant.id, 
        Number(deleteConfig.refundAmount) || 0, 
        deleteConfig.refundMethod, 
        deleteConfig.refundNote
      )
      toast.success("Tenant deleted successfully!", { id: toastId })
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete tenant", { id: toastId })
    } finally {
      setIsDeleting(false)
      setDeleteConfig(prev => ({ ...prev, isOpen: false }))
    }
  }

  const handleDelete = () => {
    setDeleteConfig({
      isOpen: true,
      refundAmount: tenant.securityDeposit || 0,
      refundMethod: 'Cash',
      refundNote: 'Security Deposit Return'
    });
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await handleSave(formData);
        }}>
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black shrink-0">
                {tenant.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="w-full">
                {isEditing ? (
                  <input 
                    name="name" 
                    defaultValue={tenant.name} 
                    required
                    className="w-full font-bold text-gray-900 border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">{tenant.name}</h2>
                )}
                <p className="text-gray-500 mt-1">Room {tenant.room}</p>
              </div>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-1">
              {!isEditing && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)} 
                    className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition"
                    title="Edit Details"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                    title="Delete Tenant"
                  >
                    {isDeleting ? <Loader2 size={18} className="animate-spin text-red-600" /> : <Trash2 size={18} />}
                  </button>
                </>
              )}
              <button 
                type="button" 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-indigo-200 transition-colors">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 flex items-center gap-1"><Phone size={12}/> Phone Number</p>
                {isEditing ? (
                  <input 
                    name="phone" 
                    type="tel"
                    defaultValue={tenant.phone} 
                    required
                    className="w-full font-medium text-gray-900 bg-white border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{tenant.phone}</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-indigo-200 transition-colors">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Rent (₹)</p>
                {isEditing ? (
                  <input 
                    name="rent" 
                    type="number"
                    defaultValue={tenant.rent} 
                    required
                    className="w-full font-bold text-gray-900 bg-white border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-bold text-gray-900">
                    {tenant.rent > 0 
                      ? `₹${(tenant.rent).toLocaleString('en-IN')}/mo`
                      : <span className="text-slate-400 font-medium text-sm">Set on room assignment</span>
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Joined Date</p>
                  <p className="font-medium text-gray-900">{tenant.joinedDate}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-indigo-200 transition-colors">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Security Deposit</p>
                {isEditing ? (
                  <input 
                    name="securityDeposit" 
                    type="number"
                    defaultValue={tenant.securityDeposit || 0}
                    className="w-full font-bold text-gray-900 bg-white border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-bold text-gray-900">₹{(tenant.securityDeposit || 0).toLocaleString('en-IN')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            {isEditing ? (
              <>
                <button 
                  type="button"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-100 transition text-gray-700"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] flex justify-center items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm text-gray-700 flex justify-center items-center gap-2"
                  onClick={() => window.open(`https://wa.me/91${tenant.phone}`, '_blank')}
                >
                  WhatsApp
                </button>
                <button 
                  type="button"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm text-gray-700 flex justify-center items-center gap-2"
                  onClick={() => window.open(`tel:${tenant.phone}`, '_self')}
                >
                  Call
                </button>
              </>
            )}
          </div>
        </form>
      </div>
      
      {/* Delete / Refund Modal */}
      {deleteConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Tenant</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to delete <span className="font-semibold text-gray-700">{tenant.name}</span>? This will also unassign them from their room.
            </p>

            {(tenant.securityDeposit || 0) > 0 && (
              <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Refund Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={deleteConfig.refundAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDeleteConfig(prev => ({ 
                        ...prev, 
                        refundAmount: val === '' ? '' : (isNaN(Number(val)) ? prev.refundAmount : val)
                      }));
                    }}
                    onFocus={(e) => e.target.select()}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave as 0 if no refund is being paid.</p>
                </div>

                {Number(deleteConfig.refundAmount) > 0 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Payment Method
                      </label>
                      <select
                        value={deleteConfig.refundMethod}
                        onChange={(e) => setDeleteConfig(prev => ({ ...prev, refundMethod: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Note
                      </label>
                      <input
                        type="text"
                        value={deleteConfig.refundNote}
                        onChange={(e) => setDeleteConfig(prev => ({ ...prev, refundNote: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white"
                        placeholder="e.g. Returned after final inspection"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfig(prev => ({ ...prev, isOpen: false }))}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
