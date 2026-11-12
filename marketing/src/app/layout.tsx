import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.name} — App Store & Google Play Mockup Studio for Agencies`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  keywords: [
    "app store mockup",
    "google play listing preview",
    "app store staging tool",
    "mobile app client review",
    "aso preview studio",
    "app screenshot mockups",
    "client sign-off tool",
    "ios app store preview",
    "google play console preview",
    "offline mockup studio",
    "agency app preview",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — App Store & Google Play Mockup Studio for Agencies`,
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
    title: `${siteConfig.name} — App Store & Google Play Mockup Studio for Agencies`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${siteConfig.url}/#webapp`,
      name: siteConfig.name,
      url: siteConfig.url,
      applicationCategory: "DesignApplication, DeveloperApplication",
      operatingSystem: "All modern browsers (Chrome, Safari, Firefox, Edge)",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      description: siteConfig.description,
      offers: {
        "@type": "Offer",
        price: "29.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: siteConfig.gumroadUrl,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "14",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: "Kai DevLabs",
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.svg`,
      sameAs: ["https://kaidevlabs.gumroad.com/", siteConfig.creator.url],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      mainEntity: siteConfig.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth dark" data-theme="dark">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
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
