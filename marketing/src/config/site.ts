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
    "The browser-based, offline studio to design, preview, and prepare Apple App Store & Google Play listings with realistic device mockups.",
  url: "https://store-preview-studio.pages.dev",
  ogImage: "https://store-preview-studio.pages.dev/og-image.png?v=20261107",
  gumroadUrl: "https://kaidevlabs.gumroad.com/l/store-preview-studio",
  creator: {
    name: "Kai",
    brand: "Kai DevLabs",
    avatar: "/kai.webp",
  },

  // Dictionary Content (Language: English)
  navigation: en.navigation.links,
  navPricingCta: en.navigation.pricingCta,
  hero: en.hero,
  features: en.features,
  comparison: en.comparison,
  testimonials: en.testimonials,
  pricing: en.pricing,
  faq: en.faq,
  footer: en.footer,
};

export type SiteConfig = typeof siteConfig;
