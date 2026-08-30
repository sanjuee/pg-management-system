"use server"

import { prisma } from "@/lib/prisma/prisma"
import { revalidatePath } from "next/cache"

export async function addExpenseAction(formData: FormData) {
  const pgId = formData.get("pgId") as string
  const category = formData.get("category") as string
  const amount = parseFloat(formData.get("amount") as string)
  const note = formData.get("note") as string
  
  if (!pgId || !category || isNaN(amount) || amount <= 0) {
    return { success: false, error: "Invalid input" }
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

  try {
    await prisma.expense.create({
      data: {
        pgId,
        category,
        amount,
        note: note || null,
        month: currentMonth
      }
    })
    
    revalidatePath(`/pg/${pgId}/dashboard`)
    revalidatePath(`/pg/${pgId}/expenses`)
    return { success: true }
  } catch (error) {
    console.error("Expense error:", error)
    return { success: false, error: "Failed to add expense." }
  }
}

export async function deleteExpenseAction(expenseId: string, pgId: string) {
  try {
    await prisma.expense.delete({
      where: { id: expenseId }
    })
    revalidatePath(`/pg/${pgId}/dashboard`)
    revalidatePath(`/pg/${pgId}/expenses`)
    return { success: true }
  } catch (error) {
    console.error("Expense delete error:", error)
    return { success: false, error: "Failed to delete expense." }
  }
}
