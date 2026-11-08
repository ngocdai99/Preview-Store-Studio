"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section id="hero" className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
      {/* Background Soft Emerald Aurora Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-emerald-500/15 via-[#00D085]/12 to-[#006636]/18 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-12">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:w-[52%] shrink-0">
            <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] xl:text-[44px] font-medium tracking-[-0.02em] leading-[1.18] text-balance">
              <span className="text-[#0f172a] dark:text-white block">
                {hero.titleLead}
              </span>
              <span className="text-emerald-700 dark:text-[oklch(0.76_0.15_157.5)] block mt-1">
                {hero.titleAccent}
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 text-[15.5px] sm:text-[16.5px] text-[#475569] dark:text-[oklch(0.684_0.00275_157.5)] leading-[1.65] text-balance max-w-xl">
              <span>Save hours of back-and-forth before every store submission. </span>
              <span>Preview and verify your listings on realistic device frames before submitting.</span>
            </p>

            {/* CTAs */}
            <div className="mt-7 sm:mt-8 flex flex-row items-center gap-3">
              <PrimaryButton
                href={hero.primaryCta.href}
                fontSize="13.5px"
                fontWeight={600}
                className="h-[36px] sm:h-[38px] px-4 sm:px-5 rounded-lg shadow-sm"
              >
                <span>{hero.primaryCta.label}</span>
              </PrimaryButton>

              <SecondaryButton
                href={hero.secondaryCta.href}
                fontSize="13.5px"
                fontWeight={500}
                className="h-[36px] sm:h-[38px] px-4 sm:px-5 rounded-lg"
              >
                <span>{hero.secondaryCta.label}</span>
              </SecondaryButton>
            </div>

            {/* Micro Trust Indicators */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                No subscription
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Standalone offline HTML
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                App Store &amp; Google Play
              </span>
            </div>
          </div>

          {/* Right Column: Visual Product Mockup */}
          <div className="lg:w-[48%] flex items-center justify-center">
            <Link
              href="/try"
              className="group relative block w-full max-w-[500px] transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Open Interactive Live Demo"
            >
              {/* Radial glow around mockup */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-[#00D085]/15 to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity rounded-3xl" />
              
              <div className="relative rounded-2xl overflow-hidden p-2 sm:p-3 bg-slate-900/5 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.6)]">
                <Image
                  src="/hero-dual-mockup.webp"
                  alt="Store Preview Studio App Store & Google Play Mockup"
                  width={1024}
                  height={1016}
                  priority
                  className="w-full h-auto object-contain drop-shadow-md rounded-xl"
                />

                {/* Floating "Try Live Demo" pill overlay */}
                <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 text-white border border-white/20 text-[11.5px] font-medium shadow-lg backdrop-blur-md opacity-90 group-hover:opacity-100 group-hover:border-emerald-400/50 transition-all">
                  <span className="w-2 h-2 rounded-full bg-[#00D085] animate-pulse" />
                  <span>Try Demo Live</span>
                  <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
