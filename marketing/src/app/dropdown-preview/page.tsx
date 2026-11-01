"use client";

import React, { useState } from "react";
import { StageViewDropdown } from "@/components/ui/StageViewDropdown";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Smartphone, ChevronDown, Sparkles, Shield, Palette } from "lucide-react";

export default function DropdownPreviewPage() {
  const [currentView, setCurrentView] = useState<"detail" | "search">("search");
  const [isDual, setIsDual] = useState(true);
  const [palette, setPalette] = useState<"monochrome" | "indigo" | "rainbow">("monochrome");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-white/10 px-6 sm:px-10 flex items-center justify-between bg-white dark:bg-[#0c1222] shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Stage View Dropdown · Palette Comparison
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-bold">
            {currentView} · dual: {isDual ? "ON" : "OFF"}
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Focus Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-3xl flex flex-col items-center gap-8">
          
          {/* Palette Selector Bar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Chọn phương án phối màu:
              </span>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-xs font-semibold">
              {/* Option 1: Monochrome Slate (Recommended) */}
              <button
                type="button"
                onClick={() => setPalette("monochrome")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  palette === "monochrome"
                    ? "bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                <span>1. Titanium Slate (Khuyên dùng)</span>
              </button>

              {/* Option 2: Unified Studio Indigo */}
              <button
                type="button"
                onClick={() => setPalette("indigo")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  palette === "indigo"
                    ? "bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-300 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>2. Studio Indigo</span>
              </button>

              {/* Option 3: Rainbow (Old) */}
              <button
                type="button"
                onClick={() => setPalette("rainbow")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  palette === "rainbow"
                    ? "bg-white dark:bg-[#1e293b] text-amber-600 dark:text-amber-300 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>3. 3 Màu Cũ (Tím/Cam/Xám)</span>
              </button>
            </div>
          </div>

          {/* Cards Grid: 2 Columns */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Live Interactive Toolbar */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6 text-center">
                1. Thanh tương tác Toolbar (Bấm để đóng / mở)
              </span>

              <div className="h-52 flex items-start justify-center">
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 shadow-sm">
                  <StageViewDropdown
                    key={`interactive-${palette}`}
                    initialView={currentView}
                    initialDual={isDual}
                    colorScheme={palette}
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

            {/* Card 2: Permanently Expanded Popover */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6 text-center">
                2. Soi cận cảnh chi tiết (Mở cố định)
              </span>

              <div className="h-52 flex items-start justify-center">
                <StageViewDropdown
                  key={`fixed-${palette}`}
                  initialView={currentView}
                  initialDual={isDual}
                  forceOpen={true}
                  colorScheme={palette}
                  onViewChange={(v) => setCurrentView(v)}
                  onDualChange={(d) => setIsDual(d)}
                />
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="w-full p-5 rounded-2xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-white font-bold block mb-1">
              💡 Tại sao phương án 1 (Titanium Slate) là tối ưu nhất?
            </strong>
            <p>
              Trên Canvas hiện tại đã có 2 màu thương hiệu chủ lực: <strong>Apple Blue</strong> (#0071e3) và <strong>Google Play Green</strong> (#059669). Nếu thanh công cụ dùng thêm Tím và Cam, cả màn hình sẽ bị loạn 4-5 màu. Dùng <strong>Titanium Slate</strong> đơn sắc trung tính giúp Stage View hoạt động như một công cụ Pro thanh lịch (tương tự Figma, Linear, macOS), nhường toàn bộ spotlight thị giác cho Mockup điện thoại của người dùng.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
