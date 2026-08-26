import { getAuthUser } from "@/lib/supabase/get-user";
import { getOwnerPGs } from "@/app/queries/pg-queries";
import { redirect } from "next/navigation";

/**
 * Entry point page: redirects to /setup if no PGs, 
 * or to the first PG's rent page if they have PGs.
 */
export default async function RentEntryPage() {
  const user = await getAuthUser();
  const pgs = await getOwnerPGs(user.id);

  if (pgs.length === 0) {
    redirect("/setup");
  }

  redirect(`/pg/${pgs[0].id}/rent`);
}
