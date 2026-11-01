"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Sparkles, ArrowRight, Info, ChevronRight } from "lucide-react";
import { LaunchModal } from "@/components/ui/LaunchModal";

export function Pricing() {
  const { pricing } = siteConfig;
  const [selectedTier, setSelectedTier] = useState<"plus" | "pro" | null>(null);

  return (
    <section id="pricing" className="py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Head */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <button
            type="button"
            onClick={() => setSelectedTier("plus")}
            className="pricing-announcement-banner group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 cursor-pointer select-none no-underline transition-all duration-200 ease-out hover:scale-[1.008] active:scale-[0.995] border backdrop-blur-md bg-[linear-gradient(135deg,rgba(139,92,246,0.14)_0%,rgba(59,130,246,0.10)_100%)] border-[rgba(139,92,246,0.38)] shadow-[0_4px_20px_-2px_rgba(139,92,246,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_8px_28px_-4px_rgba(139,92,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] dark:bg-[linear-gradient(135deg,rgba(139,92,246,0.14)_0%,rgba(59,130,246,0.10)_100%)] dark:border-[rgba(139,92,246,0.38)] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-[rgba(124,58,237,0.26)] [html:not(.dark)_&]:shadow-[0_4px_16px_rgba(124,58,237,0.08),0_1px_3px_rgba(15,23,42,0.04)] [html:not(.dark)_&]:hover:border-[rgba(124,58,237,0.5)] [html:not(.dark)_&]:hover:shadow-[0_8px_24px_rgba(124,58,237,0.14)]"
            aria-label={`${pricing.banner.tag}: ${pricing.banner.text}`}
          >
            {/* Glowing Pulse Dot */}
            <span
              className="announcement-pulse-dot relative flex h-2 w-2 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            </span>

            {/* Tag with Gradient Text */}
            <span className="announcement-tag text-[11px] font-extrabold tracking-[0.08em] uppercase shrink-0 leading-none bg-gradient-to-r from-purple-400 to-blue-400 dark:from-purple-300 dark:to-blue-400 [html:not(.dark)_&]:from-purple-700 [html:not(.dark)_&]:to-blue-600 bg-clip-text text-transparent">
              {pricing.banner.tag}
            </span>

            {/* Separator */}
            <span
              className="announcement-sep text-[12px] font-bold text-white/35 dark:text-white/35 [html:not(.dark)_&]:text-slate-400 shrink-0 leading-none"
              aria-hidden="true"
            >
              ·
            </span>

            {/* Slogan Text */}
            <span className="announcement-text text-[13px] sm:text-[13.5px] font-semibold text-slate-100 dark:text-slate-100 [html:not(.dark)_&]:text-slate-900 tracking-[-0.01em] leading-snug">
              {pricing.banner.text}
            </span>

            {/* Chevron Right Arrow */}
            <ChevronRight className="announcement-arrow w-3.5 h-3.5 shrink-0 text-purple-300 dark:text-purple-300 [html:not(.dark)_&]:text-purple-600 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

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
                className={`relative rounded-[26px] p-6 sm:px-7 sm:py-8 flex flex-col justify-between transition-all duration-300 ease-out bg-white dark:bg-[#0c1222] border-2 border-transparent shadow-[0_4px_24px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] ${
                  tier.isPopular
                    ? "hover:border-purple-500/50 dark:hover:border-purple-400/45 hover:shadow-[0_12px_36px_-6px_rgba(15,23,42,0.1),0_0_28px_rgba(139,92,246,0.15)] dark:hover:shadow-[0_14px_40px_-6px_rgba(0,0,0,0.5),0_0_28px_rgba(139,92,246,0.22)]"
                    : "hover:border-blue-500/50 dark:hover:border-blue-400/45 hover:shadow-[0_12px_36px_-6px_rgba(15,23,42,0.1),0_0_28px_rgba(6,182,212,0.15)] dark:hover:shadow-[0_14px_40px_-6px_rgba(0,0,0,0.5),0_0_28px_rgba(6,182,212,0.22)]"
                }`}
              >
              <div>
                {/* Header row: Title + Tier Pill */}
                <div className="flex items-center gap-2.5 mb-3">
                  <h3
                    className={`text-[22px] font-bold tracking-tight ${
                      tier.isPopular
                        ? "bg-[linear-gradient(135deg,#c084fc_0%,#60a5fa_100%)] bg-clip-text text-transparent inline-block"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.isPopular ? (
                    <span className="inline-flex items-center justify-center text-[10px] font-extrabold tracking-[0.08em] uppercase text-white bg-[linear-gradient(to_right,#7c3aed_0%,#ec4899_100%)] px-2.5 py-0.5 rounded-full border border-white/40 shadow-[0_2px_8px_rgba(236,72,153,0.35)] leading-tight">
                      PRO
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center text-[10px] font-extrabold tracking-[0.08em] uppercase text-white bg-[linear-gradient(to_right,#1d4ed8_0%,#06b6d4_100%)] px-2.5 py-0.5 rounded-full border border-white/40 shadow-[0_2px_8px_rgba(6,182,212,0.35)] leading-tight">
                      PLUS
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
                          className="flex items-center gap-2.5 text-[13.5px] text-purple-700 dark:text-purple-300 font-semibold pb-3 mb-2 border-b border-purple-200/60 dark:border-purple-500/25"
                        >
                          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
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
                          className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5 stroke-[2.6]"
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
                                  : tier.isPopular
                                  ? "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-500/20"
                                  : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-500/20"
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
              <button
                type="button"
                onClick={() => setSelectedTier(tier.id as "plus" | "pro")}
                className={`btn-scale w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl sm:rounded-2xl font-bold text-[15px] text-white tracking-[-0.01em] transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] cursor-pointer ${
                  tier.isPopular
                    ? "bg-[linear-gradient(135deg,#7c3aed_0%,#9333ea_50%,#c026d3_100%)] hover:opacity-95 shadow-[0_4px_16px_rgba(168,85,247,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_24px_rgba(168,85,247,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]"
                    : "bg-[linear-gradient(to_right,#1d4ed8_0%,#06b6d4_100%)] hover:opacity-95 shadow-[0_4px_16px_rgba(6,182,212,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_24px_rgba(6,182,212,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]"
                }`}
              >
                <span>{tier.cta.label}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>

          {/* Scope Note */}
          <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card/60 flex items-start gap-3 text-xs sm:text-sm text-muted leading-relaxed">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.4)] flex items-start gap-3.5 sm:gap-4 transition-all">
              {/* Avatar with Static Status Indicator */}
              <div className="relative shrink-0">
                <Image
                  src="/kai.jpg"
                  alt="Kai"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200/90 dark:ring-white/15"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c1222]" />
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
