import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bui Ngoc Dai — Mobile Developer (Flutter & React Native) | CV",
  description:
    "Curriculum Vitae of Bui Ngoc Dai (Kai) — Mobile Developer with production experience shipping Flutter & React Native apps.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "88x88" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#181918] text-[#1A1A1A] antialiased selection:bg-[#0F6B57]/20 selection:text-[#0F6B57]">
        {children}
      </body>
    </html>
  );
}
