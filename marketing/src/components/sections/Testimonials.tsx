import { siteConfig } from "@/config/site";

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
      className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#080d1a]/50 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
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
              className="rounded-2xl p-7 sm:p-8 flex flex-col justify-between
                bg-white dark:bg-[#0c1222]/80
                border border-slate-200/80 dark:border-white/[0.08]
                hover:border-slate-300 dark:hover:border-white/[0.16]
                transition-colors"
            >
              <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                {renderHighlightedText(item.quote)}
              </p>

              <div className="mt-7 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="text-[14px] font-semibold text-slate-900 dark:text-white">
                  {item.author}
                </div>
                <div className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
