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
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },

  hero: {
    badge: "Mockup & Preview Studio for App Store & Google Play",
    titleLead: "Stop guessing how your app listing",
    titleAccent: "looks before submitting.",
    subheadlineLead:
      "Save hours of back-and-forth with your client before every App Store submission.",
    subheadlineFollow:
      "App Store Connect & Google Play provide no live preview — see exactly how your listing looks before submitting.",
    subheadline:
      "Save hours of back-and-forth with your client before every App Store submission. App Store Connect & Google Play provide no live preview — see exactly how your listing looks before submitting.",
    primaryCta: {
      label: "Get Lifetime Access — $29",
      href: "#pricing",
    },
    secondaryCta: {
      label: "Try Live Demo",
      href: "/try",
    },
    trustBadges: [
      "Offline & Private Workspace",
      "No Subscriptions",
      "Pay Once, Keep Forever",
    ],
  },

  seeItInAction: {
    title: "See it in action",
    slides: [
      {
        id: "dual-store",
        name: "Workspace",
        indexLabel: "01",
        windowTitle: "01 · Workspace",
        title: "Dual-Store Studio Workspace",
        caption: "Edit metadata once and watch iPhone and Android viewports update live.",
        src: "/images/workspace_dual_store.png",
        width: 3590,
        height: 2022,
      },
      {
        id: "tablet",
        name: "Tablet",
        indexLabel: "02",
        windowTitle: "02 · Tablet",
        title: "Tablet & iPad Stage Workspace",
        caption: "Preview expanded 4:3 screenshot layouts for iPad and Android tablets.",
        src: "/images/workspace_tablet_10.png",
        width: 3550,
        height: 1876,
      },
      {
        id: "audit",
        name: "Audit",
        indexLabel: "03",
        windowTitle: "03 · Audit",
        title: "Pre-Flight ASO Compliance Audit",
        caption: "Catch icon transparency issues, invalid screenshot sizes, and character overflows before review.",
        src: "/images/audit.png",
        srcMobile: "/images/audit_mobile.png",
        width: 3200,
        height: 1700,
      },
      {
        id: "export",
        name: "Export",
        indexLabel: "04",
        windowTitle: "04 · Export",
        title: "1-Click Batch Asset & Preset Export",
        caption: "Download Retina 4K mockups, framed screenshots, and metadata JSON bundles in one zip.",
        src: "/images/export.png",
        width: 3200,
        height: 1700,
      },
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
          "Bulk export clean 4K Retina PNG mockups and client-side ZIP bundles. Generate structured store submission Markdown and portable JSON presets for seamless developer handoff.",
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
    goodColumnSubtitle: "Interactive visual workspace · Offline & Private",
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
            "Finalize store pages before release. Hand over paste-ready copy and assets to developers without confusion or misaligned specs.",
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
            "Plan marketing campaigns independently, and only loop in developers when a new app release is actually required.",
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
          badge: "PRIVATE & OFFLINE",
          title: "One-time purchase · Pay once, keep forever",
          description:
            "A self-contained HTML file running locally on your machine. No subscriptions, no cloud logins, and complete data privacy.",
        },
      },
    ],
  },

  pricing: {
    title: "One-time purchase. No subscription.",
    description:
      "No recurring fees. Standalone offline HTML studio. Pay once, keep your copy forever.",
    mostPopularBadge: "Most Popular",
    scopeNote: {
      coveredLabel: "What’s covered:",
      covered:
        "All customer-facing store listing fields: titles, subtitles, descriptions, release notes, phone & tablet screenshots, app icons, age ratings, in-app purchase tags, and App Privacy & Data Safety cards across iOS and Android.",
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
          { text: "1-Click Live App Cloner (App Store)" },
          { text: "iPhone, iPad & Android Hardware Bezels" },
          { text: "Clean 4K Ultra HD Export", tag: "No Watermark" },
          { text: "Private Offline Single-File Studio", tag: ".html" },
          { text: "Single-User Lifetime Commercial License" },
        ] as TierFeature[],
        cta: {
          label: "Buy Plus — $29",
          href: "https://kaidevlabs.gumroad.com/l/store-preview-studio/EARLYBIRDPLUS",
        },
      },
      {
        id: "pro",
        name: "Pro Studio",
        badge: "PRO",
        description:
          "For agencies, studios, and developers requiring commercial client licensing and full source code.",
        price: {
          original: 69,
          current: 49,
          currency: "$",
          period: "one-time payment",
        },
        features: [
          { text: "Everything in Plus Edition, plus:", isPrimary: true },
          { text: "Team & Agency License" },
          { text: "Full Modular Source Code", tag: "src/" },
          { text: "White-label Ready", tag: "Custom Agency Branding" },
          { text: "Live-Reload Dev Server & Bundler", tag: "build.js" },
          { text: "Agency Marketing & ASO Playbook" },
        ] as TierFeature[],
        cta: {
          label: "Buy Pro — $49",
          href: "https://kaidevlabs.gumroad.com/l/store-preview-studio/EARLYBIRDPRO",
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
      "That's why I built Store Preview Studio as a private, single-file HTML tool. Pay once, keep it forever, directly in your browser with zero tracking.",
      "When you buy a license, you're directly supporting an independent craftsperson. If you ever have a question or need a new device frame, you won't get a robot ticket — you'll talk directly to the person who wrote the code.",
    ],
    signature: "Built with craftsmanship for mobile developers worldwide.",
  },

  faq: {
    title: "Frequently Asked Questions",
    description:
      "Everything you need to know about Store Preview Studio, licensing, and offline usage.",
    items: [
      {
        id: "store-review-policy",
        topic: "Store Review Policy",
        question:
          "Does Store Preview Studio ensure my app will pass App Store or Google Play review?",
        answer:
          "No, and no software tool on the market can. Store Preview Studio gives you realistic visual mockups and catches mechanical formatting mistakes (such as wrong icon dimensions, transparent alpha channels on iOS, or invalid screenshot aspect ratios). However, final app approval is determined entirely by the official Apple and Google review teams based on your compiled code, privacy policies, and store guidelines.",
      },
      {
        id: "offline-workflow",
        topic: "Offline Workflow",
        question: "Does Store Preview Studio really work offline?",
        answer:
          "Yes. All mockup rendering, metadata drafting, character counting, and 4K exporting run directly inside your browser with zero tracking and zero server storage. An internet connection is only needed if you choose to import a public store listing from a URL.",
      },
      {
        id: "free-cheatsheet",
        topic: "Store Guidelines & Specs",
        question:
          "Where can I find the exact character limits and submission rules for Apple & Google Play?",
        answer:
          "Official specs are scattered across Apple Developer and Google Play Console documentation. If you'd rather not dig through dozens of doc pages, we've summarized all exact rules, character limits, and asset dimensions into a single free reference sheet.",
        link: {
          label: "Get The Free ASO Cheatsheet",
          href: "https://kaidevlabs.gumroad.com/l/aso-cheatsheet",
        },
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
    disclaimer: "Independent tool · Not affiliated with Apple Inc. or Google LLC.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Live Demo", href: "/try" },
          { label: "Why Us", href: "/#comparison" },
          { label: "Features", href: "/#features" },
          { label: "Pricing", href: "/#pricing" },
          { label: "FAQ", href: "/#faq" },
        ],
      },
      {
        title: "Legal & Store",
        links: [
          { label: "Free ASO Cheatsheet", href: "https://kaidevlabs.gumroad.com/l/aso-cheatsheet" },
          { label: "Gumroad Store", href: "https://kaidevlabs.gumroad.com/" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms & Refunds", href: "/terms" },
        ],
      },
    ],
    links: [
      { label: "Live Demo", href: "/try" },
      { label: "Why Us", href: "/#comparison" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Free Cheatsheet", href: "https://kaidevlabs.gumroad.com/l/aso-cheatsheet" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Gumroad Store", href: "https://kaidevlabs.gumroad.com/" },
    ],
  },
};

export type ContentDictionary = typeof en;
