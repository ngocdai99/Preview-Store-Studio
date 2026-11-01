import { siteConfig } from "@/config/site";
import { Check, Sparkles, ArrowRight, Info, ChevronRight } from "lucide-react";

export function Pricing() {
  const { pricing } = siteConfig;

  return (
    <section id="pricing" className="py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Head */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <a
            href={siteConfig.gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pricing-announcement-banner group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 cursor-pointer select-none no-underline transition-all duration-200 ease-out hover:scale-[1.008] active:scale-[0.995] border backdrop-blur-md bg-[linear-gradient(135deg,rgba(139,92,246,0.14)_0%,rgba(59,130,246,0.10)_100%)] border-[rgba(139,92,246,0.38)] shadow-[0_4px_20px_-2px_rgba(139,92,246,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[rgba(139,92,246,0.6)] hover:shadow-[0_8px_28px_-4px_rgba(139,92,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] dark:bg-[linear-gradient(135deg,rgba(139,92,246,0.14)_0%,rgba(59,130,246,0.10)_100%)] dark:border-[rgba(139,92,246,0.38)] [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-[rgba(124,58,237,0.26)] [html:not(.dark)_&]:shadow-[0_4px_16px_rgba(124,58,237,0.08),0_1px_3px_rgba(15,23,42,0.04)] [html:not(.dark)_&]:hover:border-[rgba(124,58,237,0.5)] [html:not(.dark)_&]:hover:shadow-[0_8px_24px_rgba(124,58,237,0.14)]"
            aria-label={`${pricing.banner.tag}: ${pricing.banner.text}`}
          >
            {/* Glowing Pulse Dot */}
            <span className="announcement-pulse-dot relative flex h-2 w-2 shrink-0 items-center justify-center" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            </span>

            {/* Tag with Gradient Text */}
            <span className="announcement-tag text-[11px] font-extrabold tracking-[0.08em] uppercase shrink-0 leading-none bg-gradient-to-r from-purple-400 to-blue-400 dark:from-purple-300 dark:to-blue-400 [html:not(.dark)_&]:from-purple-700 [html:not(.dark)_&]:to-blue-600 bg-clip-text text-transparent">
              {pricing.banner.tag}
            </span>

            {/* Separator */}
            <span className="announcement-sep text-[12px] font-bold text-white/35 dark:text-white/35 [html:not(.dark)_&]:text-slate-400 shrink-0 leading-none" aria-hidden="true">
              ·
            </span>

            {/* Slogan Text */}
            <span className="announcement-text text-[13px] sm:text-[13.5px] font-semibold text-slate-100 dark:text-slate-100 [html:not(.dark)_&]:text-slate-900 tracking-[-0.01em] leading-snug">
              {pricing.banner.text}
            </span>

            {/* Chevron Right Arrow */}
            <ChevronRight
              className="announcement-arrow w-3.5 h-3.5 shrink-0 text-purple-300 dark:text-purple-300 [html:not(.dark)_&]:text-purple-600 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            {pricing.title}
          </h2>
          <p className="mt-4 text-muted text-base">{pricing.description}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all shadow-sm ${
                tier.isPopular
                  ? "bg-card border-2 border-indigo-500/70 shadow-xl shadow-indigo-500/10"
                  : "bg-card border border-border hover:border-foreground/20"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3 right-8 px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {pricing.mostPopularBadge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-card-muted text-muted border border-border tracking-wider">
                    {tier.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted mb-6 leading-relaxed">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-border">
                  <span className="text-muted line-through text-lg">
                    {tier.price.currency}
                    {tier.price.original}
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground">
                    {tier.price.currency}
                    {tier.price.current}
                  </span>
                  <span className="text-xs text-muted font-medium">
                    /{tier.price.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-card-muted text-foreground flex items-center justify-center flex-shrink-0 border border-border">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                      <span
                        className={
                          feature.isPrimary
                            ? "font-semibold text-foreground"
                            : "text-foreground/80"
                        }
                      >
                        {feature.text}
                        {feature.tag && (
                          <span className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-card-muted text-muted border border-border">
                            {feature.tag}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buy CTA */}
              <a
                href={tier.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-scale w-full inline-flex items-center justify-center gap-2 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                  tier.isPopular
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                    : "bg-card-muted hover:bg-card text-foreground border border-border"
                }`}
              >
                <span>{tier.cta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
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
      </div>
    </section>
  );
}
