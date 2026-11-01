import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const { footer } = siteConfig;

  return (
    <footer className="border-t border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#080d1a] py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand + Nav Links */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 pb-8 sm:pb-10">
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group select-none shrink-0"
              aria-label={siteConfig.name}
            >
              <BrandIcon className="w-7 h-7 transition-transform duration-300 group-hover:scale-105" />
              <span className="font-extrabold text-[15px] sm:text-base text-[#0f172a] dark:text-white tracking-tight">
                {siteConfig.name}
              </span>
            </Link>

            <span
              className="hidden sm:inline-block text-slate-300 dark:text-slate-700"
              aria-hidden="true"
            >
              ·
            </span>

            <p className="text-xs sm:text-[13px] text-[#64748b] dark:text-slate-400">
              {footer.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-6 sm:gap-x-7 gap-y-2.5 text-[13px] font-medium text-[#475569] dark:text-slate-400"
          >
            {footer.links.map((link) => {
              const isExternal = link.href.startsWith("http");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 hover:text-[#0f172a] dark:hover:text-white transition-colors py-1 select-none"
                >
                  <span>{link.label}</span>
                  {isExternal && (
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 stroke-[2.2]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Tier: Divider + Copyright & Trust Note */}
        <div className="pt-6 sm:pt-8 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b] dark:text-slate-400 text-center sm:text-left">
          <p className="leading-relaxed text-balance">
            {footer.copyright}
          </p>

          <div className="inline-flex items-center gap-2 font-medium text-slate-500 dark:text-slate-400 text-balance">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>{footer.trustNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
