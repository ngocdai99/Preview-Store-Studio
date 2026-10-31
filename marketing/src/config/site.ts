import { en, type ContentDictionary } from "@/content/en";

export type NavItem = ContentDictionary["navigation"]["links"][number];
export type FeatureItem = ContentDictionary["features"]["items"][number];
export type ComparisonBeat = ContentDictionary["comparison"]["beats"][number];
export type TestimonialItem = ContentDictionary["testimonials"]["items"][number];
export type PricingTier = ContentDictionary["pricing"]["tiers"][number];
export type FaqItem = ContentDictionary["faq"]["items"][number];

export const siteConfig = {
  // Global & SEO Metadata
  name: "Store Preview Studio",
  headline: en.hero.titleLead + " " + en.hero.titleAccent,
  description:
    "The zero-server, 100% offline studio to design, preview, and validate Apple App Store & Google Play listings with realistic device mockups.",
  url: "https://store-preview-studio.pages.dev",
  ogImage: "https://store-preview-studio.pages.dev/og-image.png?v=20261026-4k",
  gumroadUrl: "https://gumroad.com/l/store-preview-studio",
  creator: {
    name: "Independent Craftsperson",
    twitter: "@StorePreviewer",
  },

  // Dictionary Content (Language: English)
  navigation: en.navigation.links,
  navPricingCta: en.navigation.pricingCta,
  hero: en.hero,
  features: en.features,
  comparison: en.comparison,
  testimonials: en.testimonials,
  pricing: en.pricing,
  aboutMaker: en.aboutMaker,
  faq: en.faq,
  footer: en.footer,
};

export type SiteConfig = typeof siteConfig;
