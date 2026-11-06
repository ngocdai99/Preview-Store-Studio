"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { DeviceSelectorDropdown } from "@/components/ui/DeviceSelectorDropdown";
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
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-2 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-[#00D085] via-emerald-400 to-transparent" />

      {/* Top Header & Interactive Switchers (z-30 to float comfortably over simulated stage) */}
      <div className="relative z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[12px] font-mono font-bold tracking-wider text-emerald-600 dark:text-[#00D085] block mb-1">
            01
          </span>
          <h3 className="text-[20px] sm:text-[22px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Modern Device Frames
          </h3>
          <p className="mt-1 text-[13.5px] sm:text-[14px] text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Switch between iPhone and iPad to preview your app with authentic store framing.
          </p>
        </div>

        {/* Interactive Controls Bar: Direct Device Menu */}
        <div className="relative z-40 self-start lg:self-center">
          <DeviceSelectorDropdown
            value={device}
            onChange={setDevice}
          />
        </div>
      </div>

      {/* Simulated Live Stage (Visual Interactive Mockup with Zero Layout Shift & Fluid Morph Animation) */}
      <div className="relative z-10 w-full h-[370px] sm:h-[390px] rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 dark:from-[#111211] dark:to-[#0c0d0c] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-center overflow-hidden select-none">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute w-[360px] h-[360px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        {/* Morphing Stage Container - Zero Layout Shift */}
        <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4">
          {/* Phone Mockup Frame (Realistic Hardware Bezel & Authentic App Store Product Page) */}
          <div
            className={`absolute transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
              device === "phone"
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-[0.88] translate-y-3 pointer-events-none"
            }`}
          >
            <div className="relative w-[265px] sm:w-[285px] rounded-[48px] p-[8px] border border-[#363840] bg-[#1e1f23] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all duration-300">
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
              <div className="w-full rounded-[40px] overflow-hidden px-3 pt-2.5 pb-2.5 bg-black text-white">
                {/* iOS Status Bar with Dynamic Island */}
                <div className="flex items-center justify-between px-2 pt-0.5 pb-2 text-[11px] font-semibold">
                  {/* Left: Clock */}
                  <span className="tracking-tight text-[11px] font-bold opacity-90">4:31</span>

                  {/* Center: Dynamic Island with Sensor Lens */}
                  <div className="w-[78px] h-[20px] bg-black rounded-full flex items-center justify-end px-2 border border-black/80 dark:border-white/10 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                  </div>

                  {/* Right: Cellular, Wi-Fi & Battery Icons */}
                  <div className="flex items-center gap-1 opacity-90">
                    {/* Cellular */}
                    <svg className="w-3.5 h-2.5" viewBox="0 0 17 12" fill="currentColor">
                      <rect x="0.5" y="7.5" width="2.4" height="4.5" rx="0.8" />
                      <rect x="4.8" y="5" width="2.4" height="7" rx="0.8" />
                      <rect x="9.1" y="2.5" width="2.4" height="9.5" rx="0.8" />
                      <rect x="13.4" y="0" width="2.4" height="12" rx="0.8" />
                    </svg>
                    {/* Wi-Fi */}
                    <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="none">
                      <path d="M1.5 4.3C5.2 1.0 10.8 1.0 14.5 4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M4.2 7.3C6.3 5.4 9.7 5.4 11.8 7.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="8" cy="10.7" r="1.25" fill="currentColor" />
                    </svg>
                    {/* Battery */}
                    <svg className="w-4 h-2.5" viewBox="0 0 26 13" fill="currentColor">
                      <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      <rect x="2" y="2" width="16" height="9" rx="2" />
                      <rect x="23.8" y="4.5" width="1.4" height="4" rx="0.7" />
                    </svg>
                  </div>
                </div>

                {/* App Detail Header: Brand Icon, Name, Subtitle, Apple Blue GET Button */}
                <div className="px-1 pt-1.5 flex items-start gap-3">
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
            className={`absolute transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
              device === "tablet"
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-[0.88] -translate-y-3 pointer-events-none"
            }`}
          >
            <div className="relative w-[340px] sm:w-[410px] rounded-[30px] p-[7px] border border-[#3e4046] bg-[#25262a] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300">
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
    </div>
  );
}

// ============================================================================
// CARD 2: CURATED STORE PRESETS (Interactive Core Presets Stage)
// ============================================================================
function StorePresetsCard() {
  const [activePreset, setActivePreset] = useState<"zenmind" | "taskflow" | "pulsefit">("zenmind");
  const [flipDegree, setFlipDegree] = useState(0);
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
      gradient: "from-purple-500 to-rose-500",
      letter: "Z",
    },
    taskflow: {
      name: "TaskFlow: Habit Planner",
      subtitle: "Build habits & boost focus",
      category: "Productivity",
      rating: "4.9 ★",
      ratingCount: "1.8K Ratings",
      age: "4+",
      developer: "FlowCraft Studio",
      gradient: "from-blue-500 to-indigo-600",
      letter: "T",
    },
    pulsefit: {
      name: "PulseFit: Workout Tracker",
      subtitle: "HIIT, gym plans & meal log",
      category: "Health & Fitness",
      rating: "4.8 ★",
      ratingCount: "24.6K Ratings",
      age: "4+",
      developer: "PulseFit Health",
      gradient: "from-emerald-500 to-teal-600",
      letter: "P",
    },
  };

  const handleSelectPreset = (key: "zenmind" | "taskflow" | "pulsefit") => {
    if (key === activePreset) return;
    setFlipDegree((prev) => prev + 360);
    setIsFlipping(true);

    // Halfway through the 360-degree rotation (260ms), update the preset data
    setTimeout(() => {
      setActivePreset(key);
    }, 260);

    setTimeout(() => {
      setIsFlipping(false);
    }, 550);
  };

  const current = presets[activePreset];

  return (
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-2 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-amber-400 via-amber-500 to-transparent" />

      {/* Top Header & Preset Switcher Buttons */}
      <div className="relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[12px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
            02
          </span>
          <h3 className="text-[20px] sm:text-[22px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curated Store Presets
          </h3>
          <p className="mt-1 text-[13.5px] sm:text-[14px] text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Switch between ready-to-edit templates with authentic store metadata, ratings, and framing.
          </p>
        </div>

        {/* 3 Preset Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/90 dark:border-[#282928] shadow-sm shrink-0 self-start sm:self-center">
          {(["zenmind", "taskflow", "pulsefit"] as const).map((key) => {
            const isActive = activePreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[var(--btn-white-bg,#EFF1F0)] text-[var(--btn-white-text,#252625)] shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.06]"
                }`}
              >
                {key === "zenmind" ? "ZenMind" : key === "taskflow" ? "TaskFlow" : "PulseFit"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulated Live Stage with Device Frame (Phone Mockup directly displaying preset data) */}
      <div className="relative z-10 w-full h-[370px] sm:h-[390px] rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 dark:from-[#111211] dark:to-[#0c0d0c] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-center overflow-hidden select-none">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute w-[360px] h-[360px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        <div
          className="relative w-full h-full flex items-center justify-center p-3 sm:p-4"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-[265px] sm:w-[285px] rounded-[48px] p-[8px] border border-[#363840] bg-[#1e1f23] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)]"
            style={{
              transform: `rotateY(${flipDegree}deg) scale(${isFlipping ? 0.92 : 1})`,
              transformStyle: "preserve-3d",
              transition: "transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)",
              willChange: "transform",
            }}
          >
            {/* Outer Physical Hardware Buttons */}
            <div className="absolute -left-[4px] top-[60px] w-[3px] h-[16px] rounded-l-sm bg-[#363840]" />
            <div className="absolute -left-[4px] top-[84px] w-[3px] h-[30px] rounded-l-sm bg-[#363840]" />
            <div className="absolute -left-[4px] top-[122px] w-[3px] h-[30px] rounded-l-sm bg-[#363840]" />
            <div className="absolute -right-[4px] top-[92px] w-[3px] h-[44px] rounded-r-sm bg-[#363840]" />

            {/* Screen Inner */}
            <div className="w-full rounded-[40px] overflow-hidden px-3 pt-2.5 pb-2.5 bg-black text-white">
              {/* iOS Status Bar with Dynamic Island */}
              <div className="flex items-center justify-between px-2 pt-0.5 pb-2 text-[11px] font-semibold">
                <span className="tracking-tight text-[11px] font-bold opacity-90">9:41</span>
                <div className="w-[78px] h-[20px] bg-black rounded-full flex items-center justify-end px-2 border border-black/80 dark:border-white/10 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 opacity-90">
                  <svg className="w-3.5 h-2.5" viewBox="0 0 17 12" fill="currentColor">
                    <rect x="0.5" y="7.5" width="2.4" height="4.5" rx="0.8" />
                    <rect x="4.8" y="5" width="2.4" height="7" rx="0.8" />
                    <rect x="9.1" y="2.5" width="2.4" height="9.5" rx="0.8" />
                    <rect x="13.4" y="0" width="2.4" height="12" rx="0.8" />
                  </svg>
                  <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="none">
                    <path d="M1.5 4.3C5.2 1.0 10.8 1.0 14.5 4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M4.2 7.3C6.3 5.4 9.7 5.4 11.8 7.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="8" cy="10.7" r="1.25" fill="currentColor" />
                  </svg>
                  <svg className="w-4 h-2.5" viewBox="0 0 26 13" fill="currentColor">
                    <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="2" y="2" width="16" height="9" rx="2" />
                    <rect x="23.8" y="4.5" width="1.4" height="4" rx="0.7" />
                  </svg>
                </div>
              </div>

              {/* App Detail Header: Brand Icon, Name, Subtitle, Apple Blue GET Button */}
              <div className="px-1 pt-1.5 flex items-start gap-3">
                {/* Stylized Preset Icon */}
                <div
                  className={`w-[52px] h-[52px] shrink-0 rounded-[15px] bg-gradient-to-br ${current.gradient} flex items-center justify-center text-white font-black text-2xl shadow-md border border-white/15 transition-all duration-300`}
                >
                  {current.letter}
                </div>

                {/* App Info & Action Button */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[12.5px] sm:text-[13px] font-extrabold tracking-tight leading-tight text-white truncate transition-all duration-200">
                    {current.name}
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] leading-tight font-medium text-slate-400 truncate transition-all duration-200">
                    {current.subtitle}
                  </p>

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

              {/* Store Metrics Ribbon with Preset-Specific Ratings & Developer */}
              <StoreMetricsRibbon
                theme="dark"
                rating={current.rating}
                ratingCount={current.ratingCount}
                age={current.age}
                developerName={current.developer}
              />

              {/* Screenshot Skeleton Carousel */}
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
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-1 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div
        className={`absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r transition-all duration-300 ${
          flattened
            ? "from-[#00D085] via-emerald-400 to-transparent"
            : "from-rose-400 via-rose-500 to-transparent"
        }`}
      />

      <div className="relative z-10">
        <span
          className={`text-[12px] font-mono font-bold tracking-wider block mb-1 transition-colors ${
            flattened
              ? "text-emerald-600 dark:text-[#00D085]"
              : "text-rose-500 dark:text-rose-400"
          }`}
        >
          03
        </span>
        <h3 className="text-[19px] sm:text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart Size &amp; Compliance QA
        </h3>
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
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-1 lg:col-span-6">
      {/* Top hairline accent line (Pricing style) */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-purple-400 via-purple-500 to-transparent" />

      <div className="relative z-10">
        <span className="text-[12px] font-mono font-bold tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
          04
        </span>
        <h3 className="text-[19px] sm:text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">
          Multi-Format Export &amp; Dev Markdown
        </h3>
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
              <div className="font-bold text-purple-400">📦 store-preview-studio.zip</div>
              <div className="pl-3">├── 📁 ios-screenshots/ (5)</div>
              <div className="pl-3">├── 📁 android-screenshots/ (5)</div>
              <div className="pl-3">└── 📄 LISTING_METADATA.md</div>
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
