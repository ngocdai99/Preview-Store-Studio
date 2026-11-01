export interface TierFeature {
  text: string;
  tag?: string;
  isPrimary?: boolean;
}

export const en = {
  navigation: {
    pricingCta: "View Pricing",
    links: [
      { label: "Why Us", href: "#comparison" },
      { label: "Live Demo", href: "/demo" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },

  hero: {
    badge: "Mockup & Preview Studio for App Store & Google Play",
    titleLead: "Stop guessing how your app listing",
    titleAccent: "looks before submitting.",
    subheadlineLead:
      "Save 2 hours of back-and-forth with your client before every App Store submission.",
    subheadlineFollow:
      "App Store Connect & Google Play provide no live preview — preview and refine your listings with confidence.",
    subheadline:
      "Save 2 hours of back-and-forth with your client before every App Store submission. App Store Connect & Google Play provide no live preview — preview and refine your listings with confidence.",
    primaryCta: {
      label: "Get Lifetime Access — $29",
      href: "#pricing",
    },
    secondaryCta: {
      label: "Try Live Demo ↗",
      href: "/demo",
    },
    trustBadges: [
      "100% Offline & Private",
      "No Subscriptions",
      "Pay Once, Keep Forever",
    ],
  },

  features: {
    headline: "Built for mobile developers, agencies, and ASO pros.",
    subheadline:
      "Everything you need to craft, review, and ship store-ready app listings without messy spreadsheets or design templates.",
    items: [
      {
        id: "frames",
        icon: "smartphone" as const,
        title: "Realistic Modern Device Frames",
        description:
          "Hardware bezels for iPhone, iPad, Android phones, and tablets. Supports authentic store viewports with dark and light OS themes.",
        badge: "Retina Hardware",
      },
      {
        id: "viewports",
        icon: "search" as const,
        title: "Search Result & Dual-Phone Viewports",
        description:
          "Simulate both the product detail page and live App Store search feed cards. Toggle dual-phone mode to compare iOS and Android renderings side-by-side.",
        badge: "Dual Viewports",
      },
      {
        id: "cloner",
        icon: "cloudDownload" as const,
        title: "1-Click Live App Cloner",
        description:
          "Import real metadata, live ratings, subtitles, and screenshot galleries directly from any public App Store listing for instant competitor benchmarking.",
        badge: "Competitor ASO",
      },
      {
        id: "compliance",
        icon: "shieldCheck" as const,
        title: "Smart Size & Compliance Detection",
        description:
          "Automatically verifies screenshot dimensions against official App Store & Google Play guidelines. Warns you instantly about invalid aspect ratios and illegal iOS icon transparency (alpha channels).",
        badge: "Automated QA",
      },
      {
        id: "export",
        icon: "folderArchive" as const,
        title: "Multi-Format Export & Dev Markdown",
        description:
          "Bulk export clean 4K Retina PNG mockups and client-side ZIP bundles. Generate structured LISTING_METADATA.md and portable JSON presets for seamless developer handoff.",
        badge: "Ultra HD 4K",
      },
    ],
  },

  comparison: {
    badge: "The Problem vs The Solution",
    title: "The blind submission headache is over.",
    badColumnTitle: "Without Preview Studio",
    badColumnSubtitle: "Blind form fields, spreadsheets & fragmented drafts",
    goodColumnTitle: "With Preview Studio",
    goodColumnSubtitle: "Interactive visual workspace · 100% Offline",
    beats: [
      {
        id: "beat-1",
        number: "01",
        category: "TEAM ACCESS & HANDOFF",
        bad: {
          title: "Marketers without developer accounts, drafting blindly in Google Docs",
          description:
            "Writing copy in shared docs leads to misaligned specs with developers over character limits, missing specs, and broken layouts.",
        },
        good: {
          badge: "INDEPENDENT MARKETING WORKFLOW",
          title: "Preview and validate listings without needing developer accounts",
          description:
            "Finalize store pages with confidence. Hand over paste-ready copy and assets to developers without confusion or misaligned specs.",
        },
      },
      {
        id: "beat-2",
        number: "02",
        category: "RELEASE PLANNING",
        bad: {
          title: "No visibility into which changes require a new app release",
          description:
            "No way to know whether an edit can go live instantly or requires developers to compile and submit a new binary — leading to surprise rebuild requests and delayed campaigns.",
        },
        good: {
          badge: "PROACTIVE RELEASE PLANNING",
          title: "Know what updates live vs. what needs a new release",
          description:
            "Plan marketing campaigns with confidence, and only loop in developers when a new app release is actually required.",
        },
      },
      {
        id: "beat-3",
        number: "03",
        category: "VISUAL CONTEXT",
        bad: {
          title: "Drafting blindly with zero device preview",
          description:
            "Typing copy into raw form inputs leaves you guessing. Awkward line wraps and cut-off text stay hidden until the app is live.",
        },
        good: {
          badge: "VISUAL DEVICE MOCKUPS",
          title: "Authentic iOS & Android mockups",
          description:
            "Preview in real time across iPhone, iPad, and Android screens. Catch awkward truncations and layout bugs long before release day.",
        },
      },
      {
        id: "beat-4",
        number: "04",
        category: "PRICING & PRIVACY",
        bad: {
          title: "$29/mo subscriptions & cloud accounts",
          description:
            "Third-party SaaS tools charge recurring monthly fees and require cloud accounts just to preview marketing assets before launch.",
        },
        good: {
          badge: "100% PRIVATE & OFFLINE",
          title: "One-time purchase · Pay once, keep forever",
          description:
            "A self-contained HTML file running locally on your machine. No subscriptions, no cloud logins, and complete data privacy.",
        },
      },
    ],
  },

  testimonials: {
    title: "See how founders and agencies ship\u00A0faster.",
    items: [
      {
        quote:
          "Before Preview Studio, every App Store submission felt like flying blind. We'd submit metadata, wait 2 days for review, only to realize the title wrapped awkwardly on smaller iPhones. **Preview Studio saved us hours of costly revision rounds before our launch day.**",
        author: "Alex Rivera",
        role: "Startup Founder · Shipped 4 iOS Apps",
        highlight: "Saved hours before launch day",
      },
      {
        quote:
          "Our clients always asked: 'Can we see what the store page will actually look like before we approve the screenshots?' We used to build messy PowerPoint decks. **Now we just export clean 4K mockups or share the standalone file.** It makes our agency deliverables look noticeably more polished and professional.",
        author: "Marcus Vance",
        role: "Partner at AppCraft Studio · ASO & Growth Agency",
        highlight: "Agency-grade client deliverables",
      },
      {
        quote:
          "Figma templates for App Store screenshots get outdated every time Apple changes bezel radiuses or introduces a new Dynamic Island. **Preview Studio gives me instant, hardware-accurate frames** and catches illegal icon transparency before engineering touches it.",
        author: "Elena Rostova",
        role: "Lead Product Designer · FinTech Mobile Suite",
        highlight: "Hardware-accurate Dynamic Island",
      },
    ],
  },

  pricing: {
    banner: {
      tag: "EARLY BIRD IS LIVE",
      text: "Special launch pricing for early supporters · Instant offline delivery",
    },
    title: "One-time purchase. No subscription.",
    description:
      "No recurring fees. Standalone offline HTML studio. Pay once, keep your copy forever.",
    mostPopularBadge: "Most Popular",
    scopeNote: {
      coveredLabel: "What’s covered:",
      covered:
        "100% of customer-facing store listings: titles, subtitles, descriptions, release notes, phone & tablet screenshots, app icons, age ratings, in-app purchase tags, and App Privacy & Data Safety cards across iOS and Android.",
      notCoveredLabel: "What’s not covered:",
      notCovered:
        "It is a visual preview & metadata drafting studio — it does not compile or upload binary builds (.ipa/.aab) and does not require developer login access to App Store Connect or Google Play Console.",
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
          { text: "1-Click Live App Cloner (App Store)", tag: "Competitor ASO" },
          { text: "Dual-Phone & Search Feed Viewports" },
          { text: "iPhone, iPad & Android Hardware Bezels", tag: "Dark/Light OS" },
          { text: "Smart Size & Icon Alpha Channel Detection" },
          { text: "Clean 4K Ultra HD Export", tag: "No Watermark" },
          { text: "LISTING_METADATA.md & JSON Presets", tag: "Dev Handoff" },
          { text: "100% Private Offline Single-File Studio", tag: ".html" },
          { text: "Single-User Lifetime Commercial License" },
        ] as TierFeature[],
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
        ] as TierFeature[],
        cta: {
          label: "Get Pro Studio ($39)",
          href: "https://gumroad.com/l/store-preview-studio?wanted=true&price=39",
        },
      },
    ],
  },

  aboutMaker: {
    badge: "About the Creator",
    title: "Crafted by an indie developer, not a faceless SaaS conglomerate.",
    story: [
      "Hi, I'm the creator behind Store Preview Studio.",
      "Like many of you, I got sick of paying $29/month to bloated SaaS platforms just to see how an app screenshot looks inside a phone frame. I also hated having to upload confidential, unreleased client screenshots to third-party servers.",
      "That's why I built Store Preview Studio as a 100% offline, single-file HTML tool. Pay once, keep it forever, with zero server bills and zero tracking.",
      "When you buy a license, you're directly supporting an independent craftsperson. If you ever have a question or need a new device frame, you won't get a robot ticket — you'll talk directly to the person who wrote the code.",
    ],
    signature: "Built with craftsmanship for mobile developers worldwide.",
  },

  faq: {
    title: "Frequently Asked Questions",
    description:
      "Everything you need to know about store review compliance, client handoff, and lifetime updates.",
    items: [
      {
        id: "store-review-policy",
        topic: "Store Review Policy",
        question:
          "Can Store Preview Studio guarantee that my app will pass App Store or Google Play review?",
        answer:
          "No, and no software tool on the market can. Store Preview Studio gives you realistic visual mockups and catches mechanical formatting mistakes (such as wrong icon dimensions, transparent alpha channels on iOS, or invalid screenshot aspect ratios). However, final app approval is determined entirely by the official Apple and Google review teams based on your compiled code, privacy policies, and store guidelines.",
      },
      {
        id: "client-handoff",
        topic: "Client Review Handoff",
        question:
          "Do my clients need a $99/year Apple Developer or Google Play account to view previews?",
        answer:
          "No! In native store consoles, clients cannot view or review listings unless they hold a paid developer account and console invite. With Store Preview Studio, you simply hand over the standalone HTML file or export JSON presets — clients can review realistic listings directly in any browser with no logins and no extra fees.",
      },
      {
        id: "product-updates",
        topic: "Product Updates",
        question: "How do updates work after purchase?",
        answer:
          "You receive all maintenance patches and store spec adjustments for the current version for free via your download link. Major future editions with new platforms or hardware generations will be offered to existing customers at a steep upgrade discount.",
      },
    ],
  },

  footer: {
    copyright: "© 2026 Store Preview Studio by Kai DevLabs",
    links: [
      { label: "Live Demo", href: "/demo" },
      { label: "Why Us", href: "#comparison" },
      { label: "Features", href: "#features" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Gumroad Store", href: "https://gumroad.com/l/store-preview-studio" },
    ],
  },
};

export type ContentDictionary = typeof en;
