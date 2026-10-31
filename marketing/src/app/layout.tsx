import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Preview & Optimize App Store Listings`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — Preview & Optimize App Store Listings`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1280,
        height: 720,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Preview & Optimize App Store Listings`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-theme="dark">
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
