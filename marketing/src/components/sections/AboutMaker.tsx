import { siteConfig } from "@/config/site";
import { UserCheck, Heart } from "lucide-react";

export function AboutMaker() {
  const { aboutMaker } = siteConfig;

  return (
    <section className="py-20 border-t border-border bg-background transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-border bg-card shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-card-muted text-muted border border-border mb-6">
            <UserCheck className="w-3.5 h-3.5 text-foreground/80" />
            <span>{aboutMaker.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
            {aboutMaker.title}
          </h2>

          <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
            {aboutMaker.story.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-muted">
            <span className="italic flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500/80 fill-current" />
              {aboutMaker.signature}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
