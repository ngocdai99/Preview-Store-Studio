import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ChevronRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-3 sm:top-5 z-50 w-full px-4 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto h-14 sm:h-16 px-3.5 sm:px-5 rounded-full border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#070b14]/85 backdrop-blur-xl shadow-lg shadow-black/[0.03] dark:shadow-2xl dark:shadow-black/40 flex items-center justify-between pointer-events-auto transition-all">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <BrandIcon className="w-8 h-8 rounded-lg shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
            {siteConfig.name}
          </span>
        </Link>

        {/* Right Section: Desktop Nav + Divider + Theme Toggle + CTA */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Studio Active Pill */}
            <Link
              href="/app"
              className="px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all bg-[#252f40] text-white hover:bg-[#1a2230] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
            >
              Studio
            </Link>

            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Vertical Divider */}
          <div className="hidden sm:block h-4 w-[1px] bg-slate-200 dark:bg-white/10" aria-hidden="true" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Pricing CTA */}
          <Link
            href="#pricing"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6] hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white px-4 sm:px-5 py-2 rounded-full shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all shrink-0 active:scale-[0.98]"
          >
            <span>{siteConfig.navPricingCta}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 stroke-[2.4]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
