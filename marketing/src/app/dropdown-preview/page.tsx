"use client";

import React, { useState } from "react";
import { StageViewDropdown } from "@/components/ui/StageViewDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Smartphone, ChevronDown, LayoutTemplate, Search } from "lucide-react";

export default function DropdownPreviewPage() {
  const [currentView, setCurrentView] = useState<"detail" | "search">("search");
  const [isDual, setIsDual] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-white/10 px-6 sm:px-10 flex items-center justify-between bg-white dark:bg-[#0c1222] shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Dropdown UI Showcase · Minimalist Menu
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-bold">
            {currentView} · dual: {isDual ? "ON" : "OFF"}
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Focus Area (Pure Dropdown Inspection, No Distractions) */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-2xl flex flex-col items-center gap-10">
          {/* Card 1: Live Interactive Toolbar */}
          <div className="w-full rounded-3xl p-8 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
              1. Live Interactive Toolbar (Bấm vào để thử đóng / mở)
            </span>

            <div className="h-48 flex items-start justify-center">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 shadow-sm">
                <StageViewDropdown
                  initialView={currentView}
                  initialDual={isDual}
                  onViewChange={(v) => setCurrentView(v)}
                  onDualChange={(d) => setIsDual(d)}
                />

                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12.5px] font-semibold bg-white dark:bg-[#0c1222] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/15 shadow-[0_2px_8px_rgba(15,23,42,0.06)] cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                  <span>Phone</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.4]" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Permanently Expanded Popover (Soi trực tiếp từng pixel, không sợ bị tắt) */}
          <div className="w-full rounded-3xl p-8 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
              2. Mở cố định để soi chi tiết (Không bao giờ tắt khi click)
            </span>

            {/* Standalone Visible Menu (Edge-to-Edge Indicator Strip Pattern matching Image 3) */}
            <div className="w-[196px] rounded-xl py-0 bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-white/15 shadow-[0_16px_36px_-4px_rgba(15,23,42,0.14),0_4px_12px_-2px_rgba(15,23,42,0.06)] dark:shadow-[0_20px_50px_-6px_rgba(0,0,0,0.8)] select-none overflow-hidden">
              <div className="px-3.5 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
                Preview Screen
              </div>

              <div>
                {/* Detail View */}
                <button
                  type="button"
                  onClick={() => setCurrentView("detail")}
                  className={`relative w-full h-[38px] flex items-center gap-2.5 px-3.5 text-left transition-colors cursor-pointer ${
                    currentView === "detail"
                      ? "bg-purple-500/10 dark:bg-purple-500/15 text-slate-900 dark:text-white font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Left Vertical Indicator Strip */}
                  {currentView === "detail" && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-[3px] bg-purple-600 dark:bg-purple-400" />
                  )}

                  <LayoutTemplate
                    className={`w-4 h-4 stroke-[2.2] shrink-0 ${
                      currentView === "detail"
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <span className="text-[13px] tracking-tight">Detail View</span>
                </button>

                {/* Search Result */}
                <button
                  type="button"
                  onClick={() => setCurrentView("search")}
                  className={`relative w-full h-[38px] flex items-center gap-2.5 px-3.5 text-left transition-colors cursor-pointer ${
                    currentView === "search"
                      ? "bg-amber-500/10 dark:bg-amber-500/15 text-slate-900 dark:text-white font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Left Vertical Indicator Strip */}
                  {currentView === "search" && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-[3px] bg-amber-500 dark:bg-amber-400" />
                  )}

                  <Search
                    className={`w-4 h-4 stroke-[2.2] shrink-0 ${
                      currentView === "search"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <span className="text-[13px] tracking-tight">Search Result</span>
                </button>
              </div>

              {/* Full-width Divider */}
              <div className="h-px bg-slate-100 dark:bg-white/[0.08]" />

              {/* Comparison Section */}
              <div className="px-3.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500">
                Comparison
              </div>

              {/* Dual Phone (Titanium Slate Indicator - Strictly Avoids Store Blue & Green) */}
              <button
                type="button"
                onClick={() => setIsDual(!isDual)}
                className={`relative w-full h-[38px] flex items-center gap-2.5 px-3.5 text-left transition-colors cursor-pointer ${
                  isDual
                    ? "bg-slate-500/10 dark:bg-slate-500/15 text-slate-900 dark:text-white font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                }`}
              >
                {/* Left Vertical Indicator Strip */}
                {isDual && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-[3px] bg-slate-600 dark:bg-slate-300" />
                )}

                <Smartphone
                  className={`w-4 h-4 stroke-[2.2] shrink-0 ${
                    isDual ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <span className="text-[13px] tracking-tight">Dual Phone</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
