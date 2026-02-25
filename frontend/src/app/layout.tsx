import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shiplog",
  description: "Simple shipment tracking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
