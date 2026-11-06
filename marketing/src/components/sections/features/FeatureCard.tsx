"use client";

import React from "react";

export interface FeatureCardProps {
  number: string; // e.g. "01", "02", "03", "04"
  title: string;
  description: string;
  accentGradient: string;
  badgeColorClass: string;
  headerRight?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FeatureCard({
  number,
  title,
  description,
  accentGradient,
  badgeColorClass,
  headerRight,
  className = "",
  children,
}: FeatureCardProps) {
  return (
    <div
      className={`group relative rounded-[28px] px-6 py-3.5 sm:px-8 sm:py-4 flex flex-col justify-between bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 ${className}`}
    >
      {/* Top hairline accent line */}
      <div
        className={`absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r ${accentGradient}`}
      />

      {/* Top border sequence badge (sitting directly on the border highlight) */}
      <div className="absolute -top-[12px] left-6 sm:left-8 z-30 pointer-events-none">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-white dark:bg-[#1D1E1D] border ${badgeColorClass} shadow-xs select-none`}
        >
          {number}
        </span>
      </div>

      {/* Top Header */}
      <div className="relative z-20 mb-2 sm:mb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className={headerRight ? "" : "max-w-xl"}>
            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="mt-1 text-[13px] sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
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
