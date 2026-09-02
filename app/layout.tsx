import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { getRoomBasicDetails } from "@/app/queries/room-queries";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import { getOwnerPGs } from "./queries/pg-queries";
import { createClient } from "@/lib/supabase/server";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "PG Management",
  description: "A complete solution for paying guest management",
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
      <html lang="en" className={hankenGrotesk.variable}>
        <body className="font-sans">
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 6000,
              style: {
                background: "#000",
                color: "#fff",
                borderRadius: "6px",
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
    <html lang="en" className={hankenGrotesk.variable} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ClientLayout pgId={pgId} pgs={pgs} availableRooms={availableRooms}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
