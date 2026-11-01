import { siteConfig, type FeatureItem } from "@/config/site";
import {
  Smartphone,
  Search,
  CloudDownload,
  ShieldCheck,
  Sparkles,
  FolderArchive,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<FeatureItem["icon"], LucideIcon> = {
  smartphone: Smartphone,
  search: Search,
  cloudDownload: CloudDownload,
  shieldCheck: ShieldCheck,
  folderArchive: FolderArchive,
};

interface FeatureTheme {
  iconBox: string;
  badge: string;
}

const featureThemes: Record<string, FeatureTheme> = {
  frames: {
    iconBox:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-[#00D085] group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40",
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  },
  viewports: {
    iconBox:
      "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500/20 group-hover:border-sky-500/40",
    badge:
      "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25",
  },
  cloner: {
    iconBox:
      "bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500/20 group-hover:border-teal-500/40",
    badge:
      "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25",
  },
  compliance: {
    iconBox:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40",
    badge:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  },
  export: {
    iconBox:
      "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/40",
    badge:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
  },
};

const featureTags: Record<string, string[]> = {
  frames: [
    "iPhone & iPad",
    "Android & Tablets",
    "Light & Dark OS",
    "Store Viewports",
  ],
  viewports: [
    "Search Feed Ribbon",
    "Product Detail Page",
    "Dual-Phone Comparison",
  ],
  cloner: [
    "Live App Store Import",
    "Competitor Research",
    "Instant Draft Kickstart",
  ],
  compliance: [
    "Official Store Specs",
    "Aspect Ratio Verification",
    "Alpha Transparency Alert",
  ],
  export: [
    "4K Retina PNGs",
    "Client-Side ZIP",
    "LISTING_METADATA.md",
    "JSON Presets",
  ],
};

export function Features() {
  const { features } = siteConfig;

  return (
    <section
      id="features"
      className="pt-12 pb-20 sm:pt-14 sm:pb-24 border-t border-border bg-slate-50/50 dark:bg-[#131413] transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[0.08em] bg-emerald-500/10 dark:bg-[#00D085]/15 text-emerald-700 dark:text-[#00D085] border border-emerald-500/25 dark:border-[#00D085]/30 mb-3.5 shadow-[0_2px_8px_rgba(0,208,133,0.08)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00D085]" />
            <span>Features</span>
          </div>

          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {features.headline}
          </h2>

          <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-[#475569] dark:text-slate-400 max-w-[680px] mx-auto leading-relaxed text-balance">
            {features.subheadline}
          </p>
        </div>

        {/* 5-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {features.items.map((feature) => {
            const Icon = iconMap[feature.icon] || Smartphone;
            const theme =
              featureThemes[feature.id] || featureThemes.frames;
            const tags = featureTags[feature.id] || [];
            const isHeroCard = feature.id === "frames";

            return (
              <div
                key={feature.id}
                className={`group relative rounded-[24px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden
                  bg-white dark:bg-[#1D1E1D]
                  border border-slate-200/90 dark:border-white/[0.08]
                  hover:border-slate-300 dark:hover:border-white/[0.16]
                  shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]
                  transition-colors duration-200
                  ${isHeroCard ? "md:col-span-2 lg:col-span-2" : "col-span-1"}
                `}
              >
                {/* Hairline reflection at top border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/10 to-transparent pointer-events-none" />

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
