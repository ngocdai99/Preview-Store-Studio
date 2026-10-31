import { siteConfig } from "@/config/site";
import { Star } from "lucide-react";

export function Testimonials() {
  const { testimonials } = siteConfig;

  return (
    <section id="testimonials" className="py-20 border-t border-border bg-card/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-card-muted text-muted border border-border mb-4">
            {testimonials.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {testimonials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.items.map((item) => (
            <div
              key={item.author}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-foreground/30 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* 5 Stars - Soft Gold */}
                <div className="flex items-center gap-1 text-amber-500/80 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-foreground/85 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-foreground text-background font-semibold text-xs flex items-center justify-center flex-shrink-0">
                  {item.avatarInitials}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.author}</h4>
                  <p className="text-xs text-muted">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
