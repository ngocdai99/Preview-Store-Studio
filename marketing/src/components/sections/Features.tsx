"use client";

import { useState, useRef } from "react";
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
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

// ============================================================================
// TAB DEFINITIONS & FEATURE METADATA
// ============================================================================
type FeatureTabId = "frames" | "viewports" | "cloner" | "compliance" | "export";

interface TabMeta {
  id: FeatureTabId;
  label: string;
  shortLabel: string;
  badge: string;
  icon: typeof Smartphone;
  accent: {
    color: string;
    bg: string;
    border: string;
    glow: string;
    pillBg: string;
    text: string;
  };
  headline: string;
  description: string;
  highlights: string[];
  footerTags: string[];
}

const TABS: TabMeta[] = [
  {
    id: "frames",
    label: "Device Frames",
    shortLabel: "Frames",
    badge: "Retina Hardware",
    icon: Smartphone,
    accent: {
      color: "emerald",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "via-emerald-500/35",
      pillBg: "bg-emerald-500 text-black",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    headline: "Realistic Modern Device Frames",
    description:
      "Interactive hardware bezels for iPhone, iPad, Android phones, and tablets with authentic dark and light OS preview environments.",
    highlights: [
      "Authentic phone and tablet hardware bezels with Dynamic Island",
      "Adaptive 16:10 landscape viewports for tablet store listings",
      "One-click toggle between native Dark and Light OS modes",
      "Native 4K rendering without layout distortion or pixelation",
    ],
    footerTags: ["iPhone & iPad", "Android & Tablets", "Dynamic Island Bezels", "Light & Dark OS"],
  },
  {
    id: "viewports",
    label: "Dual Viewports",
    shortLabel: "Viewports",
    badge: "Store Comparison",
    icon: Search,
    accent: {
      color: "sky",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
      glow: "via-sky-500/35",
      pillBg: "bg-sky-500 text-black",
      text: "text-sky-600 dark:text-sky-400",
    },
    headline: "Search Result & Dual Comparison",
    description:
      "Preview your listing directly inside the live App Store search feed ribbon or compare App Store and Google Play listings side-by-side.",
    highlights: [
      "Simulates crowded App Store search feed with 3 visible screenshot cards",
      "Side-by-side comparison between iOS and Android store listings",
      "Google Play 1024×500 feature graphic hero banner simulation",
      "Visual 30-character title truncation guidelines inspector",
    ],
    footerTags: ["Search Feed Ribbon", "Product Detail Page", "Dual-Phone Comparison"],
  },
  {
    id: "cloner",
    label: "1-Click Importer",
    shortLabel: "App Cloner",
    badge: "Competitor ASO",
    icon: CloudDownload,
    accent: {
      color: "amber",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      glow: "via-amber-500/35",
      pillBg: "bg-amber-500 text-black",
      text: "text-amber-600 dark:text-amber-400",
    },
    headline: "1-Click Live App Store Importer",
    description:
      "Clone real metadata, star ratings, subtitles, and screenshot galleries from any public App Store listing for instant competitor benchmarking.",
    highlights: [
      "Instant benchmark extraction from top competitor store listings",
      "Fetches full-resolution screenshot galleries and localized metadata",
      "Kickstart your own store drafts without starting from an empty canvas",
      "Stored directly in your browser without requiring external accounts",
    ],
    footerTags: ["Live App Store Import", "Competitor Research", "Instant Draft Kickstart"],
  },
  {
    id: "compliance",
    label: "Compliance QA",
    shortLabel: "Compliance",
    badge: "Automated QA",
    icon: ShieldCheck,
    accent: {
      color: "rose",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      glow: "via-rose-500/35",
      pillBg: "bg-rose-500 text-white",
      text: "text-rose-600 dark:text-rose-400",
    },
    headline: "Smart Size & Compliance Detection",
    description:
      "Scans screenshot dimensions and warns immediately about invalid aspect ratios and illegal iOS app icon transparency (Xcode rejection ITMS-90717).",
    highlights: [
      "Automatic detection of illegal alpha channels in app store icons",
      "One-click auto-flattening to eliminate Xcode ITMS-90717 rejections",
      "Validates exact pixel dimensions for all required store viewports",
      "Pre-submission compliance check before App Store Connect upload",
    ],
    footerTags: ["Official Store Specs", "Aspect Ratio Verification", "Alpha Transparency Alert"],
  },
  {
    id: "export",
    label: "Export Bundle",
    shortLabel: "Export",
    badge: "Ultra HD 4K",
    icon: FolderArchive,
    accent: {
      color: "purple",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      glow: "via-purple-500/35",
      pillBg: "bg-purple-500 text-white",
      text: "text-purple-600 dark:text-purple-400",
    },
    headline: "Multi-Format Export & Dev Markdown",
    description:
      "Export clean 4K Ultra-HD PNG mockups, client-side ZIP bundles, or structured Markdown documentation for seamless team handoff.",
    highlights: [
      "Export high-resolution 3x Ultra-HD PNGs (1179 × 2556 px)",
      "Instant client-side ZIP bundling without third-party server uploads",
      "Structured Markdown metadata for developers and ASO managers",
      "Portable JSON preset export for saving and restoring drafts",
    ],
    footerTags: ["4K Retina PNGs", "Client-Side ZIP", "LISTING_METADATA.md", "JSON Presets"],
  },
];

// ============================================================================
// STAGE 1: DEVICE FRAMES INTERACTIVE SHOWCASE
// ============================================================================
function DeviceFramesInteractive() {
  const [device, setDevice] = useState<"phone" | "tablet">("phone");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="w-full flex flex-col items-center">
      {/* Control Switcher Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 bg-slate-100 dark:bg-[#141514] p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08]">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-white/[0.06] p-1 rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={() => setDevice("phone")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
              device === "phone"
                ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-black shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Phone View</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
              device === "tablet"
                ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-black shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet View</span>
          </button>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-white/[0.06] p-1 rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
              theme === "dark"
                ? "bg-slate-900 text-white dark:bg-white/20 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark OS</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
              theme === "light"
                ? "bg-slate-900 text-white dark:bg-white/20 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light OS</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Stage */}
      <div className="relative w-full min-h-[360px] sm:min-h-[400px] rounded-2xl bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/90 dark:from-[#111211] dark:via-[#141514] dark:to-[#0d0e0d] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[460px] h-[460px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        {device === "phone" ? (
          /* Phone Mockup Frame */
          <div
            className={`relative w-[250px] sm:w-[270px] rounded-[40px] p-3 border-[3.5px] shadow-2xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#1d1f22] border-[#36383e] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                : "bg-[#e2e4e8] border-[#c8cbd2] shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            }`}
          >
            <div
              className={`w-full rounded-[30px] overflow-hidden p-4 transition-colors duration-300 ${
                theme === "dark" ? "bg-[#0b0c0e] text-white" : "bg-white text-slate-900"
              }`}
            >
              {/* Dynamic Island */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto mb-3.5 flex items-center justify-end px-2 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
              </div>

              {/* App Store Header */}
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black text-[16px] shadow-md shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-bold truncate">Store Preview Studio</div>
                  <div className="text-[10px] text-slate-400">Developer Tools</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full font-extrabold text-[10.5px] tracking-wide ${
                    theme === "dark"
                      ? "bg-white text-black"
                      : "bg-emerald-500 text-black shadow-sm"
                  }`}
                >
                  GET
                </div>
              </div>

              {/* Rating ribbon */}
              <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center mb-3.5">
                <div>
                  <div className="text-[10.5px] font-bold text-amber-400">4.9 ★</div>
                  <div className="text-[8px] text-slate-400">18K RATINGS</div>
                </div>
                <div className="border-x border-black/10 dark:border-white/10">
                  <div className="text-[10.5px] font-bold text-slate-800 dark:text-white">#1</div>
                  <div className="text-[8px] text-slate-400">DEV TOOLS</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-bold text-slate-800 dark:text-white">4+</div>
                  <div className="text-[8px] text-slate-400">AGE</div>
                </div>
              </div>

              {/* Screenshot Carousel */}
              <div className="flex gap-2 overflow-hidden">
                <div className="w-[74px] h-[124px] rounded-lg bg-gradient-to-br from-indigo-500/20 via-sky-500/20 to-emerald-500/20 border border-black/10 dark:border-white/10 p-1.5 flex flex-col justify-between shrink-0">
                  <span className="text-[8px] font-bold text-sky-400">Adaptive Bezels</span>
                  <div className="w-full h-9 rounded bg-black/10 dark:bg-white/10" />
                </div>
                <div className="w-[74px] h-[124px] rounded-lg bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-black/10 dark:border-white/10 p-1.5 flex flex-col justify-between shrink-0">
                  <span className="text-[8px] font-bold text-purple-400">Dual Sync</span>
                  <div className="w-full h-9 rounded bg-black/10 dark:bg-white/10" />
                </div>
                <div className="w-[74px] h-[124px] rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-black/10 dark:border-white/10 p-1.5 flex flex-col justify-between shrink-0">
                  <span className="text-[8px] font-bold text-emerald-400">Offline Studio</span>
                  <div className="w-full h-9 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tablet Mockup Frame */
          <div
            className={`relative w-[360px] sm:w-[460px] rounded-[30px] p-3.5 border-[3.5px] shadow-2xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#1d1f22] border-[#36383e] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                : "bg-[#e2e4e8] border-[#c8cbd2] shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            }`}
          >
            <div
              className={`w-full rounded-[20px] p-5 transition-colors duration-300 ${
                theme === "dark" ? "bg-[#0b0c0e] text-white" : "bg-white text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black text-[14px]">
                    S
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold">Store Preview Studio for Tablet</div>
                    <div className="text-[10.5px] text-slate-400">7&quot; &amp; 10&quot; Tablets · 16:10 Ratio</div>
                  </div>
                </div>
                <div
                  className={`px-3.5 py-1 rounded-full font-extrabold text-[11px] ${
                    theme === "dark" ? "bg-white text-black" : "bg-emerald-500 text-black shadow-sm"
                  }`}
                >
                  GET
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="h-32 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-black/10 dark:border-white/10 p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-sky-400">16:10 Landscape Ratio</span>
                  <div className="w-full h-14 rounded bg-black/10 dark:bg-white/10" />
                </div>
                <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-black/10 dark:border-white/10 p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-emerald-400">Prioritize-First Destination</span>
                  <div className="w-full h-14 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STAGE 2: DUAL VIEWPORTS INTERACTIVE SHOWCASE
// ============================================================================
function DualViewportsInteractive() {
  const [store, setStore] = useState<"compare" | "apple" | "google">("compare");

  return (
    <div className="w-full flex flex-col items-center">
      {/* Switcher Bar */}
      <div className="grid grid-cols-3 gap-1.5 mb-6 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.08] w-full max-w-md">
        <button
          type="button"
          onClick={() => setStore("compare")}
          className={`py-2 text-[12.5px] font-bold rounded-xl transition-all ${
            store === "compare"
              ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-black shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Dual View
        </button>
        <button
          type="button"
          onClick={() => setStore("apple")}
          className={`py-2 text-[12.5px] font-bold rounded-xl transition-all ${
            store === "apple"
              ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-black shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          App Store Feed
        </button>
        <button
          type="button"
          onClick={() => setStore("google")}
          className={`py-2 text-[12.5px] font-bold rounded-xl transition-all ${
            store === "google"
              ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-black shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Google Play
        </button>
      </div>

      {/* Visual Stage */}
      <div className="relative w-full min-h-[360px] sm:min-h-[400px] rounded-2xl bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/90 dark:from-[#111211] dark:via-[#141514] dark:to-[#0d0e0d] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[460px] h-[460px] rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

        {store === "compare" ? (
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Apple Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1c1d1f] border border-sky-500/30 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-[12px]">
                    A
                  </div>
                  <div>
                    <span className="font-bold text-[13px] block">App Store</span>
                    <span className="text-[10px] text-slate-400">iOS Platform</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-mono font-semibold">
                  30 Char Limit
                </span>
              </div>
              <div className="h-28 rounded-xl bg-slate-100 dark:bg-white/[0.04] p-3 border border-dashed border-sky-500/20 flex flex-col justify-between mb-3">
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Store Preview Studio: ASO
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1/3 h-12 rounded bg-sky-500/20" />
                  <div className="w-1/3 h-12 rounded bg-sky-500/20" />
                  <div className="w-1/3 h-12 rounded bg-sky-500/20" />
                </div>
              </div>
              <div className="w-full py-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-center font-bold text-[11px]">
                GET · In-App Purchases
              </div>
            </div>

            {/* Google Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1c1d1f] border border-emerald-500/30 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold text-[12px]">
                    G
                  </div>
                  <div>
                    <span className="font-bold text-[13px] block">Google Play</span>
                    <span className="text-[10px] text-slate-400">Android Platform</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold">
                  1024×500 Hero
                </span>
              </div>
              <div className="h-28 rounded-xl bg-slate-100 dark:bg-white/[0.04] p-3 border border-dashed border-emerald-500/20 flex flex-col justify-between mb-3">
                <div className="h-10 rounded-lg bg-gradient-to-r from-emerald-600/30 to-teal-500/30 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
                  Feature Graphic Active
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>100K+ Installs</span>
                  <span className="text-emerald-400 font-bold">4.9 ★</span>
                </div>
              </div>
              <div className="w-full py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center font-bold text-[11px]">
                Install
              </div>
            </div>
          </div>
        ) : store === "apple" ? (
          <div className="w-full max-w-lg p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1c1d1f] border border-sky-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                  App Store Search Feed Ribbon
                </span>
              </div>
              <span className="text-[10.5px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono font-bold">
                3 Cards Visible in Feed
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mb-4">
              Real-time feed simulation showing how your first 3 portrait screenshots grab user attention before they tap.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-44 rounded-xl bg-gradient-to-b from-sky-500/20 to-indigo-500/20 border border-black/10 dark:border-white/10 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-sky-400">01. Value Prop</span>
                <div className="w-full h-16 rounded bg-black/10 dark:bg-white/10" />
              </div>
              <div className="h-44 rounded-xl bg-gradient-to-b from-purple-500/20 to-pink-500/20 border border-black/10 dark:border-white/10 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-purple-400">02. Core Feature</span>
                <div className="w-full h-16 rounded bg-black/10 dark:bg-white/10" />
              </div>
              <div className="h-44 rounded-xl bg-gradient-to-b from-emerald-500/20 to-teal-500/20 border border-black/10 dark:border-white/10 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-emerald-400">03. Social Proof</span>
                <div className="w-full h-16 rounded bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1c1d1f] border border-emerald-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                  Google Play Detail Stage
                </span>
              </div>
              <span className="text-[10.5px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                Android Guidelines
              </span>
            </div>
            <div className="w-full h-32 rounded-xl bg-gradient-to-r from-emerald-600/30 via-teal-500/20 to-sky-500/20 border border-emerald-500/30 mb-4 flex flex-col items-center justify-center p-4">
              <div className="text-[13px] font-bold text-emerald-400 font-mono mb-1">
                Feature Graphic 1024×500 px
              </div>
              <div className="text-[11px] text-slate-400 text-center">
                Required for Google Play store merchandising and promotional slots
              </div>
            </div>
            <div className="flex items-center justify-between text-[11.5px] text-slate-500 p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04]">
              <span>4.9 ★ (120K Reviews)</span>
              <span className="font-bold text-emerald-400">Rated for 3+ / Everyone</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tools Category</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STAGE 3: APP CLONER INTERACTIVE SHOWCASE
// ============================================================================
function AppClonerInteractive() {
  const [activeApp, setActiveApp] = useState<"duolingo" | "spotify" | "zenmind">("duolingo");
  const [loading, setLoading] = useState(false);

  const apps = {
    duolingo: {
      name: "Duolingo — Learn Languages",
      category: "Education",
      rating: "4.8 ★",
      reviews: "2.4M reviews",
      color: "from-emerald-400 to-green-600",
      tag: "5 UHD Screenshots · ES, FR, DE",
      desc: "Instant breakdown of Duolingo's high-converting subtitle typography & dual-store screenshots.",
    },
    spotify: {
      name: "Spotify: Music and Podcasts",
      category: "Music & Audio",
      rating: "4.9 ★",
      reviews: "18.2M reviews",
      color: "from-green-500 to-emerald-700",
      tag: "1024×500 Feature Graphic + 6 Shots",
      desc: "Live import of high-contrast playlist feature cards and tablet horizontal layouts.",
    },
    zenmind: {
      name: "ZenMind — Meditation & Sleep",
      category: "Health & Fitness",
      rating: "4.9 ★",
      reviews: "82K reviews",
      color: "from-purple-500 to-indigo-600",
      tag: "Sleep Soundscapes · Widescreen Shots",
      desc: "Curated mindfulness mockup with dark mode sleep palette and minimal typography.",
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
    <div className="w-full flex flex-col items-center">
      {/* Sample Selector Bar */}
      <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.08]">
        {(["duolingo", "spotify", "zenmind"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelectApp(key)}
            className={`px-4 py-2 rounded-xl text-[12.5px] font-bold capitalize transition-all ${
              activeApp === key
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Visual Stage */}
      <div className="relative w-full min-h-[360px] sm:min-h-[400px] rounded-2xl bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/90 dark:from-[#111211] dark:via-[#141514] dark:to-[#0d0e0d] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[460px] h-[460px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#1c1d1f] border border-amber-500/30 shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-amber-500 font-mono">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-[13px] font-semibold">Simulating App Store API fetch...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-4 border-b border-black/5 dark:border-white/5">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center text-white font-black text-[22px] shadow-lg shrink-0`}
                >
                  {current.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-slate-900 dark:text-white truncate">
                    {current.name}
                  </div>
                  <div className="text-[12px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{current.category}</span>
                    <span>•</span>
                    <span className="text-amber-500 font-bold">{current.rating}</span>
                    <span>•</span>
                    <span>{current.reviews}</span>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {current.desc}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-[11.5px] font-mono text-slate-600 dark:text-slate-400">
                <span>{current.tag}</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5 font-sans">
                  <Check className="w-4 h-4" /> Ready to Edit
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg bg-gradient-to-b from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-1.5 flex flex-col justify-end"
                  >
                    <div className="w-full h-2 rounded bg-amber-500/30" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STAGE 4: COMPLIANCE QA INTERACTIVE SHOWCASE
// ============================================================================
function ComplianceInteractive() {
  const [flattened, setFlattened] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Status Bar */}
      <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.08]">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[12.5px] font-bold font-mono transition-all ${
            flattened
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
              : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${flattened ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
          {flattened ? "STATUS: STORE COMPLIANT" : "STATUS: REJECTION RISK (ITMS-90717)"}
        </div>
      </div>

      {/* Visual Stage */}
      <div className="relative w-full min-h-[360px] sm:min-h-[400px] rounded-2xl bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/90 dark:from-[#111211] dark:via-[#141514] dark:to-[#0d0e0d] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[460px] h-[460px] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#1c1d1f] border border-rose-500/30 shadow-xl space-y-4">
          <div className="flex items-center gap-4">
            {/* Checkerboard or Flattened Icon */}
            <div
              className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center font-black text-2xl transition-all duration-300 shrink-0 ${
                flattened
                  ? "bg-[#0f1115] border-emerald-500 text-emerald-400 shadow-lg"
                  : "bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:6px_6px] border-amber-500 text-amber-500"
              }`}
            >
              ★
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                {flattened ? (
                  <span className="text-emerald-500 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Alpha Channels Flattened
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Alpha Channel Detected &lt;250
                  </span>
                )}
              </div>
              <div className="text-[12px] text-slate-500 mt-1 leading-snug">
                {flattened
                  ? "Clean 24-bit RGB without transparency. Ready for Xcode & App Store Connect upload."
                  : "Apple App Store Connect rejects icons with transparent alpha channels (ITMS-90717)."}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] space-y-2 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Asset Dimensions:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">1024 × 1024 px (Pass)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Aspect Ratio Check:</span>
              <span className="font-mono font-bold text-emerald-500">1:1 Square (Exact)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Color Profile:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">sRGB / Display P3</span>
            </div>
          </div>

          {/* Interactive Flatten Button */}
          <button
            type="button"
            onClick={() => setFlattened(!flattened)}
            className={`w-full py-3 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
              flattened
                ? "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300"
                : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/25"
            }`}
          >
            {flattened ? (
              <>
                <RefreshCw className="w-4 h-4" /> Re-trigger Alpha Warning Test
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> 1-Click Auto-Flatten Alpha Channel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STAGE 5: EXPORT BUNDLE INTERACTIVE SHOWCASE
// ============================================================================
function ExportInteractive() {
  const [tab, setTab] = useState<"png" | "zip" | "md">("png");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Export Format Switcher */}
      <div className="grid grid-cols-3 gap-1.5 mb-6 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.08] w-full max-w-md">
        <button
          type="button"
          onClick={() => setTab("png")}
          className={`py-2 text-[12.5px] font-bold rounded-xl transition-all ${
            tab === "png"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          3x UHD PNG
        </button>
        <button
          type="button"
          onClick={() => setTab("zip")}
          className={`py-2 text-[12.5px] font-bold rounded-xl transition-all ${
            tab === "zip"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Client ZIP
        </button>
        <button
          type="button"
          onClick={() => setTab("md")}
          className={`py-2 text-[12.5px] font-bold rounded-xl transition-all ${
            tab === "md"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Markdown
        </button>
      </div>

      {/* Visual Stage */}
      <div className="relative w-full min-h-[360px] sm:min-h-[400px] rounded-2xl bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/90 dark:from-[#111211] dark:via-[#141514] dark:to-[#0d0e0d] border border-slate-200/80 dark:border-white/[0.06] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[460px] h-[460px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#1c1d1f] border border-purple-500/30 shadow-xl">
          {tab === "png" && (
            <div className="space-y-3">
              <div className="text-[13px] font-bold text-slate-900 dark:text-white mb-2">
                Ultra-HD 4K Screenshot Deliverables
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px]">
                    iPhone 6.7-inch Super Retina Mockups
                  </div>
                  <div className="text-[11px] text-slate-400">Portrait 3x native resolution</div>
                </div>
                <span className="text-[11.5px] text-purple-400 font-bold font-mono">1179 × 2556 px</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px]">
                    iPad 13-inch Landscape Canvas
                  </div>
                  <div className="text-[11px] text-slate-400">High-DPI Tablet Display</div>
                </div>
                <span className="text-[11.5px] text-purple-400 font-bold font-mono">2752 × 2064 px</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-black/5 dark:border-white/5">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px]">
                    Frameless Screen-Only Mode
                  </div>
                  <div className="text-[11px] text-slate-400">Direct store upload asset</div>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">Included</span>
              </div>
            </div>
          )}

          {tab === "zip" && (
            <div className="space-y-3 font-mono text-[12px] text-slate-600 dark:text-slate-300">
              <div className="font-bold text-purple-400 text-[13px] mb-2 font-sans">
                📦 Stored Locally · Instant ZIP Bundling
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-black/5 dark:border-white/5 space-y-1.5">
                <div className="font-bold text-purple-400">store-deliverables.zip</div>
                <div className="pl-3">├── 📁 ios-screenshots/ (5 files)</div>
                <div className="pl-3">├── 📁 android-screenshots/ (5 files)</div>
                <div className="pl-3">├── 📁 tablet-screenshots/ (4 files)</div>
                <div className="pl-3">├── 📄 LISTING_METADATA.md</div>
                <div className="pl-3">└── 📄 studio-preset.json</div>
              </div>
              <p className="text-[11.5px] text-slate-500 font-sans">
                Generated 100% in your browser using JSZip. Zero wait time, zero server latency.
              </p>
            </div>
          )}

          {tab === "md" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/5 space-y-1">
                <div className="text-purple-400 font-bold">## App Store Submission Metadata</div>
                <div className="text-emerald-500">- Name: Store Preview Studio (20/30)</div>
                <div className="text-sky-400">- Subtitle: Curated Store Mockups (21/30)</div>
                <div className="text-slate-400">- Primary Category: Developer Tools</div>
                <div className="text-slate-400">- Keywords: aso, screenshot, mockup, store preview</div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-purple-500/25 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied Markdown to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Markdown Handoff Spec
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
// MAIN FEATURES SECTION COMPONENT WITH SMOOTH TABVIEW
// ============================================================================
export function Features() {
  const [activeTab, setActiveTab] = useState<FeatureTabId>("frames");
  const tabListRef = useRef<HTMLDivElement>(null);

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const currentTab = TABS[activeIndex];

  const handleSelectTab = (id: FeatureTabId) => {
    setActiveTab(id);
  };

  const handleNextTab = () => {
    const nextIndex = (activeIndex + 1) % TABS.length;
    setActiveTab(TABS[nextIndex].id);
  };

  const handlePrevTab = () => {
    const prevIndex = (activeIndex - 1 + TABS.length) % TABS.length;
    setActiveTab(TABS[prevIndex].id);
  };

  // Keyboard navigation for tab bar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNextTab();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrevTab();
    }
  };

  return (
    <section
      id="features"
      className="pt-16 pb-24 sm:pt-20 sm:pb-32 border-t border-border bg-slate-50/50 dark:bg-[#131413] transition-colors relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[12px] font-semibold tracking-wide uppercase mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Studio Capabilities
          </div>

          <h2 className="section-title text-[28px] sm:text-[36px] lg:text-[42px] font-extrabold tracking-[-0.025em] text-[#0f172a] dark:text-white leading-[1.15] text-balance">
            {siteConfig.features.headline}
          </h2>

          <p className="mt-3.5 text-[15px] sm:text-[16.5px] text-[#475569] dark:text-slate-400 max-w-[680px] mx-auto leading-relaxed text-balance">
            Select any tab below to test the live interactive preview tools and automation workflows built directly into Store Preview Studio.
          </p>
        </div>

        {/* ================================================================= */}
        {/* TABVIEW BUTTONS BAR (Responsive, smooth navigation) */}
        {/* ================================================================= */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Features Tabview"
            onKeyDown={handleKeyDown}
            className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/80 dark:bg-[#181918] border border-slate-200/90 dark:border-white/[0.08] shadow-sm backdrop-blur-sm overflow-x-auto no-scrollbar scroll-smooth"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[13px] sm:text-[13.5px] font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-black shadow-md shadow-slate-900/10 dark:shadow-emerald-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />
                  <span>{tab.label}</span>

                  {/* Accent Dot for active state */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-black animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* ACTIVE TAB STAGE (Two-column layout: Info + Live Interactive) */}
        {/* ================================================================= */}
        <div
          id={`panel-${currentTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentTab.id}`}
          className="relative rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 bg-white dark:bg-[#1A1B1A] border border-slate-200/90 dark:border-white/[0.08] shadow-lg dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300"
        >
          {/* Hairline Color Accent Reflection */}
          <div
            className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${currentTab.accent.glow} to-transparent pointer-events-none`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Feature Details & Checklist */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Badge & Icon Pill */}
                <div className="flex items-center gap-2.5 mb-4">
                  <span
                    className={`p-2 rounded-xl ${currentTab.accent.bg} ${currentTab.accent.text} border ${currentTab.accent.border}`}
                  >
                    <currentTab.icon className="w-5 h-5 stroke-[2.2]" />
                  </span>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 font-mono">
                    {currentTab.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-[22px] sm:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {currentTab.headline}
                </h3>
                <p className="mt-3 text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {currentTab.description}
                </p>

                {/* Key Capability Highlights */}
                <div className="mt-6 space-y-3">
                  {currentTab.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="mt-0.5 p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </span>
                      <span className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-snug">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Feature Navigation Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] font-mono text-slate-500">
                  <span className="font-bold text-slate-900 dark:text-white">
                    0{activeIndex + 1}
                  </span>
                  <span>/</span>
                  <span>0{TABS.length}</span>
                  <span className="hidden sm:inline text-slate-400">• {currentTab.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevTab}
                    aria-label="Previous feature tab"
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTab}
                    aria-label="Next feature tab"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span>Next Feature</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Playground */}
            <div className="lg:col-span-7 flex flex-col items-center">
              {activeTab === "frames" && <DeviceFramesInteractive />}
              {activeTab === "viewports" && <DualViewportsInteractive />}
              {activeTab === "cloner" && <AppClonerInteractive />}
              {activeTab === "compliance" && <ComplianceInteractive />}
              {activeTab === "export" && <ExportInteractive />}
            </div>
          </div>

          {/* Feature Tags Pill Bar */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {currentTab.footerTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-medium px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-white/[0.06]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-2 sm:mt-0"
            >
              <span>Get full studio access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
