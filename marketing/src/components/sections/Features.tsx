import { siteConfig, type FeatureItem } from "@/config/site";
import {
  Smartphone,
  ShieldCheck,
  Sparkles,
  FolderArchive,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<FeatureItem["icon"], LucideIcon> = {
  smartphone: Smartphone,
  shieldCheck: ShieldCheck,
  sparkles: Sparkles,
  folderArchive: FolderArchive,
  wifiOff: WifiOff,
};

export function Features() {
  const { features } = siteConfig;

  return (
    <section id="features" className="py-20 border-t border-border bg-card/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15]">
            {features.headline}
          </h2>
          <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed">
            {features.subheadline}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.items.map((feature) => {
            const Icon = iconMap[feature.icon] || Smartphone;

            return (
              <div
                key={feature.id}
                className="group p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-blue-500/40 transition-all shadow-sm hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    {feature.badge && (
                      <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-card-muted text-muted border border-border">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
