import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";


export const metadata: Metadata = {
  title: "PG Management",
  description: "",
};

const pgName = "Pg SaaS"



export default function RootLayout({ children, }: Readonly<{children: React.ReactNode; }>) {
  return (
    <html
      lang="en"
    >
      <body>
          <ClientLayout userEmail= {pgName} > {children} </ClientLayout> 
      </body>
    </html>
  );
}
