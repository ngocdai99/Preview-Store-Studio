import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const { footer } = siteConfig;

  return (
    <footer className="border-t border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#131413] py-8 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-slate-500 dark:text-slate-400">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2.5">
          <BrandIcon className="w-5 h-5" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {siteConfig.name}
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>{footer.copyright}</span>
        </div>

        {/* Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400"
        >
          {footer.links.map((link) => {
            const isExternal = link.href.startsWith("http");

            if (isExternal) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[44px] px-1 gap-1 hover:text-slate-900 dark:hover:text-white transition-colors py-1 select-none"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 stroke-[2.2]" />
                </a>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center min-h-[44px] px-1 gap-1 hover:text-slate-900 dark:hover:text-white transition-colors py-1 select-none"
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
