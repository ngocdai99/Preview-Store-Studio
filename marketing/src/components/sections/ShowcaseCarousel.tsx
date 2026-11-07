"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export interface ShowcaseSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
  badge: string;
  desc: string;
}

export const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: "cover",
    src: "/covers/gumroad-1-cover.png",
    alt: "Dual Store Live Viewports",
    title: "Dual-Store Live Viewports",
    badge: "Side-by-Side",
    desc: "Preview Apple App Store (iOS) and Google Play (Android) listings simultaneously with synchronized text and assets.",
  },
  {
    id: "tablet",
    src: "/covers/gumroad-2-tablet.png",
    alt: "iPad & Tablet Stage Preview",
    title: "iPad & Tablet Preview Stage",
    badge: "Expanded Viewports",
    desc: "Validate large-screen layouts, 4:3 screenshot aspect ratios, and dedicated tablet typography before release.",
  },
  {
    id: "audit",
    src: "/covers/gumroad-3-audit.png",
    alt: "Pre-Flight ASO Compliance Audit",
    title: "Pre-Flight ASO Compliance Audit",
    badge: "Rejection Guard",
    desc: "Real-time verification for character limits, alpha channel violations (ITMS-90717), and asset resolution standards.",
  },
  {
    id: "export",
    src: "/covers/gumroad-4-export.png",
    alt: "Clean 4K Ultra HD Export",
    title: "4K Ultra HD Export & Handoff",
    badge: "1-Click Handoff",
    desc: "Download high-resolution mockups without watermarks, developer Markdown specifications, and JSON presets in seconds.",
  },
  {
    id: "light",
    src: "/covers/gumroad-5-light.png",
    alt: "Adaptive Light & Dark OS Themes",
    title: "Adaptive Light & Dark OS Themes",
    badge: "OS Synchronization",
    desc: "Toggle between system dark and light modes with 1 click to audit contrast and visual hierarchy across all devices.",
  },
  {
    id: "android-tablet",
    src: "/covers/gumroad-6-android-tablet.png",
    alt: "Android Tablet Listings",
    title: "Android Tablet Listings",
    badge: "Google Play Featuring",
    desc: "Audit dedicated Android tablet screenshots up to 8 MB with Google Play compliance checks and fallback previews.",
  },
  {
    id: "templates",
    src: "/covers/gumroad-7-templates.png",
    alt: "Curated Store Presets & App Cloner",
    title: "Curated Store Presets & Cloner",
    badge: "6 Pre-built Presets",
    desc: "Jumpstart your workflow with FinTech, Gaming, and SaaS presets, or clone competitor metadata directly by App Store URL.",
  },
  {
    id: "workspace-dark",
    src: "/covers/gumroad-8b-workspace-dark.png",
    alt: "Full Studio Workspace & Source Code",
    title: "Full Studio Workspace & Source Code",
    badge: "Pro Studio",
    desc: "Complete client-side modular architecture with clean source code, live-reload dev server, and agency licensing.",
  },
];

export function ShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = SHOWCASE_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setIsPlaying(false);
  };

  // Autoplay management
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        setIsPlaying(false);
      } else if (e.key === "ArrowRight") {
        nextSlide();
        setIsPlaying(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsPlaying(false);
    }
    setTouchStartX(null);
  };

  const current = SHOWCASE_SLIDES[currentIndex];

  return (
    <section
      id="showcase"
      className="relative pt-6 pb-16 sm:pt-8 sm:pb-20 overflow-hidden"
      aria-label="Product Showcase Carousel"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider text-emerald-600 dark:text-[#00D085] bg-emerald-500/10 dark:bg-[#00D085]/10 border border-emerald-500/20 dark:border-[#00D085]/20 mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00D085] shadow-[0_0_6px_rgba(0,208,133,0.7)]" />
            Product Gallery
          </span>
          <h2 className="text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-tight">
            See Store Preview Studio in Action
          </h2>
          <p className="mt-2.5 text-[14.5px] sm:text-[16px] text-slate-600 dark:text-slate-400">
            Swipe through the gallery to explore our multi-store viewports, audit rules, and 4K export workflows.
          </p>
        </div>

        {/* Carousel Viewport Container */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#282928] bg-[#0c0d0c] shadow-[0_24px_80px_rgba(0,0,0,0.35)] overflow-hidden group select-none"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main 16:9 Image Frame */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
            <Image
              key={current.id}
              src={current.src}
              alt={current.alt}
              fill
              priority={currentIndex === 0}
              className="object-cover object-center transition-opacity duration-300 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
            />

            {/* Left & Right Arrow Buttons */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-150 opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95 z-10"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-150 opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95 z-10"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Minimal Dots Pagination */}
            <div className="absolute bottom-3.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-lg">
              {SHOWCASE_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-200 cursor-pointer rounded-full ${
                    idx === currentIndex
                      ? "w-5 sm:w-6 h-1.5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
