"use client";

import React, { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

export function SeeItInAction() {
  const { seeItInAction } = siteConfig;
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);

  const slides = seeItInAction.slides;
  const currentSlide = slides[currentIndex];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      id="see-it-in-action"
      className="pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-t border-border bg-slate-50/50 dark:bg-[#131413] transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <h2 className="section-title text-[24px] sm:text-[30px] lg:text-[34px] font-medium tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.2] text-balance">
            {seeItInAction.title}
          </h2>
        </div>

        {/* Featured Large Viewport Frame */}
        <div className="max-w-6xl mx-auto">
          <div className="relative group rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.12] bg-[#0c0d0c] shadow-xl sm:shadow-2xl dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300">
            {/* Window Top Bar */}
            <div className="flex items-center px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
              </div>
            </div>

            {/* Image Canvas with Touch Swipe on Mobile (Static, no navigation on tap) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-[16/9] sm:aspect-[16/8.8] bg-[#0e0f0e] overflow-hidden select-none"
            >
              {"srcMobile" in currentSlide && currentSlide.srcMobile ? (
                <>
                  <Image
                    key={`${currentSlide.id}-mobile`}
                    src={currentSlide.srcMobile as string}
                    alt={currentSlide.title}
                    width={1200}
                    height={1800}
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="sm:hidden w-full h-full object-contain p-2"
                    priority
                    loading="eager"
                  />
                  <Image
                    key={`${currentSlide.id}-desktop`}
                    src={currentSlide.src}
                    alt={currentSlide.title}
                    width={currentSlide.width}
                    height={currentSlide.height}
                    sizes="(max-width: 1280px) 100vw, 1152px"
                    className="hidden sm:block w-full h-full object-contain p-2 sm:p-4"
                    priority
                    loading="eager"
                  />
                </>
              ) : (
                <Image
                  key={currentSlide.id}
                  src={currentSlide.src}
                  alt={currentSlide.title}
                  width={currentSlide.width}
                  height={currentSlide.height}
                  sizes="(max-width: 1280px) 100vw, 1152px"
                  className="w-full h-full object-contain p-2 sm:p-4"
                  priority
                  loading="eager"
                />
              )}
            </div>


          </div>

          {/* Active Slide Caption Underneath */}
          <div className="mt-3 px-2 sm:px-4 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <p className="leading-relaxed">
              {currentSlide.caption}
            </p>
          </div>

          {/* Thumbnails: Horizontal scroll with snap on mobile, 4-col grid on desktop */}
          <div className="mt-5 sm:mt-6 flex sm:grid sm:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-1 sm:px-0 pb-2 sm:pb-0">
            {slides.map((slide, idx) => {
              const isActive = currentIndex === idx;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`group text-left rounded-xl p-2 sm:p-2.5 transition-all duration-200 cursor-pointer flex flex-col justify-between border shrink-0 w-[68%] xs:w-[58%] sm:w-auto snap-center ${
                    isActive
                      ? "bg-white dark:bg-[#1D1E1D] border-slate-300 dark:border-white/30 shadow-md ring-1 ring-slate-200 dark:ring-white/15 opacity-100"
                      : "bg-white/80 dark:bg-[#161716] border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 shadow-xs opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* Thumbnail Image Box */}
                  <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-black/40">
                    {"srcMobile" in slide && slide.srcMobile ? (
                      <>
                        <Image
                          src={slide.srcMobile as string}
                          alt={slide.name}
                          width={1200}
                          height={1800}
                          className="sm:hidden w-full h-full object-cover"
                        />
                        <Image
                          src={slide.src}
                          alt={slide.name}
                          width={slide.width}
                          height={slide.height}
                          className="hidden sm:block w-full h-full object-cover"
                        />
                      </>
                    ) : (
                      <Image
                        src={slide.src}
                        alt={slide.name}
                        width={slide.width}
                        height={slide.height}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Clean Label placed strictly BELOW image */}
                  <div className="flex items-center justify-between px-1 mt-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          isActive
                            ? "text-slate-900 dark:text-white"
                            : "text-muted/80"
                        }`}
                      >
                        {slide.indexLabel}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                      <span className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        {slide.name}
                      </span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action CTAs right below the thumbnails */}
          <div className="mt-8 sm:mt-10 flex flex-row items-center justify-center gap-3 sm:gap-4">
            <PrimaryButton
              href={siteConfig.hero.primaryCta.href}
              fontSize="14px"
              fontWeight={600}
              className="h-[40px] sm:h-[42px] px-5 sm:px-6 rounded-lg shadow-sm"
            >
              <span>{siteConfig.hero.primaryCta.label}</span>
            </PrimaryButton>

            <SecondaryButton
              href={siteConfig.hero.secondaryCta.href}
              fontSize="14px"
              fontWeight={500}
              className="h-[40px] sm:h-[42px] px-5 sm:px-6 rounded-lg"
            >
              <span>{siteConfig.hero.secondaryCta.label}</span>
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
