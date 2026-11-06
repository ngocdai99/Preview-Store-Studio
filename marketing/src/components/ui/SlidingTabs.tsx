"use client";

import React from "react";

export interface TabOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SlidingTabsProps<T extends string> {
  options: (TabOption<T> | T)[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  ariaLabel?: string;
}

/**
 * Pure CSS-driven SlidingTabs Component
 * - Solid White Button style matching globals.css (.btn-white: --btn-white-bg, --btn-white-text)
 * - Zero colored borders
 * - Zero layout shift: mathematical N-column grid with pure CSS transform
 * - 100% centered text and icons horizontally and vertically
 * - Supports clean 2-line text wrap without truncation
 */
export function SlidingTabs<T extends string>({
  options,
  value,
  onChange,
  className = "",
  size = "sm",
  ariaLabel = "Segmented controls",
}: SlidingTabsProps<T>) {
  const normalizedOptions: TabOption<T>[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const count = normalizedOptions.length;
  const activeIndex = Math.max(
    0,
    normalizedOptions.findIndex((opt) => opt.value === value)
  );

  const py = size === "sm" ? "py-1.5" : "py-2";
  const fontSize = size === "sm" ? "text-[11.5px] sm:text-[12px]" : "text-[12.5px] sm:text-[13px]";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`relative grid p-1 rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.08] select-none ${className}`}
      style={{
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
      }}
    >
      {/* 
        Pure CSS Sliding Pill Indicator:
        - Exact 1/N width of the inner track: calc((100% - 8px) / N)
        - Absolute 4px inset from edges (matching p-1 = 4px)
        - Pure GPU transform: translateX(index * 100%)
        - Adapts to 1-line or 2-line content automatically
      */}
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-lg bg-[var(--btn-white-bg,#EFF1F0)] shadow-sm pointer-events-none"
        style={{
          left: "4px",
          width: `calc((100% - 8px) / ${count})`,
          transform: `translateX(${activeIndex * 100}%)`,
          transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Segment Buttons (Equal width, 100% centered text, supports 2 lines) */}
      {normalizedOptions.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative z-10 w-full min-h-[34px] sm:min-h-[36px] ${py} px-1.5 sm:px-2 flex items-center justify-center text-center font-semibold ${fontSize} cursor-pointer transition-colors duration-150 ${
              isActive
                ? "text-[var(--btn-white-text,#252625)]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="flex items-center justify-center gap-1.5 text-center leading-tight max-w-full">
              {opt.icon && (
                <span className="shrink-0 flex items-center justify-center">
                  {opt.icon}
                </span>
              )}
              <span className="text-center leading-tight break-words line-clamp-2">
                {opt.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
