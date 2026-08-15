//              Note : Currently allows to edit the no of total rooms to lower  than occupied

"use client";

import { useState } from "react";
import { X, Layers, Edit2, Trash2, Save } from "lucide-react";
import {
  updateRoomTypeAction,
  deleteRoomTypeAction,
} from "@/app/actions/room-actions";
import toast from "react-hot-toast";

type RoomType = {
  id: string;
  name: string;
  price: number;
  capacity: number;
};

type ManageRoomTypesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomTypes: RoomType[];
};

export default function ManageRoomTypesModal({
  isOpen,
  onClose,
  roomTypes,
}: ManageRoomTypesModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to delete the "${name}" category?`)
    ) {
      try {
        await deleteRoomTypeAction(id);
        toast.success(`Category "${name}" deleted safely!`); // Success toast
      } catch (error: any) {
        toast.error(error.message); // Error toast (if rooms are attached)
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 text-slate-700 p-2 rounded-xl shadow-sm">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Manage Categories
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Edit pricing and capacity for room types
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* LIST AREA */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {roomTypes.length === 0 ? (
            <p className="text-center text-slate-500 py-4">
              No categories created yet.
            </p>
          ) : (
            roomTypes.map((type) => (
              <div
                key={type.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm transition hover:border-slate-300"
              >
                {editingId === type.id ? (
                  /* --- EDITING STATE FORM --- */
                  <form
                    action={async (formData) => {
                      const result = await updateRoomTypeAction(formData);

                      if (result?.success === false || result?.error) {
                        toast.error(
                          result.error || "Failed to update category",
                        );
                      } else {
                        setEditingId(null);
                        toast.success("Category updated successfully!");
                      }
                    }}
                    className="flex items-end gap-3"
                  >
                    <input type="hidden" name="id" value={type.id} />

                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={type.name}
                        required
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        defaultValue={type.price}
                        required
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Beds
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        defaultValue={type.capacity}
                        required
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-200 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </form>
                ) : (
                  /* --- READ-ONLY STATE --- */
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {type.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        ₹{type.price.toLocaleString("en-IN")}/mo •{" "}
                        {type.capacity} Beds
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(type.id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id, type.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
