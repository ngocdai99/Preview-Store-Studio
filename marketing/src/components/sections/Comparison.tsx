"use client";

import { siteConfig } from "@/config/site";

interface BeatItem {
  id: string;
  number: string;
  category: string;
  solutionTitle: string;
  solutionDesc: string;
  problemTitle: string;
  icon: React.ReactNode;
  colSpan: string;
  accent: {
    verticalLine: string;
    glow: string;
    borderHover: string;
    iconBg: string;
    numColor: string;
  };
}

const BEATS_DATA: BeatItem[] = [
  {
    id: "beat-1",
    number: "01",
    category: "Team Access & Handoff",
    solutionTitle: "Preview and validate listings without developer accounts",
    solutionDesc:
      "Finalize store pages before release. Hand over paste-ready copy and compliant assets to developers without confusion or back-and-forth.",
    problemTitle: "Marketers drafting blindly in Google Docs without device limits or context",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    colSpan: "md:col-span-7",
    accent: {
      verticalLine: "from-[#00D085] via-emerald-400/60 to-transparent",
      glow: "bg-[#00D085]/20 dark:bg-[#00D085]/25",
      borderHover: "hover:border-[#00D085]/40 dark:hover:border-[#00D085]/40",
      iconBg: "bg-[#00D085]/10 text-emerald-700 dark:text-[#00D085] border-emerald-500/25",
      numColor: "text-emerald-700 dark:text-[#00D085]",
    },
  },
  {
    id: "beat-2",
    number: "02",
    category: "Release Planning",
    solutionTitle: "Know what updates live vs. what requires a new release",
    solutionDesc:
      "Plan promotional campaigns on your timeline, and only loop in engineering when an app binary rebuild is truly needed.",
    problemTitle: "Zero visibility into whether copy edits need a full developer compilation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
    colSpan: "md:col-span-5",
    accent: {
      verticalLine: "from-indigo-500 via-violet-400/60 to-transparent",
      glow: "bg-indigo-500/20 dark:bg-indigo-500/25",
      borderHover: "hover:border-indigo-500/40 dark:hover:border-indigo-500/40",
      iconBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25",
      numColor: "text-indigo-700 dark:text-indigo-400",
    },
  },
  {
    id: "beat-3",
    number: "03",
    category: "Visual Accuracy",
    solutionTitle: "Authentic multi-device mockups across phones & tablets",
    solutionDesc:
      "Inspect listings in real time across phone and tablet screens. Catch awkward truncations and layout breaks long before release day.",
    problemTitle: "Typing copy into raw form inputs leaves you guessing until the app is already live",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    colSpan: "md:col-span-5",
    accent: {
      verticalLine: "from-sky-500 via-cyan-400/60 to-transparent",
      glow: "bg-sky-500/20 dark:bg-sky-500/25",
      borderHover: "hover:border-sky-500/40 dark:hover:border-sky-500/40",
      iconBg: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
      numColor: "text-sky-700 dark:text-sky-400",
    },
  },
  {
    id: "beat-4",
    number: "04",
    category: "Pricing & Privacy",
    solutionTitle: "One-time purchase · 100% offline and private",
    solutionDesc:
      "A self-contained HTML studio running entirely in your browser. Zero subscriptions, zero cloud logins, and complete data privacy.",
    problemTitle: "$29/mo recurring subscriptions & third-party cloud lock-in for simple asset previews",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    colSpan: "md:col-span-7",
    accent: {
      verticalLine: "from-amber-500 via-orange-400/60 to-transparent",
      glow: "bg-amber-500/20 dark:bg-amber-500/25",
      borderHover: "hover:border-amber-500/40 dark:hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
      numColor: "text-amber-700 dark:text-amber-400",
    },
  },
];

export function Comparison() {
  const { comparison } = siteConfig;

  return (
    <section
      id="comparison"
      className="py-20 sm:py-28 border-t border-border bg-background transition-colors relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-3">
            {comparison.badge || "THE ADVANTAGE"}
          </span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {comparison.title}
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            Replace fragmented spreadsheets and blind form submissions with an intuitive, offline workspace.
          </p>
        </div>

        {/* Rich Bento Grid (7+5 / 5+7) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {BEATS_DATA.map((item) => (
            <div
              key={item.id}
              className={`col-span-1 ${item.colSpan} flex flex-col justify-between group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] ${item.accent.borderHover} shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden pl-7 sm:pl-8`}
            >
              {/* Colorful Vertical Left Edge Highlight */}
              <div
                className={`absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b ${item.accent.verticalLine} opacity-95`}
              />

              {/* Ambient Glow emanating from the left edge */}
              <div
                className={`absolute -top-10 -left-10 w-36 h-36 rounded-full blur-2xl opacity-15 dark:opacity-25 pointer-events-none group-hover:opacity-35 dark:group-hover:opacity-45 transition-opacity duration-500 ${item.accent.glow}`}
              />

              <div className="relative z-10">
                {/* Card Header: Category & Number */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`font-mono text-[11.5px] font-bold ${item.accent.numColor}`}
                  >
                    {item.number}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.category}
                  </span>
                </div>

                {/* Solution Block (Hero Value) */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3.5">
                    {/* Themed Icon Container */}
                    <div
                      className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 border ${item.accent.iconBg}`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-[16px] sm:text-[17.5px] font-bold text-[#0f172a] dark:text-white leading-snug tracking-[-0.01em]">
                      {item.solutionTitle}
                    </h3>
                  </div>
                  <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed pl-[49px]">
                    {item.solutionDesc}
                  </p>
                </div>
              </div>

              {/* Bottom Problem Contrast */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400">
                  <span className="shrink-0 mt-1 w-3.5 h-3.5 rounded-full bg-slate-200/70 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400 flex items-center justify-center">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                  <div className="text-[12px] sm:text-[12.5px] leading-snug">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1.5">
                      The old way:
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.problemTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
