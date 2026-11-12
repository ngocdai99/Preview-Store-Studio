import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://kaidevlabs.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: "Kai DevLabs · Bui Ngoc Dai — Mobile Engineer & Developer Tools",
  description:
    "Bui Ngoc Dai (Kai) is a mobile engineer specializing in high-performance Flutter and React Native apps, App Store & Google Play compliance, and developer tools.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    title: "Kai DevLabs · Bui Ngoc Dai — Mobile Engineer",
    description:
      "Specializing in high-performance Flutter & React Native apps, deep performance profiling, and developer tools.",
    images: ["/kai.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bui Ngoc Dai",
  alternateName: "Kai",
  url: SITE_URL,
  image: `${SITE_URL}/kai.webp`,
  email: "kai.devlabs@gmail.com",
  jobTitle: "Mobile Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Sunshine Software",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ho Chi Minh City",
    addressCountry: "VN",
  },
  sameAs: [
    "https://storepreviewstudio.com/",
    "https://kaidevlabs.gumroad.com/",
  ],
  knowsAbout: [
    "Flutter",
    "React Native",
    "Dart",
    "TypeScript",
    "Kotlin",
    "Mobile App Performance",
    "App Store & Google Play Review",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#131413] text-[#f8fafc] font-sans selection:bg-[#00D085]/20 selection:text-[#00D085]">
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
              })(window, document, "clarity", "script", "zcpowo3rau");
            `,
          }}
        />
      </body>
    </html>
  );
}
