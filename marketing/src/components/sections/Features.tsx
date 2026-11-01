import { siteConfig, type FeatureItem } from "@/config/site";
import {
  Smartphone,
  ShieldCheck,
  Sparkles,
  FolderArchive,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<FeatureItem["icon"], LucideIcon> = {
  smartphone: Smartphone,
  shieldCheck: ShieldCheck,
  sparkles: Sparkles,
  folderArchive: FolderArchive,
};

interface FeatureTheme {
  iconBox: string;
  badge: string;
  radialGlow: string;
  cardHoverBorder: string;
  cardHoverShadow: string;
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

        {/* 2x2 Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 max-w-5xl mx-auto">
          {features.items.map((feature) => {
            const Icon = iconMap[feature.icon] || Smartphone;
            const theme =
              featureThemes[feature.id] || featureThemes.frames;
            const tags = featureTags[feature.id] || [];

            return (
              <div
                key={feature.id}
                className={`group relative rounded-[24px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden
                  bg-white dark:bg-[#0c1222]
                  border border-slate-200/90 dark:border-white/[0.08]
                  shadow-[0_2px_12px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.02),inset_0_1px_0_rgba(255,255,255,0.95)]
                  dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${theme.cardHoverBorder}
                  ${theme.cardHoverShadow}
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
                  <h3 className="text-[19px] sm:text-[20px] font-extrabold text-[#0f172a] dark:text-white tracking-[-0.015em] leading-snug transition-colors">
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
