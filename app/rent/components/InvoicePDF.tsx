import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { InvoiceData } from "./invoice-types";

// Register fonts (using standard available fonts to avoid external fetching issues in some environments)
Font.register({
  family: "Open Sans",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf" },
    { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf", fontWeight: 600 },
    { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf", fontWeight: 700 },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Open Sans",
    backgroundColor: "#ffffff",
    color: "#334155",
  },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: 600,
  },
  pgName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 4,
  },
  pgDetails: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.4,
  },

  // Info Grid
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoSection: {
    width: "48%",
  },
  infoLabel: {
    fontSize: 9,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: 600,
  },
  infoValueTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.5,
  },

  // Billing Cycle Box
  cycleBox: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cycleCol: {
    flex: 1,
  },
  cycleLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cycleValue: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1e293b",
  },

  // Table
  table: {
    width: "100%",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 8,
    marginBottom: 8,
  },
  colDesc: { flex: 3 },
  colAmount: { flex: 1, textAlign: "right" },
  th: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  tr: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tdDesc: {
    fontSize: 10,
    color: "#334155",
  },
  tdSub: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 2,
  },
  tdAmount: {
    fontSize: 10,
    color: "#0f172a",
    fontWeight: 600,
  },

  // Summary
  summary: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  summaryLabel: {
    fontSize: 10,
    color: "#475569",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1e293b",
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
  },
  summaryTotalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
  },
  summaryTotalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
  },

  // Payment Status Box
  paymentStatus: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderRadius: 8,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: "#10b981",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paymentDetailRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  paymentDetailLabel: {
    width: 100,
    fontSize: 9,
    color: "#065f46",
    fontWeight: 600,
  },
  paymentDetailValue: {
    fontSize: 9,
    color: "#064e3b",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#a7f3d0",
  },
  balanceLabel: {
    fontSize: 10,
    color: "#065f46",
    fontWeight: 600,
  },
  balanceValue: {
    fontSize: 10,
    fontWeight: 700,
    color: "#064e3b",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 1.5,
  },
  footerBold: {
    fontWeight: 600,
    color: "#64748b",
  }
});

// Helpers
function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatInvoiceNumber(year: number, seq: number): string {
  return `INV-${year}-${String(seq).padStart(3, "0")}`;
}
function getBillingPeriod(billingMonth: string): { start: string; end: string } {
  const date = new Date(billingMonth + " 1");
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleString("default", { month: "long" });
  return {
    start: `${monthName} 1, ${year}`,
    end: `${monthName} ${lastDay}, ${year}`,
  };
}

export default function InvoicePDF({ data }: { data: InvoiceData }) {
  const period = getBillingPeriod(data.billingMonth);
  const remainingBalance = data.totalAmount - data.amountPaid;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Rent Invoice</Text>
            <Text style={styles.invoiceNumber}>
              {formatInvoiceNumber(data.invoiceYear, data.invoiceNumber)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.pgName}>{data.pgName}</Text>
            {data.pgAddress && <Text style={styles.pgDetails}>{data.pgAddress}</Text>}
            {data.pgPhone && <Text style={styles.pgDetails}>Phone: {data.pgPhone}</Text>}
            <Text style={styles.pgDetails}>UPI: {data.pgUpiId || "N/A"}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Billed To</Text>
            <Text style={styles.infoValueTitle}>{data.tenantName}</Text>
            <Text style={styles.infoValue}>Room: {data.tenantRoom}</Text>
            <Text style={styles.infoValue}>Phone: +91 {data.tenantPhone}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Dates</Text>
            <Text style={styles.infoValue}>
              <Text style={{ fontWeight: 600 }}>Issued On:</Text>{" "}
              {new Date(data.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
            <Text style={styles.infoValue}>
              <Text style={{ fontWeight: 600 }}>Due Date:</Text> {data.dueDate}
            </Text>
          </View>
        </View>

        {/* Billing Cycle Box */}
        <View style={styles.cycleBox}>
          <View style={styles.cycleCol}>
            <Text style={styles.cycleLabel}>Billing Cycle</Text>
            <Text style={styles.cycleValue}>{data.billingMonth}</Text>
          </View>
          <View style={styles.cycleCol}>
            <Text style={styles.cycleLabel}>Period</Text>
            <Text style={styles.cycleValue}>{period.start} - {period.end}</Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}><Text style={styles.th}>Description</Text></View>
            <View style={styles.colAmount}><Text style={styles.th}>Amount</Text></View>
          </View>
          
          <View style={styles.tr}>
            <View style={styles.colDesc}>
              <Text style={styles.tdDesc}>Base Rent</Text>
              <Text style={styles.tdSub}>Monthly rent for {data.billingMonth}</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.tdAmount}>{formatCurrency(data.baseRent)}</Text>
            </View>
          </View>

          {data.accumulatedFine > 0 && (
            <View style={styles.tr}>
              <View style={styles.colDesc}>
                <Text style={styles.tdDesc}>Late Fines</Text>
                <Text style={styles.tdSub}>Carried over from previous cycles</Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={styles.tdAmount}>{formatCurrency(data.accumulatedFine)}</Text>
              </View>
            </View>
          )}
          
          {/* Add-ons placeholder for future */}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(data.totalAmount)}</Text>
            </View>
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total Amount</Text>
              <Text style={styles.summaryTotalValue}>{formatCurrency(data.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Record Section */}
        {data.amountPaid > 0 && (
          <View style={styles.paymentStatus}>
            <View style={styles.statusHeader}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>Payment Recorded</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{remainingBalance <= 0 ? "Fully Paid" : "Partially Paid"}</Text>
              </View>
            </View>

            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Amount Received:</Text>
              <Text style={styles.paymentDetailValue}>{formatCurrency(data.amountPaid)}</Text>
            </View>
            <View style={styles.paymentDetailRow}>
              <Text style={styles.paymentDetailLabel}>Payment Method:</Text>
              <Text style={styles.paymentDetailValue}>{data.paymentMethod || "Manual"}</Text>
            </View>
            {data.paymentDate && (
              <View style={styles.paymentDetailRow}>
                <Text style={styles.paymentDetailLabel}>Date Received:</Text>
                <Text style={styles.paymentDetailValue}>
                  {new Date(data.paymentDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            )}
            {data.paymentRef && (
              <View style={styles.paymentDetailRow}>
                <Text style={styles.paymentDetailLabel}>Reference ID:</Text>
                <Text style={styles.paymentDetailValue}>{data.paymentRef}</Text>
              </View>
            )}

            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Remaining Balance</Text>
              <Text style={styles.balanceValue}>{formatCurrency(remainingBalance)}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a computer-generated invoice and does not require a physical signature.
          </Text>
          <Text style={styles.footerText}>
            For any queries, please contact <Text style={styles.footerBold}>{data.pgName}</Text>.
          </Text>
        </View>

      </Page>
    </Document>
  );
}
