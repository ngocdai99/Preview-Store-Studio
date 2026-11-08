"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAgency } from "@/context/AgencyContext";

export function Pricing() {
  const { pricing } = siteConfig;
  const { isAgencyVip } = useAgency();

  const handleProClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isAgencyVip) {
      e.preventDefault();
      window.open(
        "https://kaidevlabs.gumroad.com/l/store-preview-studio/AGENCY39",
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <section id="pricing" className="py-20 border-t border-border bg-slate-50/50 dark:bg-[#131413] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Head */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <h2 className="section-title text-[22px] sm:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.2] text-balance">
            {pricing.title}
          </h2>
          <p className="mt-3 text-muted text-sm sm:text-base text-balance">{pricing.description}</p>
        </div>

        {/* Pricing Content Container (Clean Supabase Pricing Cards) */}
        <div className="max-w-[880px] mx-auto">
          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 items-stretch mb-10">
            {pricing.tiers.map((tier) => {
              const isPlus = tier.id === "plus";
              const showAgencyVipPro = !isPlus && isAgencyVip;
              const displayCurrentPrice = showAgencyVipPro ? 39 : tier.price.current;
              const displayCtaLabel = showAgencyVipPro ? "Buy Pro (Agency Locked-In) — $39" : tier.cta.label;
              const displayCtaHref = showAgencyVipPro
                ? "https://kaidevlabs.gumroad.com/l/store-preview-studio/AGENCY39"
                : tier.cta.href;

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 ${
                    !isPlus
                      ? "bg-white dark:bg-[#1D1E1D] border-2 border-slate-300 dark:border-white/20 shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
                      : "bg-white dark:bg-[#151615] border border-slate-200 dark:border-white/[0.08] shadow-sm"
                  }`}
                >
                  <div>
                    {/* Plan Header: Name */}
                    <div className="flex items-center justify-between gap-2.5 mb-2">
                      <h3 className="text-base sm:text-[17px] font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                        {tier.name}
                      </h3>
                      {showAgencyVipPro && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-[#00D085] border border-emerald-500/25">
                          Invited Agency Rate
                        </span>
                      )}
                    </div>

                    {/* Plan Description */}
                    <p className="text-[13px] sm:text-[13.5px] text-muted mb-4 leading-relaxed min-h-[38px]">
                      {tier.description}
                    </p>

                    {/* Price Display placed above CTA button */}
                    <div className="mb-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-[11px] font-normal text-muted mb-1.5">
                        <span className="uppercase tracking-wider">One-time purchase</span>
                        <span className="text-accent font-medium">
                          {showAgencyVipPro ? "Locked-in $39 outreach offer" : "First 20 copies"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        {tier.price.original && (
                          <span className="font-mono text-xl sm:text-2xl text-muted/60 line-through">
                            ${tier.price.original}
                          </span>
                        )}
                        {showAgencyVipPro && (
                          <span className="font-mono text-xl sm:text-2xl text-muted/60 line-through">
                            ${tier.price.current}
                          </span>
                        )}
                        <p className="font-mono text-4xl sm:text-[46px] font-medium text-foreground leading-none tracking-tight">
                          ${displayCurrentPrice}
                        </p>
                        <span className="text-xs sm:text-[13px] text-muted font-normal">
                          / lifetime
                        </span>
                      </div>
                    </div>

                    {/* CTA Button placed directly below Price */}
                    <div className="mb-6">
                      {isPlus ? (
                        <a
                          href={displayCtaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative inline-flex items-center justify-center w-full h-[38px] sm:h-[40px] px-4 py-2 rounded-lg text-[13.5px] font-medium text-foreground bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-border shadow-xs transition-colors duration-150 cursor-pointer select-none text-center"
                        >
                          <span>{displayCtaLabel}</span>
                        </a>
                      ) : (
                        <PrimaryButton
                          href={displayCtaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleProClick}
                          fontSize="13.5px"
                          fontWeight={600}
                          className="w-full h-[38px] sm:h-[40px] px-4 py-2 rounded-lg"
                        >
                          <span>{displayCtaLabel}</span>
                        </PrimaryButton>
                      )}
                    </div>

                    {/* Features Checklist */}
                    <div className="pt-2">
                      <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-200 block mb-3">
                        {isPlus ? "Includes:" : "Everything in Plus, plus:"}
                      </span>
                      <ul className="space-y-3">
                        {tier.features.map((feature, i) => {
                          if (feature.isPrimary) {
                            return null;
                          }
                          return (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-[13px] sm:text-[13.5px] text-slate-700 dark:text-slate-300 leading-snug"
                            >
                              <svg
                                className="w-4 h-4 shrink-0 mt-0.5 stroke-[2.4] text-emerald-500 dark:text-[#00D085]"
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
                                  <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[10.5px] font-normal tracking-wide bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-white/10 whitespace-nowrap shrink-0">
                                    {feature.tag}
                                  </span>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Founder Note from Kai */}
          <div className="mt-8 max-w-lg mx-auto w-full">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-[#1D1E1D] border border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] dark:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.4)] flex items-start gap-3.5 sm:gap-4 transition-all">
              {/* Avatar with Static Status Indicator */}
              <div className="relative shrink-0">
                <Image
                  src="/kai.webp"
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
    </section>
  );
}
