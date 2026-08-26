import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Server-side helper: returns the currently authenticated Supabase user.
 * Redirects to /login if no session exists.
 */
export async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}
