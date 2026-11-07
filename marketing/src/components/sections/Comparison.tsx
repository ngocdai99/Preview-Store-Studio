"use client";

import { siteConfig } from "@/config/site";

interface BeatItem {
  id: string;
  number: string;
  category: string;
  solutionTitle: string;
  solutionDesc: string;
  problemTitle: string;
  colSpan: string;
  accent: {
    pill: string;
    dot: string;
    borderHover: string;
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
    colSpan: "md:col-span-7",
    accent: {
      pill: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25",
      dot: "bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.6)]",
      borderHover: "hover:border-teal-500/40 dark:hover:border-teal-500/40",
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
    colSpan: "md:col-span-5",
    accent: {
      pill: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25",
      dot: "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]",
      borderHover: "hover:border-rose-500/40 dark:hover:border-rose-500/40",
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
    colSpan: "md:col-span-5",
    accent: {
      pill: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/25",
      dot: "bg-fuchsia-500 shadow-[0_0_6px_rgba(217,70,239,0.6)]",
      borderHover: "hover:border-fuchsia-500/40 dark:hover:border-fuchsia-500/40",
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
    colSpan: "md:col-span-7",
    accent: {
      pill: "bg-slate-200/70 dark:bg-white/10 text-slate-800 dark:text-white border-slate-300/80 dark:border-white/20",
      dot: "bg-slate-700 dark:bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]",
      borderHover: "hover:border-slate-400 dark:hover:border-white/30",
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

        {/* Clean Bento Grid (7+5 / 5+7) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {BEATS_DATA.map((item) => (
            <div
              key={item.id}
              className={`col-span-1 ${item.colSpan} flex flex-col justify-between group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] ${item.accent.borderHover} shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden`}
            >
              <div className="relative z-10">
                {/* Title as Pill Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border shadow-xs select-none ${item.accent.pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${item.accent.dot}`} />
                    <span>{item.number}</span>
                    <span className="opacity-40">/</span>
                    <span>{item.category}</span>
                  </span>
                </div>

                {/* Solution Block (Hero Value) */}
                <div className="space-y-2">
                  <h3 className="text-[17px] sm:text-[18.5px] font-bold text-[#0f172a] dark:text-white leading-snug tracking-[-0.01em]">
                    {item.solutionTitle}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.solutionDesc}
                  </p>
                </div>
              </div>

              {/* Bottom Problem Contrast */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
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
