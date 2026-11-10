"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { useDeviceTime } from "./features/DeviceHardwareHelpers";
import { PhoneFramesStage } from "./features/PhoneFramesStage";
import { TabletFramesStage } from "./features/TabletFramesStage";

export function Hero() {
  const { hero } = siteConfig;
  const [device, setDevice] = useState<"phone" | "tablet">("phone");
  const [hasInteracted, setHasInteracted] = useState(false);
  const timeString = useDeviceTime();

  const handleSelectDevice = (next: "phone" | "tablet") => {
    if (next === device) return;
    setHasInteracted(true);
    setDevice(next);
  };

  return (
    <section id="hero" className="relative pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-10 lg:pb-8 overflow-hidden">
      {/* Background Soft Emerald Aurora Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-emerald-500/15 via-[#00D085]/12 to-[#006636]/18 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-12">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:w-[50%] shrink-0">
            {/* Header Eyebrow */}
            <p className="text-[13px] sm:text-[14px] font-medium text-slate-500 dark:text-slate-400 mb-2.5 sm:mb-3 select-none">
              {hero.badge}
            </p>

            <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] xl:text-[44px] font-medium tracking-[-0.02em] leading-[1.18] text-balance">
              <span className="text-[#0f172a] dark:text-white block">
                {hero.titleLead}
              </span>
              <span className="text-emerald-700 dark:text-[oklch(0.76_0.15_157.5)] block mt-1">
                {hero.titleAccent}
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] text-[#475569] dark:text-[oklch(0.684_0.00275_157.5)] leading-[1.65] max-w-xl">
              <span className="block">Save hours of back-and-forth before every store submission.</span>
              <span className="block mt-1 sm:mt-1.5">Preview and verify your listings on realistic device frames before submitting.</span>
            </p>



            {/* Micro Trust Indicators */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-[#475569] dark:text-[oklch(0.684_0.00275_157.5)] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                No subscription
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Standalone offline HTML
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                App Store &amp; Google Play
              </span>
            </div>
          </div>

          {/* Right Column: Interactive iPhone / iPad 3D Device Stage (Floating, no container box) */}
          <div className="lg:w-[50%] flex flex-col items-center">
            {/* Floating Device Switcher */}
            <div className="mb-2 flex items-center justify-center w-full z-20">
              <SlidingTabs
                value={device}
                onChange={(val) => handleSelectDevice(val as "phone" | "tablet")}
                className="w-[170px] sm:w-[180px] shrink-0 shadow-sm"
                options={[
                  {
                    value: "phone",
                    label: "iPhone",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                      >
                        <rect x="6" y="2" width="12" height="20" rx="2.5" />
                        <line x1="10" y1="18" x2="14" y2="18" />
                      </svg>
                    ),
                  },
                  {
                    value: "tablet",
                    label: "iPad",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                      >
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="12" y1="18" x2="12" y2="18" />
                      </svg>
                    ),
                  },
                ]}
              />
            </div>

            {/* Simulated Live Stage with Layered 3D Depth - Pure Floating */}
            <div
              className="relative z-10 w-full max-w-[460px] h-[410px] sm:h-[430px] flex items-center justify-center select-none"
              style={{ perspective: "1200px" }}
            >
              <PhoneFramesStage
                timeString={timeString}
                isForeground={device === "phone"}
                hasInteracted={hasInteracted}
                onSelect={() => handleSelectDevice("phone")}
              />
              <TabletFramesStage
                timeString={timeString}
                isForeground={device === "tablet"}
                hasInteracted={hasInteracted}
                onSelect={() => handleSelectDevice("tablet")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
