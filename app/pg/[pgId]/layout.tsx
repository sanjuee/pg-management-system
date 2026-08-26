import { getAuthUser } from "@/lib/supabase/get-user";
import { getPGById } from "@/app/queries/pg-queries";
import { notFound } from "next/navigation";

/**
 * Layout that validates the [pgId] in the URL belongs to the logged-in owner.
 * If not found or unauthorized, shows 404.
 */
export default async function PGLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pgId: string }>;
}) {
  const { pgId } = await params;
  const user = await getAuthUser();
  const pg = await getPGById(pgId, user.id);

  if (!pg) {
    notFound();
  }

  return <>{children}</>;
}
