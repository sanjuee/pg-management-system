// app/dashboard/rooms/components/RoomDetailsModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  Edit,
  Trash2,
  UserPlus,
  Users,
  UserMinus,
  Save,
  UserCheck,
} from "lucide-react";
import {
  deleteRoomUnitAction,
  updateRoomUnitAction,
} from "@/app/actions/room-actions";
import { assignExistingTenantAction, unassignTenantAction } from "@/app/actions/tenant-action";
import toast from "react-hot-toast";
import ConfirmModal from "@/app/components/ConfirmModal";

type RoomItem = {
  id: string;
  roomNumber: string;
  typeName: string;
  price: number;
  status: string;
  occupantCount: number;
  capacity: number;
  tenants: { id: string; name: string }[];
  roomTypeId?: string; // Added to easily select current type
};

type RoomDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  room: RoomItem | null;
  roomTypes: { id: string; name: string }[]; // Need this for the edit dropdown
  unassignedTenants: { id: string; name: string }[];
  onAddTenant: () => void;
};

export default function RoomDetailsModal({
  isOpen,
  onClose,
  room,
  roomTypes,
  unassignedTenants,
  onAddTenant,
}: RoomDetailsModalProps) {

  const [isEditing, setIsEditing] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState("")
  const [skipCurrentMonth, setSkipCurrentMonth] = useState(false)
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

  if (!isOpen || !room) return null;

  // 1. Handle Room Deletion
  const handleDeleteRoom = async () => {
    if (room.occupantCount > 0) {
      toast.error("Remove active tenants before deleting this room.");
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: "Delete Room",
      message: `Are you sure you want to delete Room ${room.roomNumber}?`,
      onConfirm: async () => {
        try {
          await deleteRoomUnitAction(room.id);
          toast.success("Room deleted successfully");
          onClose();
        } catch (error: any) {
          toast.error(error.message || "Failed to delete room");
        }
      },
    });
  };

  // 2. Handle Tenant Removal (Unassign)
  const handleRemoveTenant = async (tenantId: string, tenantName: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Remove Tenant",
      message: `Remove ${tenantName} from Room ${room.roomNumber}?`,
      onConfirm: async () => {
        try {
          await unassignTenantAction(tenantId);
          toast.success(`${tenantName} removed from room`);
        } catch (error: any) {
          toast.error("Failed to remove tenant");
        }
      }
    });
  };

  const handleAssignExisting = async () => {
    if (!selectedTenantId) {
      toast.error("Please select a tenant first.")
      return
    }
    try {
      await assignExistingTenantAction(selectedTenantId, room.id, skipCurrentMonth)
      toast.success("Tenant assigned successfully!")
      setIsAssigning(false)
      setSelectedTenantId("")
      setSkipCurrentMonth(false)
      // Next.js auto-refreshes the room data
    } catch (error) {
      toast.error("Failed to assign tenant")
    }
  }

  return (
    <>
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* HEADER / EDIT FORM */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          {isEditing ? (
            <form
              className="flex-1 mr-4 space-y-3"
              action={async (formData) => {
                // Await the structured validation object returned from the server
                const result = await updateRoomUnitAction(room.id, formData);

                if (result?.success === false || result?.error) {
                  toast.error(result.error|| "An Error Occured!"); // Triggers sleek error notification message
                } else {
                  setIsEditing(false);
                  toast.success("Room updated successfully!");
                }
              }}
            >
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  defaultValue={room.roomNumber}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  name="roomTypeId"
                  defaultValue={
                    roomTypes.find((t) => t.name === room.typeName)?.id
                  }
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {roomTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-200 text-slate-700 text-sm font-semibold py-2 rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {room.roomNumber}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    room.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : room.status === "Occupied"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.status}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                {room.typeName} • ₹{room.price.toLocaleString("en-IN")}/mo
              </p>
            </div>
          )}

          {!isEditing && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* TENANTS LIST */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} />
              Current Occupants
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {room.occupantCount} / {room.capacity} filled
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {room.tenants.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 font-medium">
                This room is currently empty.
              </div>
            ) : (
              room.tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {tenant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">
                      {tenant.name}
                    </span>
                  </div>

                  {/* Remove Tenant Button */}
                  <button
                    onClick={() => handleRemoveTenant(tenant.id, tenant.name)}
                    className="text-xs text-red-500 text-red-700 hover:bg-red-50 p-1.5 rounded-md transition   flex items-center gap-1"
                    title="Remove from room"
                  >
                    <UserMinus size={14} /> Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            
            {/* INLINE ASSIGNMENT UI */}
            {isAssigning ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Unassigned Tenant</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                >
                  <option value="">-- Choose a tenant --</option>
                  {unassignedTenants.length === 0 && <option disabled>No unassigned tenants available</option>}
                  {unassignedTenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <div className="bg-amber-50/60 border border-amber-200/60 rounded-md p-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipCurrentMonth}
                      onChange={(e) => setSkipCurrentMonth(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-700">Apply rent from next month</span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button onClick={handleAssignExisting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition">Assign</button>
                  <button onClick={() => setIsAssigning(false)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 rounded-lg text-sm transition">Cancel</button>
                </div>
              </div>
            ) : (
              /* DEFAULT ACTION BUTTONS */
              <div className="grid grid-cols-2 gap-3">
                {/* Primary split button for adding tenants */}
                <div className="col-span-2 flex gap-2">
                  <button 
                    onClick={() => { onAddTenant(); }}
                    disabled={room.occupantCount >= room.capacity}
                    className="flex-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <UserPlus size={16} />Add New Tenant
                  </button>
                  <button 
                    onClick={() => setIsAssigning(true)}
                    disabled={room.occupantCount >= room.capacity || unassignedTenants.length === 0}
                    className="flex-1 flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-3 rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    title={unassignedTenants.length === 0 ? "No unassigned tenants available" : "Assign existing"}
                  >
                    <UserCheck size={16} /> Assign Tenant
                  </button>
                </div>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl transition text-sm disabled:opacity-50"
                >
                  <Edit size={16} /> Edit Details
                </button>
                
                <button 
                  onClick={handleDeleteRoom}
                  className="flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl transition text-sm"
                >
                  <Trash2 size={16} /> Delete Room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal 
      isOpen={confirmConfig.isOpen}
      onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      title={confirmConfig.title}
      message={confirmConfig.message}
      onConfirm={confirmConfig.onConfirm}
    />
    </>
  )
}