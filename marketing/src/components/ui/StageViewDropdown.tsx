"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  LayoutTemplate,
  Smartphone,
} from "lucide-react";

export interface StageViewDropdownProps {
  initialView?: "detail" | "search";
  initialDual?: boolean;
  forceOpen?: boolean;
  colorScheme?: "monochrome" | "indigo" | "rainbow";
  onViewChange?: (view: "detail" | "search") => void;
  onDualChange?: (dual: boolean) => void;
  className?: string;
}

export function StageViewDropdown({
  initialView = "search",
  initialDual = true,
  forceOpen,
  colorScheme = "monochrome",
  onViewChange,
  onDualChange,
  className = "",
}: StageViewDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(forceOpen ?? true);
  const [activeView, setActiveView] = useState<"detail" | "search">(initialView);
  const [isDual, setIsDual] = useState(initialDual);
  const containerRef = useRef<HTMLDivElement>(null);

  const isOpen = forceOpen !== undefined ? forceOpen : internalOpen;

  useEffect(() => {
    if (forceOpen !== undefined) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setInternalOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setInternalOpen(false);
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
  }, [isOpen, forceOpen]);

  const handleSelectView = (view: "detail" | "search") => {
    setActiveView(view);
    onViewChange?.(view);
    if (forceOpen === undefined) {
      setInternalOpen(false);
    }
  };

  const handleToggleDual = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isDual;
    setIsDual(next);
    onDualChange?.(next);
  };

  const isDetail = activeView === "detail";

  // Trigger button styling
  let triggerBtnActiveStyle = "bg-slate-100/90 dark:bg-white/[0.08] text-slate-900 dark:text-white border-slate-400/80 dark:border-white/30 shadow-sm";
  let triggerIconColor = "text-slate-900 dark:text-white";

  if (colorScheme === "indigo") {
    triggerBtnActiveStyle = "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-950 dark:text-indigo-200 border-indigo-400 dark:border-indigo-400/50 shadow-[0_2px_10px_rgba(99,102,241,0.18)]";
    triggerIconColor = "text-indigo-600 dark:text-indigo-400";
  } else if (colorScheme === "rainbow") {
    if (isDetail) {
      triggerBtnActiveStyle = "bg-purple-50/80 dark:bg-purple-500/10 text-purple-950 dark:text-purple-200 border-purple-400 dark:border-purple-400/50 shadow-[0_2px_10px_rgba(168,85,247,0.2)]";
      triggerIconColor = "text-purple-600 dark:text-purple-400";
    } else {
      triggerBtnActiveStyle = "bg-amber-50/80 dark:bg-amber-500/10 text-amber-950 dark:text-amber-200 border-amber-400 dark:border-amber-400/50 shadow-[0_2px_10px_rgba(245,158,11,0.2)]";
      triggerIconColor = "text-amber-600 dark:text-amber-400";
    }
  }

  // Active items styling
  const getActiveItemClasses = (type: "detail" | "search" | "dual") => {
    if (colorScheme === "indigo") {
      return {
        row: "bg-indigo-500/10 dark:bg-indigo-500/15 text-slate-900 dark:text-white font-bold",
        strip: "bg-indigo-600 dark:bg-indigo-400",
        ico: "text-indigo-600 dark:text-indigo-400",
      };
    }
    if (colorScheme === "rainbow") {
      if (type === "detail") {
        return {
          row: "bg-purple-500/10 dark:bg-purple-500/15 text-slate-900 dark:text-white font-bold",
          strip: "bg-purple-600 dark:bg-purple-400",
          ico: "text-purple-600 dark:text-purple-400",
        };
      }
      if (type === "search") {
        return {
          row: "bg-amber-500/10 dark:bg-amber-500/15 text-slate-900 dark:text-white font-bold",
          strip: "bg-amber-500 dark:bg-amber-400",
          ico: "text-amber-600 dark:text-amber-400",
        };
      }
      return {
        row: "bg-slate-500/10 dark:bg-slate-500/15 text-slate-900 dark:text-white font-bold",
        strip: "bg-slate-600 dark:bg-slate-300",
        ico: "text-slate-700 dark:text-slate-200",
      };
    }
    // Default: monochrome (Titanium Slate)
    return {
      row: "bg-slate-900/[0.06] dark:bg-white/[0.08] text-slate-900 dark:text-white font-bold",
      strip: "bg-slate-900 dark:bg-white",
      ico: "text-slate-900 dark:text-white",
    };
  };

  const detailActive = getActiveItemClasses("detail");
  const searchActive = getActiveItemClasses("search");
  const dualActive = getActiveItemClasses("dual");

  return (
    <div ref={containerRef} className={`relative inline-block text-left select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (forceOpen === undefined) setInternalOpen(!internalOpen);
        }}
        className={`group inline-flex items-center gap-2 h-9 px-3 rounded-xl text-[12.5px] font-semibold transition-all duration-200 cursor-pointer border ${
          isOpen
            ? triggerBtnActiveStyle
            : "bg-white dark:bg-[#0c1222] text-slate-800 dark:text-slate-100 border-slate-300 dark:border-white/15 hover:border-slate-400 dark:hover:border-white/30 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Leading Bare Icon */}
        <span className={`shrink-0 transition-colors ${isOpen ? triggerIconColor : "text-slate-600 dark:text-slate-300"}`}>
          {isDetail ? (
            <LayoutTemplate className="w-4 h-4 stroke-[2.2]" />
          ) : (
            <Search className="w-4 h-4 stroke-[2.2]" />
          )}
        </span>

        {/* View Name */}
        <span className="tracking-tight">{isDetail ? "Detail View" : "Search Result"}</span>

        {/* Dual Pill Badge */}
        {isDual && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-white dark:bg-white/20 dark:text-slate-100 leading-none shadow-sm">
            Dual
          </span>
        )}

        {/* Caret Down / Up */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[2.4] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu (Edge Strip Indicator Pattern matching Device Selector) */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-[196px] rounded-xl py-0 z-50 bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-white/15 shadow-[0_16px_36px_-4px_rgba(15,23,42,0.14),0_4px_12px_-2px_rgba(15,23,42,0.06)] dark:shadow-[0_20px_50px_-6px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-150 origin-top-left overflow-hidden">
          {/* Section: Preview Screen */}
          <div className="px-3.5 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
            Preview Screen
          </div>

          <div>
            {/* Option: Detail View */}
            <button
              type="button"
              onClick={() => handleSelectView("detail")}
              className={`relative w-full h-[38px] flex items-center gap-2.5 px-3.5 text-left transition-colors cursor-pointer ${
                isDetail
                  ? detailActive.row
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
              }`}
            >
              {/* Left Vertical Indicator Strip */}
              {isDetail && (
                <span className={`absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-[3px] ${detailActive.strip}`} />
              )}

              <LayoutTemplate
                className={`w-4 h-4 stroke-[2.2] shrink-0 ${
                  isDetail ? detailActive.ico : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <span className="text-[13px] tracking-tight">Detail View</span>
            </button>

            {/* Option: Search Result */}
            <button
              type="button"
              onClick={() => handleSelectView("search")}
              className={`relative w-full h-[38px] flex items-center gap-2.5 px-3.5 text-left transition-colors cursor-pointer ${
                !isDetail
                  ? searchActive.row
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
              }`}
            >
              {/* Left Vertical Indicator Strip */}
              {!isDetail && (
                <span className={`absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-[3px] ${searchActive.strip}`} />
              )}

              <Search
                className={`w-4 h-4 stroke-[2.2] shrink-0 ${
                  !isDetail ? searchActive.ico : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <span className="text-[13px] tracking-tight">Search Result</span>
            </button>
          </div>

          {/* Full-width Divider */}
          <div className="h-px bg-slate-100 dark:bg-white/[0.08]" />

          {/* Section: Comparison */}
          <div className="px-3.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
            Comparison
          </div>

          {/* Option: Dual Phone */}
          <button
            type="button"
            onClick={handleToggleDual}
            className={`relative w-full h-[38px] flex items-center gap-2.5 px-3.5 text-left transition-colors cursor-pointer ${
              isDual
                ? dualActive.row
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
            }`}
          >
            {/* Left Vertical Indicator Strip */}
            {isDual && (
              <span className={`absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-[3px] ${dualActive.strip}`} />
            )}

            <Smartphone
              className={`w-4 h-4 stroke-[2.2] shrink-0 ${
                isDual ? dualActive.ico : "text-slate-400 dark:text-slate-500"
              }`}
            />
            <span className="text-[13px] tracking-tight">Dual Phone</span>
          </button>
        </div>
      )}
    </div>
  );
}
