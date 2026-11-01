import { siteConfig } from "@/config/site";
import {
  Heart,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  Lock,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const pledgeIcons = {
  "no-rent": ShieldCheck,
  "local-privacy": Lock,
  "direct-support": MessageSquare,
};

export function AboutMaker() {
  const { aboutMaker } = siteConfig;

  return (
    <section className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#080d1a]/50 transition-colors relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Editorial Card Container */}
        <div className="relative rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 lg:p-12 overflow-hidden bg-white dark:bg-[#0c1222] border border-slate-200/90 dark:border-white/[0.08] shadow-[0_2px_12px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.02),inset_0_1px_0_rgba(255,255,255,0.95)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
          {/* Hairline reflection at top border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent pointer-events-none" />

          {/* Corner radial ambient glow */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: The Founder Letter / Manifesto (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Header Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[0.08em] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aboutMaker.badge}</span>
                </div>

                {/* Section Title */}
                <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.2] mb-6 text-balance">
                  {aboutMaker.title}
                </h2>

                {/* The Narrative Story */}
                <div className="space-y-4">
                  {/* Intro */}
                  <p className="text-[15.5px] font-semibold text-[#0f172a] dark:text-white leading-relaxed">
                    {aboutMaker.story[0]}
                  </p>

                  {/* Problem statement */}
                  <p className="text-[14.5px] leading-relaxed text-[#475569] dark:text-slate-300">
                    {aboutMaker.story[1]}
                  </p>

                  {/* Highlight Callout Pull-Quote */}
                  <div className="my-5 rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent border-l-4 border-purple-500 dark:border-purple-400 text-[14.5px] font-medium text-slate-800 dark:text-purple-200 leading-relaxed italic shadow-2xs">
                    &ldquo;{aboutMaker.story[2]}&rdquo;
                  </div>

                  {/* Human support guarantee */}
                  <p className="text-[14.5px] leading-relaxed text-[#475569] dark:text-slate-300">
                    {aboutMaker.story[3]}
                  </p>
                </div>
              </div>

              {/* Signature Sign-off */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-[#64748b] dark:text-slate-400 italic">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                  <span>{aboutMaker.signature}</span>
                </span>
              </div>
            </div>

            {/* Right Column: Maker Profile & 3 Pledges (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl p-6 sm:p-7 bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]">
              {/* Maker Header Profile */}
              <div>
                <div className="flex items-center gap-4 pb-6 border-b border-slate-200/70 dark:border-white/[0.06]">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 ring-2 ring-white dark:ring-[#0c1222] shrink-0">
                    <Terminal className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-[15.5px] text-[#0f172a] dark:text-white truncate">
                        Independent Craftsperson
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/15 shrink-0" />
                    </div>
                    <p className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
                      {aboutMaker.roleBadge}
                    </p>
                    <div className="mt-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        100% Bootstrapped
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Core Maker Pledges */}
                <div className="mt-6 space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500 mb-3">
                    The Indie Maker Pledges
                  </h4>

                  {aboutMaker.pledges?.map((pledge) => {
                    const Icon =
                      pledgeIcons[pledge.id as keyof typeof pledgeIcons] ||
                      ShieldCheck;

                    return (
                      <div
                        key={pledge.id}
                        className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06] shadow-2xs transition-colors hover:border-slate-300 dark:hover:border-white/[0.12]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div>
                          <h5 className="text-[13px] font-bold text-[#0f172a] dark:text-white leading-snug">
                            {pledge.title}
                          </h5>
                          <p className="text-[12px] text-[#64748b] dark:text-slate-400 leading-relaxed mt-0.5">
                            {pledge.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Support Note */}
              <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-white/[0.06] text-center">
                <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
                  Zero robot tickets · Direct answers from the developer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
