import { siteConfig } from "@/config/site";
import { Heart } from "lucide-react";

export function AboutMaker() {
  const { aboutMaker } = siteConfig;

  return (
    <section className="py-20 sm:py-24 border-t border-border bg-slate-50/50 dark:bg-[#080d1a]/50 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[24px] p-8 sm:p-12 bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-white/[0.08] shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.25] mb-6 text-balance">
            {aboutMaker.title}
          </h2>

          {/* Story Narrative */}
          <div className="space-y-4 text-[15px] sm:text-[15.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            {aboutMaker.story.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Signature Sign-off */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
            <span className="italic flex items-center gap-1.5 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-500/80 fill-rose-500/80" />
              {aboutMaker.signature}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
