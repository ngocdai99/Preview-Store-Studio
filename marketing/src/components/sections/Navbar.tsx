"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isTryPage = pathname === "/try" || pathname?.startsWith("/try");
  const isHomePage = pathname === "/" || pathname === "";

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (isTryPage) return "Live Demo";
    return "";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  // Scroll spy to dynamically sync selected tab with current section in view
  useEffect(() => {
    if (isTryPage) {
      setActiveTab("Live Demo");
      return;
    }

    if (!isHomePage) {
      setActiveTab("");
      return;
    }

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      const scrollPos = window.scrollY + 140;
      const featEl = document.getElementById("features");
      const pricingEl = document.getElementById("pricing");
      const faqEl = document.getElementById("faq");

      if (faqEl && scrollPos >= faqEl.offsetTop) {
        setActiveTab("FAQ");
      } else if (pricingEl && scrollPos >= pricingEl.offsetTop) {
        setActiveTab("Pricing");
      } else if (featEl && scrollPos >= featEl.offsetTop) {
        setActiveTab("Features");
      } else {
        setActiveTab("");
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
  }, [isTryPage, isHomePage]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLElement>,
    label: string,
    href: string
  ) => {
    setActiveTab(label);
    setMobileMenuOpen(false);

    isClickScrollingRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);

    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      } else if (href === "#hero") {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "/");
        }
      } else {
        window.location.href = `/${href}`;
      }
    }
  };

  const handleLiveDemoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (pathname === "/try" || (typeof window !== "undefined" && window.location.pathname === "/try")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-[#282928] bg-white/85 dark:bg-[#131413]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Section: Brand Logo & Navigation Links (Supabase style) */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "", "#hero")}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <BrandIcon className="w-6 h-6 rounded-md shrink-0 transition-opacity duration-150 group-hover:opacity-85" />
            <span className="font-bold text-[15.5px] sm:text-[16px] tracking-tight text-slate-900 dark:text-white">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navItems.map((item) => {
              const isSelected = activeTab === item.label;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.label, item.href)}
                  className={`text-[13.5px] transition-colors duration-150 ${
                    isSelected
                      ? "text-[#006636] dark:text-[#00D085] font-semibold"
                      : "text-slate-600 dark:text-[#989A99] hover:text-slate-900 dark:hover:text-white font-medium"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Demo Link + Supabase Emerald CTA Button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link
            href="/try"
            onClick={handleLiveDemoClick}
            className={`hidden sm:inline-flex items-center text-[13px] font-medium px-2.5 py-1.5 transition-colors ${
              isTryPage || activeTab === "Live Demo"
                ? "text-[#006636] dark:text-[#00D085] font-semibold"
                : "text-slate-600 dark:text-[#989A99] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Live Demo
          </Link>

          <PrimaryButton
            href="#pricing"
            onClick={(e) => handleNavClick(e, "Pricing", "#pricing")}
            fontSize="13px"
            fontWeight={600}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 shrink-0"
          >
            <span>Get Access</span>
          </PrimaryButton>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 dark:text-[#989A99] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[2]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/90 dark:border-[#282928] bg-white/95 dark:bg-[#131413]/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isSelected = activeTab === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.label, item.href)}
                className={`block px-3 py-2 rounded-md text-[14px] transition-colors ${
                  isSelected
                    ? "text-[#006636] dark:text-[#00D085] font-semibold bg-[#006636]/10 dark:bg-[#00D085]/10"
                    : "text-slate-600 dark:text-[#989A99] hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/try"
            onClick={handleLiveDemoClick}
            className={`block px-3 py-2 text-[14px] font-medium transition-colors rounded-md ${
              isTryPage || activeTab === "Live Demo"
                ? "text-[#006636] dark:text-[#00D085] font-semibold bg-[#006636]/10 dark:bg-[#00D085]/10"
                : "text-slate-600 dark:text-[#989A99] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Live Demo
          </Link>
        </div>
      )}
    </header>
  );
}
