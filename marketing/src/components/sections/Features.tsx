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
      <div className="relative z-10 w-full h-[400px] sm:h-[420px] flex items-center justify-center select-none">
        {/* Phone Mockup Frame (Realistic Hardware Bezel & Authentic App Store Product Page) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
            device === "phone"
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-[0.88] translate-y-3 pointer-events-none"
          }`}
        >
          <div className="relative w-[212px] sm:w-[226px] h-[392px] sm:h-[412px] rounded-[44px] p-[6px] border border-[#363840] bg-[#1e1f23] shadow-[0_16px_36px_-6px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all duration-300">
            {/* Outer Physical Hardware Buttons */}
            {/* Left: Action Button */}
            <div className="absolute -left-[4px] top-[68px] w-[3px] h-[16px] rounded-l-sm bg-[#363840]" />
            {/* Left: Volume Up */}
            <div className="absolute -left-[4px] top-[94px] w-[3px] h-[28px] rounded-l-sm bg-[#363840]" />
            {/* Left: Volume Down */}
            <div className="absolute -left-[4px] top-[130px] w-[3px] h-[28px] rounded-l-sm bg-[#363840]" />
            {/* Right: Side / Power Button */}
            <div className="absolute -right-[4px] top-[102px] w-[3px] h-[40px] rounded-r-sm bg-[#363840]" />

            {/* Screen Inner (Portrait 19.5:9 Authentic iOS App Store) */}
            <div className="w-full h-full rounded-[38px] overflow-hidden p-3 bg-black text-white flex flex-col justify-between">
              {/* Dynamic Island Centered */}
              <div className="w-16 h-3.5 rounded-full bg-[#0d0e12] border border-white/10 mx-auto flex items-center justify-between px-2 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1b1c24] border border-white/15" />
                <div className="w-1 h-1 rounded-full bg-emerald-500/80" />
              </div>

              {/* App Detail Header: Brand Icon, Name, Subtitle, Blue GET Button */}
              <div className="flex items-start gap-2.5 mt-1">
                <div className="shrink-0 rounded-[12px] shadow-sm overflow-hidden">
                  <BrandIcon
                    withBadge
                    size={44}
                    className="w-[44px] h-[44px]"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[11.5px] sm:text-[12px] font-extrabold tracking-tight leading-tight text-white truncate">
                    Store Preview Studio
                  </h4>
                  <p className="text-[9.5px] sm:text-[10px] leading-tight font-medium text-slate-400 truncate">
                    Mockup Studio Pro
                  </p>

                  <div className="mt-1">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white font-normal text-[9.5px] tracking-wide shadow-sm transition-all cursor-pointer"
                    >
                      GET
                    </button>
                  </div>
                </div>
              </div>

              {/* Store Metrics Ribbon (App Store Authentic 3-Column) */}
              <StoreMetricsRibbon theme="dark" className="my-1 py-1" />

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
                  className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-0.5 pb-1 select-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {/* Slide 1: Live Canvas Studio */}
                  <div className="w-[165px] sm:w-[175px] h-[122px] sm:h-[128px] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#0c0a28] via-[#14113e] to-[#070516] border border-indigo-500/40 relative overflow-hidden shadow-lg">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
                        <span className="text-[8px] font-bold text-indigo-100 tracking-tight">Studio Canvas</span>
                      </div>
                      <span className="text-[6.5px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-mono font-bold">
                        4K · 60FPS
                      </span>
                    </div>

                    {/* Rich Studio Workspace Graphic SVG */}
                    <div className="my-auto w-full h-15 relative">
                      <svg viewBox="0 0 160 54" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="studioGrid" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
                          </linearGradient>
                          <linearGradient id="phoneScreenArt" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="40%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                          <linearGradient id="glowRing" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00D085" />
                            <stop offset="50%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>

                        {/* Subtle Canvas Dot Grid */}
                        {[20, 45, 115, 140].map((x, idx) => (
                          <g key={idx}>
                            <circle cx={x} cy="10" r="0.8" fill="#818cf8" opacity="0.35" />
                            <circle cx={x} cy="26" r="0.8" fill="#818cf8" opacity="0.35" />
                            <circle cx={x} cy="42" r="0.8" fill="#818cf8" opacity="0.35" />
                          </g>
                        ))}

                        {/* Perspective Stage Ground Ellipse */}
                        <ellipse cx="80" cy="46" rx="55" ry="7" fill="url(#studioGrid)" />

                        {/* Left Floating Tool Badge: Layer Inspector */}
                        <g transform="translate(6, 12)">
                          <rect width="36" height="15" rx="3.5" fill="#101229" stroke="rgba(129,140,248,0.5)" strokeWidth="0.8" />
                          <circle cx="6" cy="7.5" r="2" fill="#818cf8" />
                          <text x="11" y="9.5" fill="#e0e7ff" fontSize="5" fontWeight="bold" fontFamily="sans-serif">✦ Bezels</text>
                        </g>

                        {/* Left Floating Format Tag */}
                        <g transform="translate(8, 32)">
                          <rect width="32" height="12" rx="3" fill="#141733" stroke="rgba(99,102,241,0.4)" strokeWidth="0.7" />
                          <text x="16" y="8" textAnchor="middle" fill="#a5b4fc" fontSize="4.5" fontWeight="bold" fontFamily="monospace">19.5:9</text>
                        </g>

                        {/* Center Stage: Floating 3D Tilted Device Mockup */}
                        <g transform="translate(56, 4)">
                          {/* Device Drop Shadow */}
                          <rect x="4" y="6" width="46" height="42" rx="7" fill="#000000" opacity="0.6" filter="blur(3px)" />
                          {/* Outer Titanium Bezel */}
                          <rect width="48" height="44" rx="7" fill="#181a28" stroke="#818cf8" strokeWidth="1.2" />
                          {/* Screen Artwork */}
                          <rect x="2" y="2" width="44" height="40" rx="5.5" fill="url(#phoneScreenArt)" />
                          {/* Dynamic Island on Mockup */}
                          <rect x="18" y="3.5" width="12" height="2.5" rx="1.2" fill="#0c0d18" />
                          {/* App Artwork UI Content: Equalizer & Track */}
                          <rect x="6" y="8" width="16" height="2" rx="1" fill="#ffffff" opacity="0.85" />
                          <circle cx="38" cy="9" r="2" fill="#ffffff" opacity="0.9" />
                          {/* Sound wave bars */}
                          <rect x="8" y="16" width="2.5" height="14" rx="1" fill="#ffffff" opacity="0.95" />
                          <rect x="13" y="13" width="2.5" height="18" rx="1" fill="#ffffff" opacity="0.95" />
                          <rect x="18" y="19" width="2.5" height="11" rx="1" fill="#ffffff" opacity="0.95" />
                          <rect x="23" y="15" width="2.5" height="16" rx="1" fill="#ffffff" opacity="0.95" />
                          <rect x="28" y="21" width="2.5" height="9" rx="1" fill="#ffffff" opacity="0.95" />
                          <rect x="33" y="14" width="2.5" height="17" rx="1" fill="#ffffff" opacity="0.95" />
                          <rect x="38" y="18" width="2.5" height="12" rx="1" fill="#ffffff" opacity="0.95" />
                          {/* Play button pill at bottom */}
                          <rect x="14" y="34" width="20" height="4" rx="2" fill="#ffffff" opacity="0.9" />
                          {/* Transform Anchor Corner Markers */}
                          <circle cx="0" cy="0" r="1.8" fill="#22d3ee" />
                          <circle cx="48" cy="0" r="1.8" fill="#22d3ee" />
                          <circle cx="0" cy="44" r="1.8" fill="#22d3ee" />
                          <circle cx="48" cy="44" r="1.8" fill="#22d3ee" />
                        </g>

                        {/* Right Floating Palette: Swatch Ring */}
                        <g transform="translate(116, 12)">
                          <rect width="36" height="15" rx="3.5" fill="#101229" stroke="rgba(129,140,248,0.5)" strokeWidth="0.8" />
                          <circle cx="8" cy="7.5" r="2.5" fill="#00D085" />
                          <circle cx="16" cy="7.5" r="2.5" fill="#ec4899" />
                          <circle cx="24" cy="7.5" r="2.5" fill="#6366f1" />
                        </g>

                        {/* Right Floating Badge: Resolution Tag */}
                        <g transform="translate(116, 32)">
                          <rect width="36" height="12" rx="3" fill="#141733" stroke="rgba(34,211,238,0.4)" strokeWidth="0.7" />
                          <text x="18" y="8" textAnchor="middle" fill="#67e8f9" fontSize="4.5" fontWeight="bold" fontFamily="monospace">4K UHD</text>
                        </g>
                      </svg>
                    </div>

                    {/* Bottom Label */}
                    <div className="flex items-center justify-between text-[6.5px] text-slate-400 pt-0.5 border-t border-white/10">
                      <span className="font-medium text-slate-300">Live Stage Canvas</span>
                      <span className="text-cyan-300 font-semibold">Real-Time Framing</span>
                    </div>
                  </div>

                  {/* Slide 2: Adaptive Device Fleet */}
                  <div className="w-[165px] sm:w-[175px] h-[122px] sm:h-[128px] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#031d16] via-[#082e22] to-[#02120d] border border-emerald-500/40 relative overflow-hidden shadow-lg">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                        <span className="text-[8px] font-bold text-emerald-100 tracking-tight">Adaptive Fleet</span>
                      </div>
                      <span className="text-[6.5px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 font-mono font-bold">
                        ALL SIZES
                      </span>
                    </div>

                    {/* Duo Devices SVG Graphic */}
                    <div className="my-auto w-full h-15 relative flex items-center justify-center">
                      <svg viewBox="0 0 160 54" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#047857" />
                          </linearGradient>
                          <linearGradient id="tabletScreen" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#14b8a6" />
                            <stop offset="50%" stopColor="#0d9488" />
                            <stop offset="100%" stopColor="#0f766e" />
                          </linearGradient>
                          <radialGradient id="auroraGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#031d16" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Background Atmospheric Glow */}
                        <ellipse cx="80" cy="27" rx="70" ry="22" fill="url(#auroraGlow)" />

                        {/* Laser Synchronization Beam linking devices */}
                        <path d="M 54 27 L 76 27" stroke="#34d399" strokeWidth="1.2" strokeDasharray="3 2" />
                        <circle cx="65" cy="27" r="3" fill="#10b981" />
                        <circle cx="65" cy="27" r="1.5" fill="#ffffff" />

                        {/* Left: Phone Mockup Frame */}
                        <g transform="translate(24, 6)">
                          <rect width="28" height="42" rx="5" fill="#081813" stroke="#34d399" strokeWidth="1.2" />
                          <rect x="2" y="2" width="24" height="38" rx="4" fill="url(#phoneScreen)" />
                          {/* Dynamic Island */}
                          <rect x="9" y="3.5" width="10" height="2" rx="1" fill="#04140f" />
                          {/* Responsive UI Card layout */}
                          <rect x="4.5" y="8" width="19" height="7" rx="1.5" fill="#ffffff" opacity="0.85" />
                          <rect x="4.5" y="17" width="19" height="10" rx="1.5" fill="#ffffff" opacity="0.3" />
                          <rect x="4.5" y="29" width="19" height="8" rx="1.5" fill="#ffffff" opacity="0.3" />
                          {/* Label below phone */}
                          <text x="14" y="47" textAnchor="middle" fill="#a7f3d0" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">Phone 6.7"</text>
                        </g>

                        {/* Right: Tablet Mockup Frame */}
                        <g transform="translate(78, 4)">
                          <rect width="58" height="46" rx="5.5" fill="#081813" stroke="#2dd4bf" strokeWidth="1.2" />
                          <rect x="2" y="2" width="54" height="42" rx="4.5" fill="url(#tabletScreen)" />
                          {/* Front Camera dot */}
                          <circle cx="29" cy="3.5" r="1" fill="#ffffff" opacity="0.7" />
                          {/* Responsive Tablet Split View: Sidebar + 2-col cards */}
                          <rect x="4" y="7" width="12" height="34" rx="1.5" fill="#ffffff" opacity="0.25" />
                          <rect x="18" y="7" width="16" height="15" rx="1.5" fill="#ffffff" opacity="0.85" />
                          <rect x="36" y="7" width="16" height="15" rx="1.5" fill="#ffffff" opacity="0.4" />
                          <rect x="18" y="24" width="34" height="17" rx="1.5" fill="#ffffff" opacity="0.3" />
                          {/* Label below tablet */}
                          <text x="29" y="49" textAnchor="middle" fill="#99f6e4" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">Tablet 13"</text>
                        </g>
                      </svg>
                    </div>

                    {/* Bottom Label */}
                    <div className="flex items-center justify-between text-[6.5px] text-slate-400 pt-0.5 border-t border-white/10">
                      <span className="font-medium text-slate-300">Responsive Layouts</span>
                      <span className="text-emerald-300 font-semibold">Standard Store Ratios</span>
                    </div>
                  </div>

                  {/* Slide 3: 1-Click Store Deliverables */}
                  <div className="w-[165px] sm:w-[175px] h-[122px] sm:h-[128px] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1c0828] via-[#2d0d3e] to-[#0e0314] border border-purple-500/40 relative overflow-hidden shadow-lg">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_6px_#e879f9]" />
                        <span className="text-[8px] font-bold text-purple-100 tracking-tight">Store Package</span>
                      </div>
                      <span className="text-[6.5px] px-1.5 py-0.2 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 font-mono font-bold">
                        1-CLICK ZIP
                      </span>
                    </div>

                    {/* Deliverables ZIP Chest & Floating Assets SVG */}
                    <div className="my-auto w-full h-15 relative flex items-center justify-center">
                      <svg viewBox="0 0 160 54" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        {/* Sparkles */}
                        <path d="M 22 10 L 23.5 13 L 26 14.5 L 23.5 16 L 22 19 L 20.5 16 L 18 14.5 L 20.5 13 Z" fill="#fde047" opacity="0.8" />
                        <path d="M 142 38 L 143 40 L 145 41 L 143 42 L 142 44 L 141 42 L 139 41 L 141 40 Z" fill="#22d3ee" opacity="0.8" />

                        {/* Central Export Package Vault */}
                        <g transform="translate(52, 10)">
                          <rect width="56" height="34" rx="5" fill="#190724" stroke="#c084fc" strokeWidth="1.2" />
                          {/* Folder Tab Top */}
                          <path d="M 4 0 L 18 0 L 22 4 L 52 4 L 52 0" fill="none" stroke="#e879f9" strokeWidth="1" />
                          {/* Archive Name */}
                          <text x="28" y="14" textAnchor="middle" fill="#ffffff" fontSize="5.5" fontWeight="bold" fontFamily="monospace">store-bundle.zip</text>
                          {/* Format Chips inside */}
                          <rect x="6" y="19" width="12" height="7" rx="1.5" fill="rgba(192,132,252,0.3)" stroke="#c084fc" strokeWidth="0.6" />
                          <text x="12" y="24" textAnchor="middle" fill="#f3e8ff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">PNG</text>
                          <rect x="22" y="19" width="12" height="7" rx="1.5" fill="rgba(192,132,252,0.3)" stroke="#c084fc" strokeWidth="0.6" />
                          <text x="28" y="24" textAnchor="middle" fill="#f3e8ff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">ZIP</text>
                          <rect x="38" y="19" width="12" height="7" rx="1.5" fill="rgba(192,132,252,0.3)" stroke="#c084fc" strokeWidth="0.6" />
                          <text x="44" y="24" textAnchor="middle" fill="#f3e8ff" fontSize="4.2" fontWeight="bold" fontFamily="monospace">MD</text>
                        </g>

                        {/* Left Floating Asset Card: 4K Preview Badge */}
                        <g transform="translate(8, 18)">
                          <rect width="36" height="18" rx="3.5" fill="#1f092e" stroke="#e879f9" strokeWidth="0.9" />
                          <rect x="3" y="3" width="10" height="12" rx="1.5" fill="url(#phoneScreen)" />
                          <text x="24" y="10" textAnchor="middle" fill="#fdf4ff" fontSize="4.8" fontWeight="bold" fontFamily="sans-serif">PNG 4K</text>
                          <text x="24" y="15" textAnchor="middle" fill="#d8b4fe" fontSize="3.8" fontFamily="sans-serif">Screenshots</text>
                        </g>

                        {/* Right Floating Badge: Compliance Passed Shield */}
                        <g transform="translate(116, 16)">
                          <rect width="36" height="20" rx="3.5" fill="#12251a" stroke="#34d399" strokeWidth="0.9" />
                          <circle cx="11" cy="10" r="4.5" fill="#059669" />
                          <path d="M 9 10 L 10.5 11.5 L 13.5 8.5" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
                          <text x="24" y="10" textAnchor="middle" fill="#a7f3d0" fontSize="4.8" fontWeight="bold" fontFamily="sans-serif">PASSED</text>
                          <text x="24" y="15" textAnchor="middle" fill="#6ee7b7" fontSize="3.8" fontFamily="sans-serif">ASO Ready</text>
                        </g>
                      </svg>
                    </div>

                    {/* Bottom Label */}
                    <div className="flex items-center justify-between text-[6.5px] text-slate-400 pt-0.5 border-t border-white/10">
                      <span className="font-medium text-slate-300">In-Browser Privacy</span>
                      <span className="text-purple-300 font-semibold">Stored locally</span>
                    </div>
                  </div>
                </div>

                {/* What's New Snippet below carousel */}
                <div className="px-1.5 py-0.5 mt-0.5 rounded bg-white/[0.04] border border-white/5 flex items-center justify-between text-[6.5px] text-slate-400 shrink-0">
                  <span className="font-semibold text-indigo-300">Live Stage Canvas · 4K</span>
                  <span>v2.4</span>
                </div>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="w-20 h-1 rounded-full mx-auto mt-1 bg-white/35 shrink-0" />
            </div>
          </div>
        </div>

        {/* Tablet Mockup Frame (Portrait iPad) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
            device === "tablet"
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-[0.88] -translate-y-3 pointer-events-none"
          }`}
        >
          <div className="relative w-[285px] sm:w-[315px] h-[392px] sm:h-[412px] rounded-[32px] p-[6px] border border-[#3e4046] bg-[#25262a] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300">
            {/* Top Power Button */}
            <div className="absolute -top-[4px] right-[30px] w-[26px] h-[3px] rounded-t-sm bg-[#363840]" />
            {/* Right Volume Buttons */}
            <div className="absolute -right-[4px] top-[32px] w-[3px] h-[16px] rounded-r-sm bg-[#363840]" />
            <div className="absolute -right-[4px] top-[52px] w-[3px] h-[16px] rounded-r-sm bg-[#363840]" />

            {/* Screen Inner (Portrait iPad) */}
            <div className="w-full h-full rounded-[26px] p-3 sm:p-3.5 bg-black text-white flex flex-col justify-between">
              {/* Front Camera Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 mx-auto shrink-0" />

              {/* Tablet Header: Brand Icon, Name, Subtitle & Blue GET Button */}
              <div className="flex items-start gap-3 mt-0.5">
                <div className="shrink-0 rounded-[13px] shadow-sm overflow-hidden">
                  <BrandIcon
                    withBadge
                    size={46}
                    className="w-[46px] h-[46px]"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold leading-tight text-white truncate">
                    Store Preview Studio
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Mockup Studio Pro
                  </div>
                  <div className="mt-1">
                    <button
                      type="button"
                      className="px-3 py-0.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-normal text-[9.5px] tracking-wide shadow-sm transition-colors cursor-pointer"
                    >
                      GET
                    </button>
                  </div>
                </div>
              </div>

              {/* Store Metrics Ribbon (App Store Authentic 3-Column) */}
              <StoreMetricsRibbon theme="dark" className="my-1 py-1" />

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
                  className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-0.5 pb-1 select-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {/* Screen 1: Dual-Store Live Studio Canvas */}
                  <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#0c0a24] via-[#080918] to-black border border-indigo-500/35 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8.5px] font-bold text-indigo-200">Dual-Store Canvas</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      </div>
                      <span className="text-[6.5px] px-1.5 py-0.5 rounded bg-indigo-500/25 text-indigo-300 font-mono font-bold">
                        3x RETINA · 4K
                      </span>
                    </div>

                    {/* Center Studio Mockup Preview with Side-by-Side Frames */}
                    <div className="flex items-center justify-between gap-3 my-auto px-1">
                      {/* Left: Mini Phone Stage */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-11 rounded-[4px] border border-indigo-400/60 bg-[#0a0b1c] p-0.5 flex flex-col justify-between shadow">
                          <div className="w-1.5 h-0.5 rounded-full bg-white/40 mx-auto" />
                          <div className="w-full h-7 rounded-[2px] bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-500" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[7.5px] text-white font-bold leading-none">Phone Preview</div>
                          <div className="text-[6.5px] text-slate-400">1179 × 2556 px</div>
                          <div className="text-[6px] text-emerald-400 font-semibold">Framed &amp; Screen-Only</div>
                        </div>
                      </div>

                      {/* Right: Mini Tablet Stage */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-9 h-11 rounded-[5px] border border-indigo-400/60 bg-[#0a0b1c] p-0.5 flex flex-col justify-between shadow">
                          <div className="w-2.5 h-0.5 rounded-full bg-white/40 mx-auto" />
                          <div className="w-full h-7 rounded-[2.5px] bg-gradient-to-br from-purple-500 to-indigo-600" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[7.5px] text-white font-bold leading-none">Tablet Preview</div>
                          <div className="text-[6.5px] text-slate-400">2048 × 2732 px</div>
                          <div className="text-[6px] text-indigo-300 font-semibold">Native App Ratio</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[6.5px] text-slate-400 pt-0.5 border-t border-white/10">
                      <span>Live Stage Canvas</span>
                      <span className="text-indigo-400 font-semibold">Dual-Store Viewports</span>
                    </div>
                  </div>

                  {/* Screen 2: Pre-Flight Compliance & 1-Click Package */}
                  <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] rounded-xl p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-br from-[#1a0822] via-[#0e0514] to-black border border-purple-500/35 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8.5px] font-bold text-purple-200">Pre-Flight Compliance</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[6.5px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        100% PASSED ✓
                      </span>
                    </div>

                    {/* Split View: Left Audit Specs, Right Export ZIP Badge */}
                    <div className="flex items-center justify-between gap-2.5 my-auto px-1">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[6.5px]">
                          <span className="text-slate-300">App Title &amp; Subtitle Specs</span>
                          <span className="text-emerald-400 font-bold">Valid ✓</span>
                        </div>
                        <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[6.5px]">
                          <span className="text-slate-300">Master Icon 1024 (Opaque)</span>
                          <span className="text-cyan-400 font-bold">Compliant ✓</span>
                        </div>
                      </div>

                      <div className="w-20 rounded-lg p-1.5 bg-purple-950/60 border border-purple-500/30 flex flex-col justify-between text-center shrink-0">
                        <span className="text-[7px] text-white font-mono font-bold truncate">store-bundle.zip</span>
                        <div className="flex justify-center gap-1 my-0.5">
                          <span className="text-[5.5px] px-1 rounded bg-purple-500/40 text-purple-200 font-bold">PNG</span>
                          <span className="text-[5.5px] px-1 rounded bg-purple-500/40 text-purple-200 font-bold">ZIP</span>
                          <span className="text-[5.5px] px-1 rounded bg-purple-500/40 text-purple-200 font-bold">MD</span>
                        </div>
                        <span className="text-[6px] text-emerald-400 font-bold">1-Click Export</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[6.5px] text-slate-400 pt-0.5 border-t border-white/10">
                      <span>In-Browser Privacy</span>
                      <span className="text-purple-400 font-semibold">Stored locally in your browser</span>
                    </div>
                  </div>
                </div>

                {/* What's New Snippet below screenshots */}
                <div className="px-1.5 py-1 mt-1 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-between text-[7px] text-slate-400 shrink-0">
                  <span className="font-semibold text-indigo-300">Universal Canvas · 4K Stage</span>
                  <span>v2.4 · 65 MB</span>
                </div>
              </div>

              {/* Tablet Home Bar */}
              <div className="w-24 h-1 rounded-full mx-auto mt-1.5 bg-white/30 shrink-0" />
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
      developer: "OmniArcade Games Ltd.",
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
      developer: "ZenMind Studio",
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
      developer: "PulseFit Health Lab",
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
            Explore sample listings across diverse app categories.
          </p>
        </div>

        {/* 3 Preset Switcher Sliding Tabs (Domain Categories) */}
        <div className="shrink-0 self-start sm:self-center">
          <SlidingTabs
            value={activePreset}
            onChange={(val) => handleSelectPreset(val as "cyberstrike" | "pulsefit" | "zenmind")}
            options={[
              { value: "cyberstrike", label: "Games" },
              { value: "pulsefit", label: "Health Care" },
              { value: "zenmind", label: "Wellness" },
            ]}
            className="w-[270px] sm:w-[290px]"
            size="sm"
            ariaLabel="Preset selector tabs"
          />
        </div>
      </div>

      {/* Simulated Live Stage with Device Frame (without inner container wrapper) */}
      <div
        className="relative z-10 w-full h-[400px] sm:h-[420px] flex items-center justify-center select-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative w-[285px] sm:w-[315px] h-[392px] sm:h-[412px] rounded-[32px] p-[6px] border border-[#3e4046] bg-[#25262a] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]"
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
          <div className="absolute -top-[4px] right-[30px] w-[26px] h-[3px] rounded-t-sm bg-[#363840]" />
          {/* Right: Volume Up */}
          <div className="absolute -right-[4px] top-[32px] w-[3px] h-[16px] rounded-r-sm bg-[#363840]" />
          {/* Right: Volume Down */}
          <div className="absolute -right-[4px] top-[52px] w-[3px] h-[16px] rounded-r-sm bg-[#363840]" />

          {/* Screen Inner (Portrait iPad) */}
          <div className="w-full h-full rounded-[26px] p-3 sm:p-3.5 bg-black text-white flex flex-col justify-between">
            {/* Front Camera Dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mx-auto shrink-0" />

            {/* Tablet Header: Brand Icon, Name, Subtitle & Blue GET Button */}
            <div className="flex items-start gap-3 mt-0.5">
              <div className="w-[46px] h-[46px] shrink-0 rounded-[12px] shadow-md overflow-hidden border border-white/10 transition-all duration-300">
                {current.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold leading-tight text-white truncate transition-all duration-200">
                  {current.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate transition-all duration-200">
                  {current.subtitle}
                </div>
                <div className="mt-1">
                  <button
                    type="button"
                    className="px-3 py-0.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-normal text-[9.5px] tracking-wide shadow-sm transition-colors cursor-pointer"
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

            {/* Tablet Screenshots Carousel (Authentic Horizontal Scroll) */}
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
                {activePreset === "zenmind" && (
                  <>
                    {/* ZenMind Screen 1: Mindful Paced Breathing Halo */}
                    <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#031d15] via-[#082e22] to-black border border-emerald-500/35 relative overflow-hidden transition-all duration-300">
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8.5px] font-bold text-emerald-200">Mindful Breath</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          4-7-8 PACED
                        </span>
                      </div>

                      {/* Ethereal Glowing Breathing Halo SVG */}
                      <div className="relative my-auto flex items-center justify-center">
                        <svg viewBox="0 0 160 42" className="w-full h-14" preserveAspectRatio="xMidYMid meet">
                          <defs>
                            <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                              <stop offset="60%" stopColor="#059669" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#05140e" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#a7f3d0" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>

                          {/* Atmospheric background glow */}
                          <ellipse cx="80" cy="21" rx="60" ry="18" fill="url(#haloGrad)" />

                          {/* Concentric Breathing Rings */}
                          <ellipse cx="80" cy="21" rx="42" ry="16" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="1" strokeDasharray="3 3" />
                          <ellipse cx="80" cy="21" rx="30" ry="12" fill="none" stroke="url(#orbitGrad)" strokeWidth="1.8" />
                          <ellipse cx="80" cy="21" rx="18" ry="8" fill="rgba(52,211,153,0.15)" stroke="#6ee7b7" strokeWidth="1.2" />

                          {/* Orbiting glowing prana particles */}
                          <circle cx="106" cy="17" r="2.5" fill="#fde68a" />
                          <circle cx="106" cy="17" r="4.5" fill="#fde68a" opacity="0.4" />
                          <circle cx="54" cy="25" r="1.8" fill="#a7f3d0" />

                          {/* Center Text: Rhythm */}
                          <text x="80" y="21" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="9" fontWeight="800" fontFamily="monospace">
                            4s
                          </text>
                        </svg>

                        {/* Floating breath state cue */}
                        <div className="absolute -bottom-1 inset-x-0 text-center">
                          <span className="text-[6.5px] font-extrabold uppercase tracking-widest text-emerald-300 drop-shadow">
                            INHALE · EXPAND
                          </span>
                        </div>
                      </div>

                      {/* Bottom Footer Note */}
                      <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5 border-t border-white/10">
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          🌿 14-Day Calm Streak
                        </span>
                        <span className="text-slate-400">Heart coherence: 94%</span>
                      </div>
                    </div>

                    {/* ZenMind Screen 2: 3D Binaural Soundscape & Waveform Mixer */}
                    <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#021f24] via-[#06292b] to-black border border-teal-500/35 relative overflow-hidden transition-all duration-300">
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8.5px] font-bold text-teal-200">3D Soundscapes</span>
                          <span className="text-[6.5px] text-amber-300">🌙</span>
                        </div>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold">
                          432 HZ SOLFEGGIO
                        </span>
                      </div>

                      {/* Harmonic Fluid Sine Waves & Nature Sliders SVG */}
                      <div className="relative my-auto h-14 w-full">
                        <svg viewBox="0 0 160 44" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="waveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
                              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.3" />
                            </linearGradient>
                            <linearGradient id="waveEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                              <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                            </linearGradient>
                          </defs>

                          {/* Crescent Moon in Night Sky */}
                          <path d="M 148 6 A 6 6 0 0 0 154 12 A 7 7 0 1 1 146 6 Z" fill="#fde68a" opacity="0.9" />
                          <circle cx="138" cy="8" r="0.8" fill="#ffffff" opacity="0.8" />
                          <circle cx="128" cy="14" r="0.8" fill="#ffffff" opacity="0.6" />

                          {/* Layer 1: Delta Wave (2.5 Hz) */}
                          <path
                            d="M 0 28 C 30 18, 50 36, 80 26 C 110 16, 130 32, 160 22"
                            fill="none"
                            stroke="url(#waveEmerald)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />

                          {/* Layer 2: Harmonic Solfeggio Wave */}
                          <path
                            d="M 0 20 C 25 32, 55 12, 85 24 C 115 34, 135 14, 160 26"
                            fill="none"
                            stroke="url(#waveCyan)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />

                          {/* Layer 3: Rain Ambient Ripples */}
                          <path
                            d="M 0 34 C 40 30, 70 38, 110 32 C 135 28, 150 34, 160 30"
                            fill="none"
                            stroke="rgba(167,243,208,0.3)"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                          />
                        </svg>

                        {/* Natural Sound Mix Channels Overlay */}
                        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between text-[6px] font-mono px-1">
                          <span className="flex items-center gap-0.5 text-teal-300">
                            🌧️ Rain 75%
                          </span>
                          <span className="flex items-center gap-0.5 text-emerald-300">
                            🌲 Pines 50%
                          </span>
                          <span className="flex items-center gap-0.5 text-cyan-300">
                            🧠 Delta 2.5Hz
                          </span>
                        </div>
                      </div>

                      {/* Bottom Footer Note */}
                      <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5 border-t border-white/10">
                        <span>Night Rain on Leaves</span>
                        <span className="text-teal-400 font-semibold">Auto-fade 45m ⏱</span>
                      </div>
                    </div>
                  </>
                )}

                {activePreset === "pulsefit" && (
                  <>
                    {/* PulseFit Screen 1: Weekly Volume & Hypertrophy Bar Chart */}
                    <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#2a0e05] via-[#140804] to-black border border-orange-500/30 relative overflow-hidden transition-all duration-300">
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8.5px] font-bold text-orange-200">Volume Load</span>
                          <span className="text-[6.5px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            ↑ 18.4%
                          </span>
                        </div>
                        <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono font-bold">
                          12,480 KG
                        </span>
                      </div>

                      {/* 7-Day Vertical Bar Chart */}
                      <div className="my-auto px-1">
                        <div className="h-12 flex items-end justify-between gap-1.5">
                          {[
                            { day: "M", val: 55, active: false },
                            { day: "T", val: 78, active: false },
                            { day: "W", val: 40, active: false },
                            { day: "T", val: 96, active: true },
                            { day: "F", val: 82, active: false },
                            { day: "S", val: 65, active: false },
                            { day: "S", val: 30, active: false },
                          ].map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div
                                className={`w-full rounded-t-[3px] transition-all duration-300 ${
                                  item.active
                                    ? "bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,146,60,0.6)]"
                                    : "bg-gradient-to-t from-orange-950/80 to-orange-500/40 hover:to-orange-400/60"
                                }`}
                                style={{ height: `${item.val}%` }}
                              />
                            </div>
                          ))}
                        </div>
                        {/* Day Labels */}
                        <div className="flex items-center justify-between text-[6px] font-mono text-slate-400 pt-1 border-t border-white/10">
                          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                            <span key={i} className={`flex-1 text-center ${i === 3 ? "text-amber-300 font-bold" : ""}`}>
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Footer Note */}
                      <div className="flex items-center justify-between text-[6px] text-slate-400">
                        <span>Progressive Overload</span>
                        <span className="text-amber-400 font-semibold">Peak: Thursday (Legs)</span>
                      </div>
                    </div>

                    {/* PulseFit Screen 2: Cardiac Zones & Real-time Waveform Area Chart */}
                    <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#17071e] via-[#0d0414] to-black border border-rose-500/30 relative overflow-hidden transition-all duration-300">
                      {/* Top Header & Zones Pips */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8.5px] font-bold text-rose-200">Heart Rate Zones</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                        {/* Mini 5 Zones Distribution Bar */}
                        <div className="flex items-center gap-0.5">
                          <div className="w-2.5 h-1.5 rounded-xs bg-slate-700" title="Z1" />
                          <div className="w-2.5 h-1.5 rounded-xs bg-blue-500/60" title="Z2" />
                          <div className="w-3.5 h-1.5 rounded-xs bg-emerald-500/80" title="Z3" />
                          <div className="w-5 h-1.5 rounded-xs bg-amber-500" title="Z4" />
                          <div className="w-3 h-1.5 rounded-xs bg-rose-500 font-bold" title="Z5" />
                        </div>
                      </div>

                      {/* Smooth Area Waveform Chart SVG */}
                      <div className="relative my-auto h-13 w-full overflow-hidden">
                        <svg viewBox="0 0 160 40" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="hrAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                              <stop offset="60%" stopColor="#fb923c" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="hrLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#fb923c" />
                              <stop offset="50%" stopColor="#f43f5e" />
                              <stop offset="85%" stopColor="#e11d48" />
                              <stop offset="100%" stopColor="#fb7185" />
                            </linearGradient>
                          </defs>

                          {/* Horizontal Threshold Grid Lines */}
                          <line x1="0" y1="12" x2="160" y2="12" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 3" strokeWidth="0.8" />
                          <line x1="0" y1="26" x2="160" y2="26" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 3" strokeWidth="0.8" />

                          {/* Gradient Fill under Area Curve */}
                          <path
                            d="M 0 35 Q 20 32 35 24 T 70 20 T 100 8 T 130 16 T 160 22 L 160 40 L 0 40 Z"
                            fill="url(#hrAreaGrad)"
                          />

                          {/* Main Glowing ECG / HR Curve */}
                          <path
                            d="M 0 35 Q 20 32 35 24 T 70 20 T 100 8 T 130 16 T 160 22"
                            fill="none"
                            stroke="url(#hrLineGrad)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          {/* Peak Pulse Highlight Dot */}
                          <circle cx="100" cy="8" r="3" fill="#ffffff" />
                          <circle cx="100" cy="8" r="5" fill="#f43f5e" opacity="0.4" />
                        </svg>

                        {/* Floating Peak HR Callout Pill */}
                        <div className="absolute top-0 right-14 transform -translate-y-1">
                          <span className="px-1 py-0.5 rounded bg-rose-500/90 text-white font-mono text-[6px] font-bold shadow">
                            168 BPM
                          </span>
                        </div>
                      </div>

                      {/* Bottom Footer Note */}
                      <div className="flex items-center justify-between text-[6px] text-slate-400">
                        <span>Cardio Session: 42 mins</span>
                        <span className="text-rose-400 font-semibold">Zone 4: 82% of workout</span>
                      </div>
                    </div>
                  </>
                )}

                {activePreset === "cyberstrike" && (
                  <>
                    {/* CyberStrike Screen 1: Open World Action RPG */}
                    <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl relative overflow-hidden bg-[#060714] border border-cyan-500/40 shadow-inner select-none transition-all duration-300">
                      {/* Atmospheric Cyber Background SVG */}
                      <svg viewBox="0 0 180 96" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e0b36" />
                            <stop offset="60%" stopColor="#0b081d" />
                            <stop offset="100%" stopColor="#03040c" />
                          </linearGradient>
                          <linearGradient id="neonMoon" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f5ff" />
                            <stop offset="100%" stopColor="#ff007f" />
                          </linearGradient>
                        </defs>
                        <rect width="180" height="96" fill="url(#skyGrad)" />

                        {/* Giant Neon Cyber Moon */}
                        <circle cx="140" cy="30" r="20" fill="none" stroke="url(#neonMoon)" strokeWidth="2.5" opacity="0.6" />
                        <circle cx="140" cy="30" r="26" fill="none" stroke="#00f5ff" strokeWidth="0.8" opacity="0.3" strokeDasharray="4 4" />

                        {/* Distant Cyber Skyscraper Silhouettes */}
                        <path d="M10 52 L25 52 L25 35 L40 35 L40 52 L55 52 L55 28 L72 28 L72 52 L85 52 L85 38 L105 38 L105 52 L125 52 L125 22 L145 22 L145 52 L165 52 L165 35 L175 35 L175 52 Z" fill="#0b0c1c" opacity="0.9" />
                        {/* Skyscraper window neon lights */}
                        <rect x="58" y="32" width="2" height="3" fill="#00f5ff" opacity="0.8" />
                        <rect x="64" y="36" width="2" height="3" fill="#ff007f" opacity="0.8" />
                        <rect x="128" y="26" width="2" height="4" fill="#00f5ff" opacity="0.9" />
                        <rect x="136" y="30" width="2" height="4" fill="#ff007f" opacity="0.9" />

                        {/* 3D Perspective Ground Grid (Synthwave Tron grid) */}
                        <line x1="0" y1="54" x2="180" y2="54" stroke="#00f5ff" strokeWidth="1" opacity="0.7" />
                        <line x1="0" y1="62" x2="180" y2="62" stroke="#00f5ff" strokeWidth="0.8" opacity="0.5" />
                        <line x1="0" y1="72" x2="180" y2="72" stroke="#00f5ff" strokeWidth="0.7" opacity="0.35" />
                        <line x1="0" y1="84" x2="180" y2="84" stroke="#00f5ff" strokeWidth="0.6" opacity="0.2" />
                        {/* Perspective vanishing grid lines */}
                        <line x1="90" y1="54" x2="10" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
                        <line x1="90" y1="54" x2="50" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
                        <line x1="90" y1="54" x2="90" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
                        <line x1="90" y1="54" x2="130" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
                        <line x1="90" y1="54" x2="170" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />

                        {/* Hero Character Silhouette (Standing Cyber Warrior with Glowing Cyan Katana) */}
                        <g transform="translate(85, 42)">
                          {/* Glowing Energy Katana Blade */}
                          <line x1="14" y1="36" x2="28" y2="12" stroke="#00f5ff" strokeWidth="3" strokeLinecap="round" />
                          <line x1="14" y1="36" x2="28" y2="12" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                          {/* Warrior Body & Cloak Silhouette */}
                          <path d="M0 38 L4 20 L2 14 L5 8 L9 8 L12 14 L10 20 L14 38 Z" fill="#04040a" />
                          {/* Cybernetic glowing eye visor */}
                          <line x1="6" y1="10" x2="10" y2="10" stroke="#ff007f" strokeWidth="1.5" strokeLinecap="round" />
                        </g>
                      </svg>

                      {/* In-Game Mobile HUD Overlays */}
                      {/* Top Bar: Player Stats & Location */}
                      <div className="absolute top-1.5 left-2 right-2 flex items-center justify-between text-[6.5px] font-mono">
                        <div className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-white font-bold">LV.88</span>
                          <span className="text-cyan-400">NEO-SHINJUKU</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          OPEN WORLD
                        </span>
                      </div>

                      {/* Bottom In-Game Controls HUD */}
                      {/* Virtual Joystick (Bottom Left) */}
                      <div className="absolute bottom-1.5 left-2 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border border-cyan-400/40 bg-black/40 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 shadow" />
                        </div>
                      </div>

                      {/* Action Ability Buttons (Bottom Right) */}
                      <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-slate-900/80 border border-purple-500/50 flex items-center justify-center text-[7px] text-purple-300 shadow">
                          💨
                        </div>
                        <div className="w-5 h-5 rounded-full bg-slate-900/80 border border-fuchsia-500/60 flex items-center justify-center text-[7px] text-fuchsia-300 shadow">
                          ⚡
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border border-white/60 flex items-center justify-center text-[8px] text-white shadow-lg">
                          ⚔️
                        </div>
                      </div>
                    </div>

                    {/* CyberStrike Screen 2: Boss Battle & Combat Slash */}
                    <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl relative overflow-hidden bg-[#0a0410] border border-pink-500/40 shadow-inner select-none transition-all duration-300">
                      {/* Atmospheric Combat Arena Background SVG */}
                      <svg viewBox="0 0 180 96" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="arenaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#250522" />
                            <stop offset="50%" stopColor="#0c0414" />
                            <stop offset="100%" stopColor="#030108" />
                          </linearGradient>
                          <linearGradient id="neonSlash" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f5ff" />
                            <stop offset="50%" stopColor="#ff007f" />
                            <stop offset="100%" stopColor="#ffffff" />
                          </linearGradient>
                        </defs>
                        <rect width="180" height="96" fill="url(#arenaGrad)" />

                        {/* Ominous Giant Mech Boss Silhouette on Right */}
                        <g transform="translate(130, 20)">
                          <polygon points="10,42 35,25 45,68 5,68" fill="#14061a" opacity="0.9" />
                          <polygon points="15,25 30,12 38,28" fill="#1b0825" />
                          {/* Glowing Crimson Evil Eye */}
                          <circle cx="24" cy="22" r="3.5" fill="#ff0055" />
                          <circle cx="24" cy="22" r="1.5" fill="#ffffff" />
                        </g>

                        {/* GIANT COMBAT SLASH ARC (Dynamic Sword Trail cutting across screen) */}
                        <path
                          d="M 18 85 Q 85 18 160 36"
                          fill="none"
                          stroke="url(#neonSlash)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          opacity="0.95"
                        />
                        <path
                          d="M 22 83 Q 85 20 155 35"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Exploding Hit Sparks & Impact Bursts */}
                        <g transform="translate(120, 34)">
                          <line x1="0" y1="-8" x2="0" y2="8" stroke="#00f5ff" strokeWidth="2" />
                          <line x1="-8" y1="0" x2="8" y2="0" stroke="#00f5ff" strokeWidth="2" />
                          <line x1="-6" y1="-6" x2="6" y2="6" stroke="#ff007f" strokeWidth="2" />
                          <line x1="-6" y1="6" x2="6" y2="-6" stroke="#ff007f" strokeWidth="2" />
                          <circle cx="0" cy="0" r="3" fill="#ffffff" />
                        </g>

                        {/* Second smaller slash trail */}
                        <path
                          d="M 45 28 Q 95 62 145 72"
                          fill="none"
                          stroke="#00f5ff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </svg>

                      {/* Boss Health Bar (Top Center) */}
                      <div className="absolute top-1.5 inset-x-3 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between text-[6.5px] font-mono font-bold">
                          <span className="text-rose-400 flex items-center gap-1">
                            <span>💀</span> BOSS: TITAN-DREADNOUGHT
                          </span>
                          <span className="text-slate-400 text-[6px]">PHASE 2</span>
                        </div>
                        {/* Segmented Boss HP bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-900 border border-rose-500/40 p-[1px] flex gap-0.5 overflow-hidden">
                          <div className="w-[45%] h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" />
                          <div className="w-[30%] h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full" />
                        </div>
                      </div>

                      {/* Combat Floating Damage Text & Combo Badge */}
                      <div className="absolute top-7 left-3">
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-fuchsia-600/30 border border-fuchsia-500/50">
                          <span className="text-[9.5px] font-black text-white font-mono leading-none">142</span>
                          <span className="text-[5.5px] text-fuchsia-200 font-extrabold uppercase tracking-wider">COMBO</span>
                        </div>
                      </div>

                      {/* Big Dramatic Critical Hit Text */}
                      <div className="absolute bottom-2.5 left-9 transform -rotate-6">
                        <div className="text-[11px] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 drop-shadow-[0_2px_8px_rgba(255,0,127,0.8)] font-mono leading-none">
                          CRIT 98,420!
                        </div>
                      </div>

                      {/* Parry / Perfect Evade Badge (Bottom Right) */}
                      <div className="absolute bottom-2 right-2.5">
                        <div className="px-1.5 py-0.5 rounded bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-[7px] font-mono font-black tracking-wide shadow-lg">
                          ⚡ PARRY!
                        </div>
                      </div>
                    </div>
                  </>
                )}
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

              {/* Tablet Home Bar */}
              <div className="w-24 h-1 rounded-full mx-auto mt-1.5 bg-white/30 shrink-0" />
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
