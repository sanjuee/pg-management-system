import AddTenantButton from "@/app/components/AddTenantButton";
import { Send } from "lucide-react";

export default function QuickActionsCard({
  pgId,
  availableRooms,
}: {
  pgId: string;
  availableRooms: { id: string; roomNumber: string; price: number }[];
}) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm flex flex-col">
      <h3 className="font-bold text-primary mb-4 text-lg">Quick Actions</h3>
      <div className="space-y-3 flex-1 flex flex-col">
        <AddTenantButton
          pgId={pgId}
          availableRooms={availableRooms}
          className="w-full"
        />
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 py-2 rounded-md text-sm font-medium transition shadow-sm">
          <Send size={16} className="text-slate-500" /> Send Reminder
        </button>
      </div>
    </div>
  );
}
