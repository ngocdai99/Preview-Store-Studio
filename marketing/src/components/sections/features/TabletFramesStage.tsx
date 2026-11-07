"use client";

import React from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { StoreMetricsRibbon } from "@/components/ui/StoreMetricsRibbon";
import { IPadMockupFrame, useDraggableScroll } from "./DeviceHardwareHelpers";

export interface TabletFramesStageProps {
  timeString: string;
  isForeground: boolean;
  onSelect?: () => void;
}

export function TabletFramesStage({ timeString, isForeground, onSelect }: TabletFramesStageProps) {
  const { ref: scrollRef, handlers: scrollHandlers } = useDraggableScroll();
  return (
    <div
      onClick={!isForeground ? onSelect : undefined}
      className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
        isForeground
          ? "z-20 opacity-100 scale-[0.92] sm:scale-100 translate-x-0 translate-y-0 rotate-0 filter-none pointer-events-auto"
          : "z-10 opacity-40 hover:opacity-85 scale-[0.78] sm:scale-[0.82] hover:scale-[0.82] sm:hover:scale-[0.86] translate-x-10 sm:translate-x-16 -translate-y-3 sm:-translate-y-4 rotate-[1.5deg] filter blur-[0.4px] hover:blur-none cursor-pointer pointer-events-auto group"
      }`}
    >
      <div className="relative">
        <IPadMockupFrame
          timeString={timeString}
          className={`transition-all duration-500 ${
            isForeground
              ? "shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2),0_0_0_1px_rgba(255,255,255,0.12)]"
              : "shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]"
          }`}
        >
        {/* Tablet Header: Brand Icon, Name, Subtitle & Blue GET Button */}
        <div className="flex items-start gap-3 mt-0.5">
          <div className="shrink-0 rounded-[13px] shadow-sm overflow-hidden">
            <BrandIcon withBadge size={46} className="w-[46px] h-[46px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold leading-tight text-white truncate">
              Store Preview Studio
            </div>
            <div className="text-[10px] leading-tight text-slate-400 truncate">
              Mockup Studio Pro
            </div>
            <div className="mt-0">
              <button
                type="button"
                className="inline-flex items-center justify-center px-2.5 py-[1.5px] rounded-full bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white font-bold text-[8px] tracking-wide shadow-xs transition-all cursor-pointer"
              >
                GET
              </button>
            </div>
          </div>
        </div>

        {/* Store Metrics Ribbon (App Store Authentic 3-Column) */}
        <StoreMetricsRibbon theme="dark" developerName="Kai DevLabs" className="my-1 py-1" />

        {/* Portrait Tablet Screenshot Carousel (Authentic Horizontal Scroll) */}
        <div className="flex-1 flex flex-col justify-center min-h-0 my-1">
          <div className="flex items-center justify-between px-0.5 mb-1.5">
            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">
              Screenshots
            </span>
            <span className="text-[7px] text-slate-400 font-mono">
              Swipe ↔
            </span>
          </div>

          <div
            ref={scrollRef}
            {...scrollHandlers}
            className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-0.5 pb-1 select-none cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Slide 1: Studio Canvas (Exact 4:3 Landscape - Apple iPad App Store SRS Standard) */}
            <div className="w-[168px] h-[126px] aspect-[4/3] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#0c0a28] via-[#14113e] to-[#070516] border border-indigo-500/40 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                  <span className="text-[8px] font-bold text-indigo-100 tracking-tight">Studio Canvas</span>
                </div>
                <span className="text-[6px] px-1.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-mono font-bold">
                  HIGH-RES · 4K
                </span>
              </div>

              <div className="my-auto w-full h-15 relative flex items-center justify-center">
                <svg viewBox="0 0 160 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="ipadCanvasGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="ipadScreenArt" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="45%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>

                  {[20, 50, 110, 140].map((x, idx) => (
                    <g key={idx}>
                      <circle cx={x} cy="10" r="0.8" fill="#818cf8" opacity="0.3" />
                      <circle cx={x} cy="25" r="0.8" fill="#818cf8" opacity="0.3" />
                      <circle cx={x} cy="40" r="0.8" fill="#818cf8" opacity="0.3" />
                    </g>
                  ))}

                  <g transform="translate(6, 10)">
                    <rect width="36" height="13" rx="3" fill="#101229" stroke="rgba(129,140,248,0.5)" strokeWidth="0.8" />
                    <circle cx="6" cy="6.5" r="2" fill="#818cf8" />
                    <text x="11" y="8.5" fill="#e0e7ff" fontSize="4.8" fontWeight="bold" fontFamily="sans-serif">✦ Mockups</text>
                  </g>

                  <g transform="translate(8, 28)">
                    <rect width="32" height="11" rx="2.5" fill="#141733" stroke="rgba(99,102,241,0.4)" strokeWidth="0.7" />
                    <text x="16" y="7.5" textAnchor="middle" fill="#a5b4fc" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">Tablet View</text>
                  </g>

                  <g transform="translate(58, 4)">
                    <rect x="2" y="3" width="44" height="34" rx="4.5" fill="#000000" opacity="0.55" />
                    <rect width="44" height="34" rx="4.5" fill="#181a28" stroke="#818cf8" strokeWidth="1" />
                    <rect x="1.5" y="1.5" width="41" height="31" rx="3.5" fill="url(#ipadScreenArt)" />
                    <circle cx="22" cy="3" r="0.7" fill="#ffffff" opacity="0.7" />
                    <rect x="7" y="11" width="2.2" height="13" rx="1" fill="#ffffff" opacity="0.95" />
                    <rect x="12" y="8" width="2.2" height="16" rx="1" fill="#ffffff" opacity="0.95" />
                    <rect x="17" y="13" width="2.2" height="11" rx="1" fill="#ffffff" opacity="0.95" />
                    <rect x="22" y="9" width="2.2" height="15" rx="1" fill="#ffffff" opacity="0.95" />
                    <rect x="27" y="14" width="2.2" height="10" rx="1" fill="#ffffff" opacity="0.95" />
                    <rect x="32" y="10" width="2.2" height="14" rx="1" fill="#ffffff" opacity="0.95" />
                    <rect x="14" y="27" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.9" />
                  </g>

                  <g transform="translate(116, 10)">
                    <rect width="36" height="13" rx="3" fill="#101229" stroke="rgba(129,140,248,0.5)" strokeWidth="0.8" />
                    <circle cx="8" cy="6.5" r="2.2" fill="#00D085" />
                    <circle cx="16" cy="6.5" r="2.2" fill="#22d3ee" />
                    <circle cx="24" cy="6.5" r="2.2" fill="#a855f7" />
                  </g>

                  <g transform="translate(116, 28)">
                    <rect width="36" height="11" rx="2.5" fill="#141733" stroke="rgba(34,211,238,0.4)" strokeWidth="0.7" />
                    <text x="18" y="7.5" textAnchor="middle" fill="#67e8f9" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">4K UHD</text>
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5 border-t border-white/10">
                <span className="font-medium text-slate-300">Custom Device Styling</span>
                <span className="text-cyan-300 font-semibold">Instant Preview</span>
              </div>
            </div>

            {/* Slide 2: Adaptive Layouts */}
            <div className="w-[168px] h-[126px] aspect-[4/3] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#0b0e22] via-[#101533] to-[#070914] border border-sky-500/35 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                  <span className="text-[8px] font-bold text-sky-100 tracking-tight">Adaptive Layouts</span>
                </div>
                <span className="text-[6px] px-1.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 font-mono font-bold">
                  ALL SIZES
                </span>
              </div>

              <div className="my-auto w-full h-15 relative flex items-center justify-center">
                <svg viewBox="0 0 160 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="ipadResponsiveHero" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>

                  <path d="M 46 22 L 80 22" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                  <circle cx="63" cy="22" r="2.5" fill="#38bdf8" />
                  <circle cx="63" cy="22" r="1.2" fill="#ffffff" />

                  <g transform="translate(24, 1)">
                    <rect width="20" height="42" rx="3.5" fill="#141724" stroke="#475569" strokeWidth="1" />
                    <rect x="1.5" y="1.5" width="17" height="39" rx="2.5" fill="#090b12" />
                    <rect x="6.5" y="2.5" width="7" height="1.6" rx="0.8" fill="#000000" />
                    <rect x="3" y="6" width="14" height="4" rx="0.8" fill="#1e2238" />
                    <rect x="3" y="12" width="14" height="10" rx="1.5" fill="url(#ipadResponsiveHero)" />
                    <rect x="3" y="24" width="14" height="6" rx="1" fill="#ffffff" opacity="0.18" />
                    <rect x="3" y="32" width="14" height="5" rx="1" fill="#ffffff" opacity="0.1" />
                    <text x="10" y="47.5" textAnchor="middle" fill="#94a3b8" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">Phone View</text>
                  </g>

                  <g transform="translate(82, 4)">
                    <rect width="48" height="36" rx="4" fill="#161928" stroke="#475569" strokeWidth="1" />
                    <rect x="1.5" y="1.5" width="45" height="33" rx="3" fill="#090b12" />
                    <circle cx="24" cy="2.5" r="0.8" fill="#475569" />
                    <rect x="3" y="5" width="9" height="26" rx="1" fill="#141829" />
                    <circle cx="7.5" cy="8.5" r="1.2" fill="#38bdf8" />
                    <circle cx="7.5" cy="13" r="1.2" fill="#a855f7" />
                    <circle cx="7.5" cy="17.5" r="1.2" fill="#ec4899" />
                    <rect x="14" y="5" width="31" height="11" rx="1.5" fill="url(#ipadResponsiveHero)" />
                    <rect x="14" y="18" width="14.5" height="13" rx="1" fill="#ffffff" opacity="0.18" />
                    <rect x="30.5" y="18" width="14.5" height="13" rx="1" fill="#ffffff" opacity="0.1" />
                    <text x="24" y="44.5" textAnchor="middle" fill="#94a3b8" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">Tablet View</text>
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5 border-t border-white/10">
                <span className="font-medium text-slate-300">Multi-Device Formats</span>
                <span className="text-sky-300 font-semibold">Store Specifications</span>
              </div>
            </div>

            {/* Slide 3: Store Deliverables */}
            <div className="w-[168px] h-[126px] aspect-[4/3] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1c0828] via-[#2d0d3e] to-[#0e0314] border border-purple-500/40 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_6px_#e879f9]" />
                  <span className="text-[8px] font-bold text-purple-100 tracking-tight">Store Deliverables</span>
                </div>
                <span className="text-[6px] px-1.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 font-mono font-bold">
                  1-CLICK ZIP
                </span>
              </div>

              <div className="my-auto w-full h-15 relative flex items-center justify-center">
                <svg viewBox="0 0 160 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <path d="M 22 8 L 23.5 11 L 26 12.5 L 23.5 14 L 22 17 L 20.5 14 L 18 12.5 L 20.5 11 Z" fill="#fde047" opacity="0.8" />
                  <path d="M 142 36 L 143 38 L 145 39 L 143 40 L 142 42 L 141 40 L 139 39 L 141 38 Z" fill="#22d3ee" opacity="0.8" />

                  <g transform="translate(54, 8)">
                    <rect width="52" height="32" rx="4.5" fill="#190724" stroke="#c084fc" strokeWidth="1" />
                    <path d="M 4 0 L 16 0 L 20 3.5 L 48 3.5 L 48 0" fill="none" stroke="#e879f9" strokeWidth="0.9" />
                    <text x="26" y="13" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold" fontFamily="monospace">store-bundle.zip</text>
                    <rect x="7" y="18" width="17" height="8" rx="1.5" fill="rgba(192,132,252,0.3)" stroke="#c084fc" strokeWidth="0.6" />
                    <text x="15.5" y="23.5" textAnchor="middle" fill="#f3e8ff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">PNG 4K</text>
                    <rect x="28" y="18" width="16" height="8" rx="1.5" fill="rgba(192,132,252,0.3)" stroke="#c084fc" strokeWidth="0.6" />
                    <text x="36" y="23.5" textAnchor="middle" fill="#f3e8ff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">ZIP</text>
                  </g>

                  <g transform="translate(8, 16)">
                    <rect width="36" height="17" rx="3" fill="#1f092e" stroke="#e879f9" strokeWidth="0.8" />
                    <rect x="3" y="3" width="9" height="11" rx="1.2" fill="#6366f1" />
                    <text x="23" y="9.5" textAnchor="middle" fill="#fdf4ff" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">PNG 4K</text>
                    <text x="23" y="14" textAnchor="middle" fill="#d8b4fe" fontSize="3.5" fontFamily="sans-serif">Deliverables</text>
                  </g>

                  <g transform="translate(114, 15)">
                    <rect width="40" height="18" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
                    <rect x="3" y="3" width="9" height="12" rx="1.5" fill="#0284c7" />
                    <text x="7.5" y="11" textAnchor="middle" fill="#ffffff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">MD</text>
                    <text x="25" y="9.5" textAnchor="middle" fill="#f8fafc" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">METADATA</text>
                    <text x="25" y="14.5" textAnchor="middle" fill="#7dd3fc" fontSize="3.5" fontFamily="monospace">listing.md</text>
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5 border-t border-white/10">
                <span className="font-medium text-slate-300">Organized Folders</span>
                <span className="text-purple-300 font-semibold">Stored in browser</span>
              </div>
            </div>
          </div>

          {/* What's New Snippet below screenshots */}
          <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
            <span className="font-semibold text-indigo-300">Multi-Store Layouts · High-Res Assets</span>
            <span>v2.4 · 65 MB</span>
          </div>
        </div>
      </IPadMockupFrame>

      {/* Click overlay when in background */}
      {!isForeground && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          aria-label="Switch to iPad preview"
          className="absolute inset-0 z-40 w-full h-full rounded-[32px] cursor-pointer focus:outline-none"
        >
          <span className="sr-only">Switch to iPad</span>
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-900/95 border border-white/20 text-white font-medium text-[9px] tracking-tight shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap flex items-center gap-1 backdrop-blur-md">
            <span>View iPad</span>
            <span className="text-emerald-400 font-bold">↗</span>
          </span>
        </button>
      )}
      </div>
    </div>
  );
}
