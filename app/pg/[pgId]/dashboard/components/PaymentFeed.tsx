"use client";

import { Activity } from "lucide-react";

export default function PaymentFeed({
  payments,
}: {
  payments: {
    id: string;
    amount: number;
    date: Date;
    tenantName: string;
    roomNumber: string;
  }[];
}) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 text-accent rounded">
          <Activity size={18} />
        </div>
        <h3 className="font-bold text-primary">Recent Payments</h3>
      </div>
      
      {payments.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">No recent payments found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex justify-between items-center group border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                  {payment.tenantName}
                </span>
                <span className="text-xs text-slate-500" suppressHydrationWarning>
                  Room {payment.roomNumber} • {new Date(payment.date).toLocaleDateString()}
                </span>
              </div>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                +₹{payment.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
