"use client";

import React, { useState } from "react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { FeatureCard } from "./FeatureCard";
import { StoreMetricsRibbon } from "@/components/ui/StoreMetricsRibbon";
import { IPadMockupFrame } from "./DeviceHardwareHelpers";
import { ZenmindPresetMockup } from "./ZenmindPresetMockup";
import { PulsefitPresetMockup } from "./PulsefitPresetMockup";
import { CyberstrikePresetMockup } from "./CyberstrikePresetMockup";

export function StorePresetsCard() {
  const [activePreset, setActivePreset] = useState<"cyberstrike" | "zenmind" | "pulsefit">("cyberstrike");
  const [isFlipping, setIsFlipping] = useState(false);

  const presets = {
    cyberstrike: {
      name: "CyberStrike: 2088 Cyber RPG",
      subtitle: "Open-world sci-fi action RPG",
      category: "Role Playing",
      rating: "4.8 ★",
      ratingCount: "145K Ratings",
      age: "12+",
      developer: "Kai DevLabs",
      gradient: "from-[#05050b] via-[#1e0b2e] to-[#7928ca]",
      icon: (
        <svg viewBox="0 0 512 512" className="w-full h-full text-white drop-shadow-sm" fill="none">
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
    zenmind: {
      name: "ZenMind: Meditation & Sleep",
      subtitle: "Guided breathwork & calm sound",
      category: "Health & Fitness",
      rating: "4.9 ★",
      ratingCount: "82K Ratings",
      age: "4+",
      developer: "Kai DevLabs",
      gradient: "from-[#05140e] via-[#0c2319] to-[#059669]",
      icon: (
        <svg viewBox="0 0 512 512" className="w-full h-full text-white drop-shadow-sm" fill="none">
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
      developer: "Kai DevLabs",
      gradient: "from-[#ff6b35] via-[#ea580c] to-[#ffc107]",
      icon: (
        <svg viewBox="0 0 512 512" className="w-full h-full text-white drop-shadow-sm" fill="none">
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
  };

  const handleSelectPreset = (key: "cyberstrike" | "zenmind" | "pulsefit") => {
    if (key === activePreset || isFlipping) return;
    setIsFlipping(true);

    setTimeout(() => {
      setActivePreset(key);
      setIsFlipping(false);
    }, 180);
  };

  const current = presets[activePreset];

  return (
    <FeatureCard
      number="02"
      title="Curated Store Presets"
      description="Explore sample listings across diverse app categories."
      accentGradient="from-amber-400 via-amber-500 to-transparent"
      badgeColorClass="border-amber-500/40 text-amber-600 dark:text-amber-400"
      className="col-span-1 md:col-span-2 lg:col-span-6"
      headerRight={
        <SlidingTabs
          value={activePreset}
          onChange={(val) => handleSelectPreset(val as "cyberstrike" | "pulsefit" | "zenmind")}
          options={[
            { value: "cyberstrike", label: "Games" },
            { value: "pulsefit", label: "Health" },
            { value: "zenmind", label: "Wellness" },
          ]}
          className="w-[270px] sm:w-[290px] shrink-0"
          size="sm"
          ariaLabel="Preset selector tabs"
        />
      }
    >
      {/* Simulated Live Stage with Device Frame */}
      <div
        className="relative z-10 w-full h-[400px] sm:h-[420px] flex items-center justify-center select-none overflow-hidden rounded-b-[24px]"
        style={{ perspective: "1200px" }}
      >
        <IPadMockupFrame
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
          {/* Tablet Header: Brand Icon, Name, Subtitle & Blue GET Button */}
          <div className="flex items-start gap-3 mt-0.5">
            <div className="w-[46px] h-[46px] shrink-0 rounded-[12px] shadow-md overflow-hidden border border-white/10 transition-all duration-300">
              {current.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold leading-tight text-white truncate transition-all duration-200">
                {current.name}
              </div>
              <div className="text-[10px] leading-tight text-slate-400 truncate transition-all duration-200">
                {current.subtitle}
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

          {/* Store Metrics Ribbon (Tablet 3-Column) */}
          <StoreMetricsRibbon
            theme="dark"
            rating={current.rating}
            ratingCount={current.ratingCount}
            age={current.age}
            developerName={current.developer}
            className="my-1 py-1"
          />

          {/* Tablet Screenshots Carousel */}
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
              className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-0.5 pb-1 select-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {activePreset === "zenmind" && <ZenmindPresetMockup />}
              {activePreset === "pulsefit" && <PulsefitPresetMockup />}
              {activePreset === "cyberstrike" && <CyberstrikePresetMockup />}
            </div>

            {/* Contextual App Info Snippet below carousel */}
            {activePreset === "cyberstrike" && (
              <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
                <span className="font-semibold text-cyan-300">Boss Update: Titan-Dreadnought</span>
                <span>v2.1 · 1.8 GB</span>
              </div>
            )}
            {activePreset === "pulsefit" && (
              <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
                <span className="font-semibold text-amber-300">Cardiac Zone 4 Real-Time Sync</span>
                <span>v3.4 · 142 MB</span>
              </div>
            )}
            {activePreset === "zenmind" && (
              <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
                <span className="font-semibold text-emerald-300">432Hz Solfeggio Rain Mix</span>
                <span>v4.0 · 98 MB</span>
              </div>
            )}
          </div>
        </IPadMockupFrame>
      </div>
    </FeatureCard>
  );
}
