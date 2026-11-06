import React from "react";

export interface StoreMetricsRibbonProps {
  className?: string;
  theme?: "dark" | "light";
  rating?: string;
  ratingCount?: string;
  age?: string;
  developerName?: string;
}

/**
 * StoreMetricsRibbon Component
 * 
 * Reusable authentic App Store 3-column Metrics Ribbon
 * shared across iPhone and iPad frames.
 * Uses explicit `theme` prop to guarantee correct contrast in both dark & light device modes.
 */
export function StoreMetricsRibbon({
  className = "",
  theme = "dark",
  rating = "4.9 ★",
  ratingCount = "1.8K Ratings",
  age = "4+",
  developerName = "Kai DevLabs",
}: StoreMetricsRibbonProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`grid grid-cols-3 divide-x border-y py-1.5 my-2 text-center select-none ${
        isDark
          ? "border-white/10 divide-white/10"
          : "border-slate-200 divide-slate-200"
      } ${className}`}
    >
      {/* Column 1: Ratings */}
      <div className="flex flex-col items-center justify-center px-1">
        <span
          className={`text-[10px] font-bold leading-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {rating}
        </span>
        <span
          className={`text-[7.5px] mt-0.5 leading-tight ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {ratingCount}
        </span>
      </div>

      {/* Column 2: Age */}
      <div className="flex flex-col items-center justify-center px-1">
        <span
          className={`text-[10px] font-bold leading-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {age}
        </span>
        <span
          className={`text-[7.5px] mt-0.5 leading-tight ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Years Old
        </span>
      </div>

      {/* Column 3: Developer */}
      <div className="flex flex-col items-center justify-center px-1">
        <div
          className={`h-3.5 flex items-center justify-center ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3.5" y="3.5" width="17" height="17" rx="3.8" />
            <circle cx="12" cy="9.8" r="2.4" fill="currentColor" stroke="none" />
            <path d="M6.8 19.2c0-2.8 2.3-4.7 5.2-4.7s5.2 1.9 5.2 4.7z" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <span
          className={`text-[7.5px] mt-0.5 leading-tight truncate max-w-[85px] ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {developerName}
        </span>
      </div>
    </div>
  );
}
