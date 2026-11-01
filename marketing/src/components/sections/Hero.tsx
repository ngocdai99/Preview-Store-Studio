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
          {/* Glowing Pulse Dot */}
          <span className="badge-dot relative flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-sky-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0284c7] dark:bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
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
        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          {hero.subheadline}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href={hero.primaryCta.href}
            className="btn-scale w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{hero.primaryCta.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={hero.secondaryCta.href}
            className="btn-scale w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card hover:bg-card-muted text-foreground border border-border font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{hero.secondaryCta.label}</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-muted">
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
