import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandIcon className="w-8 h-8 transition-transform group-hover:scale-105" />
          <span className="font-semibold text-base sm:text-lg tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-card-muted p-1 rounded-full border border-border">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-card rounded-full transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle + Brand CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          <Link
            href="#pricing"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/20 transition-all hover:shadow-indigo-500/35"
          >
            <span>View Pricing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
