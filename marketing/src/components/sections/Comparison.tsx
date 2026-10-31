import { siteConfig } from "@/config/site";
import { Check, X } from "lucide-react";

export function Comparison() {
  const { comparison } = siteConfig;

  return (
    <section id="comparison" className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            {comparison.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {comparison.title}
          </h2>
        </div>

        {/* Comparison Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="p-4 sm:p-6 rounded-2xl border border-rose-950/40 bg-rose-950/10 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-rose-200 text-base sm:text-lg">
                {comparison.badColumnTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {comparison.badColumnSubtitle}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl border border-indigo-900/40 bg-indigo-950/20 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-200 text-base sm:text-lg">
                {comparison.goodColumnTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
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
              className="grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-800/80"
            >
              {/* Bad column */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                    {beat.number} / {beat.category}
                  </div>
                  <h4 className="text-base font-semibold text-slate-200 mb-2">
                    {beat.bad.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {beat.bad.description}
                  </p>
                </div>
              </div>

              {/* Good column */}
              <div className="p-6 sm:p-8 bg-indigo-950/10 flex flex-col justify-between">
                <div>
                  <div className="inline-block text-[11px] font-bold tracking-wider text-indigo-400 uppercase mb-2 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {beat.good.badge}
                  </div>
                  <h4 className="text-base font-semibold text-white mb-2">
                    {beat.good.title}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
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

