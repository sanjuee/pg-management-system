"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { InvoiceData } from "./invoice-types";

function ButtonShell() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 cursor-wait">
      <Loader2 size={14} className="animate-spin" />
      Invoice
    </span>
  );
}

const DynamicInvoiceDownloadLink = dynamic(
  () => import("./InvoiceDownloadLink"),
  { ssr: false, loading: () => <ButtonShell /> },
);

export default function InvoiceDownloadButton({ data }: { data: InvoiceData }) {
  return <DynamicInvoiceDownloadLink data={data} />;
}
