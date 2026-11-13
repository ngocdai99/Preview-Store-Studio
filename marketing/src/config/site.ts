import type { Metadata } from "next";
import { en, type ContentDictionary } from "@/content/en";

export type NavItem = ContentDictionary["navigation"]["links"][number];
export type FeatureItem = ContentDictionary["features"]["items"][number];
export type ComparisonBeat = ContentDictionary["comparison"]["beats"][number];
export type SeeItInActionSlide = ContentDictionary["seeItInAction"]["slides"][number];
export type PricingTier = ContentDictionary["pricing"]["tiers"][number];
export type FaqItem = ContentDictionary["faq"]["items"][number];

export const siteConfig = {
  // Global & SEO Metadata
  name: "Store Preview Studio",
  headline: en.hero.titleLead + " " + en.hero.titleAccent,
  description:
    "The browser-based, offline studio to design, preview, and prepare Apple App Store & Google Play listings with realistic device mockups.",
  url: "https://storepreviewstudio.com",
  ogImage: "https://storepreviewstudio.com/og-image.png?v=20261107",
  gumroadUrl: "https://kaidevlabs.gumroad.com/l/store-preview-studio",
  supportEmail: "support.kai.devlabs@gmail.com",
  creator: {
    name: "Kai",
    brand: "Kai DevLabs",
    url: "https://kaidevlabs.pages.dev",
    avatar: "/kai.webp",
  },

  // Dictionary Content (Language: English)
  navigation: en.navigation.links,
  navPricingCta: en.navigation.pricingCta,
  hero: en.hero,
  seeItInAction: en.seeItInAction,
  features: en.features,
  comparison: en.comparison,
  testimonials: en.testimonials,
  pricing: en.pricing,
  faq: en.faq,
  footer: en.footer,
};

export type SiteConfig = typeof siteConfig;

/** Build per-page SEO metadata while preserving shared OpenGraph & Twitter image defaults. */
export function createPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.path,
    },
    openGraph: {
      type: "website",
      url: opts.path,
      title: opts.title,
      description: opts.description,
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
      title: opts.title,
      description: opts.description,
      images: [siteConfig.ogImage],
    },
  };
}
