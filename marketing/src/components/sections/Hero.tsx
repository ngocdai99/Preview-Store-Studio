import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section id="hero" className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Background Soft Supabase Emerald Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-emerald-500/18 via-[#00D085]/14 to-[#006636]/22 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Main H1 */}
        <h1 className="text-[34px] sm:text-[46px] lg:text-[56px] font-extrabold tracking-[-0.03em] max-w-4xl mx-auto mb-5 leading-[1.15] text-[#0f172a] [html:not(.dark)_&]:bg-[linear-gradient(180deg,#0f172a_40%,#334155_100%)] [html:not(.dark)_&]:bg-clip-text [html:not(.dark)_&]:text-transparent dark:text-white dark:bg-[linear-gradient(180deg,#ffffff_40%,#94a3b8_100%)] dark:bg-clip-text dark:text-transparent">
          {hero.titleLead} <br className="hidden sm:inline" />
          {hero.titleAccent}
        </h1>

        {/* Sub-headline */}
        <p className="hero-sub text-[16.5px] sm:text-[18.26px] text-[#475569] dark:text-slate-400 max-w-[820px] mx-auto mb-6 leading-[1.6]">
          <span>{hero.subheadlineLead || "Save 2 hours of back-and-forth with your client before every App Store submission."}</span>
          <br className="hidden sm:inline" />{" "}
          <span>{hero.subheadlineFollow || "App Store Connect & Google Play provide zero live preview — preview and refine your listings with confidence."}</span>
        </p>

        {/* CTAs */}
        <div className="mt-1 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <PrimaryButton
            href={hero.primaryCta.href}
            fontSize="15px"
            fontWeight={700}
            className="w-full sm:w-auto h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-xl sm:rounded-[14px]"
          >
            <span>{hero.primaryCta.label}</span>
          </PrimaryButton>

          <a
            href={hero.secondaryCta.href}
            className="group w-full sm:w-auto inline-flex items-center justify-center h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-xl sm:rounded-[14px] bg-white dark:bg-[#1D1E1D] hover:bg-slate-50 dark:hover:bg-[#282a28] text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 font-semibold text-[14.5px] sm:text-[15.5px] tracking-[-0.01em] transition-colors duration-150 shadow-xs"
          >
            <span>{hero.secondaryCta.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
