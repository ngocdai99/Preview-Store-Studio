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
  forceOpen?: boolean;
  onViewChange?: (view: "detail" | "search") => void;
  onDualChange?: (dual: boolean) => void;
  className?: string;
}

export function StageViewDropdown({
  initialView = "search",
  initialDual = true,
  forceOpen,
  onViewChange,
  onDualChange,
  className = "",
}: StageViewDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(forceOpen ?? true);
  const [activeView, setActiveView] = useState<"detail" | "search">(initialView);
  const [isDual, setIsDual] = useState(initialDual);
  const containerRef = useRef<HTMLDivElement>(null);

  const isOpen = forceOpen !== undefined ? forceOpen : internalOpen;

  // Close when clicking outside (only if not forced open)
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
            ? isDetail
              ? "bg-purple-50 dark:bg-purple-500/15 text-purple-950 dark:text-purple-200 border-purple-400 dark:border-purple-400/50 shadow-[0_2px_12px_rgba(168,85,247,0.25),0_0_0_2px_rgba(168,85,247,0.2)]"
              : "bg-amber-50 dark:bg-amber-500/15 text-amber-950 dark:text-amber-200 border-amber-400 dark:border-amber-400/50 shadow-[0_2px_12px_rgba(245,158,11,0.25),0_0_0_2px_rgba(245,158,11,0.2)]"
            : "bg-white dark:bg-[#0c1222] text-slate-800 dark:text-slate-100 border-slate-300 dark:border-white/15 hover:border-slate-400 dark:hover:border-white/30 shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Bare Leading Icon */}
        <span
          className={`shrink-0 transition-colors ${
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
        <span className="tracking-tight">{isDetail ? "Detail View" : "Search Result"}</span>

        {/* Subtle Dual Badge */}
        {isDual && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white/20 dark:text-slate-100 leading-none shadow-sm">
            Dual
          </span>
        )}

        {/* Caret Down */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[2.4] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* High-Contrast Floating Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-[210px] rounded-2xl p-1.5 z-50 bg-white dark:bg-[#0e1628] border-2 border-slate-200/90 dark:border-white/15 shadow-[0_20px_48px_-8px_rgba(15,23,42,0.24),0_4px_16px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_60px_-8px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] animate-in fade-in zoom-in-95 duration-150 origin-top-left">
          {/* Section: Preview Screen */}
          <div className="px-2.5 pt-1.5 pb-1 text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
            Preview Screen
          </div>

          <div className="space-y-1">
            {/* Option: Detail View */}
            <button
              type="button"
              onClick={() => handleSelectView("detail")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                isDetail
                  ? "bg-purple-500/10 dark:bg-purple-500/20 text-purple-950 dark:text-purple-200 font-bold border border-purple-500/25 shadow-sm"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <LayoutTemplate
                  className={`w-4 h-4 stroke-[2] shrink-0 ${
                    isDetail ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="text-[12.5px] tracking-tight">Detail View</span>
              </div>
              {isDetail && (
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 stroke-[2.8] shrink-0" />
              )}
            </button>

            {/* Option: Search Result */}
            <button
              type="button"
              onClick={() => handleSelectView("search")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                !isDetail
                  ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-950 dark:text-amber-200 font-bold border border-amber-500/25 shadow-sm"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search
                  className={`w-4 h-4 stroke-[2] shrink-0 ${
                    !isDetail ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="text-[12.5px] tracking-tight">Search Result</span>
              </div>
              {!isDetail && (
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.8] shrink-0" />
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200 dark:bg-white/10 my-1.5 mx-1" />

          {/* Section: Comparison */}
          <div className="px-2.5 pt-0.5 pb-1 text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
            Comparison
          </div>

          {/* Option: Dual Phone (Neutral Slate / Titanium - Avoids Store Blue & Green) */}
          <button
            type="button"
            onClick={handleToggleDual}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer ${
              isDual
                ? "bg-slate-100 dark:bg-white/15 text-slate-900 dark:text-white font-bold border border-slate-300/80 dark:border-white/20 shadow-sm"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Smartphone
                className={`w-4 h-4 stroke-[2] shrink-0 ${
                  isDual ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <span className="text-[12.5px] tracking-tight">Dual Phone</span>
            </div>
            {isDual && (
              <Check className="w-4 h-4 text-slate-800 dark:text-white stroke-[2.8] shrink-0" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
