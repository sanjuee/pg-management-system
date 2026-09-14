"use client";

import { useState } from "react";
import { Plus, Trash2, Tag, ReceiptText, IndianRupee, Loader2 } from "lucide-react";
import ConfirmModal from "@/app/components/ConfirmModal";
import {
  addExpenseAction,
  deleteExpenseAction,
} from "@/app/actions/expense-actions";
import {
  addIncomeAction,
  deleteIncomeAction,
} from "@/app/actions/income-actions";
import toast from "react-hot-toast";

export default function TransactionLogger({
  pgId,
  currentMonth,
  expenses,
  incomes,
}: {
  pgId: string;
  currentMonth: string;
  expenses: {
    id: string;
    category: string;
    amount: number;
    note: string | null;
    createdAt: Date;
  }[];
  incomes: {
    id: string;
    category: string;
    amount: number;
    note: string | null;
    createdAt: Date;
  }[];
}) {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "expense" | "income";
  } | null>(null);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("pgId", pgId);

    const isExpense = activeTab === "expense";
    const action = isExpense ? addExpenseAction : addIncomeAction;
    const res = await action(formData);

    setIsSubmitting(false);
    if (res.success) {
      toast.success(`${isExpense ? "Expense" : "Income"} logged successfully`);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error || `Failed to log ${activeTab}`);
    }
  }

  async function confirmDelete() {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    const action =
      type === "expense" ? deleteExpenseAction : deleteIncomeAction;
    const res = await action(id, pgId);
    if (res.success) {
      toast.success(`${type === "expense" ? "Expense" : "Income"} deleted`);
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setItemToDelete(null);
  }

  const expenseCategories = [
    "Electricity",
    "Internet",
    "Water",
    "Staff",
    "Maintenance",
    "Food/Groceries",
    "Other",
  ];
  const incomeCategories = [
    "Fine",
    "Extra Food/Meals",
    "Vending Machine",
    "Other",
  ];

  const currentCategories =
    activeTab === "expense" ? expenseCategories : incomeCategories;
  const currentList = activeTab === "expense" ? expenses : incomes;

  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "highest") return b.amount - a.amount;
    if (sortBy === "lowest") return a.amount - b.amount;
    return 0;
  });

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Logger Form */}
      <div className="p-6 md:w-1/3 bg-slate-50 border-r border-gray-200">
        <div className="flex bg-slate-200 p-1 rounded-md mb-6">
          <button
            onClick={() => setActiveTab("expense")}
            className={`flex-1 text-sm font-medium py-1.5 rounded-sm transition-colors ${activeTab === "expense" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Expense
          </button>
          <button
            onClick={() => setActiveTab("income")}
            className={`flex-1 text-sm font-medium py-1.5 rounded-sm transition-colors ${activeTab === "income" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Income
          </button>
        </div>

        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
          {activeTab === "expense" ? (
            <ReceiptText size={18} className="text-slate-500" />
          ) : (
            <IndianRupee size={18} className="text-emerald-500" />
          )}
          Log {activeTab === "expense" ? "Expense" : "Income"}
        </h3>

        <form id="transaction-form" onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Category
            </label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-3 text-slate-400" />
              <select
                name="category"
                required
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select category...</option>
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Amount (₹)
            </label>
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
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              name="note"
              placeholder={
                activeTab === "expense" ? "e.g. August Bill" : "e.g. Late fee"
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 font-medium py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white ${activeTab === "expense" ? "bg-primary hover:bg-slate-800" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {isSubmitting
              ? "Logging..."
              : `Add ${activeTab === "expense" ? "Expense" : "Income"}`}
          </button>
        </form>
      </div>

      {/* Transaction List */}
      <div className="p-6 md:w-2/3 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-primary">
            Current Month {activeTab === "expense" ? "Expenses" : "Incomes"} (
            {currentMonth})
          </h3>
          {currentList.length > 0 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          )}
        </div>

        {currentList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-md">
            <p className="text-sm text-slate-400">
              No {activeTab === "expense" ? "expenses" : "incomes"} logged this
              month.
            </p>
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
                {sortedList.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0 hover:bg-slate-50/50"
                  >
                    <td
                      className="px-4 py-3 text-slate-600"
                      suppressHydrationWarning
                    >
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {item.note || "-"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-bold ${activeTab === "expense" ? "text-primary" : "text-emerald-600"}`}
                    >
                      {activeTab === "income" ? "+" : ""}₹
                      {item.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setItemToDelete({ id: item.id, type: activeTab })
                        }
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title={`Delete ${activeTab}`}
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
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${itemToDelete?.type === "expense" ? "Expense" : "Income"}`}
        message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
