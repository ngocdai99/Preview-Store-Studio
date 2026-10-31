export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: "smartphone" | "shieldCheck" | "sparkles" | "folderArchive" | "wifiOff";
  badge?: string;
}

export interface ComparisonBeat {
  id: string;
  number: string;
  category: string;
  bad: {
    title: string;
    description: string;
  };
  good: {
    badge: string;
    title: string;
    description: string;
  };
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  highlight: string;
  avatarInitials: string;
}

export interface PricingTier {
  id: string;
  name: string;
  badge: string;
  isPopular?: boolean;
  description: string;
  price: {
    original: number;
    current: number;
    currency: string;
    period: string;
  };
  features: Array<{
    text: string;
    tag?: string;
    isPrimary?: boolean;
  }>;
  cta: {
    label: string;
    href: string;
  };
}

export interface FaqItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

export const siteConfig = {
  name: "Store Preview Studio",
  headline: "Stop guessing how your app listing looks before submitting.",
  description:
    "The zero-server, 100% offline studio to design, preview, and validate Apple App Store & Google Play listings with realistic device mockups.",
  url: "https://store-preview-studio.pages.dev",
  ogImage: "https://store-preview-studio.pages.dev/og-image.png?v=20261026-4k",
  gumroadUrl: "https://gumroad.com/l/store-preview-studio",
  creator: {
    name: "Independent Craftsperson",
    twitter: "@StorePreviewer",
  },

  navigation: [
    { label: "Showcase", href: "#showcase" },
    { label: "Features", href: "#features" },
    { label: "Why Us", href: "#comparison" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ] as NavItem[],

  hero: {
    badge: "Mockup Studio for App Store & Google Play",
    subheadline:
      "Save 2 hours of back-and-forth with your client before every App Store submission. App Store Connect & Google Play provide zero live preview — preview and refine your listings with confidence.",
    primaryCta: {
      label: "Get Lifetime Access — $29",
      href: "#pricing",
    },
    secondaryCta: {
      label: "Watch Interactive Tour",
      href: "#showcase",
    },
    trustBadges: [
      "100% Offline & Private",
      "No Subscriptions",
      "Pay Once, Keep Forever",
    ],
  },

  features: [
    {
      id: "frames",
      icon: "smartphone",
      title: "Realistic Modern Device Frames",
      description:
        "Hardware bezels for iPhone 16/15 Pro with Dynamic Island, iPad Pro, Android flagship phones, and tablets. Supports landscape game mode viewports and dark/light OS themes.",
      badge: "Retina Hardware",
    },
    {
      id: "compliance",
      icon: "shieldCheck",
      title: "Smart Size & Compliance Detection",
      description:
        "Automatically verifies screenshot dimensions against official App Store (6.7\", 6.5\", iPad 12.9\") & Google Play guidelines. Warns you instantly about invalid aspect ratios and illegal iOS icon transparency (alpha channels).",
      badge: "Automated QA",
    },
    {
      id: "sync",
      icon: "sparkles",
      title: "Dual-Store Sync & Unicode Counters",
      description:
        "Author Apple & Google listings side-by-side. Uses native grapheme cluster segmentation (Intl.Segmenter) so complex emojis and symbols never trigger surprise store metadata rejections.",
      badge: "Zero Rejections",
    },
    {
      id: "export",
      icon: "folderArchive",
      title: "1-Click Preset & Zip Export",
      description:
        "Export portable JSON presets to backup configurations or transfer between teammates. Bulk export clean 4K Retina screenshot bundles with instant client-side ZIP generation.",
      badge: "Ultra HD 4K",
    },
    {
      id: "offline",
      icon: "wifiOff",
      title: "100% Private & Standalone Offline",
      description:
        "Zero servers, zero analytics, zero external API dependencies. A single self-contained HTML file that runs straight in any browser. Your unreleased client assets and secret copy never leave your local RAM.",
      badge: "Air-gapped",
    },
  ] as FeatureItem[],

  comparison: {
    badge: "The Problem vs The Solution",
    title: "The blind submission headache is over.",
    badColumnTitle: "Without Preview Studio",
    badColumnSubtitle: "Blind form fields, spreadsheets & $29/mo recurring subscriptions",
    goodColumnTitle: "With Preview Studio",
    goodColumnSubtitle: "Interactive visual workspace · 100% Offline · Pay once, keep forever",
    beats: [
      {
        id: "beat-1",
        number: "01",
        category: "Team Access & Handoff",
        bad: {
          title: "Marketers without developer accounts, drafting blindly in Google Docs",
          description:
            "Writing copy in shared docs leads to endless back-and-forth with developers over character limits, missing specs, and broken layouts.",
        },
        good: {
          badge: "Independent Marketing Workflow",
          title: "Preview and validate listings without needing developer accounts",
          description:
            "Finalize store pages with confidence. Hand over paste-ready copy and assets to developers with zero back-and-forth.",
        },
      },
      {
        id: "beat-2",
        number: "02",
        category: "Release Planning",
        bad: {
          title: "No visibility into which changes require a new app release",
          description:
            "No way to know whether an edit can go live instantly or requires developers to compile and submit a new binary — leading to surprise rebuild requests and delayed campaigns.",
        },
        good: {
          badge: "Proactive Release Planning",
          title: "Know what updates live vs. what needs a new release",
          description:
            "Plan marketing campaigns with confidence, and only loop in developers when a new app release is actually required.",
        },
      },
      {
        id: "beat-3",
        number: "03",
        category: "Visual Context & Mockups",
        bad: {
          title: "Drafting blindly with zero device preview or outdated frames",
          description:
            "Typing copy into raw form inputs leaves you guessing. Awkward line wraps and cut-off text stay hidden until the app is live.",
        },
        good: {
          badge: "Visual Device Mockups",
          title: "Authentic, pixel-perfect iOS & Android mockups",
          description:
            "Preview in real time across iPhone (Dynamic Island), iPad, and Android screens. Catch awkward truncations and layout bugs long before release day.",
        },
      },
      {
        id: "beat-4",
        number: "04",
        category: "Pricing & Privacy",
        bad: {
          title: "$29/mo recurring subscriptions & mandatory cloud uploads",
          description:
            "Third-party SaaS tools charge recurring monthly fees and force you to upload unreleased client assets to third-party cloud servers.",
        },
        good: {
          badge: "100% Private & Offline",
          title: "One-time purchase · Pay once, keep forever",
          description:
            "A self-contained HTML file running locally on your machine. Zero subscriptions, zero logins, zero servers, and complete peace of mind.",
        },
      },
    ] as ComparisonBeat[],
  },

  testimonials: [
    {
      quote:
        "Before Preview Studio, every App Store submission felt like flying blind. We'd submit metadata, wait 2 days for review, only to realize the title wrapped awkwardly on smaller iPhones. Preview Studio saved us hours of back-and-forth before our launch day.",
      author: "Alex Rivera",
      role: "Startup Founder · Shipped 4 iOS Apps",
      highlight: "Saved hours before launch day",
      avatarInitials: "AR",
    },
    {
      quote:
        "Our clients always asked: 'Can we see what the store page will actually look like before we approve the screenshots?' We used to build messy PowerPoint decks. Now we just export clean 4K mockups or share the standalone file. It makes our agency deliverables look 10x more professional.",
      author: "Marcus Vance",
      role: "Partner at AppCraft Studio · ASO & Growth Agency",
      highlight: "10x more professional deliverables",
      avatarInitials: "MV",
    },
    {
      quote:
        "Figma templates for App Store screenshots get outdated every time Apple changes bezel radiuses or introduces a new Dynamic Island. Preview Studio gives me instant, hardware-accurate frames and catches illegal icon transparency before engineering touches it.",
      author: "Elena Rostova",
      role: "Lead Product Designer · FinTech Mobile Suite",
      highlight: "Hardware-accurate Dynamic Island",
      avatarInitials: "ER",
    },
  ] as TestimonialItem[],

  pricing: {
    banner: {
      tag: "EARLY BIRD IS LIVE",
      text: "Special launch pricing for early supporters · Instant offline delivery",
    },
    title: "One-time purchase. No subscription.",
    description:
      "Zero recurring fees. Standalone offline HTML studio. Pay once, keep your copy forever.",
    scopeNote: {
      covered:
        "Preview Studio previews what customers see (title, subtitle, description, icon, screenshots across phones & tablets).",
      notCovered:
        "It does not preview developer setup forms like App Privacy nutrition labels, Google Play Data Safety, In-App Purchases, or age rating questionnaires.",
    },
    tiers: [
      {
        id: "plus",
        name: "Plus Edition",
        badge: "PLUS",
        description:
          "For indie developers and creators who need a fast, standalone offline preview studio.",
        price: {
          original: 39,
          current: 29,
          currency: "$",
          period: "one-time payment",
        },
        features: [
          { text: "Clean 4K Ultra HD Export", tag: "No Watermark" },
          { text: "iPhone, iPad & Android Phone/Tablet frames" },
          { text: "Smart Size & Icon Alpha Channel Detection" },
          { text: "Store Listing Metadata Export", tag: "Markdown & Copy" },
          { text: "Store Character & Emoji Counters" },
          { text: "100% Offline Single-File Studio", tag: ".html" },
          { text: "Single-User Commercial License" },
        ],
        cta: {
          label: "Get Plus Edition ($29)",
          href: "https://gumroad.com/l/store-preview-studio?wanted=true&price=29",
        },
      },
      {
        id: "pro",
        name: "Pro Studio",
        badge: "PRO",
        isPopular: true,
        description:
          "For agencies, studios, and developers requiring commercial client licensing and full source code.",
        price: {
          original: 59,
          current: 39,
          currency: "$",
          period: "one-time payment",
        },
        features: [
          { text: "Everything in Plus Edition, plus:", isPrimary: true },
          { text: "Team & Agency License", tag: "Unlimited Client Work" },
          { text: "Full Modular Source Code", tag: "src/" },
          { text: "White-label Ready", tag: "Custom Agency Branding" },
          { text: "Live-Reload Dev Server & Bundler", tag: "build.js" },
          { text: "Agency Marketing & ASO Playbook", tag: "HTML offline" },
        ],
        cta: {
          label: "Get Pro Studio ($39)",
          href: "https://gumroad.com/l/store-preview-studio?wanted=true&price=39",
        },
      },
    ] as PricingTier[],
  },

  aboutMaker: {
    badge: "Bootstrapped & Independent",
    title: "Crafted by an indie developer, not a faceless SaaS conglomerate.",
    story: [
      "Hi, I'm the creator behind Store Preview Studio.",
      "Like many of you, I got sick of paying $29/month to bloated SaaS platforms just to see how an app screenshot looks inside a phone frame. I also hated having to upload confidential, unreleased client screenshots to third-party servers.",
      "That's why I built Store Preview Studio as a 100% offline, single-file HTML tool. Pay once, keep it forever, with zero server bills and zero tracking.",
      "When you buy a license, you're directly supporting an independent craftsperson. If you ever have a question or need a new device frame, you won't get a robot ticket — you'll talk directly to the person who wrote the code.",
    ],
    signature: "Built with craftsmanship for mobile developers worldwide.",
  },

  faq: [
    {
      id: "offline-architecture",
      topic: "Offline Architecture",
      question: "Does Store Preview Studio require an active internet connection?",
      answer:
        "No. Store Preview Studio runs 100% locally in your browser. All scripts, icons, CSS styles, and fonts are completely self-contained. You can use it on airplanes, remote locations, or behind corporate firewalls with zero telemetry and zero external server calls.",
    },
    {
      id: "store-review-policy",
      topic: "Store Review Policy",
      question:
        "Can Store Preview Studio guarantee that my app will pass App Store or Google Play review?",
      answer:
        "No, and no software tool on the market can. Store Preview Studio gives you realistic visual mockups and catches mechanical formatting mistakes (such as wrong icon dimensions, transparent alpha channels on iOS, or invalid screenshot aspect ratios). However, final app approval is determined entirely by the official Apple and Google review teams based on your compiled code, privacy policies, and store guidelines.",
    },
    {
      id: "scope-coverage",
      topic: "Scope & Coverage",
      question: "What parts of a store listing does Preview Studio actually cover?",
      answer:
        "Preview Studio previews what customers see on your store page: title, subtitle, description, app icon, and screenshots across iOS, iPadOS, and Android. It does not preview developer setup forms like App Privacy nutrition labels, Google Play Data Safety, In-App Purchases, or age rating questionnaires — those remain managed directly inside Apple and Google consoles.",
    },
    {
      id: "commercial-license",
      topic: "Commercial License",
      question: "Can I use Store Preview Studio for client projects?",
      answer:
        "Yes! Both the Plus and Pro tiers include full commercial licenses. You can author, optimize, and present store listings for as many apps as you wish — on a single-user basis. If you need multiple seats or unlimited client work, upgrade to Pro Studio which includes a full Team & Agency license.",
    },
    {
      id: "client-handoff",
      topic: "Client Review Handoff",
      question:
        "Do my clients need a $99/year Apple Developer or Google Play account to view previews?",
      answer:
        "No! In native store consoles, clients cannot view or review listings unless they hold a paid developer account and console invite. With Store Preview Studio, you simply hand over the standalone HTML file or export JSON presets — clients can review realistic listings directly in any browser with zero logins and zero fees.",
    },
    {
      id: "product-updates",
      topic: "Product Updates",
      question: "How do updates work after purchase?",
      answer:
        "You receive all maintenance patches and store spec adjustments for the current version for free via your download link. Major future editions with new platforms or hardware generations will be offered to existing customers at a steep upgrade discount.",
    },
  ] as FaqItem[],

  footer: {
    copyright: "© 2026 Store Preview Studio. Built for mobile craftspeople worldwide.",
    links: [
      { label: "Why Us", href: "#comparison" },
      { label: "Features", href: "#features" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Gumroad Store", href: "https://gumroad.com/l/store-preview-studio" },
    ],
  },
};
