import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";

export function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* App Icon Centered */}
        <div className="mb-6 p-2 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-xl shadow-blue-500/10">
          <BrandIcon className="w-14 h-14" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>{hero.badge}</span>
        </div>

        {/* Main H1 */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.12]">
          Stop guessing how your app listing <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            looks before submitting.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          {hero.subheadline}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href={hero.primaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
          >
            <span>{hero.primaryCta.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={hero.secondaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-sm sm:text-base px-6 py-3 rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{hero.secondaryCta.label}</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400">
          {hero.trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

