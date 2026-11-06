"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { StoreMetricsRibbon } from "@/components/ui/StoreMetricsRibbon";
import {
  Check,
  Copy,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

// ============================================================================
// CARD 1: REALISTIC MODERN DEVICE FRAMES (Interactive Device Stage)
// ============================================================================
function DeviceFramesCard() {
  const [device, setDevice] = useState<"phone" | "tablet">("phone");

  return (
    <div className="group relative rounded-[28px] px-6 py-3.5 sm:px-8 sm:py-4 flex flex-col overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-2 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-[#00D085] via-emerald-400 to-transparent" />

      {/* Top Header & Interactive Switchers (z-30 to float comfortably over simulated stage) */}
      <div className="relative z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2 sm:mb-2.5">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-mono font-bold tracking-wider text-emerald-600 dark:text-[#00D085] shrink-0">
              01
            </span>
            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              Modern Device Frames
            </h3>
          </div>
          <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-400 max-w-sm leading-normal">
            Adaptive device frames across multiple screen formats.
          </p>
        </div>

        {/* Interactive Controls Bar: Device Sliding Tabs */}
        <div className="relative z-40 self-start lg:self-center">
          <SlidingTabs
            value={device}
            onChange={(val) => setDevice(val as "phone" | "tablet")}
            options={[
              {
                value: "phone",
                label: "iPhone",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <rect x="6" y="2" width="12" height="20" rx="2.5" />
                    <line x1="10" y1="18" x2="14" y2="18" />
                  </svg>
                ),
              },
              {
                value: "tablet",
                label: "iPad",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2.5" />
                    <line x1="10" y1="18" x2="14" y2="18" />
                  </svg>
                ),
              },
            ]}
            className="w-[170px] sm:w-[190px]"
            size="sm"
            ariaLabel="Device selector tabs"
          />
        </div>
      </div>

      {/* Simulated Live Stage (Visual Interactive Mockup without wrapper container) */}
      <div className="relative z-10 w-full h-[265px] sm:h-[275px] flex items-center justify-center select-none">
        {/* Phone Mockup Frame (Realistic Hardware Bezel & Authentic App Store Product Page) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
            device === "phone"
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-[0.88] translate-y-3 pointer-events-none"
          }`}
        >
          <div className="relative w-[265px] sm:w-[285px] rounded-[48px] p-[8px] border border-[#363840] bg-[#1e1f23] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300">
              {/* Outer Physical Hardware Buttons */}
              {/* Left: Action Button */}
              <div className="absolute -left-[4px] top-[60px] w-[3px] h-[16px] rounded-l-sm bg-[#363840]" />
              {/* Left: Volume Up */}
              <div className="absolute -left-[4px] top-[84px] w-[3px] h-[30px] rounded-l-sm bg-[#363840]" />
              {/* Left: Volume Down */}
              <div className="absolute -left-[4px] top-[122px] w-[3px] h-[30px] rounded-l-sm bg-[#363840]" />
              {/* Right: Side / Power Button */}
              <div className="absolute -right-[4px] top-[92px] w-[3px] h-[44px] rounded-r-sm bg-[#363840]" />

              {/* Screen Inner */}
              <div className="w-full rounded-[40px] overflow-hidden p-3.5 bg-black text-white">
                {/* App Detail Header: Brand Icon, Name, Subtitle, Apple Blue GET Button */}
                <div className="flex items-start gap-3">
                  {/* Official Brand Icon with 3D Interlocking K */}
                  <div className="shrink-0 rounded-[15px] shadow-md overflow-hidden">
                    <BrandIcon
                      withBadge
                      size={52}
                      className="w-[52px] h-[52px]"
                    />
                  </div>

                  {/* App Info & Action Button */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12.5px] sm:text-[13px] font-extrabold tracking-tight leading-tight text-white">
                      Store Preview Studio
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] leading-tight font-medium text-slate-400">
                      Mockup Studio Pro
                    </p>

                    {/* Blue Apple GET Button (No top margin) */}
                    <div>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white font-normal text-[10px] tracking-wide shadow-sm transition-all cursor-pointer"
                      >
                        GET
                      </button>
                    </div>
                  </div>
                </div>

                {/* Store Metrics Ribbon (App Store Authentic 3-Column) */}
                <StoreMetricsRibbon theme="dark" />

                {/* Screenshot Carousel (Vibrant App Store Showcase) */}
                <div className="flex gap-2 overflow-hidden px-0.5 pb-1 select-none">
                  {/* Screen 1: Realtime Preview */}
                  <div className="w-20 h-24 rounded-[10px] p-1.5 flex flex-col justify-between shrink-0 bg-gradient-to-b from-indigo-950 via-[#131422] to-black border border-indigo-500/20 shadow-inner relative overflow-hidden">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-indigo-500/20 rounded-full blur-sm" />
                    <div>
                      <div className="text-[7.5px] font-bold text-indigo-300 tracking-tight leading-none">Instant Preview</div>
                      <div className="text-[6px] text-slate-400 mt-0.5">Live store canvas</div>
                    </div>
                    {/* Mini Phone Graphic */}
                    <div className="my-auto w-10 h-11 mx-auto rounded-[6px] border border-indigo-400/40 bg-indigo-950/60 p-0.5 flex flex-col justify-between shadow-sm">
                      <div className="w-3 h-0.5 rounded-full bg-white/40 mx-auto" />
                      <div className="w-full h-6 rounded-[3px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-[6px] font-bold text-white">4K</span>
                      </div>
                      <div className="w-4 h-0.5 rounded-full bg-white/30 mx-auto" />
                    </div>
                    <div className="text-[6.5px] text-center font-medium text-indigo-200/90 bg-indigo-900/40 py-0.5 rounded-[3px]">
                      Ultra-HD
                    </div>
                  </div>

                  {/* Screen 2: Multi-Device */}
                  <div className="w-20 h-24 rounded-[10px] p-1.5 flex flex-col justify-between shrink-0 bg-gradient-to-b from-emerald-950 via-[#0e1f18] to-black border border-emerald-500/20 shadow-inner relative overflow-hidden">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500/20 rounded-full blur-sm" />
                    <div>
                      <div className="text-[7.5px] font-bold text-emerald-300 tracking-tight leading-none">All Formats</div>
                      <div className="text-[6px] text-slate-400 mt-0.5">Phone &amp; tablet</div>
                    </div>
                    {/* Mini Devices Graphic */}
                    <div className="my-auto flex items-end justify-center gap-1">
                      <div className="w-6 h-9 rounded-[4px] border border-emerald-400/40 bg-emerald-950/60 p-0.5 flex flex-col justify-between">
                        <div className="w-2 h-0.5 rounded-full bg-white/40 mx-auto" />
                        <div className="w-full h-5 rounded-[2px] bg-gradient-to-br from-emerald-500 to-teal-600" />
                      </div>
                      <div className="w-8 h-11 rounded-[5px] border border-emerald-400/40 bg-emerald-950/60 p-0.5 flex flex-col justify-between">
                        <div className="w-3 h-0.5 rounded-full bg-white/40 mx-auto" />
                        <div className="w-full h-7 rounded-[3px] bg-gradient-to-br from-teal-500 to-cyan-600" />
                      </div>
                    </div>
                    <div className="text-[6.5px] text-center font-medium text-emerald-200/90 bg-emerald-900/40 py-0.5 rounded-[3px]">
                      Adaptive
                    </div>
                  </div>

                  {/* Screen 3: 1-Click Export */}
                  <div className="w-20 h-24 rounded-[10px] p-1.5 flex flex-col justify-between shrink-0 bg-gradient-to-b from-purple-950 via-[#1b1227] to-black border border-purple-500/20 shadow-inner relative overflow-hidden">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-purple-500/20 rounded-full blur-sm" />
                    <div>
                      <div className="text-[7.5px] font-bold text-purple-300 tracking-tight leading-none">ZIP &amp; Handoff</div>
                      <div className="text-[6px] text-slate-400 mt-0.5">Developer ready</div>
                    </div>
                    {/* Mini Package Graphic */}
                    <div className="my-auto text-center">
                      <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-[6.5px] text-center font-medium text-purple-200/90 bg-purple-900/40 py-0.5 rounded-[3px]">
                      1-Click ZIP
                    </div>
                  </div>
                </div>

                {/* iOS Home Indicator Bar */}
                <div className="w-20 h-1 rounded-full mx-auto mt-1.5 bg-white/30" />
              </div>
            </div>
          </div>

          {/* Tablet Mockup Frame */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
              device === "tablet"
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-[0.88] -translate-y-3 pointer-events-none"
            }`}
          >
            <div className="relative w-[340px] sm:w-[410px] rounded-[30px] p-[7px] border border-[#3e4046] bg-[#25262a] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300">
              {/* Outer Physical Hardware Buttons for iPad (Top Power Button & Two Side Volume Buttons) */}
              {/* Top: Power / Sleep Button */}
              <div className="absolute -top-[4px] right-[36px] sm:right-[44px] w-[30px] sm:w-[34px] h-[3px] rounded-t-sm bg-[#363840]" />
              {/* Right: Volume Up */}
              <div className="absolute -right-[4px] top-[26px] sm:top-[28px] w-[3px] h-[16px] sm:h-[18px] rounded-r-sm bg-[#363840]" />
              {/* Right: Volume Down */}
              <div className="absolute -right-[4px] top-[46px] sm:top-[50px] w-[3px] h-[16px] sm:h-[18px] rounded-r-sm bg-[#363840]" />

              {/* Screen Inner */}
              <div className="w-full rounded-[24px] p-3.5 bg-black text-white">
                {/* Tablet Header: Brand Icon, Name, Subtitle & Blue GET Button */}
                <div className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-[15px] shadow-sm overflow-hidden">
                      <BrandIcon
                        withBadge
                        size={58}
                        className="w-[58px] h-[58px]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold leading-tight text-white">
                        Store Preview Studio
                      </div>
                      <div className="text-[10.5px] text-slate-400">
                        Mockup Studio Pro
                      </div>
                      <div>
                        <button
                          type="button"
                          className="px-3 py-0.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-normal text-[10px] tracking-wide shadow-sm transition-colors cursor-pointer"
                        >
                          GET
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Metrics Ribbon (App Store Authentic 3-Column) */}
                <StoreMetricsRibbon theme="dark" />

                {/* Tablet Screenshot Gallery (Vibrant Mini App Screens) */}
                <div className="grid grid-cols-2 gap-2.5 select-none">
                  {/* Screen 1: Canvas Studio */}
                  <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-indigo-950/80 via-[#141527] to-black border border-indigo-500/25 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-bold text-indigo-300">Live Stage Canvas</span>
                      <span className="text-[7px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">4K Retina</span>
                    </div>
                    <div className="flex items-center gap-2 my-auto">
                      <div className="w-10 h-11 rounded-[6px] border border-indigo-400/40 bg-indigo-950 p-0.5 flex flex-col justify-between shadow">
                        <div className="w-3 h-0.5 rounded-full bg-white/40 mx-auto" />
                        <div className="w-full h-7 rounded-[3px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-[7.5px] text-white font-medium">Framed &amp; Frameless</div>
                        <div className="text-[6.5px] text-slate-400">Realistic bezels &amp; metrics</div>
                        <div className="w-full h-1 rounded-full bg-indigo-500/30 overflow-hidden">
                          <div className="w-3/4 h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Screen 2: Export Package */}
                  <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-purple-950/80 via-[#1b1328] to-black border border-purple-500/25 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[8.5px] font-bold text-purple-300">Handoff Deliverables</span>
                      <span className="text-[7px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">ZIP + MD</span>
                    </div>
                    <div className="flex items-center gap-2.5 my-auto">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shrink-0 shadow">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="text-[7.5px] text-white font-mono font-bold truncate">store-bundle.zip</div>
                        <div className="text-[6.5px] text-slate-400">PNGs, screens &amp; metadata</div>
                        <div className="text-[6.5px] text-emerald-400 font-semibold">✓ Ready to submit</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tablet Home Bar */}
                <div className="w-24 h-1 rounded-full mx-auto mt-2.5 bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

// ============================================================================
// CARD 2: CURATED STORE PRESETS (Interactive Core Presets Stage)
// ============================================================================
function StorePresetsCard() {
  const [activePreset, setActivePreset] = useState<"zenmind" | "pulsefit" | "cyberstrike">("zenmind");
  const [isFlipping, setIsFlipping] = useState(false);

  const presets = {
    zenmind: {
      name: "ZenMind: Meditation & Sleep",
      subtitle: "Guided breathwork & calm sound",
      category: "Health & Fitness",
      rating: "4.9 ★",
      ratingCount: "82K Ratings",
      age: "4+",
      developer: "ZenMind Studio",
      gradient: "from-[#05140e] via-[#0c2319] to-[#059669]",
      icon: (
        <svg viewBox="0 0 512 512" className="w-9 h-9 text-white drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="zmBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#05140e" />
              <stop offset="50%" stopColor="#0c2319" />
              <stop offset="100%" stopColor="#143527" />
            </linearGradient>
            <linearGradient id="zmGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="115" fill="url(#zmBg)" />
          <circle cx="256" cy="256" r="175" fill="none" stroke="rgba(52,211,153,0.3)" strokeWidth="4" />
          <g transform="translate(256, 160)">
            <path d="M 0 -45 A 36 36 0 0 0 32 -10 A 42 42 0 1 1 -5 -45 Z" fill="#fde68a" />
            <circle cx="15" cy="-28" r="3" fill="#ffffff" opacity="0.8" />
          </g>
          <g transform="translate(256, 300)">
            <path d="M 0 20 C -70 10 -115 -25 -100 -70 C -75 -65 -35 -20 0 20 Z" fill="url(#zmGreen)" opacity="0.75" />
            <path d="M 0 20 C 70 10 115 -25 100 -70 C 75 -65 35 -20 0 20 Z" fill="url(#zmGreen)" opacity="0.75" />
            <path d="M 0 20 C -55 -15 -80 -70 -50 -105 C -35 -80 -10 -25 0 20 Z" fill="url(#zmGreen)" opacity="0.9" />
            <path d="M 0 20 C 55 -15 80 -70 50 -105 C 35 -80 10 -25 0 20 Z" fill="url(#zmGreen)" opacity="0.9" />
            <path d="M 0 20 C -35 -35 -35 -105 0 -130 C 35 -105 35 -35 0 20 Z" fill="#ffffff" opacity="0.95" />
            <circle cx="0" cy="-20" r="12" fill="#fde68a" />
          </g>
        </svg>
      ),
    },
    pulsefit: {
      name: "PulseFit: Workout & Fitness",
      subtitle: "HIIT, gym plans & meal log",
      category: "Health & Fitness",
      rating: "4.9 ★",
      ratingCount: "24.6K Ratings",
      age: "4+",
      developer: "PulseFit Health Lab",
      gradient: "from-[#ff6b35] via-[#ea580c] to-[#ffc107]",
      icon: (
        <svg viewBox="0 0 512 512" className="w-9 h-9 text-white drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="pfitBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#080e18" />
              <stop offset="50%" stopColor="#0f1b2d" />
              <stop offset="100%" stopColor="#16273f" />
            </linearGradient>
            <linearGradient id="pfG" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="50%" stopColor="#ff8c42" />
              <stop offset="100%" stopColor="#ffc107" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="115" fill="url(#pfitBg)" />
          <circle cx="256" cy="256" r="165" fill="none" stroke="url(#pfG)" strokeWidth="22" strokeDasharray="500 200" strokeLinecap="round" opacity="0.4" />
          <rect x="96" y="224" width="24" height="64" rx="8" fill="url(#pfG)" opacity="0.9" />
          <rect x="128" y="206" width="28" height="100" rx="10" fill="url(#pfG)" />
          <rect x="356" y="206" width="28" height="100" rx="10" fill="url(#pfG)" />
          <rect x="392" y="224" width="24" height="64" rx="8" fill="url(#pfG)" opacity="0.9" />
          <path d="M120 256 L180 256 L205 185 L240 335 L272 205 L300 285 L325 256 L392 256" fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="205" cy="185" r="9" fill="#ffc107" />
        </svg>
      ),
    },
    cyberstrike: {
      name: "CyberStrike: 2088 Cyber RPG",
      subtitle: "Open-world sci-fi action RPG",
      category: "Role Playing",
      rating: "4.8 ★",
      ratingCount: "145K Ratings",
      age: "12+",
      developer: "OmniArcade Games Ltd.",
      gradient: "from-[#05050b] via-[#1e0b2e] to-[#7928ca]",
      icon: (
        <svg viewBox="0 0 512 512" className="w-9 h-9 text-white drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#05050b" />
              <stop offset="40%" stopColor="#0f0e1c" />
              <stop offset="100%" stopColor="#1e0b2e" />
            </linearGradient>
            <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#0077fe" />
            </linearGradient>
            <linearGradient id="neonPink" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff007f" />
              <stop offset="100%" stopColor="#7928ca" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="115" fill="url(#cbg)" />
          <path d="M40 120 L120 120 L160 160 M472 120 L392 120 L352 160 M40 392 L120 392 L160 352 M472 392 L392 392 L352 352" stroke="#00f5ff" strokeWidth="4" fill="none" opacity="0.3" />
          <path d="M160 170 L352 170 L382 250 L322 360 L190 360 L130 250 Z" fill="#131422" stroke="url(#neonCyan)" strokeWidth="10" />
          <polygon points="175,230 337,230 315,268 197,268" fill="url(#neonPink)" />
          <line x1="160" y1="249" x2="352" y2="249" stroke="#ffffff" strokeWidth="5" />
          <polygon points="170,165 140,90 200,140" fill="url(#neonPink)" />
          <polygon points="342,165 372,90 312,140" fill="url(#neonPink)" />
        </svg>
      ),
    },
  };

  const handleSelectPreset = (key: "zenmind" | "pulsefit" | "cyberstrike") => {
    if (key === activePreset || isFlipping) return;
    setIsFlipping(true);

    // Half-turn: Turn 90deg edge-on, swap preset, then unfold back to 0deg
    setTimeout(() => {
      setActivePreset(key);
      setIsFlipping(false);
    }, 180);
  };

  const current = presets[activePreset];

  return (
    <div className="group relative rounded-[28px] px-6 py-3.5 sm:px-8 sm:py-4 flex flex-col overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-2 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-amber-400 via-amber-500 to-transparent" />

      {/* Top Header & Preset Switcher Buttons */}
      <div className="relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 sm:mb-2.5">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 shrink-0">
              02
            </span>
            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curated Store Presets
            </h3>
          </div>
          <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-400 max-w-sm leading-normal">
            Explore sample presets with store metadata and ratings.
          </p>
        </div>

        {/* 3 Preset Switcher Sliding Tabs */}
        <div className="shrink-0 self-start sm:self-center">
          <SlidingTabs
            value={activePreset}
            onChange={(val) => handleSelectPreset(val as "zenmind" | "pulsefit" | "cyberstrike")}
            options={[
              { value: "zenmind", label: "ZenMind" },
              { value: "pulsefit", label: "PulseFit" },
              { value: "cyberstrike", label: "CyberStrike" },
            ]}
            className="w-[270px] sm:w-[290px]"
            size="sm"
            ariaLabel="Preset selector tabs"
          />
        </div>
      </div>

      {/* Simulated Live Stage with Device Frame (without inner container wrapper) */}
      <div
        className="relative z-10 w-full h-[265px] sm:h-[275px] flex items-center justify-center select-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative w-[340px] sm:w-[410px] rounded-[30px] p-[7px] border border-[#3e4046] bg-[#25262a] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]"
            style={{
              transform: isFlipping ? "rotateY(90deg) scale(0.93)" : "rotateY(0deg) scale(1)",
              transformStyle: "preserve-3d",
              transition: isFlipping
                ? "transform 0.18s cubic-bezier(0.4, 0, 1, 1), opacity 0.18s ease-in"
                : "transform 0.22s cubic-bezier(0, 0, 0.2, 1), opacity 0.22s ease-out",
              opacity: isFlipping ? 0.7 : 1,
              willChange: "transform, opacity",
            }}
          >
            {/* Outer Physical Hardware Buttons for iPad (Top Power Button & Two Side Volume Buttons) */}
            {/* Top: Power / Sleep Button */}
            <div className="absolute -top-[4px] right-[36px] sm:right-[44px] w-[30px] sm:w-[34px] h-[3px] rounded-t-sm bg-[#363840]" />
            {/* Right: Volume Up */}
            <div className="absolute -right-[4px] top-[26px] sm:top-[28px] w-[3px] h-[16px] sm:h-[18px] rounded-r-sm bg-[#363840]" />
            {/* Right: Volume Down */}
            <div className="absolute -right-[4px] top-[46px] sm:top-[50px] w-[3px] h-[16px] sm:h-[18px] rounded-r-sm bg-[#363840]" />

            {/* Screen Inner */}
            <div className="w-full rounded-[24px] p-3.5 bg-black text-white">
              {/* Tablet Header: Brand Icon, Name, Subtitle & Blue GET Button */}
              <div className="pb-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-[58px] h-[58px] shrink-0 rounded-[15px] bg-gradient-to-br ${current.gradient} flex items-center justify-center text-white shadow-md border border-white/20 transition-all duration-300 overflow-hidden`}
                  >
                    {current.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold leading-tight text-white truncate transition-all duration-200">
                      {current.name}
                    </div>
                    <div className="text-[10.5px] text-slate-400 truncate transition-all duration-200">
                      {current.subtitle}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="px-3 py-0.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-normal text-[10px] tracking-wide shadow-sm transition-colors cursor-pointer"
                      >
                        GET
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Metrics Ribbon (Tablet 3-Column) */}
              <StoreMetricsRibbon
                theme="dark"
                rating={current.rating}
                ratingCount={current.ratingCount}
                age={current.age}
                developerName={current.developer}
              />

              {/* Tablet Screenshot Gallery (Dynamic Real App UI aligned with Core) */}
              <div className="grid grid-cols-2 gap-2.5 select-none">
                {activePreset === "zenmind" && (
                  <>
                    {/* ZenMind Screen 1: Daily Guided Meditation */}
                    <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#064e3b]/90 via-[#0c2319] to-black border border-emerald-500/25 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-emerald-200">Daily Meditation</span>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">15 Min Practice</span>
                      </div>
                      <div className="flex items-center gap-2 my-auto">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shrink-0 shadow">
                          <span className="text-[14px]">🧘‍♀️</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="text-[7.5px] text-white font-medium truncate">Morning Gratitude &amp; Focus</div>
                          <div className="text-[6.5px] text-emerald-300/80">Voice: Sarah Jenkins</div>
                          <div className="flex items-center gap-1 text-[6px] text-slate-400">
                            <span>08:42</span>
                            <div className="flex-1 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
                              <div className="w-[58%] h-full bg-emerald-400 rounded-full" />
                            </div>
                            <span>15:00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ZenMind Screen 2: 3D Binaural Soundscapes */}
                    <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#042f2e]/90 via-[#0a1e16] to-black border border-teal-500/25 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-teal-200">3D Soundscapes</span>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-medium">432 Hz Solfeggio</span>
                      </div>
                      <div className="flex items-center gap-2.5 my-auto">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-700 to-emerald-900 flex items-center justify-center shrink-0 shadow">
                          <span className="text-[14px]">🌧️</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="text-[7.5px] text-white font-medium">Soft Rain on Skylight (75%)</div>
                          <div className="text-[6.5px] text-slate-400">Delta Sleep Induction (2.5 Hz)</div>
                          <div className="text-[6.5px] text-emerald-400 font-semibold">🌙 45m Auto-fade</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activePreset === "pulsefit" && (
                  <>
                    {/* PulseFit Screen 1: Workout & Set Logger */}
                    <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#431407]/90 via-[#180d09] to-black border border-orange-500/25 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-orange-200">Set Logger</span>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-medium">Rest 01:45</span>
                      </div>
                      <div className="space-y-1 my-auto">
                        <div className="text-[7.5px] text-white font-medium flex items-center justify-between">
                          <span>🏋️ Barbell Bench Press</span>
                          <span className="text-orange-400 font-bold">Set 3/4</span>
                        </div>
                        <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[7px]">
                          <span className="text-slate-300">Active: 100 kg × 8 reps</span>
                          <span className="text-emerald-400 font-bold">✓ Logged</span>
                        </div>
                      </div>
                    </div>

                    {/* PulseFit Screen 2: Cardiac Metrics */}
                    <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#1e1b4b]/80 via-[#0f172a] to-black border border-amber-500/25 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-amber-200">Cardiac Metrics</span>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">Zone 4 (Hard)</span>
                      </div>
                      <div className="flex items-center gap-2.5 my-auto">
                        <div className="w-9 h-9 rounded-full border-2 border-orange-500/70 flex items-center justify-center shrink-0 shadow-inner">
                          <span className="text-[8.5px] font-extrabold text-amber-300 font-mono">154</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="text-[7.5px] text-white font-medium">BPM · Active Heart Rate</div>
                          <div className="text-[6.5px] text-orange-300 font-medium">🔥 520 kcal burned</div>
                          <div className="text-[6.5px] text-cyan-300">⌚ Apple Watch &amp; Wear OS</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activePreset === "cyberstrike" && (
                  <>
                    {/* CyberStrike Screen 1: Next-Gen Open World */}
                    <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#1e0b2e]/90 via-[#0d071a] to-black border border-cyan-500/30 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-cyan-300 tracking-wider">NEO-SHINJUKU</span>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">2088 RPG</span>
                      </div>
                      <div className="my-auto space-y-1">
                        <div className="text-[7.5px] text-white font-semibold flex items-center justify-between">
                          <span>⚔️ Legendary Cyber-Blade</span>
                          <span className="text-cyan-400 font-mono text-[7px]">LVL 75</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[6px] text-slate-400 font-mono">
                            <span>HP 4,850 / 5,200</span>
                            <span className="text-cyan-400">SHIELD 100%</span>
                          </div>
                          <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                            <div className="w-[93%] h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CyberStrike Screen 2: High-Speed Combat */}
                    <div className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#2a0820]/90 via-[#140612] to-black border border-pink-500/30 relative overflow-hidden transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[8.5px] font-bold text-pink-300 tracking-wider">HACK &amp; SLASH</span>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono font-bold">120 FPS</span>
                      </div>
                      <div className="flex items-center gap-2 my-auto">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-600 via-fuchsia-600 to-cyan-500 flex flex-col items-center justify-center shrink-0 shadow text-center p-0.5">
                          <span className="text-[8px] font-black text-white font-mono leading-none">142</span>
                          <span className="text-[5px] text-cyan-100 font-bold uppercase">Combo</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="text-[7.5px] text-cyan-300 font-mono font-extrabold truncate">CRITICAL STRIKE! +380%</div>
                          <div className="text-[6.5px] text-slate-300 font-mono">CRIT 98,420 DMG</div>
                          <div className="text-[6.5px] text-fuchsia-400 font-bold">⚡ PARRY! Fluid Aerial Combo</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Tablet Home Bar */}
              <div className="w-24 h-1 rounded-full mx-auto mt-2.5 bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

// ============================================================================
// CARD 3: SMART SIZE & COMPLIANCE DETECTION (Interactive 1-Click Flatten)
// ============================================================================
function ComplianceCard() {
  const [flattened, setFlattened] = useState(false);

  return (
    <div className="group relative rounded-[28px] px-6 py-3.5 sm:px-8 sm:py-4 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-1 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div
        className={`absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r transition-all duration-300 ${
          flattened
            ? "from-[#00D085] via-emerald-400 to-transparent"
            : "from-rose-400 via-rose-500 to-transparent"
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-[12px] font-mono font-bold tracking-wider shrink-0 transition-colors ${
              flattened
                ? "text-emerald-600 dark:text-[#00D085]"
                : "text-rose-500 dark:text-rose-400"
            }`}
          >
            03
          </span>
          <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Size &amp; Compliance QA
          </h3>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Automatically scans for invalid aspect ratios and illegal iOS app icon transparency (ITMS-90717).
        </p>

        {/* Interactive Scanner Box */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            {/* Simulated Icon (Core Canvas Dot Grid with Subtle White Border vs Flattened) */}
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-xl transition-all duration-300 ${
                flattened
                  ? "bg-[#0b0c0e] border-emerald-500/50 shadow-[0_0_14px_rgba(16,185,129,0.2)]"
                  : "bg-[#121312] dark:bg-[#141514] [background-image:radial-gradient(circle,rgba(255,255,255,0.15)_1.2px,transparent_1.2px)] [background-size:8px_8px] border-white/20 dark:border-white/15 shadow-sm"
              }`}
            >
              <span className={`text-xl drop-shadow-sm select-none ${flattened ? "text-emerald-400" : "text-amber-400"}`}>
                ★
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {flattened ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> No Alpha Found
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Alpha Detected &lt;250
                  </span>
                )}
              </div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">
                {flattened ? "Export-ready RGB icon preview" : "Transparency notice: ITMS-90717"}
              </div>
            </div>
          </div>

          {/* 1-Click Flatten Action Button (Using globals.css --card background) */}
          <button
            type="button"
            onClick={() => setFlattened(!flattened)}
            className="w-full py-2.5 px-4 rounded-xl text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer bg-[var(--card,#1D1E1D)] hover:bg-[#252625] text-slate-200 dark:text-[#EDEDED] hover:text-white border border-slate-200/90 dark:border-[var(--border,#282928)] hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] active:scale-[0.99]"
          >
            {flattened ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Re-test Alpha Warning</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>1-Click Auto-Flatten</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CARD 4: MULTI-FORMAT EXPORT & DEV MARKDOWN (Interactive Export Selector)
// ============================================================================
function ExportCard() {
  const [tab, setTab] = useState<"png" | "zip" | "md">("png");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group relative rounded-[28px] px-6 py-3.5 sm:px-8 sm:py-4 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-1 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-purple-400 via-purple-500 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-[12px] font-mono font-bold tracking-wider text-purple-600 dark:text-purple-400 shrink-0">
            04
          </span>
          <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Multi-Format Export &amp; Dev Markdown
          </h3>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Export 3x Ultra-HD PNG mockups, client-side ZIP bundles, or developer markdown handoffs.
        </p>

        {/* Tab Switcher with Sliding Pill */}
        <div className="my-3.5">
          <SlidingTabs
            value={tab}
            onChange={setTab}
            className="w-full"
            ariaLabel="Export format tabs"
            options={[
              { value: "png", label: "3x PNG" },
              { value: "zip", label: "ZIP Bundle" },
              { value: "md", label: "Markdown" },
            ]}
          />
        </div>

        {/* Interactive Visual Canvas */}
        <div className="rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06] p-3.5 h-[130px] flex flex-col justify-center">
          {tab === "png" && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#1c1d1f] border border-black/5 dark:border-white/5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">3x Ultra-HD PNG</span>
                <span className="text-[10px] text-purple-400 font-bold">1179 × 2556 px</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#1c1d1f] border border-black/5 dark:border-white/5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Frameless Screen-Only</span>
                <span className="text-[10px] text-slate-400">Direct Store Upload</span>
              </div>
            </div>
          )}

          {tab === "zip" && (
            <div className="space-y-1.5 text-[10.5px] font-mono text-slate-600 dark:text-slate-300">
              <div className="font-bold text-purple-400">📦 store-bundle.zip</div>
              <div className="pl-3">├── 📁 phone-previews/</div>
              <div className="pl-3">├── 📁 tablet-previews/</div>
              <div className="pl-3">└── 📄 store-metadata.md</div>
            </div>
          )}

          {tab === "md" && (
            <div className="space-y-2">
              <div className="p-2 rounded bg-white dark:bg-[#1c1d1f] text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/5 overflow-hidden">
                <div>## App Store Metadata</div>
                <div className="text-emerald-500">- Name: Store Preview Studio (20/30)</div>
                <div className="text-purple-400">- Subtitle: Curated Store Mockups</div>
              </div>
              <button
                onClick={handleCopy}
                className="w-full py-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/25 text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-purple-500/20 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Markdown Handoff
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN FEATURES SECTION CONTAINER
// ============================================================================
export function Features() {
  const { features } = siteConfig;

  return (
    <section
      id="features"
      className="pt-14 pb-20 sm:pt-16 sm:pb-24 border-t border-border bg-slate-50/50 dark:bg-[#131413] transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {features.headline}
          </h2>

          <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-[#475569] dark:text-slate-400 max-w-[680px] mx-auto leading-relaxed text-balance">
            Test the live interactive components below to preview the exact workflows and automation built into Store Preview Studio.
          </p>
        </div>

        {/* 4-Card Bento Grid: Row 1 (6 + 6 cols) & Row 2 (6 + 6 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-7">
          <DeviceFramesCard />
          <StorePresetsCard />
          <ComplianceCard />
          <ExportCard />
        </div>
      </div>
    </section>
  );
}
