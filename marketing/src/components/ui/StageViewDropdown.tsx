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

  // Close when clicking outside or pressing Escape
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
    setIsOpen(false);
  };

  const handleToggleDual = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isDual;
    setIsDual(next);
    onDualChange?.(next);
  };

  const isDetail = activeView === "detail";

  return (
    <div ref={containerRef} className={`relative inline-block text-left select-none ${className}`}>
      {/* Trigger Button (Compact macOS Toolbar Pill) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer border ${
          isOpen
            ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border-slate-300 dark:border-white/20 shadow-sm"
            : "bg-white dark:bg-[#0e1526] text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Bare Icon */}
        <span
          className={`shrink-0 ${
            isDetail ? "text-purple-600 dark:text-purple-400" : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {isDetail ? (
            <LayoutTemplate className="w-3.5 h-3.5 stroke-[2]" />
          ) : (
            <Search className="w-3.5 h-3.5 stroke-[2]" />
          )}
        </span>

        {/* View Name */}
        <span>{isDetail ? "Detail View" : "Search Result"}</span>

        {/* Subtle Dual Badge */}
        {isDual && (
          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 leading-tight">
            Dual
          </span>
        )}

        {/* Caret Down */}
        <ChevronDown
          className={`w-3 h-3 text-slate-400 dark:text-slate-500 stroke-[2.2] transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Native macOS / Raycast Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-[185px] rounded-xl p-1 z-50 bg-white/90 dark:bg-[#121826]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_10px_28px_-4px_rgba(15,23,42,0.14),0_2px_6px_rgba(15,23,42,0.04)] dark:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-100 origin-top-left">
          {/* Section: Preview Screen */}
          <div className="px-2 pt-1 pb-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
            Preview Screen
          </div>

          <div className="space-y-0.5">
            {/* Option: Detail View */}
            <button
              type="button"
              onClick={() => handleSelectView("detail")}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors duration-100 cursor-pointer ${
                isDetail
                  ? "bg-slate-100/90 dark:bg-white/10 text-slate-900 dark:text-white font-medium"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <LayoutTemplate
                  className={`w-3.5 h-3.5 stroke-[1.8] shrink-0 ${
                    isDetail ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="text-[12px] truncate">Detail View</span>
              </div>
              {isDetail && (
                <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 stroke-[2.4] shrink-0" />
              )}
            </button>

            {/* Option: Search Result */}
            <button
              type="button"
              onClick={() => handleSelectView("search")}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors duration-100 cursor-pointer ${
                !isDetail
                  ? "bg-slate-100/90 dark:bg-white/10 text-slate-900 dark:text-white font-medium"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search
                  className={`w-3.5 h-3.5 stroke-[1.8] shrink-0 ${
                    !isDetail ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="text-[12px] truncate">Search Result</span>
              </div>
              {!isDetail && (
                <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 stroke-[2.4] shrink-0" />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200/70 dark:bg-white/[0.08] my-1 mx-1" />

          {/* Section: Comparison */}
          <div className="px-2 pt-0.5 pb-0.5 text-[9.5px] font-bold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
            Comparison
          </div>

          {/* Option: Dual Phone (macOS Checkmark Toggle Style) */}
          <button
            type="button"
            onClick={handleToggleDual}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors duration-100 cursor-pointer ${
              isDual
                ? "bg-slate-100/90 dark:bg-white/10 text-slate-900 dark:text-white font-medium"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Smartphone
                className={`w-3.5 h-3.5 stroke-[1.8] shrink-0 ${
                  isDual ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <span className="text-[12px] truncate">Dual Phone</span>
            </div>
            {isDual && (
              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[2.4] shrink-0" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
