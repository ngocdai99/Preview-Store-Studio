import { siteConfig } from "@/config/site";

export function Comparison() {
  const { comparison } = siteConfig;

  return (
    <section id="comparison" className="py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="section-badge text-[12px] font-extrabold uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400 mb-3 block">
            {comparison.badge}
          </span>
          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {comparison.title}
          </h2>
        </div>

        {/* Editorial Stage Container */}
        <div className="max-w-5xl mx-auto rounded-[28px] p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#0b0f1b] border border-slate-200/90 dark:border-white/[0.08] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_20px_48px_-12px_rgba(15,23,42,0.06)] dark:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45)] transition-colors">
          {/* Stage Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-7 mb-7 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex flex-col">
              <h3 className="text-lg sm:text-[19px] font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5 leading-snug">
                {comparison.badColumnTitle}
              </h3>
              <p className="text-xs sm:text-[13px] font-medium text-[#475569] dark:text-slate-400">
                {comparison.badColumnSubtitle}
              </p>
            </div>
            <div className="flex flex-col md:border-l md:border-slate-100 dark:md:border-white/[0.06] md:pl-8 lg:pl-12">
              <h3 className="text-lg sm:text-[19px] font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5 leading-snug">
                {comparison.goodColumnTitle}
              </h3>
              <p className="text-xs sm:text-[13px] font-semibold text-blue-600 dark:text-blue-400">
                {comparison.goodColumnSubtitle}
              </p>
            </div>
          </div>

          {/* Editorial Beats */}
          <div className="flex flex-col">
            {comparison.beats.map((beat, idx) => (
              <div
                key={beat.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-6 sm:py-7 ${
                  idx > 0 ? "border-t border-slate-100 dark:border-white/[0.06]" : "pt-0"
                } transition-colors`}
              >
                {/* Bad column */}
                <div className="flex flex-col gap-1.5 justify-between">
                  <div>
                    <span className="font-mono text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#475569] dark:text-slate-400 mb-1.5 block">
                      {beat.number} / {beat.category}
                    </span>
                    <h4 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2">
                      {beat.bad.title}
                    </h4>
                    <p className="text-[13.5px] text-[#334155] dark:text-[#94a3b8] leading-relaxed">
                      {beat.bad.description}
                    </p>
                  </div>
                </div>

                {/* Good column */}
                <div className="flex flex-col gap-1.5 justify-between md:border-l md:border-slate-100 dark:md:border-white/[0.06] md:pl-8 lg:pl-12">
                  <div>
                    <span className="font-mono text-[10.5px] font-bold tracking-[0.08em] uppercase text-blue-600 dark:text-blue-400 mb-1.5 block">
                      {beat.good.badge}
                    </span>
                    <h4 className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-snug mb-2">
                      {beat.good.title}
                    </h4>
                    <p className="text-[13.5px] text-[#334155] dark:text-[#cbd5e1] leading-relaxed">
                      {beat.good.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
