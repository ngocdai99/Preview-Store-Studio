"use client";

import React, { useState } from "react";
import { StageViewDropdown } from "@/components/ui/StageViewDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Smartphone, ChevronDown } from "lucide-react";

export default function DropdownPreviewPage() {
  const [currentView, setCurrentView] = useState<"detail" | "search">("search");
  const [isDual, setIsDual] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060a12] text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-200/80 dark:border-white/10 px-6 flex items-center justify-between bg-white/70 dark:bg-[#0c1222]/70 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Stage View Dropdown · macOS Style
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-mono">
            {currentView} {isDual ? "+ dual" : "+ single"}
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Grid Canvas matching Store Preview Studio */}
      <main className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-start bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Real-size Floating Toolbar */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/95 dark:bg-[#0f172a]/95 border border-slate-200/90 dark:border-white/10 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6)] backdrop-blur-xl mb-8">
          <StageViewDropdown
            initialView={currentView}
            initialDual={isDual}
            onViewChange={(v) => setCurrentView(v)}
            onDualChange={(d) => setIsDual(d)}
          />

          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium bg-white dark:bg-[#0e1526] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2]" />
            <span>Phone</span>
            <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2.2]" />
          </button>
        </div>

        {/* Realistic Dual Phone Stage */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {/* Phone 1: App Store (iPhone) */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              App Store · iPhone
            </span>
            <div className="w-[280px] h-[580px] rounded-[48px] p-3 bg-black border-[4px] border-slate-800 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden relative">
              {/* Dynamic Island */}
              <div className="w-24 h-5 rounded-full bg-black mx-auto mb-3 mt-1" />
              <div className="p-2 space-y-3">
                <div className="h-6 rounded-lg bg-white/10 flex items-center px-2 text-[10px] text-slate-400">
                  {currentView === "search" ? "🔍 Notion" : "Notion: Notes, Tasks"}
                </div>
                <div className="flex gap-2.5 items-center">
                  <div className="w-12 h-12 rounded-xl bg-white/20" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-24 bg-white/30 rounded" />
                    <div className="h-2.5 w-16 bg-white/15 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <div className="h-32 bg-white/10 rounded-lg" />
                  <div className="h-32 bg-white/10 rounded-lg" />
                  <div className="h-32 bg-white/10 rounded-lg" />
                </div>
              </div>
              <div className="h-1 w-28 bg-white/40 rounded-full mx-auto mb-2" />
            </div>
          </div>

          {/* Phone 2: Google Play (Android) */}
          {isDual && (
            <div className="flex flex-col items-center gap-3 animate-in fade-in duration-200">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Google Play · Android
              </span>
              <div className="w-[280px] h-[580px] rounded-[42px] p-3 bg-black border-[4px] border-slate-800 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden relative">
                {/* Punch hole camera */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 mx-auto mt-1" />
                <div className="p-2 space-y-3">
                  <div className="h-6 rounded-lg bg-white/10 flex items-center px-2 text-[10px] text-slate-400">
                    {currentView === "search" ? "🔍 Notion" : "Notion"}
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/20" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-24 bg-white/30 rounded" />
                      <div className="h-2.5 w-16 bg-white/15 rounded" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-2">
                    <div className="h-32 bg-white/10 rounded-lg" />
                    <div className="h-32 bg-white/10 rounded-lg" />
                    <div className="h-32 bg-white/10 rounded-lg" />
                  </div>
                </div>
                <div className="h-1 w-20 bg-white/30 rounded-full mx-auto mb-2" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
