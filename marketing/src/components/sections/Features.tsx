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

                {/* Screenshot Skeleton Carousel (Subtle & Deep Tone) */}
                <div className="flex gap-2 overflow-hidden px-0.5 pb-1 select-none">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className="w-20 h-24 rounded-[10px] p-2 flex flex-col justify-between shrink-0 bg-[#121312] border border-white/[0.04]"
                    >
                      <div className="w-full h-12 rounded-md bg-black/60" />
                      <div className="w-10 h-1.5 rounded-full mx-auto bg-black/50" />
                    </div>
                  ))}
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

                {/* Tablet Screenshot Skeleton Gallery (Subtle & Deep Tone) */}
                <div className="grid grid-cols-2 gap-2.5 select-none">
                  {[0, 1].map((idx) => (
                    <div
                      key={idx}
                      className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-[#121312] border border-white/[0.04]"
                    >
                      <div className="w-full h-13 rounded-lg bg-black/60" />
                      <div className="w-16 h-1.5 rounded-full bg-black/50" />
                    </div>
                  ))}
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
  const [activePreset, setActivePreset] = useState<"zenmind" | "taskflow" | "pulsefit">("zenmind");
  const [isFlipping, setIsFlipping] = useState(false);

  const presets = {
    zenmind: {
      name: "ZenMind: Sleep & Calm",
      subtitle: "Guided breathwork & sound",
      category: "Wellness",
      rating: "4.9 ★",
      ratingCount: "82K Ratings",
      age: "4+",
      developer: "ZenMind Studio",
      gradient: "from-purple-600 via-fuchsia-500 to-rose-500",
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-white drop-shadow-sm" fill="none">
          {/* Crescent Moon */}
          <path d="M 50 18 A 8 8 0 0 0 57 26 A 10 10 0 1 1 48 18 Z" fill="#fde68a" opacity="0.95" />
          {/* Lotus Petals */}
          <path d="M 50 72 C 32 60 26 44 32 32 C 40 44 46 60 50 72 Z" fill="white" opacity="0.85" />
          <path d="M 50 72 C 68 60 74 44 68 32 C 60 44 54 60 50 72 Z" fill="white" opacity="0.85" />
          <path d="M 50 74 C 40 56 42 36 50 26 C 58 36 60 56 50 74 Z" fill="white" />
          <circle cx="50" cy="62" r="3.5" fill="#fde68a" />
        </svg>
      ),
    },
    taskflow: {
      name: "TaskFlow: Habit Planner",
      subtitle: "Build habits & boost focus",
      category: "Productivity",
      rating: "4.9 ★",
      ratingCount: "1.8K Ratings",
      age: "4+",
      developer: "FlowCraft Studio",
      gradient: "from-sky-400 via-blue-600 to-indigo-600",
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-white drop-shadow-sm" fill="none">
          {/* Glowing habit progress ring */}
          <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,0.3)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="32" stroke="#e0f2fe" strokeWidth="5" strokeDasharray="130 80" strokeLinecap="round" />
          {/* Bold Checkmark */}
          <path d="M 37 51 L 46 60 L 65 41" stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="71" cy="29" r="3.5" fill="#bae6fd" />
        </svg>
      ),
    },
    pulsefit: {
      name: "PulseFit: Workout Tracker",
      subtitle: "HIIT, gym plans & meal log",
      category: "Health & Fitness",
      rating: "4.8 ★",
      ratingCount: "24.6K Ratings",
      age: "4+",
      developer: "PulseFit Health",
      gradient: "from-emerald-400 via-teal-500 to-cyan-400",
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-white drop-shadow-sm" fill="none">
          {/* Fitness Ring */}
          <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,0.25)" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="32" stroke="#a7f3d0" strokeWidth="4.5" strokeDasharray="140 70" strokeLinecap="round" />
          {/* Heart ECG Pulse Wave */}
          <path
            d="M 24 50 L 36 50 L 41 36 L 48 66 L 54 40 L 60 56 L 65 50 L 76 50"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="41" cy="36" r="2.5" fill="#fde68a" />
        </svg>
      ),
    },
  };

  const handleSelectPreset = (key: "zenmind" | "taskflow" | "pulsefit") => {
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
            onChange={(val) => handleSelectPreset(val as "zenmind" | "taskflow" | "pulsefit")}
            options={[
              { value: "zenmind", label: "ZenMind" },
              { value: "taskflow", label: "TaskFlow" },
              { value: "pulsefit", label: "PulseFit" },
            ]}
            className="w-[240px] sm:w-[260px]"
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

              {/* Tablet Screenshot Skeleton Gallery (2-column grid) */}
              <div className="grid grid-cols-2 gap-2.5 select-none">
                {[0, 1].map((idx) => (
                  <div
                    key={idx}
                    className="h-24 rounded-xl p-2.5 flex flex-col justify-between bg-[#121312] border border-white/[0.04]"
                  >
                    <div className="w-full h-13 rounded-lg bg-black/60" />
                    <div className="w-16 h-1.5 rounded-full bg-black/50" />
                  </div>
                ))}
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
