// Shared type definition for invoice data - no @react-pdf imports here
export type InvoiceData = {
  invoiceNumber: number;
  invoiceYear: number;
  billingMonth: string;
  createdAt: string;
  dueDate: string;
  baseRent: number;
  accumulatedFine: number;
  totalAmount: number;
  amountPaid: number;
  // Tenant
  tenantName: string;
  tenantPhone: string;
  tenantRoom: string;
  // PG
  pgName: string;
  pgUpiId: string;
  pgAddress?: string | null;
  pgPhone?: string | null;
  // Payment
  paymentMethod: string | null;
  paymentDate: string | null;
  paymentRef: string | null;
};
