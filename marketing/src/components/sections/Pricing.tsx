"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Sparkles, Info } from "lucide-react";
import { LaunchModal } from "@/components/ui/LaunchModal";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function Pricing() {
  const { pricing } = siteConfig;
  const [selectedTier, setSelectedTier] = useState<"plus" | "pro" | null>(null);

  return (
    <section id="pricing" className="py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Head */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {pricing.title}
          </h2>
          <p className="mt-4 text-muted text-base text-balance">{pricing.description}</p>
        </div>

        {/* Pricing Content Container (Optimized width so tags and lines never awkwardly wrap) */}
        <div className="max-w-[1020px] mx-auto">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 items-stretch mb-10">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.id}
                className="relative rounded-[26px] p-6 sm:px-7 sm:py-8 flex flex-col justify-between transition-colors duration-200 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
              >
              {/* Top hairline accent line */}
              <div
                className={`absolute top-0 inset-x-0 h-[2px] rounded-t-[26px] bg-gradient-to-r ${
                  tier.isPopular
                    ? "from-[#00D085] via-emerald-400 to-transparent"
                    : "from-slate-700/60 via-slate-500/30 to-transparent dark:from-white/30 dark:via-white/10 to-transparent"
                }`}
              />

              <div>
                {/* Header row: Title on left, License Scope on right */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">
                    {tier.name}
                  </h3>

                  {tier.isPopular ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.08] px-2.5 py-1 rounded-md border border-slate-300/80 dark:border-white/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                      Commercial License
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[11px] font-medium tracking-wide text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.05] px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-white/[0.08]">
                      Personal License
                    </span>
                  )}
                </div>

                <p className="text-[13.5px] text-slate-600 dark:text-slate-400 mb-6 leading-relaxed min-h-[42px]">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 mb-7 pb-6 border-b border-slate-100 dark:border-white/[0.08]">
                  <span className="text-2xl sm:text-[26px] font-bold text-slate-400 dark:text-slate-500 line-through tracking-tight">
                    {tier.price.currency}
                    {tier.price.original}
                  </span>
                  <span className="text-4xl sm:text-[50px] font-black text-slate-900 dark:text-white leading-none tracking-[-0.03em]">
                    {tier.price.currency}
                    {tier.price.current}
                  </span>
                  <span className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 ml-1">
                    {tier.price.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature, i) => {
                    if (feature.isPrimary) {
                      return (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-[13.5px] text-slate-900 dark:text-white font-semibold pb-3 mb-2 border-b border-slate-200 dark:border-white/10"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-500 dark:text-[#00D085] shrink-0" />
                          <span>
                            <strong className="text-slate-900 dark:text-white font-bold">
                              {feature.text.replace(", plus:", "")}
                            </strong>
                            , plus:
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[13.5px] sm:text-[14px] text-slate-700 dark:text-slate-200 leading-snug"
                      >
                        <svg
                          className="w-4 h-4 shrink-0 mt-0.5 stroke-[2.6] text-emerald-500 dark:text-[#00D085]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="flex-1">
                          <span>{feature.text}</span>
                          {feature.tag && (
                            <span
                              className={`inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide border whitespace-nowrap shrink-0 ${
                                feature.tag === "src/" ||
                                feature.tag === "build.js" ||
                                feature.tag === ".html"
                                  ? "font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 rounded-md"
                                  : "bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10"
                              }`}
                            >
                              {feature.tag}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Buy CTA */}
              {tier.isPopular ? (
                <PrimaryButton
                  onClick={() => setSelectedTier(tier.id as "plus" | "pro")}
                  fontSize="15px"
                  fontWeight={700}
                  className="w-full h-12 rounded-xl sm:rounded-2xl tracking-[-0.01em]"
                >
                  <span>{tier.cta.label}</span>
                </PrimaryButton>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedTier(tier.id as "plus" | "pro")}
                  className="w-full inline-flex items-center justify-center h-12 rounded-xl sm:rounded-2xl font-bold text-[15px] tracking-[-0.01em] bg-slate-900 hover:bg-slate-800 text-white dark:bg-[#121312] dark:hover:bg-[#1e1f1e] dark:text-white border border-slate-700/80 dark:border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_0_rgba(0,0,0,0.15)] transition-all duration-150 cursor-pointer"
                >
                  <span>{tier.cta.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>

          {/* Scope Note */}
          <div className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-[#1D1E1D] flex items-start gap-3 text-xs sm:text-sm text-muted leading-relaxed">
            <Info className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                <strong className="text-foreground">{pricing.scopeNote.coveredLabel}</strong>{" "}
                {pricing.scopeNote.covered}
              </p>
              <p>
                <strong className="text-muted">{pricing.scopeNote.notCoveredLabel}</strong>{" "}
                {pricing.scopeNote.notCovered}
              </p>
            </div>
          </div>

          {/* Founder Note from Kai */}
          <div className="mt-8 max-w-lg mx-auto w-full">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-[#1D1E1D] border border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.4)] flex items-start gap-3.5 sm:gap-4 transition-all">
              {/* Avatar with Static Status Indicator */}
              <div className="relative shrink-0">
                <Image
                  src="/kai.jpg"
                  alt="Kai"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200/90 dark:ring-white/15"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#006636] ring-2 ring-white dark:ring-[#1D1E1D]" />
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[13px] font-bold text-slate-900 dark:text-white">Kai</span>
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300">
                    Kai DevLabs
                  </span>
                </div>
                <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;I built Store Preview Studio for my own daily app workflow. If you ever need a new device frame or hit a bug, just reply to your receipt email &mdash; no bots, no ticket queues.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Early Bird Launch Modal */}
      {selectedTier !== null && (
        <LaunchModal
          isOpen={true}
          onClose={() => setSelectedTier(null)}
          tierId={selectedTier}
        />
      )}
    </section>
  );
}
