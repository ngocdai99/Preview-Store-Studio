import { siteConfig, type FeatureItem } from "@/config/site";
import {
  Smartphone,
  ShieldCheck,
  Sparkles,
  FolderArchive,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<FeatureItem["icon"], LucideIcon> = {
  smartphone: Smartphone,
  shieldCheck: ShieldCheck,
  sparkles: Sparkles,
  folderArchive: FolderArchive,
  wifiOff: WifiOff,
};

interface FeatureTheme {
  iconBox: string;
  badge: string;
  radialGlow: string;
  cardHoverBorder: string;
  cardHoverShadow: string;
  tagBg: string;
}

const featureThemes: Record<string, FeatureTheme> = {
  frames: {
    iconBox:
      "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    badge:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25",
    radialGlow: "from-blue-500/15 via-indigo-500/10 to-transparent",
    cardHoverBorder: "hover:border-blue-500/40 dark:hover:border-blue-500/40",
    cardHoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(59,130,246,0.25)]",
    tagBg:
      "bg-blue-50/70 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-500/20",
  },
  compliance: {
    iconBox:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    radialGlow: "from-emerald-500/15 via-teal-500/10 to-transparent",
    cardHoverBorder:
      "hover:border-emerald-500/40 dark:hover:border-emerald-500/40",
    cardHoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(16,185,129,0.25)]",
    tagBg:
      "bg-emerald-50/70 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-500/20",
  },
  sync: {
    iconBox:
      "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    badge:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25",
    radialGlow: "from-purple-500/15 via-violet-500/10 to-transparent",
    cardHoverBorder:
      "hover:border-purple-500/40 dark:hover:border-purple-500/40",
    cardHoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(168,85,247,0.25)]",
    tagBg:
      "bg-purple-50/70 text-purple-700 border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-500/20",
  },
  export: {
    iconBox:
      "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    badge:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
    radialGlow: "from-amber-500/15 via-orange-500/10 to-transparent",
    cardHoverBorder: "hover:border-amber-500/40 dark:hover:border-amber-500/40",
    cardHoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(245,158,11,0.25)]",
    tagBg:
      "bg-amber-50/70 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-500/20",
  },
  offline: {
    iconBox:
      "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]",
    badge:
      "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25",
    radialGlow: "from-rose-500/15 via-pink-500/10 to-transparent",
    cardHoverBorder: "hover:border-rose-500/40 dark:hover:border-rose-500/40",
    cardHoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(244,63,94,0.25)]",
    tagBg:
      "bg-rose-50/70 text-rose-700 border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-500/20",
  },
};

const featureTags: Record<string, string[]> = {
  frames: [
    "iPhone & iPad",
    "Android & Tablets",
    "Light & Dark OS",
    "Store Viewports",
  ],
  compliance: [
    "Official Store Specs",
    "Aspect Ratio Verification",
    "Alpha Transparency Alert",
  ],
  sync: [
    "Side-by-Side Dual Store",
    "Intl.Segmenter Emojis",
    "Live Title Length Guard",
  ],
  export: [
    "Instant Client-Side ZIP",
    "Portable JSON Presets",
    "4K Retina Bundles",
  ],
  offline: [
    "Zero Network Calls",
    "100% In-Memory RAM",
    "Self-Contained File",
  ],
};

export function Features() {
  const { features } = siteConfig;

  return (
    <section
      id="features"
      className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#080d1a]/50 transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[0.08em] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4 shadow-[0_2px_8px_rgba(59,130,246,0.06)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Capabilities</span>
          </div>

          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15]">
            {features.headline}
          </h2>

          <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-[#475569] dark:text-slate-400 max-w-[680px] mx-auto leading-relaxed">
            {features.subheadline}
          </p>
        </div>

        {/* 6-Column Bento Grid: Row 1 has two 3-col hero cards, Row 2 has three 2-col cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {features.items.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || Smartphone;
            const theme =
              featureThemes[feature.id] || featureThemes.frames;
            const tags = featureTags[feature.id] || [];

            // Bento span rules:
            // Item 0 & 1: 50% on desktop (lg:col-span-3)
            // Item 2 & 3: 33.3% on desktop (lg:col-span-2)
            // Item 4: 33.3% on desktop (lg:col-span-2) and spans full 2-cols on tablet (md:col-span-2)
            const colSpanClass =
              idx === 0 || idx === 1
                ? "md:col-span-1 lg:col-span-3"
                : idx === 4
                ? "md:col-span-2 lg:col-span-2"
                : "md:col-span-1 lg:col-span-2";

            const isHeroCard = idx === 0 || idx === 1;

            return (
              <div
                key={feature.id}
                className={`group relative rounded-[24px] flex flex-col justify-between overflow-hidden
                  bg-white dark:bg-[#0c1222]
                  border border-slate-200/90 dark:border-white/[0.08]
                  shadow-[0_2px_12px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.02),inset_0_1px_0_rgba(255,255,255,0.95)]
                  dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]
                  hover:-translate-y-1.5
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${theme.cardHoverBorder}
                  ${theme.cardHoverShadow}
                  ${colSpanClass}
                  ${isHeroCard ? "p-7 sm:p-9" : "p-6 sm:p-7"}
                `}
              >
                {/* Hairline reflection at top border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent pointer-events-none" />

                {/* Subtle corner radial glow on hover */}
                <div
                  className={`absolute -top-20 -right-20 w-52 h-52 rounded-full bg-gradient-to-br ${theme.radialGlow} blur-3xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-[14px] border flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${theme.iconBox}`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    {feature.badge && (
                      <span
                        className={`text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-1 rounded-full border shadow-sm transition-colors ${theme.badge}`}
                      >
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-extrabold text-[#0f172a] dark:text-white tracking-[-0.015em] leading-snug transition-colors ${
                      isHeroCard
                        ? "text-[20px] sm:text-[21px]"
                        : "text-[18px] sm:text-[19px]"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-[14px] sm:text-[14.5px] leading-relaxed text-[#475569] dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Tags / Visual Feature Chips */}
                {tags.length > 0 && (
                  <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap gap-1.5 items-center">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-medium px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-white/[0.06] select-none transition-colors group-hover:border-slate-300 dark:group-hover:border-white/[0.12]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400/70 dark:bg-slate-500/70" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
