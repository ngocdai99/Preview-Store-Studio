import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ChevronRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto h-12 sm:h-13 px-3 sm:px-4 rounded-full border border-border bg-card/90 backdrop-blur-xl shadow-sm dark:shadow-xl dark:shadow-black/40 flex items-center justify-between pointer-events-auto transition-colors">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <BrandIcon className="w-7 h-7 rounded-lg shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-bold text-[13px] sm:text-[14px] tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Right Section: Desktop Nav + Divider + Theme Toggle + CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5">
            {/* Studio Active Pill */}
            <Link
              href="/app"
              className="px-3 py-1 text-[11.5px] sm:text-[12px] font-semibold rounded-full transition-all bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-xs"
            >
              Studio
            </Link>

            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11.5px] sm:text-[12.5px] font-medium text-muted hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Vertical Divider */}
          <div className="hidden sm:block h-3.5 w-[1px] bg-border" aria-hidden="true" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Pricing CTA */}
          <Link
            href="#pricing"
            className="inline-flex items-center gap-1 text-[11.5px] sm:text-[12.5px] font-semibold bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6] hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white px-3.5 sm:px-4 py-1.5 rounded-full shadow-xs shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all shrink-0 active:scale-[0.98]"
          >
            <span>{siteConfig.navPricingCta}</span>
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
