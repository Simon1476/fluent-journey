import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import { getMetadata } from "@/lib/metadata";

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <SessionProvider>
          <Navbar />
          <div className="mt-16">{children}</div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
