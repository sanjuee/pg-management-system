"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddTenantModal from "./AddTenantModal";

type AddTenantButtonProps = {
  pgId: string;
  availableRooms: { id: string; roomNumber: string; price: number }[];
  className?: string;
};

export default function AddTenantButton({
  pgId,
  availableRooms,
  className = "",
}: AddTenantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* THE TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className={`px-4 py-2 bg-primary hover:bg-slate-800 text-white rounded-md text-sm font-medium shadow-sm transition flex items-center justify-center gap-2 ${className}`}
      >
        <Plus size={16} /> Add Tenant
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
