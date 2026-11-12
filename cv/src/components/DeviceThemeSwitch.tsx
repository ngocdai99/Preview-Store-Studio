"use client";

import React from "react";

export interface DeviceThemeSwitchProps {
  value: "light" | "dark";
  onChange: (value: "light" | "dark") => void;
  className?: string;
  ariaLabel?: string;
}

export function DeviceThemeSwitch({
  value,
  onChange,
  className = "",
  ariaLabel = "Theme (Light / Dark)",
}: DeviceThemeSwitchProps) {
  const isDark = value === "dark";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`relative inline-grid grid-cols-2 p-[2.5px] rounded-[10px] transition-colors duration-200 select-none shrink-0 ${
        isDark
          ? "bg-[#171817] border border-[#282928] shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
          : "bg-slate-200/80 border border-slate-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
      } ${className}`}
    >
      {/* Sliding Pill Indicator */}
      <span
        aria-hidden="true"
        className={`absolute top-[2px] bottom-[2px] left-[2px] rounded-[8px] pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.2,0.9,0.3,1.15)] z-[1] ${
          isDark
            ? "bg-[#252625] border border-white/[0.12] shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
            : "bg-white border border-slate-300/80 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        }`}
        style={{
          width: "calc((100% - 4px) / 2)",
          transform: isDark ? "translateX(100%)" : "translateX(0%)",
        }}
      />

      {/* Light Option Button */}
      <button
        type="button"
        title="Light mode"
        aria-pressed={!isDark}
        onClick={() => onChange("light")}
        className={`relative z-[2] w-[32px] h-[26px] flex items-center justify-center rounded-[8px] cursor-pointer transition-colors duration-200 ${
          !isDark
            ? "text-slate-900 font-semibold"
            : "text-[#888A88] hover:text-[#f8fafc]"
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
            className="w-3.5 h-3.5"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </span>
      </button>

      {/* Dark Option Button */}
      <button
        type="button"
        title="Dark mode"
        aria-pressed={isDark}
        onClick={() => onChange("dark")}
        className={`relative z-[2] w-[32px] h-[26px] flex items-center justify-center rounded-[8px] cursor-pointer transition-colors duration-200 ${
          isDark
            ? "text-white font-semibold"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <span className="flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
