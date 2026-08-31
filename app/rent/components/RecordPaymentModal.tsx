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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER */}
        <div className="p-5 bg-slate-50/50 border-b border-gray-100 flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-blue-50 text-accent rounded-md flex items-center justify-center">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary tracking-tight">Record Payment</h2>
              <p className="text-xs text-slate-500 font-medium">{invoice.tenantName} • {invoice.billingMonth}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md transition">
            <X size={18} />
          </button>
        </div>

        {/* MATH BREAKDOWN */}
        <div className="p-5 pb-2 space-y-3 border-b border-gray-100">
          <div className="flex justify-between text-sm text-slate-600 font-medium">
            <span>Base Rent</span>
            <span className="text-primary font-bold">₹{invoice.baseRent.toLocaleString('en-IN')}</span>
          </div>
          {invoice.accumulatedFine > 0 && (
            <div className="flex justify-between text-sm text-red-600 font-medium">
              <span>Late Fines</span>
              <span className="font-bold">+ ₹{invoice.accumulatedFine.toLocaleString('en-IN')}</span>
            </div>
          )}
          {invoice.amountPaid > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 font-medium">
              <span>Already Paid</span>
              <span className="font-bold">- ₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-gray-100">
            <span>Remaining Balance</span>
            <span>₹{remainingBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* PAYMENT FORM */}
        <form onSubmit={handleSubmit} className="p-5 pt-4 space-y-5">
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <input type="hidden" name="paymentMethod" value={paymentMethod} />

          {/* Amount Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Amount Receiving Now (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee size={16} className="text-slate-400" />
              </div>
              <input
                type="number"
                name="paymentAmount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value ? Number(e.target.value) : "")}
                max={remainingBalance}
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md font-bold text-base text-primary focus:outline-none focus:ring-1 focus:ring-accent transition placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`py-2 flex flex-col items-center justify-center gap-1 rounded-md border text-[10px] font-bold transition ${
                  paymentMethod === "UPI" ? 'bg-blue-50 border-blue-200 text-accent' : 'bg-white border-gray-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={16} /> UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`py-2 flex flex-col items-center justify-center gap-1 rounded-md border text-[10px] font-bold transition ${
                  paymentMethod === "CASH" ? 'bg-blue-50 border-blue-200 text-accent' : 'bg-white border-gray-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Banknote size={16} /> Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("BANK")}
                className={`py-2 flex flex-col items-center justify-center gap-1 rounded-md border text-[10px] font-bold transition ${
                  paymentMethod === "BANK" ? 'bg-blue-50 border-blue-200 text-accent' : 'bg-white border-gray-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Receipt size={16} /> Transfer
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
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting || customAmount === "" || customAmount <= 0}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 rounded-md shadow-sm transition text-sm ${
              isSubmitting || customAmount === "" || customAmount <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-slate-800 text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Recording...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} /> Confirm Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}