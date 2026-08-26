"use server"

import { prisma } from "@/lib/prisma/prisma"
import { revalidatePath } from "next/cache"

export async function recordPaymentAction(formData: FormData) {
  const invoiceId = formData.get("invoiceId") as string
  const paymentAmount = parseFloat(formData.get("paymentAmount") as string)
  const paymentMethod = formData.get("paymentMethod") as string
  const referenceId = formData.get("referenceId") as string

  if (!invoiceId || isNaN(paymentAmount) || paymentAmount <= 0) {
    return { success: false, error: "Invalid payment amount." }
  }

  try {
    // 1. Fetch the current invoice to check the math
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    })

    if (!invoice) throw new Error("Invoice not found")

    // 2. Calculate new totals
    const newAmountPaid = invoice.amountPaid + paymentAmount
    const remainingBalance = invoice.totalAmount - newAmountPaid
    
    // Determine the new status
    let newStatus = invoice.status
    if (remainingBalance <= 0) {
      newStatus = "PAID"
    } else if (newAmountPaid > 0) {
      newStatus = "PARTIAL"
    }

    // 3. Database Transaction (All or Nothing)
    // We use a Prisma transaction to ensure if one fails, both fail.
    await prisma.$transaction([
      // Create the receipt
      prisma.transaction.create({
        data: {
          amount: paymentAmount,
          paymentMethod,
          referenceId: referenceId || null,
          invoiceId
        }
      }),
      // Update the invoice totals
      prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          status: newStatus
        }
      })
    ])

    revalidatePath("/rent")
    return { success: true }

  } catch (error) {
    console.error("Payment Error:", error)
    return { success: false, error: "Failed to record payment." }
  }
}