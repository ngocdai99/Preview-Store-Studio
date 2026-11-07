"use client";

import { siteConfig } from "@/config/site";
import {
  DeviceFramesCard,
  StorePresetsCard,
  ComplianceCard,
  ExportCard,
} from "./features/index";

export function Features() {
  const { features } = siteConfig;

  return (
    <section
      id="features"
      className="pt-14 pb-20 sm:pt-16 sm:pb-24 border-t border-border bg-slate-50/50 dark:bg-[#131413] transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="section-title text-[22px] sm:text-[28px] lg:text-[32px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.2] text-balance">
            {features.headline}
          </h2>
        </div>

        {/* 4-Card Bento Grid: Row 1 (6 + 6 cols) & Row 2 (6 + 6 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-7">
          <DeviceFramesCard />
          <StorePresetsCard />
          <ComplianceCard />
          <ExportCard />
        </div>
      </div>
    </section>
  );
}
