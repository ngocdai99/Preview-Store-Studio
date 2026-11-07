"use client";

import React from "react";

export interface FeatureCardProps {
  number?: string; // e.g. "01", "02", "03", "04" (deprecated/optional)
  title: string;
  description: string;
  accentGradient?: string;
  badgeColorClass?: string;
  headerRight?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  headerRight,
  className = "",
  children,
}: FeatureCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 ${className}`}
    >
      {/* Top Header */}
      <div className="relative z-20 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className={headerRight ? "" : "max-w-xl"}>
            <h3 className="text-[16px] sm:text-[17px] font-medium text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="mt-1 text-[13px] sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-[#989A99]">
              {description}
            </p>
          </div>
          {headerRight && (
            <div className="shrink-0 self-start sm:self-center">
              {headerRight}
            </div>
          )}
        </div>
      </div>

      {/* Card Body / Visual Stage */}
      {children}
    </div>
  );
}
