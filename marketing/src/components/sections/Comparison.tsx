import { siteConfig } from "@/config/site";
import { Check, X } from "lucide-react";

export function Comparison() {
  const { comparison } = siteConfig;

  return (
    <section id="comparison" className="py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4">
            {comparison.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {comparison.title}
          </h2>
        </div>

        {/* Comparison Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="p-4 sm:p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base sm:text-lg">
                {comparison.badColumnTitle}
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                {comparison.badColumnSubtitle}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base sm:text-lg">
                {comparison.goodColumnTitle}
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                {comparison.goodColumnSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Editorial Beats */}
        <div className="space-y-4 sm:space-y-6">
          {comparison.beats.map((beat) => (
            <div
              key={beat.id}
              className="grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-border bg-card overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border shadow-sm"
            >
              {/* Bad column */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-muted uppercase mb-2">
                    {beat.number} / {beat.category}
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-2">
                    {beat.bad.title}
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {beat.bad.description}
                  </p>
                </div>
              </div>

              {/* Good column */}
              <div className="p-6 sm:p-8 bg-blue-500/5 flex flex-col justify-between">
                <div>
                  <div className="inline-block text-[11px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-2 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {beat.good.badge}
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-2">
                    {beat.good.title}
                  </h4>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {beat.good.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
