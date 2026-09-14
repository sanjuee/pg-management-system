"use client"

import { useState } from "react"
import { X, AlertTriangle, Loader2 } from "lucide-react"

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true
}: ConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${isDestructive ? 'bg-red-50/50' : 'bg-indigo-50/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`${isDestructive ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'} p-2 rounded-xl`}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              disabled={isSubmitting}
              onClick={async () => {
                setIsSubmitting(true)
                try {
                  await onConfirm()
                  onClose()
                } catch (error) {
                  console.error(error)
                } finally {
                  setIsSubmitting(false)
                }
              }}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed " : ""
              }${
                isDestructive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
