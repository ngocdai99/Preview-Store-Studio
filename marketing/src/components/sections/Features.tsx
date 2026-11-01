import { siteConfig, type FeatureItem } from "@/config/site";
import {
  Smartphone,
  Search,
  CloudDownload,
  ShieldCheck,
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
      className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#080d1a]/50 transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
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
            const tags = featureTags[feature.id] || [];
            const isHeroCard = feature.id === "frames";

            return (
              <div
                key={feature.id}
                className={`group relative rounded-[24px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden
                  bg-white dark:bg-[#0c1222]
                  border border-slate-200/90 dark:border-white/[0.08]
                  shadow-[0_2px_12px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.02),inset_0_1px_0_rgba(255,255,255,0.95)]
                  dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]
                  hover:border-slate-300 dark:hover:border-white/[0.16]
                  hover:shadow-[0_12px_32px_-8px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.45)]
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${isHeroCard ? "md:col-span-2 lg:col-span-2" : "col-span-1"}
                `}
              >
                {/* Hairline reflection at top border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  {/* Clean Icon Container */}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-[14px] bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-white/[0.08] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/40 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
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
