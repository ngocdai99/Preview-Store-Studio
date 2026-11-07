"use client";

import { siteConfig } from "@/config/site";

interface BeatItem {
  id: string;
  category: string;
  solutionTitle: string;
  solutionDesc: string;
  problemTitle: string;
  icon: React.ReactNode;
  hoverBorder: string;
}

const BEATS_DATA: BeatItem[] = [
  {
    id: "beat-1",
    category: "Team Access",
    solutionTitle: "Preview without developer accounts",
    solutionDesc:
      "Marketers validate and finalize store listings independently. Hand over paste-ready copy to developers.",
    problemTitle: "Drafting blindly in docs without device context",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-900 dark:text-white"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    hoverBorder: "hover:border-slate-300 dark:hover:border-white/30",
  },
  {
    id: "beat-2",
    category: "Release Planning",
    solutionTitle: "Live updates vs. binary releases",
    solutionDesc:
      "Instantly distinguish what changes go live on the fly versus what requires developers to compile a new build.",
    problemTitle: "Zero visibility into app rebuild requirements",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#80C8FF]"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
    hoverBorder: "hover:border-[#80C8FF]/40",
  },
  {
    id: "beat-3",
    category: "Visual Accuracy",
    solutionTitle: "Realistic phone & tablet mockups",
    solutionDesc:
      "Preview in real time across phone and tablet screens. Catch awkward text cutoffs long before release day.",
    problemTitle: "Guessing form fields until the app is already live",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#47C5FB]"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    hoverBorder: "hover:border-[#47C5FB]/40",
  },
  {
    id: "beat-4",
    category: "Pricing & Privacy",
    solutionTitle: "One-time purchase · 100% offline",
    solutionDesc:
      "Standalone HTML file stored locally in your browser. Zero subscriptions, zero cloud lock-in, complete privacy.",
    problemTitle: "$29/mo recurring subscriptions & cloud lock-in",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#FFFFDE]"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    hoverBorder: "hover:border-[#FFFFDE]/40",
  },
];

export function Comparison() {
  const { comparison } = siteConfig;

  return (
    <section
      id="comparison"
      className="py-16 sm:py-24 border-t border-border bg-background transition-colors relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2.5">
            {comparison.badge || "THE ADVANTAGE"}
          </span>
          <h2 className="text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.18] text-balance">
            {comparison.title}
          </h2>
        </div>

        {/* 4 Compact Cards Row (Matching Supabase template style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 items-stretch">
          {BEATS_DATA.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between group relative rounded-2xl p-5 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] ${item.hoverBorder} shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 overflow-hidden`}
            >
              <div>
                {/* Bare Colored Icon (No box container, clean Supabase style) */}
                <div className="mb-3 flex items-center">
                  {item.icon}
                </div>

                {/* Solution Title (Compact font size ~ 14-15px) */}
                <h3 className="text-[14.5px] sm:text-[15px] font-bold text-[#0f172a] dark:text-white leading-snug tracking-tight mb-1.5">
                  {item.solutionTitle}
                </h3>

                {/* Solution Description */}
                <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.solutionDesc}
                </p>
              </div>

              {/* Bottom Problem Contrast */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 mt-0.5 text-slate-400 dark:text-slate-500"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                  <div className="text-[11.5px] leading-snug">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1">
                      Previously:
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
