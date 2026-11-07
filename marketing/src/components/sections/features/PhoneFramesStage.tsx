"use client";

import React from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { StoreMetricsRibbon } from "@/components/ui/StoreMetricsRibbon";
import { useDraggableScroll } from "./DeviceHardwareHelpers";

export interface PhoneFramesStageProps {
  timeString: string;
  isForeground: boolean;
  onSelect?: () => void;
}

export function PhoneFramesStage({ timeString, isForeground, onSelect }: PhoneFramesStageProps) {
  const { ref: scrollRef, handlers: scrollHandlers } = useDraggableScroll();
  return (
    <div
      onClick={!isForeground ? onSelect : undefined}
      className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
        isForeground
          ? "z-20 opacity-100 scale-95 sm:scale-100 translate-x-0 translate-y-0 rotate-0 filter-none pointer-events-auto"
          : "z-10 opacity-40 hover:opacity-85 scale-[0.74] sm:scale-[0.78] hover:scale-[0.78] sm:hover:scale-[0.82] -translate-x-20 sm:-translate-x-32 -translate-y-3 sm:-translate-y-4 -rotate-2 filter blur-[0.4px] hover:blur-none cursor-pointer pointer-events-auto group"
      }`}
    >
      <div
        className={`relative w-[212px] sm:w-[226px] h-[392px] sm:h-[412px] rounded-[44px] p-[6px] border border-[#363840] bg-[#1e1f23] transition-all duration-500 ${
          isForeground
            ? "shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2),0_0_0_1px_rgba(255,255,255,0.12)]"
            : "shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]"
        }`}
      >
        {/* Outer Physical Hardware Buttons */}
        <div className="absolute -left-[4px] top-[68px] w-[3px] h-[16px] rounded-l-sm bg-[#363840]" />
        <div className="absolute -left-[4px] top-[94px] w-[3px] h-[28px] rounded-l-sm bg-[#363840]" />
        <div className="absolute -left-[4px] top-[130px] w-[3px] h-[28px] rounded-l-sm bg-[#363840]" />
        <div className="absolute -right-[4px] top-[102px] w-[3px] h-[40px] rounded-r-sm bg-[#363840]" />

        {/* Screen Inner (Portrait 19.5:9 Authentic iOS App Store) */}
        <div className="w-full h-full rounded-[38px] overflow-hidden pt-1.5 px-3 pb-3 bg-black text-white flex flex-col justify-between">
          {/* iOS Status Bar with Pure Black Dynamic Island */}
          <div className="w-full h-6 px-1 mb-2 sm:mb-2.5 flex items-center justify-between select-none shrink-0 text-white z-20">
            {/* Left: Current Local Time */}
            <div className="w-11 text-left pl-0.5">
              <span className="text-[10px] font-semibold tracking-tight text-white font-sans">
                {timeString}
              </span>
            </div>

            {/* Center: Dynamic Island */}
            <div className="w-[58px] sm:w-[62px] h-[17px] rounded-full bg-black shadow-sm shrink-0" />

            {/* Right: Cellular Signal + Wi-Fi + Battery */}
            <div className="w-11 flex items-center justify-end gap-1 text-white">
              <svg className="w-3.5 h-2.5 text-white" viewBox="0 0 17 12" fill="currentColor">
                <rect x="1" y="8.5" width="2.5" height="3.5" rx="0.6" />
                <rect x="5" y="6" width="2.5" height="6" rx="0.6" />
                <rect x="9" y="3.5" width="2.5" height="8.5" rx="0.6" />
                <rect x="13" y="1" width="2.5" height="11" rx="0.6" />
              </svg>

              <svg className="w-3 h-2.5 text-white" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                <path d="M4.5 7.5a5 5 0 0 1 7 0 .8.8 0 0 1-1.1 1.1 3.4 3.4 0 0 0-4.8 0 .8.8 0 1 1-1.1-1.1z" />
                <path d="M2 4.5a8.5 8.5 0 0 1 12 0 .8.8 0 0 1-1.1 1.1 6.9 6.9 0 0 0-9.8 0 .8.8 0 1 1-1.1-1.1z" />
              </svg>

              <div className="flex items-center">
                <div className="w-4 h-2 rounded-[2.5px] border border-white p-[0.8px] flex items-center">
                  <div className="w-full h-full rounded-[1px] bg-white" />
                </div>
                <div className="w-[0.8px] h-1 rounded-r-[0.5px] bg-white ml-[0.5px]" />
              </div>
            </div>
          </div>

          {/* App Detail Header: Brand Icon, Name, Subtitle, Blue GET Button */}
          <div className="flex items-start gap-2.5 mt-1">
            <div className="shrink-0 rounded-[12px] shadow-sm overflow-hidden">
              <BrandIcon withBadge size={44} className="w-[44px] h-[44px]" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-[11.5px] sm:text-[12px] font-extrabold tracking-tight leading-tight text-white truncate">
                Store Preview Studio
              </h4>
              <p className="text-[9.5px] sm:text-[10px] leading-tight font-medium text-slate-400 truncate">
                Mockup Studio Pro
              </p>

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

          {/* Landscape Screenshots Carousel Section */}
          <div className="flex-1 flex flex-col justify-center min-h-0">
            <div className="flex items-center justify-between px-0.5 mb-1">
              <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-wider">
                Preview
              </span>
              <span className="text-[6.5px] text-slate-500 font-mono">
                Swipe ↔
              </span>
            </div>

            {/* Horizontal Scroll Carousel for Landscape Cards */}
            <div
              ref={scrollRef}
              {...scrollHandlers}
              className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-0.5 pb-1 select-none cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Slide 1: Live Canvas Studio (16:9 Landscape - SRS Apple & Google Standard) */}
              <div className="w-[172px] h-[97px] aspect-[16/9] rounded-xl p-2 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#0c0a28] via-[#14113e] to-[#070516] border border-indigo-500/40 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                    <span className="text-[7.5px] font-bold text-indigo-100 tracking-tight">Studio Canvas</span>
                  </div>
                  <span className="text-[6px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-mono font-bold">
                    HIGH-RES · 4K
                  </span>
                </div>

                <div className="my-auto w-full h-13 relative flex items-center justify-center">
                  <svg viewBox="0 0 160 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="phoneScreenArt" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="40%" stopColor="#a855f7" />
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
                      <text x="16" y="7.5" textAnchor="middle" fill="#a5b4fc" fontSize="4.2" fontWeight="bold" fontFamily="sans-serif">Phone View</text>
                    </g>

                    <g transform="translate(68, 2)">
                      <rect x="2" y="3" width="24" height="44" rx="4.5" fill="#000000" opacity="0.55" />
                      <rect width="24" height="44" rx="4.5" fill="#181a28" stroke="#818cf8" strokeWidth="1" />
                      <rect x="1.5" y="1.5" width="21" height="41" rx="3.5" fill="url(#phoneScreenArt)" />
                      <rect x="8.5" y="2.5" width="7" height="1.8" rx="0.9" fill="#0c0d18" />
                      <rect x="3.5" y="7" width="8" height="1.5" rx="0.7" fill="#ffffff" opacity="0.85" />
                      <rect x="4" y="14" width="1.8" height="12" rx="0.9" fill="#ffffff" opacity="0.95" />
                      <rect x="7" y="11" width="1.8" height="15" rx="0.9" fill="#ffffff" opacity="0.95" />
                      <rect x="10" y="16" width="1.8" height="10" rx="0.9" fill="#ffffff" opacity="0.95" />
                      <rect x="13" y="12" width="1.8" height="14" rx="0.9" fill="#ffffff" opacity="0.95" />
                      <rect x="16" y="17" width="1.8" height="9" rx="0.9" fill="#ffffff" opacity="0.95" />
                      <rect x="7" y="33" width="10" height="3" rx="1.5" fill="#ffffff" opacity="0.9" />
                    </g>

                    <g transform="translate(116, 10)">
                      <rect width="36" height="13" rx="3" fill="#101229" stroke="rgba(129,140,248,0.5)" strokeWidth="0.8" />
                      <circle cx="8" cy="6.5" r="2.2" fill="#00D085" />
                      <circle cx="16" cy="6.5" r="2.2" fill="#22d3ee" />
                      <circle cx="24" cy="6.5" r="2.2" fill="#ec4899" />
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
              <div className="w-[172px] h-[97px] aspect-[16/9] rounded-xl p-2 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#0b0e22] via-[#101533] to-[#070914] border border-sky-500/35 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                    <span className="text-[7.5px] font-bold text-sky-100 tracking-tight">Adaptive Layouts</span>
                  </div>
                  <span className="text-[6px] px-1.5 py-0.2 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 font-mono font-bold">
                    ALL SIZES
                  </span>
                </div>

                <div className="my-auto w-full h-13 relative flex items-center justify-center">
                  <svg viewBox="0 0 160 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="responsiveHero" x1="0%" y1="0%" x2="100%" y2="100%">
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
                      <rect x="3" y="12" width="14" height="10" rx="1.5" fill="url(#responsiveHero)" />
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
                      <rect x="14" y="5" width="31" height="11" rx="1.5" fill="url(#responsiveHero)" />
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

              {/* Slide 3: 1-Click Store Deliverables */}
              <div className="w-[172px] h-[97px] aspect-[16/9] rounded-xl p-2 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1c0828] via-[#2d0d3e] to-[#0e0314] border border-purple-500/40 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_6px_#e879f9]" />
                    <span className="text-[7.5px] font-bold text-purple-100 tracking-tight">Store Deliverables</span>
                  </div>
                  <span className="text-[6px] px-1.5 py-0.2 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 font-mono font-bold">
                    1-CLICK ZIP
                  </span>
                </div>

                <div className="my-auto w-full h-13 relative flex items-center justify-center">
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

            <div className="px-1.5 py-0.5 mt-0.5 rounded bg-white/[0.04] border border-white/5 flex items-center justify-between text-[6.5px] text-slate-400 shrink-0">
              <span className="font-semibold text-indigo-300">Multi-Store Layouts · High-Res Assets</span>
              <span>v2.4</span>
            </div>
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-20 h-1 rounded-full mx-auto mt-1 bg-white/35 shrink-0" />
        </div>

        {/* Click overlay when in background */}
        {!isForeground && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            aria-label="Switch to iPhone preview"
            className="absolute inset-0 z-40 w-full h-full rounded-[44px] cursor-pointer focus:outline-none"
          >
            <span className="sr-only">Switch to iPhone</span>
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-900/95 border border-white/20 text-white font-medium text-[9px] tracking-tight shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap flex items-center gap-1 backdrop-blur-md">
              <span>View iPhone</span>
              <span className="text-emerald-400 font-bold">↗</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
