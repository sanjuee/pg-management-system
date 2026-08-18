"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddRoomModal from "./AddRoomModal";
import AddTenantModal from "@/app/components/AddTenantModal";
import RoomDetailsModal from "./RoomDetailsModal";
import { Layers } from "lucide-react";
import ManageRoomTypesModal from "./ManageRoomTypes";

type RoomItem = {
  id: string;
  roomNumber: string;
  typeName: string;
  price: number;
  status: "Available" | "Occupied" | "Maintenance";
  occupantCount: number;
  capacity: number;
  tenants: { id: string; name: string }[];
};

type RoomInventoryGridProps = {
  initialRooms: RoomItem[];
  roomTypes: any[];
  unassignedTenants: { id: string; name: string; phone: string }[]; 
  pgId: string;
};

// 2. ADD IT TO THE DESTRUCTURED ARGUMENTS OF THE EXPORT FUNCTION
export default function RoomInventoryGrid({
  initialRooms,
  roomTypes,
  unassignedTenants, 
  pgId,
}: RoomInventoryGridProps) {
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");

  // Modal States
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);

  // Track which room is currently clicked
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);

  const [isManageTypesOpen, setIsManageTypesOpen] = useState(false);

  const filteredRooms = initialRooms.filter((room) => {
    if (statusFilter === "All Statuses") return true;
    return room.status === statusFilter;
  });

  // We map the initial rooms to feed into the AddTenantModal dropdown safely
  const availableRoomsList = initialRooms
    .filter((r) => r.occupantCount < r.capacity)
    .map((r) => ({ id: r.id, roomNumber: r.roomNumber, price: r.price }));

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-50 text-green-700 border-green-200";
      case "Occupied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Maintenance":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER OVERVIEW WITH ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Room Inventory
          </h1>
          <p className="text-slate-500 mt-1">
            Manage all property units and monitor occupancy status.
          </p>
        </div>

        {/* BUTTON GROUP */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddRoomOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-full font-semibold transition-colors shadow-sm text-sm"
          >
            <Plus size={18} />
            Add New Room
          </button>
          <button
            onClick={() => setIsManageTypesOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-full font-semibold transition-colors shadow-sm text-sm"
          >
            <Layers size={18} className="text-slate-400" />
            Manage Categories
          </button>

        </div>
      </div>

      {/* FILTER BAR ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-500">Filters:</span>
          <select
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <span className="text-sm font-medium text-slate-500">
          Showing 1–{filteredRooms.length} of {initialRooms.length} Rooms
        </span>
      </div>

      {/* CARDS INVENTORY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-300 transition relative overflow-hidden group cursor-pointer"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {room.roomNumber}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    {room.typeName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(room.status)}`}
                >
                  {room.status}
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Monthly Rent
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {room.status === "Maintenance"
                      ? "--"
                      : `₹${room.price.toLocaleString("en-IN")}`}
                  </p>
                </div>
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                  →
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${room.status === "Occupied" ? "bg-blue-400" : "bg-green-400"}`}
              ></span>
              {room.status === "Maintenance"
                ? "Under Review"
                : `${room.occupantCount} / ${room.capacity} beds filled`}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODALS ---------------- */}

      {/* 1. Add Room/Category Modal */}
      <AddRoomModal
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        pgId={pgId}
        roomTypes={roomTypes}
      />

      {/* 2. Room Details Modal */}
      <RoomDetailsModal
        isOpen={!!selectedRoom && !isAddTenantOpen}
        onClose={() => setSelectedRoom(null)}
        room={selectedRoom}
        roomTypes={roomTypes}
        unassignedTenants={unassignedTenants} // <--- Pass it into the modal
        onAddTenant={() => setIsAddTenantOpen(true)}
      />

      {/* 3. The Unified Add Tenant Modal (Pre-filled with selected room) */}
      <AddTenantModal
        isOpen={isAddTenantOpen}
        onClose={() => {
          setIsAddTenantOpen(false);
          setSelectedRoom(null); // Clear selection when modal closes
        }}
        pgId={pgId}
        availableRooms={availableRoomsList} // Pass the list of rooms with space
        initialRoomId={selectedRoom?.id}
      />
      <ManageRoomTypesModal
        isOpen={isManageTypesOpen}
        onClose={() => setIsManageTypesOpen(false)}
        roomTypes={roomTypes}
      />
    </div>
  );
}
