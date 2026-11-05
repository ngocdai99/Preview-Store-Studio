"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  Smartphone,
  Tablet,
  Sun,
  Moon,
  Search,
  CloudDownload,
  ShieldCheck,
  FolderArchive,
  Check,
  Copy,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Layers,
  ArrowRight,
  FileCode,
  Download,
} from "lucide-react";

// ============================================================================
// CARD 1: REALISTIC MODERN DEVICE FRAMES (Interactive Device & Theme Stage)
// ============================================================================
function DeviceFramesCard() {
  const [device, setDevice] = useState<"phone" | "tablet">("phone");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-2 lg:col-span-2">
      {/* Hairline reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent pointer-events-none" />

      {/* Top Header & Interactive Switchers */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Live Interactive Hardware
            </span>
          </div>
          <h3 className="text-[20px] sm:text-[22px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Realistic Modern Device Frames
          </h3>
          <p className="mt-1 text-[13.5px] sm:text-[14px] text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Toggle hardware bezels and OS themes directly in this live preview to see authentic store styling.
          </p>
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-[#141514] p-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] self-start lg:self-center">
          {/* Device Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-white/[0.06] p-1 rounded-lg border border-slate-200/70 dark:border-white/[0.06]">
            <button
              onClick={() => setDevice("phone")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                device === "phone"
                  ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-black shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                device === "tablet"
                  ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-black shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-white/[0.06] p-1 rounded-lg border border-slate-200/70 dark:border-white/[0.06]">
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                theme === "dark"
                  ? "bg-slate-900 text-white dark:bg-white/20 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dark</span>
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                theme === "light"
                  ? "bg-slate-900 text-white dark:bg-white/20 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Light</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Live Stage (Visual Interactive Mockup) */}
      <div className="relative z-10 w-full min-h-[290px] sm:min-h-[320px] rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 dark:from-[#111211] dark:to-[#0c0d0c] border border-slate-200/80 dark:border-white/[0.06] p-5 sm:p-6 flex items-center justify-center overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute w-[360px] h-[360px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

        {device === "phone" ? (
          /* Phone Mockup Frame */
          <div
            className={`relative w-[240px] sm:w-[260px] rounded-[38px] p-2.5 border-[4px] shadow-2xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#1f2023] border-[#383a40] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                : "bg-[#e2e4e8] border-[#c8cbd2] shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            }`}
          >
            {/* Screen Inner */}
            <div
              className={`w-full rounded-[28px] overflow-hidden p-3.5 transition-colors duration-300 ${
                theme === "dark" ? "bg-[#0b0c0e] text-white" : "bg-white text-slate-900"
              }`}
            >
              {/* Dynamic Island */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-end px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Mini App Header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md font-extrabold text-[15px]">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold truncate">Store Preview Studio</div>
                  <div className="text-[10px] opacity-60">Developer Tools</div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] tracking-wide">
                  GET
                </div>
              </div>

              {/* Rating ribbon */}
              <div className="flex items-center justify-between text-[10px] opacity-75 mb-3 px-1 py-1 rounded-lg bg-black/5 dark:bg-white/5 font-medium">
                <span>★ 4.9 · 18K Ratings</span>
                <span>Age 4+</span>
              </div>

              {/* Mini Screenshot Carousel */}
              <div className="flex gap-2 overflow-hidden">
                <div className="w-20 h-32 rounded-lg bg-gradient-to-br from-indigo-500/20 via-sky-500/20 to-emerald-500/20 border border-black/10 dark:border-white/10 p-1.5 flex flex-col justify-between shrink-0">
                  <span className="text-[8px] font-bold opacity-70">3x UHD</span>
                  <div className="w-full h-12 rounded bg-black/10 dark:bg-white/10" />
                </div>
                <div className="w-20 h-32 rounded-lg bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-black/10 dark:border-white/10 p-1.5 flex flex-col justify-between shrink-0">
                  <span className="text-[8px] font-bold opacity-70">Dual Store</span>
                  <div className="w-full h-12 rounded bg-black/10 dark:bg-white/10" />
                </div>
                <div className="w-20 h-32 rounded-lg bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-black/10 dark:border-white/10 p-1.5 flex flex-col justify-between shrink-0">
                  <span className="text-[8px] font-bold opacity-70">Offline</span>
                  <div className="w-full h-12 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tablet Mockup Frame */
          <div
            className={`relative w-[340px] sm:w-[420px] rounded-[28px] p-3 border-[4px] shadow-2xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#1f2023] border-[#383a40] shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                : "bg-[#e2e4e8] border-[#c8cbd2] shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            }`}
          >
            {/* Screen Inner */}
            <div
              className={`w-full rounded-[18px] p-4 transition-colors duration-300 ${
                theme === "dark" ? "bg-[#0b0c0e] text-white" : "bg-white text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-extrabold text-[13px]">
                    S
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold">Store Preview Studio for Tablet</div>
                    <div className="text-[10px] opacity-60">10-inch &amp; 12.9-inch Adaptive Preview</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-[10.5px]">
                  GET
                </div>
              </div>

              {/* Tablet 2-Column Gallery Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div className="h-28 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-black/10 dark:border-white/10 p-2.5 flex flex-col justify-between">
                  <span className="text-[9px] font-bold opacity-75">16:10 Landscape Ratio</span>
                  <div className="w-full h-12 rounded bg-black/10 dark:bg-white/10" />
                </div>
                <div className="h-28 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-black/10 dark:border-white/10 p-2.5 flex flex-col justify-between">
                  <span className="text-[9px] font-bold opacity-75">Prioritize-first Dest</span>
                  <div className="w-full h-12 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Badges Footer */}
      <div className="relative z-10 mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap gap-2 items-center">
        {["iPhone & iPad", "Android & Tablets", "Dynamic Island Bezels", "Light & Dark OS"].map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.06]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CARD 2: SEARCH RESULT & DUAL-PHONE VIEWPORTS (Interactive Store Comparison)
// ============================================================================
function DualViewportsCard() {
  const [store, setStore] = useState<"compare" | "apple" | "google">("compare");

  return (
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/25 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Search className="w-5 h-5 stroke-[2.2]" />
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400">
            Dual Viewports
          </span>
        </div>

        <h3 className="text-[19px] sm:text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">
          Search Result &amp; Dual Comparison
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Switch between App Store search ribbon feed and side-by-side store comparison.
        </p>

        {/* View Mode Switcher */}
        <div className="grid grid-cols-3 gap-1 my-4 p-1 rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06]">
          <button
            onClick={() => setStore("compare")}
            className={`py-1.5 text-[11.5px] font-bold rounded-lg transition-all ${
              store === "compare"
                ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-black shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Dual View
          </button>
          <button
            onClick={() => setStore("apple")}
            className={`py-1.5 text-[11.5px] font-bold rounded-lg transition-all ${
              store === "apple"
                ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-black shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            App Store
          </button>
          <button
            onClick={() => setStore("google")}
            className={`py-1.5 text-[11.5px] font-bold rounded-lg transition-all ${
              store === "google"
                ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-black shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Google Play
          </button>
        </div>

        {/* Visual Mini Display */}
        <div className="rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06] p-3.5 min-h-[175px] flex items-center justify-center">
          {store === "compare" ? (
            <div className="w-full grid grid-cols-2 gap-2.5">
              {/* Apple Mini Card */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1e2022] border border-sky-500/30 text-[11px] shadow-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-sky-500 text-white flex items-center justify-center font-bold text-[9px]">
                    A
                  </div>
                  <span className="font-bold text-[11px] truncate">App Store</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-2">30 Char Title Cap</div>
                <div className="w-full py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-center font-bold text-[9.5px]">
                  GET
                </div>
              </div>

              {/* Google Mini Card */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1e2022] border border-emerald-500/30 text-[11px] shadow-sm">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500 text-black flex items-center justify-center font-bold text-[9px]">
                    G
                  </div>
                  <span className="font-bold text-[11px] truncate">Google Play</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-2">1024×500 Hero Banner</div>
                <div className="w-full py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center font-bold text-[9.5px]">
                  Install
                </div>
              </div>
            </div>
          ) : store === "apple" ? (
            <div className="w-full p-3 rounded-lg bg-white dark:bg-[#1e2022] border border-sky-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-sky-500">Search Feed Ribbon</span>
                <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400">3 Items</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-1/3 h-16 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-1/3 h-16 rounded bg-slate-200 dark:bg-white/10" />
                <div className="w-1/3 h-16 rounded bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
          ) : (
            <div className="w-full p-3 rounded-lg bg-white dark:bg-[#1e2022] border border-emerald-500/30">
              <div className="w-full h-12 rounded-lg bg-gradient-to-r from-emerald-600/30 to-teal-500/30 border border-emerald-500/20 mb-2 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                Feature Graphic 1024×500
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>100K+ Downloads</span>
                <span className="font-bold text-emerald-400">Everyone (E)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap gap-1.5">
        {["Search Feed Ribbon", "Product Detail Page", "Dual-Phone Comparison"].map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CARD 3: 1-CLICK LIVE APP CLONER (Interactive Benchmark Simulator)
// ============================================================================
function AppClonerCard() {
  const [activeApp, setActiveApp] = useState<"duolingo" | "spotify" | "zenmind">("duolingo");
  const [loading, setLoading] = useState(false);

  const apps = {
    duolingo: {
      name: "Duolingo",
      category: "Education",
      rating: "4.8 ★",
      reviews: "2.4M reviews",
      color: "from-emerald-400 to-green-600",
      tag: "5 Screenshots · ES, FR, DE",
    },
    spotify: {
      name: "Spotify",
      category: "Music & Audio",
      rating: "4.9 ★",
      reviews: "18.2M reviews",
      color: "from-green-500 to-emerald-700",
      tag: "Feature Graphic + 6 Shots",
    },
    zenmind: {
      name: "ZenMind",
      category: "Health & Fitness",
      rating: "4.9 ★",
      reviews: "82K reviews",
      color: "from-purple-500 to-indigo-600",
      tag: "Sleep Audio + Widescreen",
    },
  };

  const handleSelectApp = (key: "duolingo" | "spotify" | "zenmind") => {
    if (key === activeApp) return;
    setLoading(true);
    setTimeout(() => {
      setActiveApp(key);
      setLoading(false);
    }, 280);
  };

  const current = apps[activeApp];

  return (
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <CloudDownload className="w-5 h-5 stroke-[2.2]" />
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Competitor ASO
          </span>
        </div>

        <h3 className="text-[19px] sm:text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">
          1-Click Live App Cloner
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Clone real metadata, ratings, and screenshots from any public store listing for instant benchmarking.
        </p>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-1.5 my-3.5">
          {(["duolingo", "spotify", "zenmind"] as const).map((key) => (
            <button
              key={key}
              onClick={() => handleSelectApp(key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                activeApp === key
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40"
                  : "bg-slate-100 dark:bg-white/[0.05] text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Simulated Clone Visual Result */}
        <div className="rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06] p-3.5 min-h-[140px] flex flex-col justify-center">
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-[12px] text-amber-500 py-6">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Fetching metadata &amp; assets...</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${current.color} flex items-center justify-center text-white font-black text-[15px] shadow-sm shrink-0`}
                >
                  {current.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                    {current.name}
                  </div>
                  <div className="text-[11px] text-slate-500">{current.category}</div>
                </div>
                <span className="text-[11px] font-bold text-amber-500">{current.rating}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-200 dark:border-white/10 text-slate-500">
                <span>{current.tag}</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Cloned
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap gap-1.5">
        {["Live App Store Import", "Competitor Research", "Instant Draft Kickstart"].map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CARD 4: SMART SIZE & COMPLIANCE DETECTION (Interactive 1-Click Flatten)
// ============================================================================
function ComplianceCard() {
  const [flattened, setFlattened] = useState(false);

  return (
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/25 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </span>
          <span
            className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border transition-all ${
              flattened
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                : "border-amber-500/30 bg-amber-500/10 text-amber-500"
            }`}
          >
            {flattened ? "STORE COMPLIANT" : "REJECTION RISK"}
          </span>
        </div>

        <h3 className="text-[19px] sm:text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart Size &amp; Compliance QA
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Automatically scans for invalid aspect ratios and illegal iOS app icon transparency (ITMS-90717).
        </p>

        {/* Interactive Scanner Box */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            {/* Simulated Icon (Transparent checkerboard vs Flattened) */}
            <div
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-xl transition-all duration-300 ${
                flattened
                  ? "bg-[#0f1115] border-emerald-500 text-emerald-400 shadow-md"
                  : "bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:6px_6px] border-amber-500/80 text-amber-500"
              }`}
            >
              ★
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
                {flattened ? "Ready for Xcode & Store Connect" : "Xcode rejection warning: ITMS-90717"}
              </div>
            </div>
          </div>

          {/* 1-Click Flatten Interactive Button */}
          <button
            onClick={() => setFlattened(!flattened)}
            className={`w-full py-2 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              flattened
                ? "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300"
                : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-md"
            }`}
          >
            {flattened ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" /> Re-test Alpha Warning
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Auto-Flatten
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap gap-1.5">
        {["Official Store Specs", "Aspect Ratio Verification", "Alpha Transparency Alert"].map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CARD 5: MULTI-FORMAT EXPORT & DEV MARKDOWN (Interactive Export Selector)
// ============================================================================
function ExportCard() {
  const [tab, setTab] = useState<"png" | "zip" | "md">("png");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group relative rounded-[28px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <FolderArchive className="w-5 h-5 stroke-[2.2]" />
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-purple-500/25 bg-purple-500/10 text-purple-600 dark:text-purple-400">
            Ultra HD 4K
          </span>
        </div>

        <h3 className="text-[19px] sm:text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight">
          Multi-Format Export &amp; Dev Markdown
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Export 3x Ultra-HD PNG mockups, client-side ZIP bundles, or developer markdown handoffs.
        </p>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 my-3.5 p-1 rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06]">
          <button
            onClick={() => setTab("png")}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
              tab === "png"
                ? "bg-slate-900 text-white dark:bg-purple-500 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            3x PNG
          </button>
          <button
            onClick={() => setTab("zip")}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
              tab === "zip"
                ? "bg-slate-900 text-white dark:bg-purple-500 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            ZIP Bundle
          </button>
          <button
            onClick={() => setTab("md")}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
              tab === "md"
                ? "bg-slate-900 text-white dark:bg-purple-500 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Markdown
          </button>
        </div>

        {/* Interactive Visual Canvas */}
        <div className="rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06] p-3.5 min-h-[140px] flex flex-col justify-center">
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

      <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap gap-1.5">
        {["4K Retina PNGs", "Client-Side ZIP", "LISTING_METADATA.md", "JSON Presets"].map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400"
          >
            {t}
          </span>
        ))}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[12px] font-bold tracking-wide uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Studio Capabilities
          </div>

          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {features.headline}
          </h2>

          <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-[#475569] dark:text-slate-400 max-w-[680px] mx-auto leading-relaxed text-balance">
            Test the live interactive components below to preview the exact workflows and automation built into Store Preview Studio.
          </p>
        </div>

        {/* 5-Card Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          <DeviceFramesCard />
          <DualViewportsCard />
          <AppClonerCard />
          <ComplianceCard />
          <ExportCard />
        </div>
      </div>
    </section>
  );
}
