"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ChevronRight } from "lucide-react";

export function Navbar() {
  const [activeTab, setActiveTab] = useState<string>("Studio");
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = [
    { label: "Studio", href: "#hero" },
    ...siteConfig.navigation,
  ];

  // Scroll spy to dynamically sync selected tab with current section in view
  useEffect(() => {
    const handleScroll = () => {
      // If user just clicked a nav tab, do not let scroll-spy override the active tab during smooth scroll
      if (isClickScrollingRef.current) return;

      const scrollPos = window.scrollY + 140;
      const compEl = document.getElementById("comparison");
      const pricingEl = document.getElementById("pricing");
      const faqEl = document.getElementById("faq");

      if (faqEl && scrollPos >= faqEl.offsetTop) {
        setActiveTab("FAQ");
      } else if (pricingEl && scrollPos >= pricingEl.offsetTop) {
        setActiveTab("Pricing");
      } else if (compEl && scrollPos >= compEl.offsetTop) {
        setActiveTab("Why Us");
      } else {
        setActiveTab("Studio");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    href: string
  ) => {
    // 1. Instantly switch active state immediately (0ms delay)
    setActiveTab(label);

    // 2. Lock scroll-spy listener during smooth scroll animation
    isClickScrollingRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);

    // 3. Perform smooth scroll
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      } else if (href === "#hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", window.location.pathname);
      }
    }
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none">
      <div className="max-w-5xl mx-auto h-12 sm:h-13 px-3 sm:px-4 rounded-full border border-border bg-card/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-xl dark:shadow-black/40 flex items-center justify-between pointer-events-auto transition-colors">
        {/* Brand */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, "Studio", "#hero")}
          className="flex items-center gap-2 group shrink-0"
        >
          <BrandIcon className="w-7 h-7 rounded-lg shrink-0 transition-transform group-hover:scale-105" />
          <span className="font-bold text-[13px] sm:text-[14px] tracking-tight text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        {/* Right Section: Desktop Nav + Divider + Theme Toggle + CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Navigation Links with Interactive Active Pill */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const isSelected = activeTab === item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.label, item.href)}
                  className={`btn-scale transition-colors duration-150 rounded-full px-3.5 py-1 text-[12px] sm:text-[12.5px] cursor-pointer ${
                    isSelected
                      ? "font-semibold bg-[#334155] text-white hover:bg-[#1e293b] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs"
                      : "font-medium text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Vertical Divider */}
          <div className="hidden sm:block h-3.5 w-[1px] bg-border" aria-hidden="true" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Pricing CTA */}
          <Link
            href="#pricing"
            onClick={(e) => handleNavClick(e, "Pricing", "#pricing")}
            className="btn-scale inline-flex items-center gap-1 text-[11.5px] sm:text-[12.5px] font-semibold bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6] hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white px-3.5 sm:px-4 py-1.5 rounded-full shadow-none sm:shadow-[0_1px_2px_rgba(99,102,241,0.15)] transition-all shrink-0 cursor-pointer"
          >
            <span>{siteConfig.navPricingCta}</span>
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
