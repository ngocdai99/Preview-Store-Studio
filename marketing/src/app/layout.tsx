import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { AgencyProvider } from "@/context/AgencyContext";
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
        width: 2560,
        height: 1440,
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
    <html lang="en" className="h-full scroll-smooth dark" data-theme="dark">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased">
        <AgencyProvider>
          {children}
        </AgencyProvider>
        <CookieBanner />
        <script
          id="microsoft-clarity"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "z3c2oaazvl");

              try {
                if (window.location.search) {
                  var p = new URLSearchParams(window.location.search);
                  var appid = p.get('appid') || p.get('id') || p.get('app_id') || p.get('apple_id');
                  var vip = p.get('vip') || p.get('offer');
                  if (appid || vip === '39' || vip === 'agency39') {
                    try { localStorage.setItem('sps_agency_vip', appid || '39'); } catch(_) {}
                  }
                  if (appid && typeof window.clarity === 'function') {
                    window.clarity('set', 'appid', appid);
                    window.clarity('identify', appid);
                  }
                  if (!window.location.pathname.startsWith('/try')) {
                    if (p.get('id') || p.get('appid') || p.get('app') || p.get('url') || p.get('itunes') || p.get('link') || p.get('bundle')) {
                      window.location.replace('/try' + window.location.search);
                    }
                  }
                }
              } catch(_) {}
            `,
          }}
        />
      </body>
    </html>
  );
}
