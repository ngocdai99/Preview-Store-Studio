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

      <div className="max-w-7xl mx-auto">
        {/* Supabase-style Row Layout: Left (Title + CTAs) & Right (Description) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-14">
          {/* Left Column: Two-line Punchy Headline & CTAs */}
          <div className="lg:w-[58%] shrink-0">
            <h1 className="text-[26px] sm:text-[34px] lg:text-[38px] xl:text-[40px] font-medium tracking-[-0.02em] leading-[1.2] text-balance">
              <span className="text-[#0f172a] dark:text-white block">
                {hero.titleLead}
              </span>
              <span className="text-emerald-700 dark:text-[#00D085] block mt-1">
                {hero.titleAccent}
              </span>
            </h1>

            {/* CTAs directly below headline (left-aligned) */}
            <div className="mt-6 sm:mt-7 flex flex-row items-center gap-3">
              <PrimaryButton
                href={hero.primaryCta.href}
                fontSize="13.5px"
                fontWeight={600}
                className="h-[34px] sm:h-[36px] px-3.5 sm:px-4 rounded-lg"
              >
                <span>{hero.primaryCta.label}</span>
              </PrimaryButton>

              <SecondaryButton
                href={hero.secondaryCta.href}
                fontSize="13.5px"
                fontWeight={500}
                className="h-[34px] sm:h-[36px] px-3.5 sm:px-4 rounded-lg"
              >
                <span>{hero.secondaryCta.label}</span>
              </SecondaryButton>
            </div>
          </div>

          {/* Right Column: Clean Descriptive Subtext */}
          <div className="lg:w-[42%]">
            <p className="text-[16px] text-[#475569] dark:text-[oklch(0.684_0.00275_157.5)] leading-[1.65] text-balance">
              <span>Save 2 hours of back-and-forth before every store submission.</span>
              <span className="block mt-1 sm:mt-1.5">
                Preview and verify your listings on realistic device frames before submitting.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
