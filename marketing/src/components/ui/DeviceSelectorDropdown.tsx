"use client";

import React from "react";

export interface DeviceOption {
  value: "phone" | "tablet";
  label: string;
  icon?: React.ReactNode;
}

export interface DeviceSelectorDropdownProps {
  value: "phone" | "tablet";
  onChange: (value: "phone" | "tablet") => void;
  options?: DeviceOption[];
  className?: string;
  label?: string;
}

const DEFAULT_OPTIONS: DeviceOption[] = [
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
        className="w-4 h-4"
      >
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <circle cx="12" cy="5" r="0.8" fill="currentColor" />
        <line x1="10" y1="19" x2="14" y2="19" />
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
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <rect x="4" y="2" width="16" height="20" rx="2.5" />
        <line x1="10" y1="19" x2="14" y2="19" />
      </svg>
    ),
  },
];

/**
 * DeviceSelectorMenu Component
 * 
 * Directly displays the Core Stage Device Menu Panel (No trigger button or hover needed).
 * - Matches Core's `#menuAppleDevice` styling
 * - Core Apple Blue indicator strip on the left edge (`w-[3px] bg-[#0071e3] / gradient from #38bdf8 to #0071e3`)
 * - Core Apple Blue tinted active background
 * - Directly accessible with 1 click, zero popup overlay or layout shift
 */
export function DeviceSelectorDropdown({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className = "",
  label = "iPhone / iPad",
}: DeviceSelectorDropdownProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`rounded-xl bg-white dark:bg-[#141514] border border-slate-200/90 dark:border-[#282928] shadow-sm dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)] py-1.5 px-1 w-[150px] sm:w-[160px] select-none shrink-0 ${className}`}
    >
      {/* Category Header Label */}
      <div className="px-2.5 pt-0.5 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#64748b]">
        {label}
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-0.5">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`relative flex items-center gap-2.5 w-full h-[32px] sm:h-[34px] px-2.5 rounded-lg text-left text-[12.5px] sm:text-[13px] cursor-pointer transition-colors duration-150 ${
                isSelected
                  ? "bg-[#0071e3]/10 dark:bg-[#0071e3]/[0.15] text-[#0071e3] dark:text-white font-semibold"
                  : "text-slate-600 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] font-medium"
              }`}
            >
              {/* Active Indicator Bar on the Left Edge (Core Apple Blue) */}
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r bg-[#0071e3] dark:bg-gradient-to-b dark:from-[#38bdf8] dark:to-[#0071e3]"
                />
              )}

              {/* Icon */}
              <span
                className={`inline-flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "text-[#0071e3] dark:text-[#38bdf8]"
                    : "text-slate-400 dark:text-[#94a3b8]"
                }`}
              >
                {opt.icon}
              </span>

              {/* Label */}
              <span className="flex-1 truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
