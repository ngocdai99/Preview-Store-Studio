import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Store Preview Studio — Preview & Optimize App Store Listings",
  description: "The zero-server, 100% offline studio to design, preview, and validate Apple App Store & Google Play listings with realistic device mockups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-theme="dark">
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
