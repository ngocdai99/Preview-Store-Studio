import { siteConfig } from "@/config/site";
import { Star } from "lucide-react";

export function Testimonials() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#080d1a]/50 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[40px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.2] text-balance">
            {testimonials.title}
          </h2>

          {testimonials.subtitle && (
            <p className="mt-3.5 text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed text-balance">
              {testimonials.subtitle}
            </p>
          )}
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {testimonials.items.map((item) => (
            <div
              key={item.author}
              className="rounded-[20px] p-7 sm:p-8 flex flex-col justify-between
                bg-white dark:bg-[#0c1222]
                border border-slate-200/80 dark:border-white/[0.08]
                shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_16px_rgba(15,23,42,0.02)]
                dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                hover:border-slate-300 dark:hover:border-white/[0.16]
                transition-all duration-200"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 stroke-amber-400"
                    />
                  ))}
                </div>

                {/* Quote Content */}
                <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Profile Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-200/70 dark:border-white/[0.08] shrink-0">
                  {item.avatarInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[14.5px] font-bold text-[#0f172a] dark:text-white leading-snug">
                    {item.author}
                  </h3>
                  <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    {item.role}
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
