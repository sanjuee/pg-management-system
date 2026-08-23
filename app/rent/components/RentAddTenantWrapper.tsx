"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddTenantModal from "./AddTenantButton"; // Imports your exact modal

type RentAddTenantWrapperProps = {
  pgId: string;
  availableRooms: { id: string; roomNumber: string; price: number }[];
};

export default function RentAddTenantWrapper({ pgId, availableRooms }: RentAddTenantWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* THE TRIGGER BUTTON */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
      >
        <Plus size={18} /> Add Tenant
      </button>

      {/* YOUR EXISTING MODAL */}
      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pgId={pgId}
        availableRooms={availableRooms}
      />
    </>
  );
}