"use client";

import React from "react";

export interface DeviceThemeSwitchProps {
  value: "light" | "dark";
  onChange: (value: "light" | "dark") => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * DeviceThemeSwitch Component (Extracted 1:1 from Core `device-theme-seg.html` & `toolbar.css`)
 * 
 * Design Features:
 * - Exact visual reproduction of Core's `.vt.theme-seg` device theme switcher
 * - Uses `--card` (#1D1E1D) and `--card-muted` (#171817) from globals.css for dark mode
 * - Uses `--btn-white-bg` / white for light mode
 * - Butter-smooth cubic-bezier spring transition (0.2, 0.9, 0.3, 1.15)
 * - Zero layout shift with mathematical GPU 100% translation
 */
export function DeviceThemeSwitch({
  value,
  onChange,
  className = "",
  ariaLabel = "Device Theme (Light / Dark)",
}: DeviceThemeSwitchProps) {
  const isDark = value === "dark";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`relative inline-grid grid-cols-2 p-[2.5px] rounded-[12px] bg-slate-100 dark:bg-[var(--card-muted,#171817)] border border-slate-200/90 dark:border-[var(--border,#282928)] shadow-sm dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.15)] select-none shrink-0 ${className}`}
    >
      {/* Sliding Pill Indicator */}
      <span
        aria-hidden="true"
        className="absolute top-[2.5px] bottom-[2.5px] left-[2.5px] rounded-[8px] pointer-events-none bg-white dark:bg-[var(--card,#1D1E1D)] border border-slate-300/80 dark:border-white/[0.12] shadow-sm dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.9,0.3,1.15)] z-[1]"
        style={{
          width: "calc((100% - 5px) / 2)",
          transform: isDark ? "translateX(100%)" : "translateX(0%)",
        }}
      />

      {/* Light Option Button */}
      <button
        type="button"
        title="Light device theme"
        aria-pressed={!isDark}
        onClick={() => onChange("light")}
        className={`relative z-[2] w-[36px] h-[27px] flex items-center justify-center rounded-[8px] cursor-pointer transition-colors duration-200 ${
          !isDark
            ? "text-slate-900 dark:text-white"
            : "text-slate-400 dark:text-[var(--muted,#989A99)] hover:text-slate-700 dark:hover:text-[#f8fafc]"
        }`}
      >
        <span className="flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </span>
      </button>

      {/* Dark Option Button */}
      <button
        type="button"
        title="Dark device theme"
        aria-pressed={isDark}
        onClick={() => onChange("dark")}
        className={`relative z-[2] w-[36px] h-[27px] flex items-center justify-center rounded-[8px] cursor-pointer transition-colors duration-200 ${
          isDark
            ? "text-slate-900 dark:text-white"
            : "text-slate-400 dark:text-[var(--muted,#989A99)] hover:text-slate-700 dark:hover:text-[#f8fafc]"
        }`}
      >
        <span className="flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
