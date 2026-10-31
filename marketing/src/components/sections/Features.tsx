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
    <section id="features" className="py-20 border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built for mobile developers, agencies, and ASO pros.
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to craft, review, and ship perfect app listings without messy
            spreadsheets or design templates.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || Smartphone;
            const isLarge = idx === 0 || idx === 1;

            return (
              <div
                key={feature.id}
                className={`group p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 transition-all hover:border-slate-700/80 shadow-sm hover:shadow-indigo-500/5 flex flex-col justify-between ${
                  isLarge ? "lg:col-span-1" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    {feature.badge && (
                      <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-slate-400 text-sm leading-relaxed">
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

