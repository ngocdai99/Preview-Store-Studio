"use client";

import { useState } from "react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { FeatureCard } from "./FeatureCard";

// ============================================================================
// CARD 3: SMART GUIDELINES & ASSET CHECK (Interactive Inspection Hub)
// ============================================================================
export function ComplianceCard() {
  const [tab, setTab] = useState<"transparency" | "resolution" | "ratio">("transparency");
  const [alphaMode, setAlphaMode] = useState<"solid" | "alpha">("solid");
  const [resolutionMode, setResolutionMode] = useState<"lowres" | "1024">("lowres");
  const [ratioMode, setRatioMode] = useState<"distorted" | "square">("distorted");

  return (
    <FeatureCard
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      }
      title="Smart Guidelines & Asset Check"
      description="Validation checks catch formatting mistakes such as transparent alpha, low resolutions, and aspect ratio mismatches."
      className="col-span-1 md:col-span-1 lg:col-span-6"
    >
      <div className="relative z-10">
        {/* Tab Switcher with Sliding Pill (Symmetrical with Card 04) */}
        <div className="mb-3.5">
          <SlidingTabs
            value={tab}
            onChange={(val) => setTab(val as "transparency" | "resolution" | "ratio")}
            className="w-full"
            ariaLabel="Asset inspection tabs"
            options={[
              { value: "transparency", label: "Alpha" },
              { value: "resolution", label: "Resolution" },
              { value: "ratio", label: "Ratio" },
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
                    0% alpha
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
                  <div className="text-[10.5px] mt-0.5 text-slate-600 dark:text-slate-300 leading-snug">
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

                <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400">
                  1024px
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
                  <div className="text-[10.5px] mt-0.5 text-slate-600 dark:text-slate-300 leading-snug">
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
                  {ratioMode === "distorted" ? "4:3 rect" : "1:1 square"}
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
                  <div className="text-[10.5px] mt-0.5 text-slate-600 dark:text-slate-300 leading-snug">
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
    </FeatureCard>
  );
}
