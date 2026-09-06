"use client";

import { useState } from "react";
import { Plus, Bed } from "lucide-react";
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
        return "bg-blue-100 text-blue-700";
      case "Occupied":
        return "bg-emerald-100 text-emerald-700";
      case "Maintenance":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER OVERVIEW WITH ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Room Inventory
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage all property units and monitor occupancy status.
          </p>
        </div>

        {/* BUTTON GROUP */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddRoomOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-slate-800 text-white py-2 px-4 rounded font-semibold transition-colors shadow-sm text-sm"
          >
            <Plus size={16} />
            Add Room Units
          </button>
          <button
            onClick={() => setIsManageTypesOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 py-2 px-4 rounded font-semibold transition-colors shadow-sm text-sm"
          >
            <Layers size={16} className="text-slate-400" />
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
            className="bg-white border border-gray-200/80 rounded-md shadow-sm flex flex-col hover:shadow-md hover:border-blue-300 transition relative overflow-hidden group cursor-pointer"
          >
            {/* Header */}
            <div className="bg-slate-50/70 p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-primary tracking-tight leading-none">
                  {room.roomNumber}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                  {room.typeName}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${getStatusStyles(
                  room.status
                )}`}
              >
                {room.status}
              </span>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <span className="text-sm font-medium text-slate-500">
                  Monthly Rent
                </span>
                <span className="text-xl font-bold text-primary tracking-tight">
                  {room.status === "Maintenance"
                    ? "--"
                    : `₹${room.price.toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="space-y-0">
                {Array.from({ length: room.capacity }).map((_, i) => {
                  const tenant = room.tenants[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-t border-slate-100"
                    >
                      <div className="flex items-center gap-2 text-slate-600">
                        <Bed size={16} className="text-slate-400" />
                        <span className="text-sm font-medium">Bed {i + 1}</span>
                      </div>
                      <span
                        className={`text-sm truncate max-w-[120px] text-right ${
                          tenant
                            ? "font-semibold text-slate-700"
                            : "font-medium text-slate-400"
                        }`}
                      >
                        {tenant ? tenant.name : "Empty"}
                      </span>
                    </div>
                  );
                })}
              </div>
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
        pgId={pgId}
      />
    </div>
  );
}
