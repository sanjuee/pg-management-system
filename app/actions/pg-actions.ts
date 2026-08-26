'use server'

import { prisma } from "@/lib/prisma/prisma"
import { getAuthUser } from "@/lib/supabase/get-user"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPGAction(formData: FormData) {
  const user = await getAuthUser()

  const name = formData.get('name') as string
  const upiId = formData.get('upiId') as string
  
  const billingCycleDate = parseInt(formData.get('billingCycleDate') as string) || 1
  const rentDueDate = parseInt(formData.get('rentDueDate') as string) || 0
  const dailyLateFee = parseFloat(formData.get('dailyLateFee') as string) || 0

  if (!name?.trim() || !upiId?.trim()) {
    return { error: 'PG Name and UPI ID are required.' }
  }

  let newPgId = ""

  try {
    const pg = await prisma.pG.create({
      data: {
        name: name.trim(),
        upiId: upiId.trim(),
        ownerId: user.id,
        billingCycleDate,
        rentDueDate,
        dailyLateFee,
      }
    })
    
    newPgId = pg.id
  } catch (error) {
    return { error: 'Failed to create PG. Please try again.' }
  }

  revalidatePath('/', 'layout')
  redirect(`/pg/${newPgId}/rent`)
}
