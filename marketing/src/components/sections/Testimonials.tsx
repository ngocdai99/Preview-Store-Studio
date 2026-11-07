import { siteConfig } from "@/config/site";
import { Quote } from "lucide-react";

function renderHighlightedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={index}
          className="font-semibold text-slate-900 dark:text-white"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function Testimonials() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 border-t border-border bg-background transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="section-title text-[22px] sm:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.2] text-balance">
            {testimonials.title}
          </h2>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {testimonials.items.map((item) => {
            return (
              <div
                key={item.author}
                className="group relative overflow-hidden rounded-2xl p-7 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1D1E1D] border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-colors duration-200"
              >
                {/* Top hairline accent line */}
                <div
                  className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/10 to-transparent"
                />

                <div className="relative z-10">
                  {/* Card Header: Neutral Quote Icon + Unified Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.08] flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Quote className="w-4 h-4 fill-current opacity-85" />
                    </div>

                    {item.highlight && (
                      <span className="inline-flex items-center text-[11px] font-normal tracking-wide px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-white/10">
                        {item.highlight}
                      </span>
                    )}
                  </div>

                  {/* Quote Body */}
                  <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {renderHighlightedText(item.quote)}
                  </p>
                </div>

                {/* Author Signature */}
                <div className="relative z-10 mt-7 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
                  <div className="text-[14px] font-bold text-slate-900 dark:text-white">
                    {item.author}
                  </div>
                  <div className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.role}
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
