import { getAuthUser } from "@/lib/supabase/get-user";
import { getOwnerPGs } from "@/app/queries/pg-queries";
import { redirect } from "next/navigation";

export default async function TenantsEntryPage() {
  const user = await getAuthUser();
  const pgs = await getOwnerPGs(user.id);

  if (pgs.length === 0) redirect("/setup");
  redirect(`/pg/${pgs[0].id}/tenants`);
}
