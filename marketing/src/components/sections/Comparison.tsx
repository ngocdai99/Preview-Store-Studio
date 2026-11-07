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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

function CardView({ item }: { item: BeatItem }) {
  return (
    <div className="group relative rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300">
      {/* Subtle Top Hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

      {/* Card Category Header */}
      <div className="flex items-center gap-2 mb-3.5">
        <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          {item.number}
        </span>
        <span className="text-slate-300 dark:text-slate-700">·</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {item.category}
        </span>
      </div>

      {/* Main Solution Value */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-3">
          {/* Neutral / White Icon */}
          <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white flex items-center justify-center mt-0.5 border border-slate-200/80 dark:border-white/10">
            {item.icon}
          </div>
          <h3 className="text-[15.5px] sm:text-[16.5px] font-bold text-[#0f172a] dark:text-white leading-snug tracking-[-0.01em]">
            {item.solutionTitle}
          </h3>
        </div>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed pl-[44px]">
          {item.solutionDesc}
        </p>
      </div>

      {/* Subtle Hairline Divider */}
      <div className="my-3.5 border-t border-slate-100 dark:border-white/[0.06]" />

      {/* The Old Way Contrast (Clean Neutral Bullet) */}
      <div className="flex items-start gap-2.5 text-slate-500 dark:text-slate-400">
        <span className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full bg-slate-200/70 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400 flex items-center justify-center">
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
  );
}

export function Comparison() {
  const { comparison } = siteConfig;

  return (
    <section
      id="comparison"
      className="py-20 sm:py-28 border-t border-border bg-background transition-colors relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* 2 Staggered Parallel Columns (Song song, so le gần nhau, không đè hàng) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
          {/* Cột trái: Card 01 & Card 03 */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <CardView item={BEATS_DATA[0]} />
            <CardView item={BEATS_DATA[2]} />
          </div>

          {/* Cột phải: Card 02 & Card 04 (Lệch so le xuống một nhịp) */}
          <div className="flex flex-col gap-4 sm:gap-6 md:pt-10 lg:pt-12">
            <CardView item={BEATS_DATA[1]} />
            <CardView item={BEATS_DATA[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}
