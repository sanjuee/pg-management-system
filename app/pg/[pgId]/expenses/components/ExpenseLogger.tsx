"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, ReceiptText } from "lucide-react";
import { addExpenseAction, deleteExpenseAction } from "@/app/actions/expense-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ExpenseLogger({
  pgId,
  currentMonth,
  expenses,
}: {
  pgId: string;
  currentMonth: string;
  expenses: { id: string; category: string; amount: number; note: string | null; createdAt: Date }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("pgId", pgId);
    
    const res = await addExpenseAction(formData);
    
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Expense logged successfully");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error || "Failed to log expense");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    const res = await deleteExpenseAction(id, pgId);
    if (res.success) {
      toast.success("Expense deleted");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  }

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Logger Form */}
      <div className="p-6 md:w-1/3 bg-slate-50 border-r border-gray-200">
        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
          <ReceiptText size={18} className="text-slate-500" />
          Log Expense
        </h3>
        
        <form id="expense-form" onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-3 text-slate-400" />
              <select name="category" required className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select category...</option>
                <option value="Electricity">Electricity</option>
                <option value="Internet">Internet/WiFi</option>
                <option value="Water">Water</option>
                <option value="Staff">Staff/Salary</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Food/Groceries">Food/Groceries</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Amount (₹)</label>
            <input 
              type="number" 
              name="amount" 
              required 
              min="1"
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Note (Optional)</label>
            <input 
              type="text" 
              name="note" 
              placeholder="e.g. August Bill"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-slate-800 text-white font-medium py-2 rounded text-sm transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            {isSubmitting ? "Logging..." : "Add Expense"}
          </button>
        </form>
      </div>

      {/* Expense List */}
      <div className="p-6 md:w-2/3 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-primary">Current Month ({currentMonth})</h3>
        </div>

        {expenses.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-md">
            <p className="text-sm text-slate-400">No expenses logged this month.</p>
          </div>
        ) : (
          <div className="overflow-auto border border-slate-200 rounded-md max-h-64">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                <tr>
                  <th className="px-4 py-3 border-b">Date</th>
                  <th className="px-4 py-3 border-b">Category</th>
                  <th className="px-4 py-3 border-b">Note</th>
                  <th className="px-4 py-3 border-b text-right">Amount</th>
                  <th className="px-4 py-3 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-600">{new Date(expense.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium text-primary">{expense.category}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{expense.note || "-"}</td>
                    <td className="px-4 py-3 text-right font-bold text-primary">₹{expense.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete expense"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
