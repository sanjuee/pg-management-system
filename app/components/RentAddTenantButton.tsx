"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
// Import your existing shared modal
import AddTenantModal from "./AddTenantModal"; 

type RentAddTenantButtonProps = {
  pgId: string;
  availableRooms: { id: string; roomNumber: string; price: number }[];
};

export default function RentAddTenantButton({ pgId, availableRooms }: RentAddTenantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* THE TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
      >
        <Plus size={18} /> Add Tenant
      </button>

      {/* YOUR EXISTING SHARED MODAL */}
      <AddTenantModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pgId={pgId}
        availableRooms={availableRooms}
      />
    </>
  );
}