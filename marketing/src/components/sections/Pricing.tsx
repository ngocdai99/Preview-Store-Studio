"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function Pricing() {
  const { pricing } = siteConfig;

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

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 ${
                    tier.isPopular
                      ? "bg-white dark:bg-[#1D1E1D] border-2 border-slate-300 dark:border-white/20 shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
                      : "bg-white dark:bg-[#151615] border border-slate-200 dark:border-white/[0.08] shadow-sm"
                  }`}
                >
                  <div>
                    {/* Plan Header: Name & Most Popular Pill */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <h3 className="text-base sm:text-[17px] font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                        {tier.name}
                      </h3>
                      {tier.isPopular && (
                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.08] border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}
                    </div>

                    {/* Plan Description */}
                    <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-[#989A99] mb-5 leading-relaxed min-h-[38px]">
                      {tier.description}
                    </p>

                    {/* CTA Button placed right below description */}
                    <div className="mb-6">
                      {isPlus ? (
                        <a
                          href={tier.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative inline-flex items-center justify-center w-full h-[36px] sm:h-[38px] px-4 py-2 rounded-lg text-[13.5px] font-medium text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[oklch(0.95_0.00275_157.5_/_0.0328947)] dark:hover:bg-white/[0.08] border border-slate-300 dark:border-white/10 shadow-xs transition-colors duration-150 cursor-pointer select-none text-center"
                        >
                          <span>{tier.cta.label}</span>
                        </a>
                      ) : (
                        <PrimaryButton
                          href={tier.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          fontSize="13.5px"
                          fontWeight={600}
                          className="w-full h-[36px] sm:h-[38px] px-4 py-2 rounded-lg"
                        >
                          <span>{tier.cta.label}</span>
                        </PrimaryButton>
                      )}
                    </div>

                    {/* Price Display matching DevTools inspect: p.mt-2.pb-1.font-mono.text-5xl */}
                    <div className="mb-6 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
                      <span className="text-[11px] font-normal uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        One-time purchase
                      </span>
                      <div className="flex items-baseline gap-2">
                        {tier.price.original && (
                          <span className="font-mono text-xl sm:text-2xl text-slate-400 dark:text-slate-600 line-through">
                            ${tier.price.original}
                          </span>
                        )}
                        <p className="mt-2 pb-1 font-mono text-4xl sm:text-[46px] font-medium text-slate-900 dark:text-[oklch(0.95_0.00275_157.5)] leading-none tracking-tight">
                          ${tier.price.current}
                        </p>
                        <span className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-normal">
                          / lifetime
                        </span>
                      </div>
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
                                  <span
                                    className={`inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide border whitespace-nowrap shrink-0 ${
                                      feature.tag === "src/" ||
                                      feature.tag === "build.js" ||
                                      feature.tag === ".html"
                                        ? "font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                                        : "bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10"
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
    </section>
  );
}
