"use client";

import React, { useState } from "react";
import { StageViewDropdown } from "@/components/ui/StageViewDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Smartphone, ChevronDown, Check, LayoutTemplate, Search } from "lucide-react";

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

            {/* Standalone Visible Menu */}
            <div className="w-[220px] rounded-2xl p-2 bg-white dark:bg-[#0e1628] border-2 border-slate-200 dark:border-white/15 shadow-[0_20px_48px_-8px_rgba(15,23,42,0.22),0_4px_16px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_60px_-8px_rgba(0,0,0,0.85)] select-none">
              <div className="px-2.5 pt-1.5 pb-1 text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                Preview Screen
              </div>

              <div className="space-y-1">
                {/* Detail View */}
                <button
                  type="button"
                  onClick={() => setCurrentView("detail")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    currentView === "detail"
                      ? "bg-purple-500/10 dark:bg-purple-500/20 text-purple-950 dark:text-purple-200 font-bold border border-purple-500/25 shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <LayoutTemplate
                      className={`w-4 h-4 stroke-[2] shrink-0 ${
                        currentView === "detail"
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span className="text-[12.5px] tracking-tight">Detail View</span>
                  </div>
                  {currentView === "detail" && (
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 stroke-[2.8] shrink-0" />
                  )}
                </button>

                {/* Search Result */}
                <button
                  type="button"
                  onClick={() => setCurrentView("search")}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    currentView === "search"
                      ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-950 dark:text-amber-200 font-bold border border-amber-500/25 shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Search
                      className={`w-4 h-4 stroke-[2] shrink-0 ${
                        currentView === "search"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span className="text-[12.5px] tracking-tight">Search Result</span>
                  </div>
                  {currentView === "search" && (
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.8] shrink-0" />
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200 dark:bg-white/10 my-2 mx-1" />

              {/* Comparison Section */}
              <div className="px-2.5 pt-0.5 pb-1 text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                Comparison
              </div>

              {/* Dual Phone */}
              <button
                type="button"
                onClick={() => setIsDual(!isDual)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isDual
                    ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-950 dark:text-blue-200 font-bold border border-blue-500/25 shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Smartphone
                    className={`w-4 h-4 stroke-[2] shrink-0 ${
                      isDual ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <span className="text-[12.5px] tracking-tight">Dual Phone</span>
                </div>
                {isDual && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.8] shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
