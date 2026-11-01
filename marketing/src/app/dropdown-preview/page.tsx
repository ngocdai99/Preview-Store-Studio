"use client";

import React, { useState } from "react";
import { StageViewDropdown } from "@/components/ui/StageViewDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Smartphone } from "lucide-react";

export default function DropdownPreviewPage() {
  const [currentView, setCurrentView] = useState<"detail" | "search">("search");
  const [isDual, setIsDual] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070a14] p-6 sm:p-12 transition-colors">
      {/* Top Bar with theme toggle & title */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Stage View Dropdown Showcase
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current mode: <strong className="text-indigo-600 dark:text-indigo-400">{currentView}</strong> · Dual Mode:{" "}
            <strong className={isDual ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
              {isDual ? "ON" : "OFF"}
            </strong>
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Simulated Studio Canvas Canvas */}
      <div className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 bg-white/70 dark:bg-[#0e1526]/70 border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-md">
        {/* Mock Toolbar */}
        <div className="flex items-center gap-3 mb-8 p-2 rounded-2xl bg-white/90 dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 shadow-sm w-fit">
          <StageViewDropdown
            initialView={currentView}
            initialDual={isDual}
            onViewChange={(v) => setCurrentView(v)}
            onDualChange={(d) => setIsDual(d)}
          />

          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-[13px] font-semibold bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Phone</span>
            <span className="text-slate-400">▾</span>
          </button>
        </div>

        {/* Mock Stage Display */}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 p-8 text-center bg-slate-50/50 dark:bg-black/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 mb-3">
            Active Layout Simulation
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentView === "detail" ? "Product Detail Page" : "App Store Search Result"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {isDual
              ? "Dual-Phone mode is active: Rendering side-by-side Apple iPhone 16 Pro and Google Pixel 9 frames."
              : "Single-Phone mode: Rendering dedicated focus viewport."}
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
            <div className="w-56 h-80 rounded-[32px] border-4 border-slate-900 dark:border-slate-700 bg-slate-950 p-3 shadow-xl flex flex-col justify-between text-left">
              <div className="text-[11px] font-bold text-sky-400">App Store · iOS</div>
              <div className="space-y-1">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 mb-2" />
                <div className="h-3 w-28 bg-white/20 rounded" />
                <div className="h-2 w-20 bg-white/10 rounded" />
              </div>
              <div className="text-[10px] text-slate-500">Notion Preview</div>
            </div>

            {isDual && (
              <div className="w-56 h-80 rounded-[32px] border-4 border-slate-900 dark:border-slate-700 bg-slate-950 p-3 shadow-xl flex flex-col justify-between text-left animate-in fade-in duration-200">
                <div className="text-[11px] font-bold text-emerald-400">Google Play · Android</div>
                <div className="space-y-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 mb-2" />
                  <div className="h-3 w-28 bg-white/20 rounded" />
                  <div className="h-2 w-20 bg-white/10 rounded" />
                </div>
                <div className="text-[10px] text-slate-500">Notion Preview</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
