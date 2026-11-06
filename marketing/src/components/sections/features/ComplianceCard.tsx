"use client";

import { useState } from "react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";

// ============================================================================
// CARD 3: SMART GUIDELINES & ASSET CHECK (Interactive Inspection Hub)
// ============================================================================
export function ComplianceCard() {
  const [tab, setTab] = useState<"transparency" | "resolution" | "ratio">("transparency");
  const [alphaMode, setAlphaMode] = useState<"solid" | "alpha">("solid");
  const [resolutionMode, setResolutionMode] = useState<"lowres" | "1024">("lowres");
  const [ratioMode, setRatioMode] = useState<"distorted" | "square">("distorted");

  return (
    <div className="group relative rounded-[28px] px-6 py-3.5 sm:px-8 sm:py-4 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-1 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-sky-400 via-blue-500 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-[12px] font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 shrink-0">
            03
          </span>
          <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Guidelines &amp; Asset Check
          </h3>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Validation checks help catch mechanical formatting mistakes (such as incorrect dimensions, transparent alpha channels on iOS, or file size limits).
        </p>

        {/* Tab Switcher with Sliding Pill (Symmetrical with Card 04) */}
        <div className="my-3.5">
          <SlidingTabs
            value={tab}
            onChange={(val) => setTab(val as "transparency" | "resolution" | "ratio")}
            className="w-full"
            ariaLabel="Asset inspection tabs"
            options={[
              { value: "transparency", label: "Icon Background" },
              { value: "resolution", label: "Resolution" },
              { value: "ratio", label: "Aspect Ratio" },
            ]}
          />
        </div>

        {/* Interactive Visual Canvas matching Card 04 Height */}
        <div className="rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06] p-3 min-h-[142px] flex flex-col justify-center">
          {tab === "transparency" && (
            <div className="space-y-2.5">
              {/* Test selector buttons */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAlphaMode("solid")}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      alphaMode === "solid"
                        ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Solid (No Alpha)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlphaMode("alpha")}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      alphaMode === "alpha"
                        ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Transparent (Alpha)
                  </button>
                </div>

                {alphaMode === "solid" && (
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400">
                    0% ALPHA
                  </span>
                )}
              </div>

              {/* Simulated Icon & Inspection Readout */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center font-black text-lg transition-all duration-300 shrink-0 ${
                    alphaMode === "solid"
                      ? "bg-[#0b0c0e] border-emerald-500/50"
                      : "bg-[#121312] dark:bg-[#141514] [background-image:radial-gradient(circle,rgba(255,255,255,0.15)_1.2px,transparent_1.2px)] [background-size:8px_8px] border-rose-500/40"
                  }`}
                >
                  <span
                    className={`text-base select-none ${
                      alphaMode === "solid" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    ★
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-slate-900 dark:text-white">
                    {alphaMode === "solid" ? (
                      <span className="text-emerald-500">
                        Solid Background Verified
                      </span>
                    ) : (
                      <span className="text-rose-500">
                        Transparent Background Detected
                      </span>
                    )}
                  </div>
                  <div className="text-[10.5px] mt-0.5 truncate text-slate-600 dark:text-white">
                    {alphaMode === "solid"
                      ? "100% opaque background · Complies with store guidelines"
                      : "Alpha channel detected · Stores require opaque icons"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "resolution" && (
            <div className="space-y-2.5">
              {/* Resolution selector buttons */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setResolutionMode("lowres")}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      resolutionMode === "lowres"
                        ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Low-Res (256 × 256)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolutionMode("1024")}
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      resolutionMode === "1024"
                        ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    1024 × 1024 px
                  </button>
                </div>

                <span
                  className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    resolutionMode === "lowres"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {resolutionMode === "lowres" ? "256 PX" : "1024 PX"}
                </span>
              </div>

              {/* Simulated Icon & Dimension Readout */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 shrink-0 ${
                    resolutionMode === "1024"
                      ? "border-emerald-500/50 bg-[#0b0c0e] text-emerald-400"
                      : "border-amber-500/40 bg-[#181510] text-amber-400"
                  }`}
                >
                  {resolutionMode === "1024" ? "1024" : "256"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-slate-900 dark:text-white">
                    {resolutionMode === "1024" ? (
                      <span className="text-emerald-500">
                        Resolution Verified
                      </span>
                    ) : (
                      <span className="text-amber-500">
                        Low Resolution Detected
                      </span>
                    )}
                  </div>
                  <div className="text-[10.5px] mt-0.5 truncate text-slate-600 dark:text-white">
                    {resolutionMode === "1024"
                      ? "1024 × 1024 px · 380 KB (Store limit: Max 1024 KB)"
                      : "256 × 256 px · Required: 1024 × 1024 px master icon"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "ratio" && (
            <div className="space-y-2.5">
              {/* Ratio test selector buttons */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setRatioMode("distorted")}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      ratioMode === "distorted"
                        ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Non-Square (4:3 Rect)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatioMode("square")}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      ratioMode === "square"
                        ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    1:1 Square (1024×1024)
                  </button>
                </div>

                <span
                  className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    ratioMode === "distorted"
                      ? "bg-rose-500/15 text-rose-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {ratioMode === "distorted" ? "4:3 RECT" : "1:1 SQUARE"}
                </span>
              </div>

              {/* Simulated Icon & Ratio Readout */}
              <div className="flex items-center gap-3">
                <div
                  className={`h-11 rounded-xl border flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-300 shrink-0 ${
                    ratioMode === "square"
                      ? "w-11 bg-[#0b0c0e] border-emerald-500/50 text-emerald-400"
                      : "w-14 bg-[#181510] border-rose-500/40 text-rose-400"
                  }`}
                >
                  {ratioMode === "square" ? "1:1" : "4:3"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-slate-900 dark:text-white">
                    {ratioMode === "square" ? (
                      <span className="text-emerald-500">
                        Perfect 1:1 Square Ratio
                      </span>
                    ) : (
                      <span className="text-rose-500">
                        Non-Square Ratio Detected
                      </span>
                    )}
                  </div>
                  <div className="text-[10.5px] mt-0.5 truncate text-slate-600 dark:text-white">
                    {ratioMode === "square"
                      ? "Width and height are identical (1.00) · No image distortion"
                      : "Aspect ratio is 1.33:1 · Required: 1:1 square"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
