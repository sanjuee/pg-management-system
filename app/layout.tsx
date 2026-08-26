import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { getRoomBasicDetails } from "@/app/queries/room-queries";


export const metadata: Metadata = {
  title: "PG Management",
  description: "",
};

const pgName = "Pg SaaS"



export default async function RootLayout({ children, }: Readonly<{children: React.ReactNode; }>) {
  const pgId = "4f3c2b81-9d11-4a5e-b287-73c09r3e4b1a";
  const availableRooms = await getRoomBasicDetails(pgId);

  return (
    <html
      lang="en"
    >
      <body>
          <ClientLayout userEmail={pgName} pgId={pgId} availableRooms={availableRooms}> {children} </ClientLayout> 
      </body>
    </html>
  );
}
