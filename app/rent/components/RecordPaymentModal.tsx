"use client"

import { useState, useEffect } from "react"
// Added Loader2 to the imports
import { X, Receipt, IndianRupee, CreditCard, Banknote, CheckCircle2, Loader2 } from "lucide-react"
import { recordPaymentAction } from "@/app/actions/billing-actions"
import toast from "react-hot-toast"

type InvoiceDetails = {
  id: string
  billingMonth: string
  baseRent: number
  accumulatedFine: number
  totalAmount: number
  amountPaid: number
  tenantName: string
}

type RecordPaymentModalProps = {
  isOpen: boolean
  onClose: () => void
  invoice: InvoiceDetails | null
}

export default function RecordPaymentModal({ isOpen, onClose, invoice }: RecordPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  const [customAmount, setCustomAmount] = useState<number | "">("")

  useEffect(() => {
    if (invoice) {
      setCustomAmount(invoice.totalAmount - invoice.amountPaid)
      setPaymentMethod("UPI") // Reset to default on new open
    }
  }, [invoice])

  if (!isOpen || !invoice) return null

  const remainingBalance = invoice.totalAmount - invoice.amountPaid

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const toastId = toast.loading("Recording payment...")
    
    // Extract the form data manually
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const result = await recordPaymentAction(formData)
    
    if (result.success) {
      toast.success("Payment recorded successfully!", { id: toastId })
      onClose()
    } else {
      toast.error(result.error || "Failed to record payment.", { id: toastId })
    }
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <Receipt size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
              <p className="text-sm text-slate-500 font-medium">{invoice.tenantName} • {invoice.billingMonth}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-200 hover:text-slate-700 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* MATH BREAKDOWN */}
        <div className="p-6 pb-2 space-y-3 border-b border-slate-50">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Base Rent</span>
            <span className="font-medium">₹{invoice.baseRent.toLocaleString('en-IN')}</span>
          </div>
          {invoice.accumulatedFine > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Late Fines</span>
              <span className="font-medium">+ ₹{invoice.accumulatedFine.toLocaleString('en-IN')}</span>
            </div>
          )}
          {invoice.amountPaid > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Already Paid</span>
              <span className="font-medium">- ₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
            <span>Remaining Balance</span>
            <span>₹{remainingBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* PAYMENT FORM */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <input type="hidden" name="paymentMethod" value={paymentMethod} />

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Amount Receiving Now (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IndianRupee size={18} className="text-slate-400" />
              </div>
              <input
                type="number"
                name="paymentAmount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value ? Number(e.target.value) : "")}
                max={remainingBalance}
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`py-2 flex flex-col items-center justify-center gap-1 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === "UPI" ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={18} /> UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`py-2 flex flex-col items-center justify-center gap-1 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === "CASH" ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Banknote size={18} /> Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("BANK")}
                className={`py-2 flex flex-col items-center justify-center gap-1 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === "BANK" ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Banknote size={18} /> Bank
              </button>
            </div>
          </div>

          {/* Optional Reference ID (for UPI/Bank) */}
          {paymentMethod !== "CASH" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Transaction ID (Optional)
              </label>
              <input
                type="text"
                name="referenceId"
                placeholder="e.g., UTR Number"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || customAmount === "" || customAmount <= 0}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin " />
            ) : (
              <CheckCircle2 size={20} />
            )}
            {isSubmitting ? "Processing..." : `Confirm ₹${Number(customAmount).toLocaleString('en-IN')}`}
          </button>
        </form>
      </div>
    </div>
  )
}