"use client"

import { useState } from "react"
import { Edit2, X, Save, Trash2, Loader2 } from "lucide-react"

import toast from "react-hot-toast"
import { updateTenantDetailsAction, deleteTenantAction } from "@/app/actions/tenant-action"
import ConfirmModal from "@/app/components/ConfirmModal"

type TenantDetailsModalProps = {
  tenant: any
  onClose: () => void
  onRecordPayment: (tenant: any) => void
}

export default function TenantDetailsModal({ 
  tenant, 
  onClose, 
  onRecordPayment 
}: TenantDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isEditing) {
      onClose()
    }
  }

  const handleSave = async (formData: FormData) => {
    const result = await updateTenantDetailsAction(tenant.tenantId || tenant.id, formData)
    
    if (result?.success === false) {
      toast.error(result.error || "Failed to update tenant")
    } else {
      toast.success("Tenant details updated!")
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    const tenantId = tenant.tenantId || tenant.id
    setConfirmConfig({
      isOpen: true,
      title: "Delete Tenant",
      message: `Are you sure you want to delete ${tenant.name}? This action cannot be undone.`,
      onConfirm: async () => {
        setIsDeleting(true)
        const toastId = toast.loading("Deleting tenant...")

        try {
          await deleteTenantAction(tenantId)
          toast.success("Tenant deleted successfully!", { id: toastId })
          onClose()
        } catch (error: any) {
          toast.error(error.message || "Failed to delete tenant", { id: toastId })
        } finally {
          setIsDeleting(false)
        }
      }
    });
  }

  // Calculate the remaining balance
  const remainingBalance = (tenant.amount || 0) - (tenant.amountPaid || 0)

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <form action={handleSave}>
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-black shrink-0">
                {tenant.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
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
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone Number</p>
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
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Base Rent (₹)</p>
                {isEditing ? (
                  <input 
                    name="rent" 
                    type="number"
                    defaultValue={tenant.baseRent || tenant.amount} 
                    required
                    className="w-full font-bold text-gray-900 bg-white border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-bold text-gray-900">₹{(tenant.baseRent || tenant.amount).toLocaleString('en-IN')}/mo</p>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Current Payment Status</h4>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 text-sm font-medium">Due Date:</span>
                <span className="font-bold text-gray-900">{tenant.dueDate}</span>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 text-sm font-medium">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tenant.status === 'PAID' ? 'bg-green-100 text-green-700' :
                  tenant.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                  tenant.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {tenant.status}
                </span>
              </div>

              {(tenant.status === 'PARTIAL' || tenant.status === 'OVERDUE' || tenant.status === 'PENDING') && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-gray-900 text-sm font-bold">Remaining Balance:</span>
                  <span className="font-black text-red-600">₹{remainingBalance.toLocaleString('en-IN')}</span>
                </div>
              )}
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
                  className="flex-[2] flex justify-center items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition"
                >
                  <Save size={16} /> Save Changes
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm text-gray-700"
                  onClick={() => window.open(`https://wa.me/91${tenant.phone}`, '_blank')}
                >
                  WhatsApp
                </button>
                
                {tenant.status !== 'PAID' && (
                  <button 
                    type="button"
                    onClick={() => onRecordPayment(tenant)}
                    className="flex-1 px-4 py-2.5 bg-indigo-700 text-white rounded-xl text-sm font-semibold hover:bg-indigo-900 shadow-sm transition"
                  >
                    Mark as Paid
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </div>
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
      />
    </div>
  )
}