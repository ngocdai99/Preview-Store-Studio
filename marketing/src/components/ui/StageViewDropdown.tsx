"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Search,
  LayoutTemplate,
  Smartphone,
} from "lucide-react";

export interface StageViewDropdownProps {
  initialView?: "detail" | "search";
  initialDual?: boolean;
  onViewChange?: (view: "detail" | "search") => void;
  onDualChange?: (dual: boolean) => void;
  className?: string;
}

export function StageViewDropdown({
  initialView = "search",
  initialDual = true,
  onViewChange,
  onDualChange,
  className = "",
}: StageViewDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<"detail" | "search">(initialView);
  const [isDual, setIsDual] = useState(initialDual);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectView = (view: "detail" | "search") => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const handleToggleDual = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isDual;
    setIsDual(next);
    onDualChange?.(next);
  };

  const isDetail = activeView === "detail";

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-2 h-10 px-3.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer select-none border backdrop-blur-md ${
          isOpen
            ? isDetail
              ? "bg-purple-500/10 text-purple-900 dark:text-purple-200 border-purple-500/50 shadow-[0_2px_12px_rgba(168,85,247,0.2),0_0_0_2px_rgba(168,85,247,0.2)]"
              : "bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/50 shadow-[0_2px_12px_rgba(245,158,11,0.2),0_0_0_2px_rgba(245,158,11,0.2)]"
            : isDetail
            ? "bg-white/95 dark:bg-[#0c1222]/90 text-slate-800 dark:text-slate-100 border-purple-300/80 dark:border-purple-500/30 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:border-purple-400 hover:shadow-[0_4px_12px_rgba(168,85,247,0.15)]"
            : "bg-white/95 dark:bg-[#0c1222]/90 text-slate-800 dark:text-slate-100 border-amber-300/80 dark:border-amber-500/30 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:border-amber-400 hover:shadow-[0_4px_12px_rgba(245,158,11,0.15)]"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Leading Dynamic Icon */}
        <span
          className={`flex items-center justify-center shrink-0 transition-colors ${
            isDetail ? "text-purple-600 dark:text-purple-400" : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {isDetail ? (
            <LayoutTemplate className="w-4 h-4 stroke-[2.2]" />
          ) : (
            <Search className="w-4 h-4 stroke-[2.2]" />
          )}
        </span>

        {/* View Name */}
        <span className="tracking-[-0.01em]">
          {isDetail ? "Detail View" : "Search Result"}
        </span>

        {/* Optional Dual Badge */}
        {isDual && (
          <span className="inline-flex items-center text-[10.5px] font-bold px-2 py-0.5 rounded-full leading-none tracking-wide uppercase bg-slate-900 text-white dark:bg-white/15 dark:text-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.15)] shrink-0">
            Dual
          </span>
        )}

        {/* Caret Chevron */}
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500 stroke-[2.4] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-60 rounded-2xl p-1.5 z-50 bg-white/95 dark:bg-[#0c1324]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-[0_16px_36px_-6px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.04)] dark:shadow-[0_20px_40px_-6px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-150 origin-top-left">
          {/* Section: Preview Screen */}
          <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
            Preview Screen
          </div>

          <div className="space-y-0.5">
            {/* Option: Detail View */}
            <button
              type="button"
              onClick={() => handleSelectView("detail")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                isDetail
                  ? "bg-purple-500/10 text-purple-900 dark:text-purple-200 font-semibold shadow-sm"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isDetail
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                      : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <LayoutTemplate className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span className="text-[13px] tracking-tight">Detail View</span>
              </div>

              {/* Checkmark Active Indicator */}
              {isDetail && (
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 stroke-[2.6] shrink-0" />
              )}
            </button>

            {/* Option: Search Result */}
            <button
              type="button"
              onClick={() => handleSelectView("search")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                !isDetail
                  ? "bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold shadow-sm"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    !isDetail
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span className="text-[13px] tracking-tight">Search Result</span>
              </div>

              {/* Checkmark Active Indicator */}
              {!isDetail && (
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.6] shrink-0" />
              )}
            </button>
          </div>

          {/* Subtle Divider */}
          <div className="h-px bg-slate-200/60 dark:bg-white/[0.08] my-1.5 mx-1" />

          {/* Section: Comparison */}
          <div className="px-2.5 pt-1 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
            Comparison
          </div>

          {/* Option: Dual Phone Toggle */}
          <button
            type="button"
            onClick={handleToggleDual}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
              isDual
                ? "bg-slate-100/90 dark:bg-white/[0.07] text-slate-900 dark:text-white"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isDual
                    ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-[13px] font-medium tracking-tight">Dual Phone</span>
            </div>

            {/* Apple/macOS Styled Toggle Switch */}
            <div
              className={`w-8 h-[18px] rounded-full p-[2px] transition-colors duration-200 ease-out flex items-center ${
                isDual
                  ? "bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                  : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                  isDual ? "translate-x-3.5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
