import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section id="hero" className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Background Soft Indigo Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-purple-500/15 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Hero Brand App Icon */}
        <div className="hero-icon-container mb-5 flex justify-center">
          <div className="hero-app-icon w-[72px] h-[72px] rounded-[17px] cursor-pointer select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_14px_32px_-6px_rgba(59,130,246,0.28),0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_36px_-6px_rgba(99,102,241,0.42),0_0_0_1px_rgba(255,255,255,0.18)] hover:-translate-y-1 hover:scale-105 hover:-rotate-[4deg] hover:shadow-[0_20px_42px_-6px_rgba(59,130,246,0.38),0_0_0_1px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_22px_46px_-6px_rgba(99,102,241,0.55),0_0_0_1px_rgba(255,255,255,0.3)]">
            <BrandIcon className="w-full h-full rounded-[17px]" />
          </div>
        </div>

        {/* Category Badge Pill */}
        <div className="hero-badge group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 cursor-default select-none transition-all duration-200 ease-out hover:scale-[1.015] bg-white/95 dark:bg-white/[0.05] backdrop-blur-md border border-slate-200/90 dark:border-white/[0.12] hover:border-slate-300 dark:hover:border-white/[0.22] shadow-[0_2px_10px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_4px_16px_rgba(15,23,42,0.08),inset_0_1px_0_#ffffff] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.14)]">
          {/* Calm Static Purple Dot */}
          <span className="badge-dot relative flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#8b5cf6] shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
          </span>
          <span className="text-[13px] sm:text-[13.5px] font-medium tracking-[-0.01em] text-[#334155] dark:text-[#cbd5e1] group-hover:text-[#0f172a] dark:group-hover:text-white transition-colors duration-150">
            {hero.badge}
          </span>
        </div>

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
          <Link
            href={hero.primaryCta.href}
            className="btn-scale group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-xl sm:rounded-[14px] bg-[linear-gradient(135deg,#3b82f6_0%,#6366f1_50%,#8b5cf6_100%)] hover:bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_50%,#7c3aed_100%)] text-white font-bold text-[14.5px] sm:text-[15.5px] tracking-[-0.01em] shadow-[0_4px_16px_rgba(99,102,241,0.28),inset_0_1px_0_rgba(255,255,255,0.32)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.42),inset_0_1px_0_rgba(255,255,255,0.42)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{hero.primaryCta.label}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href={hero.secondaryCta.href}
            className="btn-scale group w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-xl sm:rounded-[14px] bg-white dark:bg-[#0e1526] hover:bg-slate-50 dark:hover:bg-[#152038] text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 font-semibold text-[14.5px] sm:text-[15.5px] tracking-[-0.01em] transition-all duration-200 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_14px_rgba(15,23,42,0.08)] hover:scale-[1.01] active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 transition-transform duration-200 group-hover:rotate-12" />
            <span>{hero.secondaryCta.label}</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-7 pt-5 border-t border-border flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-muted">
          {hero.trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
