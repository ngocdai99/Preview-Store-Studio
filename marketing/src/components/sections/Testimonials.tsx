import { siteConfig } from "@/config/site";

export function Testimonials() {
  const { testimonials } = siteConfig;

  return (
    <section className="py-16 sm:py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2.5">
            Customer Reviews
          </span>
          <div className="flex items-center justify-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-amber-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="ml-1.5 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
              5.0
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="flex-1 text-[13.5px] sm:text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Verified tick — no label */}
              <div className="mt-4">
                <svg
                  className="w-4 h-4 text-emerald-500 dark:text-[#00D085]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
