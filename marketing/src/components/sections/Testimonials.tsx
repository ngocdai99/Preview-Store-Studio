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

const cardAccents = [
  {
    borderHover: "hover:border-[#00D085]/40 dark:hover:border-[#00D085]/40",
    topLine: "from-[#00D085] via-emerald-400/60 to-transparent",
    glow: "bg-[#00D085]/10 dark:bg-[#00D085]/15",
    quoteColor: "text-[#006533] dark:text-[#00D085]",
    pill: "bg-emerald-50 text-emerald-800 dark:bg-[#00D085]/10 dark:text-[#00D085] border-emerald-200/80 dark:border-[#00D085]/25",
  },
  {
    borderHover: "hover:border-slate-400 dark:hover:border-white/30",
    topLine: "from-slate-700 via-slate-500/50 to-transparent dark:from-white/70 dark:via-white/30 to-transparent",
    glow: "bg-slate-500/10 dark:bg-white/5",
    quoteColor: "text-slate-700 dark:text-slate-300",
    pill: "bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300 border-slate-200/80 dark:border-white/10",
  },
  {
    borderHover: "hover:border-emerald-500/40 dark:hover:border-emerald-500/40",
    topLine: "from-emerald-500 via-teal-500/50 to-transparent",
    glow: "bg-emerald-500/10 dark:bg-emerald-500/15",
    quoteColor: "text-emerald-600 dark:text-emerald-400",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/25",
  },
];

export function Testimonials() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#131413] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[40px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.2] text-balance">
            {testimonials.title}
          </h2>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {testimonials.items.map((item, index) => {
            const accent = cardAccents[index % cardAccents.length];

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
                  {/* Card Header: Accent Quote Icon + Highlight Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-8 h-8 rounded-lg bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.08] flex items-center justify-center ${accent.quoteColor}`}
                    >
                      <Quote className="w-4 h-4 fill-current opacity-85" />
                    </div>

                    {item.highlight && (
                      <span
                        className={`inline-flex items-center text-[11px] font-bold tracking-tight px-2.5 py-0.5 rounded-full border ${accent.pill}`}
                      >
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
