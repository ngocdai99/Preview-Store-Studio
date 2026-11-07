"use client";

import React, { useState } from "react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { FeatureCard } from "./FeatureCard";
import { StoreMetricsRibbon } from "@/components/ui/StoreMetricsRibbon";
import { IPadMockupFrame, useDraggableScroll } from "./DeviceHardwareHelpers";
import { ZenmindPresetMockup } from "./ZenmindPresetMockup";
import { PulsefitPresetMockup } from "./PulsefitPresetMockup";
import { CyberstrikePresetMockup } from "./CyberstrikePresetMockup";

type PresetKey = "cyberstrike" | "pulsefit" | "zenmind";

const PRESET_KEYS: PresetKey[] = ["cyberstrike", "pulsefit", "zenmind"];

interface PresetDeckCardProps {
  presetKey: PresetKey;
  preset: {
    name: string;
    subtitle: string;
    label: string;
    rating: string;
    ratingCount: string;
    age: string;
    developer: string;
    icon: React.ReactNode;
  };
  depth: number;
  prevDepth: number;
  hasInteracted: boolean;
  onSelect: () => void;
}

function PresetDeckCard({
  presetKey,
  preset,
  depth,
  prevDepth,
  hasInteracted,
  onSelect,
}: PresetDeckCardProps) {
  const { ref: scrollRef, handlers: scrollHandlers } = useDraggableScroll();
  const isForeground = depth === 0;

  let motionClass = `deck-card-initial-${depth}`;
  if (hasInteracted && depth !== prevDepth) {
    if (depth === 0) {
      motionClass = prevDepth === 2 ? "deck-card-orbit-deep-0" : "deck-card-orbit-0";
    } else if (depth === 1) {
      motionClass = "deck-card-orbit-1";
    } else {
      motionClass = "deck-card-orbit-2";
    }
  }

  const opacityClass =
    depth === 0
      ? "opacity-100 filter-none"
      : depth === 1
        ? "opacity-55 group-hover/bg:opacity-85 group-hover/bg:scale-[1.03] filter blur-[0.3px] group-hover/bg:blur-none"
        : "opacity-30 group-hover/bg:opacity-70 group-hover/bg:scale-[1.03] filter blur-[0.6px] group-hover/bg:blur-none";

  return (
    <div
      onClick={!isForeground ? onSelect : undefined}
      className={`absolute inset-0 flex items-center justify-center transform-gpu pointer-events-auto ${motionClass} ${
        !isForeground ? "cursor-pointer group/bg" : ""
      }`}
    >
      <div className={`relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${opacityClass}`}>
        <IPadMockupFrame className="shadow-none">
          {/* Tablet Header: Brand Icon, Name, Subtitle & Blue GET Button */}
          <div className="flex items-start gap-3 mt-0.5">
            <div className="w-[46px] h-[46px] shrink-0 rounded-[12px] shadow-md overflow-hidden border border-white/10">
              {preset.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold leading-tight text-white truncate">
                {preset.name}
              </div>
              <div className="text-[10px] leading-tight text-slate-400 truncate">
                {preset.subtitle}
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
            rating={preset.rating}
            ratingCount={preset.ratingCount}
            age={preset.age}
            developerName={preset.developer}
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
              ref={scrollRef}
              {...scrollHandlers}
              className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-0.5 pb-1 select-none cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {presetKey === "zenmind" && <ZenmindPresetMockup />}
              {presetKey === "pulsefit" && <PulsefitPresetMockup />}
              {presetKey === "cyberstrike" && <CyberstrikePresetMockup />}
            </div>

            {/* Contextual App Info Snippet below carousel */}
            {presetKey === "cyberstrike" && (
              <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
                <span className="font-semibold text-cyan-300">Boss Update: Titan-Dreadnought</span>
                <span>v2.1 · 1.8 GB</span>
              </div>
            )}
            {presetKey === "pulsefit" && (
              <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
                <span className="font-semibold text-amber-300">Cardiac Zone 4 Real-Time Sync</span>
                <span>v3.4 · 142 MB</span>
              </div>
            )}
            {presetKey === "zenmind" && (
              <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
                <span className="font-semibold text-emerald-300">432Hz Solfeggio Rain Mix</span>
                <span>v4.0 · 98 MB</span>
              </div>
            )}
          </div>
        </IPadMockupFrame>

        {/* Click overlay when stacked in background */}
        {!isForeground && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            aria-label={`Switch to ${preset.label} preset`}
            className="absolute inset-0 z-40 w-full h-full rounded-[32px] cursor-pointer focus:outline-none"
          >
            <span className="sr-only">Switch to {preset.label}</span>
            <span className="absolute -top-3.5 right-6 px-2.5 py-1 rounded-full bg-slate-900/95 border border-white/20 text-white font-medium text-[9px] tracking-tight shadow-xl opacity-0 group-hover/bg:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap flex items-center gap-1 backdrop-blur-md">
              <span>{preset.label}</span>
              <span className="text-emerald-400 font-bold">↗</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function StorePresetsCard() {
  const [deckState, setDeckState] = useState<{
    order: PresetKey[];
    prevOrder: PresetKey[];
    hasInteracted: boolean;
  }>({
    order: ["cyberstrike", "pulsefit", "zenmind"],
    prevOrder: ["cyberstrike", "pulsefit", "zenmind"],
    hasInteracted: false,
  });

  const activePreset = deckState.order[0];

  const presets: Record<
    PresetKey,
    {
      name: string;
      subtitle: string;
      label: string;
      category: string;
      rating: string;
      ratingCount: string;
      age: string;
      developer: string;
      glowClass: string;
      icon: React.ReactNode;
    }
  > = {
    cyberstrike: {
      name: "CyberStrike: 2088 Cyber RPG",
      subtitle: "Open-world sci-fi action RPG",
      label: "Games Preset",
      category: "Role Playing",
      rating: "4.8 ★",
      ratingCount: "145K Ratings",
      age: "12+",
      developer: "Kai DevLabs",
      glowClass: "bg-fuchsia-500/40 -translate-x-4",
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
      label: "Wellness Preset",
      category: "Health & Fitness",
      rating: "4.9 ★",
      ratingCount: "82K Ratings",
      age: "4+",
      developer: "Kai DevLabs",
      glowClass: "bg-emerald-500/40 translate-x-4",
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
      label: "Health Preset",
      category: "Health & Fitness",
      rating: "4.9 ★",
      ratingCount: "24.6K Ratings",
      age: "4+",
      developer: "Kai DevLabs",
      glowClass: "bg-orange-500/40 translate-y-2",
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

  const handleSelectPreset = (key: PresetKey) => {
    if (key === activePreset) return;
    setDeckState((prev) => ({
      order: [key, ...prev.order.filter((k) => k !== key)],
      prevOrder: prev.order,
      hasInteracted: true,
    }));
  };

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
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      }
      title="Curated Store Presets"
      description="Explore sample listings across diverse app categories."
      className="col-span-1 md:col-span-2 lg:col-span-6"
      headerRight={
        <SlidingTabs
          value={activePreset}
          onChange={(val) => handleSelectPreset(val as PresetKey)}
          options={[
            { value: "cyberstrike", label: "Games" },
            { value: "pulsefit", label: "Health" },
            { value: "zenmind", label: "Wellness" },
          ]}
          className="w-[204px] sm:w-[216px] shrink-0"
          size="sm"
          ariaLabel="Preset selector tabs"
        />
      }
    >
      {/* Simulated Live Stage with 3D Stacked Preset Deck */}
      <div
        className="relative z-10 w-full h-[400px] sm:h-[420px] flex items-center justify-center select-none overflow-hidden rounded-b-2xl"
        style={{ perspective: "1200px" }}
      >
        {PRESET_KEYS.map((key) => {
          const depth = deckState.order.indexOf(key);
          const prevDepth = deckState.prevOrder.indexOf(key);
          return (
            <PresetDeckCard
              key={key}
              presetKey={key}
              preset={presets[key]}
              depth={depth}
              prevDepth={prevDepth}
              hasInteracted={deckState.hasInteracted}
              onSelect={() => handleSelectPreset(key)}
            />
          );
        })}
      </div>
    </FeatureCard>
  );
}
