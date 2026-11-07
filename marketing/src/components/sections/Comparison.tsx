"use client";

import { siteConfig } from "@/config/site";

interface BeatItem {
  id: string;
  category: string;
  solutionTitle: string;
  solutionDesc: string;
  problemTitle: string;
  colSpan: string;
  icon: React.ReactNode;
  hoverBorder: string;
}

const BEATS_DATA: BeatItem[] = [
  {
    id: "beat-1",
    category: "Team Access & Handoff",
    solutionTitle: "Preview listings without developer accounts",
    solutionDesc:
      "Finalize store pages before release. Hand over paste-ready copy and compliant assets to developers without confusion.",
    problemTitle: "Marketers drafting blindly in Google Docs without device limits or context",
    colSpan: "md:col-span-7",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-teal-500 dark:text-teal-400"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    hoverBorder: "hover:border-teal-500/40 dark:hover:border-teal-500/40",
  },
  {
    id: "beat-2",
    category: "Release Planning",
    solutionTitle: "Know what updates live vs. what requires a new release",
    solutionDesc:
      "Plan promotional campaigns on your timeline, and only loop in engineering when an app binary rebuild is truly needed.",
    problemTitle: "Zero visibility into whether copy edits need a full developer compilation",
    colSpan: "md:col-span-5",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-rose-500 dark:text-rose-400"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
    hoverBorder: "hover:border-rose-500/40 dark:hover:border-rose-500/40",
  },
  {
    id: "beat-3",
    category: "Visual Accuracy",
    solutionTitle: "Authentic multi-device mockups across phones & tablets",
    solutionDesc:
      "Inspect listings in real time across phone and tablet screens. Catch awkward truncations and layout breaks long before launch.",
    problemTitle: "Typing copy into raw form inputs leaves you guessing until the app is already live",
    colSpan: "md:col-span-5",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-fuchsia-500 dark:text-fuchsia-400"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    hoverBorder: "hover:border-fuchsia-500/40 dark:hover:border-fuchsia-500/40",
  },
  {
    id: "beat-4",
    category: "Pricing & Privacy",
    solutionTitle: "One-time purchase · 100% offline and private",
    solutionDesc:
      "A self-contained HTML studio running entirely in your browser. Zero subscriptions, zero cloud logins, and complete data privacy.",
    problemTitle: "$29/mo recurring subscriptions & third-party cloud lock-in for simple asset previews",
    colSpan: "md:col-span-7",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-500 dark:text-amber-400"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    hoverBorder: "hover:border-amber-500/40 dark:hover:border-amber-500/40",
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

        {/* Clean Bento Grid (Supabase / Vercel style) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {BEATS_DATA.map((item) => (
            <div
              key={item.id}
              className={`col-span-1 ${item.colSpan} flex flex-col justify-between group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] ${item.hoverBorder} shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden`}
            >
              <div>
                {/* Bare Colored Icon (No box container) */}
                <div className="mb-3.5 flex items-center">
                  {item.icon}
                </div>

                {/* Solution Title (Compact, Clean Typography) */}
                <h3 className="text-[15.5px] sm:text-[16.5px] font-bold text-[#0f172a] dark:text-white leading-snug tracking-tight mb-2">
                  {item.solutionTitle}
                </h3>

                {/* Solution Description */}
                <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.solutionDesc}
                </p>
              </div>

              {/* Bottom Problem Contrast */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400">
                  <svg
                    width="14"
                    height="14"
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
