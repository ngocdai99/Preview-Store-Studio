import { siteConfig } from "@/config/site";

export function Comparison() {
  const { comparison } = siteConfig;

  return (
    <section id="comparison" className="py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#a78bfa] mb-3 font-mono">
            {comparison.badge}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground leading-[1.15]">
            {comparison.title}
          </h2>
        </div>

        {/* Unified Comparison Card with Delicate Dashed Dividers */}
        <div className="max-w-6xl mx-auto rounded-[28px] sm:rounded-[32px] border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0b0f1b] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-2xl dark:shadow-black/60 overflow-hidden transition-colors">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-dashed border-slate-200/80 dark:border-white/[0.08]">
            <div className="p-7 sm:p-10 lg:p-12 md:border-r md:border-dashed border-slate-200/80 dark:border-white/[0.08]">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
                {comparison.badColumnTitle}
              </h3>
              <p className="text-xs sm:text-[13.5px] font-medium text-[#334155] dark:text-slate-400">
                {comparison.badColumnSubtitle}
              </p>
            </div>
            <div className="p-7 sm:p-10 lg:p-12">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5">
                {comparison.goodColumnTitle}
              </h3>
              <p className="text-xs sm:text-[13.5px] font-medium text-[#a78bfa]">
                {comparison.goodColumnSubtitle}
              </p>
            </div>
          </div>

          {/* 4 Beats */}
          {comparison.beats.map((beat, idx) => {
            const isLast = idx === comparison.beats.length - 1;
            return (
              <div
                key={beat.id}
                className={`grid grid-cols-1 md:grid-cols-2 transition-colors ${
                  !isLast ? "border-b border-dashed border-slate-200/80 dark:border-white/[0.08]" : ""
                }`}
              >
                {/* Bad column */}
                <div className="p-7 sm:p-10 lg:p-12 md:border-r md:border-dashed border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between">
                  <div>
                    <span className="text-[10.5px] sm:text-[11px] font-bold tracking-wider text-[#475569] dark:text-slate-400 uppercase mb-3 block font-mono">
                      {beat.number} / {beat.category}
                    </span>
                    <h4 className="text-[15px] sm:text-[16.5px] font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2.5">
                      {beat.bad.title}
                    </h4>
                    <p className="text-xs sm:text-[13.5px] text-[#334155] dark:text-slate-400 leading-relaxed">
                      {beat.bad.description}
                    </p>
                  </div>
                </div>

                {/* Good column */}
                <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
                  <div>
                    <span className="text-[10.5px] sm:text-[11px] font-bold tracking-wider text-[#a78bfa] uppercase mb-3 block font-mono">
                      {beat.good.badge}
                    </span>
                    <h4 className="text-[15px] sm:text-[16.5px] font-bold text-slate-900 dark:text-white leading-snug mb-2.5">
                      {beat.good.title}
                    </h4>
                    <p className="text-xs sm:text-[13.5px] text-[#334155] dark:text-slate-400 leading-relaxed">
                      {beat.good.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
