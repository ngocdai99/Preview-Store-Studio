import { siteConfig } from "@/config/site";
import { UserCheck, Heart } from "lucide-react";

export function AboutMaker() {
  const { aboutMaker } = siteConfig;

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/80 shadow-xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{aboutMaker.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6">
            {aboutMaker.title}
          </h2>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            {aboutMaker.story.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="italic flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              {aboutMaker.signature}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

