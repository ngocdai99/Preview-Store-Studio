"use client";

import { siteConfig } from "@/config/site";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section id="hero" className="relative pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 overflow-hidden">
      {/* Background Soft Emerald Aurora Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-emerald-500/15 via-[#00D085]/12 to-[#006636]/18 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Supabase-style Row Layout: Left (Title + CTAs) & Right (Description) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-14">
          {/* Left Column: Two-line Punchy Headline & CTAs */}
          <div className="lg:w-[58%] shrink-0">
            <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] xl:text-[52px] font-extrabold tracking-[-0.03em] leading-[1.12]">
              <span className="text-[#0f172a] dark:text-white block">
                {hero.titleLead}
              </span>
              <span className="text-emerald-700 dark:text-[#00D085] block mt-1">
                {hero.titleAccent}
              </span>
            </h1>

            {/* CTAs directly below headline (left-aligned) */}
            <div className="mt-7 sm:mt-8 flex flex-row items-center gap-3 sm:gap-3.5">
              <PrimaryButton
                href={hero.primaryCta.href}
                fontSize="14.5px"
                fontWeight={700}
                className="h-[44px] sm:h-[46px] px-5 sm:px-6 rounded-xl"
              >
                <span>{hero.primaryCta.label}</span>
              </PrimaryButton>

              <SecondaryButton
                href={hero.secondaryCta.href}
                fontSize="14.5px"
                fontWeight={600}
                className="h-[44px] sm:h-[46px] px-5 sm:px-6 rounded-xl"
              >
                <span>{hero.secondaryCta.label}</span>
              </SecondaryButton>
            </div>
          </div>

          {/* Right Column: Clean Descriptive Subtext */}
          <div className="lg:w-[42%] lg:pl-4">
            <p className="text-[15px] sm:text-[16px] lg:text-[16.5px] text-[#475569] dark:text-slate-400 leading-[1.65]">
              {hero.subheadlineLead || "Save 2 hours of back-and-forth before every App Store & Google Play submission."}{" "}
              {hero.subheadlineFollow || "App Store Connect & Google Play provide zero live preview — see exactly how your listing looks before submitting."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
