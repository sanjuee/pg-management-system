"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, Loader2 } from "lucide-react";
import InvoicePDF from "./InvoicePDF";
import type { InvoiceData } from "./invoice-types";

export default function InvoiceDownloadLink({ data }: { data: InvoiceData }) {
  const fileName = `Invoice-${data.tenantName.replace(/\s+/g, "_")}-${data.billingMonth.replace(/\s+/g, "_")}.pdf`;

  return (
    <PDFDownloadLink
      document={<InvoicePDF data={data} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition
            ${loading
              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-wait"
              : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FileDown size={14} />
          )}
          Invoice
        </span>
      )}
    </PDFDownloadLink>
  );
}
