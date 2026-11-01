import { siteConfig } from "@/config/site";
import { Star, Quote, Sparkles, CheckCircle2 } from "lucide-react";

interface TestimonialTheme {
  avatarGradient: string;
  badge: string;
  badgeBorder: string;
  radialGlow: string;
  hoverBorder: string;
  hoverShadow: string;
  personaTag: string;
}

const cardThemes: Record<string, TestimonialTheme> = {
  "Alex Rivera": {
    avatarGradient: "from-blue-500 to-indigo-600",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-500/25",
    radialGlow: "from-blue-500/15 via-indigo-500/10 to-transparent",
    hoverBorder: "hover:border-blue-500/40 dark:hover:border-blue-500/40",
    hoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(59,130,246,0.25)]",
    personaTag: "Indie Founder",
  },
  "Marcus Vance": {
    avatarGradient: "from-purple-500 to-violet-600",
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-500/25",
    radialGlow: "from-purple-500/15 via-violet-500/10 to-transparent",
    hoverBorder: "hover:border-purple-500/40 dark:hover:border-purple-500/40",
    hoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(168,85,247,0.25)]",
    personaTag: "ASO Agency",
  },
  "Elena Rostova": {
    avatarGradient: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-500/25",
    radialGlow: "from-emerald-500/15 via-teal-500/10 to-transparent",
    hoverBorder: "hover:border-emerald-500/40 dark:hover:border-emerald-500/40",
    hoverShadow:
      "hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_24px_48px_-15px_rgba(16,185,129,0.25)]",
    personaTag: "Lead Designer",
  },
};

export function Testimonials() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#080d1a]/50 transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[0.08em] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-4 shadow-[0_2px_8px_rgba(168,85,247,0.06)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{testimonials.badge}</span>
          </div>

          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {testimonials.title}
          </h2>

          {testimonials.subtitle && (
            <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-[#475569] dark:text-slate-400 max-w-[620px] mx-auto leading-relaxed text-balance">
              {testimonials.subtitle}
            </p>
          )}
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {testimonials.items.map((item) => {
            const theme = cardThemes[item.author] || cardThemes["Alex Rivera"];

            return (
              <div
                key={item.author}
                className={`group relative rounded-[24px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden
                  bg-white dark:bg-[#0c1222]
                  border border-slate-200/90 dark:border-white/[0.08]
                  shadow-[0_2px_12px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.02),inset_0_1px_0_rgba(255,255,255,0.95)]
                  dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${theme.hoverBorder}
                  ${theme.hoverShadow}
                `}
              >
                {/* Hairline reflection at top border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent pointer-events-none" />

                {/* Subtle corner radial glow on hover */}
                <div
                  className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${theme.radialGlow} blur-3xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Top Row: Stars + Rating Badge + Quote Watermark */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.3)]"
                            />
                          ))}
                        </div>
                        <span className="text-[11.5px] font-extrabold text-amber-600 dark:text-amber-400 ml-1">
                          5.0
                        </span>
                      </div>

                      <Quote className="w-7 h-7 text-slate-300/70 dark:text-white/10 stroke-[1.8] group-hover:text-purple-500/30 dark:group-hover:text-purple-400/30 transition-colors" />
                    </div>

                    {/* Highlight Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.03em] uppercase px-3 py-1 rounded-full border shadow-2xs transition-colors ${theme.badge} ${theme.badgeBorder}`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{item.highlight}</span>
                      </span>
                    </div>

                    {/* Quote Content */}
                    <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-[#334155] dark:text-slate-300 font-normal">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author Profile Footer */}
                  <div className="pt-5 mt-6 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center text-xs font-extrabold text-white shadow-sm ring-2 ring-white dark:ring-[#0c1222] shrink-0`}
                      >
                        {item.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[14px] font-bold text-[#0f172a] dark:text-white truncate">
                            {item.author}
                          </h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/15 shrink-0" />
                        </div>
                        <p className="text-[12px] text-[#64748b] dark:text-slate-400 truncate">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-white/[0.06] shrink-0 hidden sm:inline-block">
                      {theme.personaTag}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Proof Metric Ribbon */}
        <div className="mt-10 sm:mt-12 max-w-3xl mx-auto rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.02] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-white dark:ring-[#0c1222] flex items-center justify-center text-[10px] font-bold text-white shadow-2xs">
                AR
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 ring-2 ring-white dark:ring-[#0c1222] flex items-center justify-center text-[10px] font-bold text-white shadow-2xs">
                MV
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 ring-2 ring-white dark:ring-[#0c1222] flex items-center justify-center text-[10px] font-bold text-white shadow-2xs">
                ER
              </div>
            </div>
            <div className="text-xs sm:text-[13px] font-semibold text-[#0f172a] dark:text-white">
              Rated <strong className="text-amber-500 dark:text-amber-400 font-extrabold">5.0 / 5.0</strong> by mobile developers & agencies
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Verified Customer Feedback</span>
          </div>
        </div>
      </div>
    </section>
  );
}
