import { siteConfig } from "@/config/site";
import { Check, Sparkles, ArrowRight, Info } from "lucide-react";

export function Pricing() {
  const { pricing } = siteConfig;

  return (
    <section id="pricing" className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Head */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold">{pricing.banner.tag}</span>
            <span className="text-slate-500">·</span>
            <span>{pricing.banner.text}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {pricing.title}
          </h2>
          <p className="mt-4 text-slate-400 text-base">{pricing.description}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-12">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                tier.isPopular
                  ? "bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/10"
                  : "bg-slate-900/40 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 right-8 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${
                      tier.isPopular
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-slate-800/80">
                  <span className="text-slate-500 line-through text-lg">
                    {tier.price.currency}
                    {tier.price.original}
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {tier.price.currency}
                    {tier.price.current}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    /{tier.price.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tier.isPopular
                            ? "bg-indigo-500/20 text-indigo-400"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span
                        className={
                          feature.isPrimary
                            ? "font-semibold text-white"
                            : "text-slate-300"
                        }
                      >
                        {feature.text}
                        {feature.tag && (
                          <span className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
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
                className={`w-full inline-flex items-center justify-center gap-2 font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all shadow-md ${
                  tier.isPopular
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-500/25"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                <span>{tier.cta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Scope Note */}
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 flex items-start gap-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
          <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong className="text-slate-200">What’s covered:</strong>{" "}
              {pricing.scopeNote.covered}
            </p>
            <p>
              <strong className="text-slate-400">What’s not covered:</strong>{" "}
              {pricing.scopeNote.notCovered}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

