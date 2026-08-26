import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { getRoomBasicDetails } from "@/app/queries/room-queries";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "PG Management",
  description: "",
};

const pgName = "Pg SaaS"

export default async function RootLayout({ children, }: Readonly<{children: React.ReactNode; }>) {
  const headersList = await headers();
  const pathname = headersList.get("x-next-url") ?? headersList.get("x-invoke-path") ?? "";
  const isLoginPage = pathname.startsWith("/login");

  return (
    <html lang="en">
      <body>
        {isLoginPage ? (
          <>
            <Toaster position="bottom-right" toastOptions={{ duration: 6000, style: { background: "#333", color: "#fff", borderRadius: "10px", fontSize: "14px", fontWeight: "500" } }} />
            {children}
          </>
        ) : (
          await (async () => {
            const pgId = "4f3c2b81-9d11-4a5e-b287-73c09r3e4b1a";
            const availableRooms = await getRoomBasicDetails(pgId);
            return (
              <ClientLayout userEmail={pgName} pgId={pgId} availableRooms={availableRooms}>
                {children}
              </ClientLayout>
            );
          })()
        )}
      </body>
    </html>
  );
}
