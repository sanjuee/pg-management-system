import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { getRoomBasicDetails } from "@/app/queries/room-queries";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import { getOwnerPGs } from "./queries/pg-queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "PG Management",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const pathname = headersList.get("x-next-url") ?? "";

  // Pages that render WITHOUT the sidebar
  const isBarePage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/setup") ||
    pathname === "/";

  if (isBarePage) {
    return (
      <html lang="en">
        <body>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 6000,
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
          {children}
        </body>
      </html>
    );
  }

  // For all authenticated pages: get user and their PGs
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pgs = user ? await getOwnerPGs(user.id) : [];

  // Extract pgId from the URL: /pg/[pgId]/...
  const pgIdMatch = pathname.match(/^\/pg\/([^/]+)/);
  const pgId = pgIdMatch ? pgIdMatch[1] : (pgs[0]?.id ?? "");

  const availableRooms = pgId ? await getRoomBasicDetails(pgId) : [];

  return (
    <html lang="en">
      <body>
        <ClientLayout pgId={pgId} pgs={pgs} availableRooms={availableRooms}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
