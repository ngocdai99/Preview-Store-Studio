"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Download, 
  RotateCcw, 
  Type, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  Eye,
  ShieldCheck,
  Zap,
  Lock,
  Smartphone
} from "lucide-react";

export default function BannerStudioPage() {
  // --- Banner Configurations ---
  const [aspectMode, setAspectMode] = useState<"cover" | "thumbnail">("cover");
  
  // Text configuration
  const [title, setTitle] = useState("Store Preview Studio");
  const [subtitle, setSubtitle] = useState("Dual-Store App Mockup & Metadata Studio");
  const [badgeText, setBadgeText] = useState("100% Client-Side");
  
  // Feature bullet points
  const [feature1Title, setFeature1Title] = useState("Instant Dual Previews");
  const [feature1Desc, setFeature1Desc] = useState("Side-by-side iOS & Android listings as you type");
  
  const [feature2Title, setFeature2Title] = useState("Zero-Rejection Audit");
  const [feature2Desc, setFeature2Desc] = useState("Auto-check text limits & icon alpha compliance");
  
  const [feature3Title, setFeature3Title] = useState("Ready-to-Publish Export");
  const [feature3Desc, setFeature3Desc] = useState("Download crisp 3x Retina mockups & developer docs");
  
  const [feature4Title, setFeature4Title] = useState("Pay Once, Own Forever");
  const [feature4Desc, setFeature4Desc] = useState("100% offline in browser · No monthly subscriptions");

  // Pricing configuration
  const [showPricing, setShowPricing] = useState(true);
  const [plusOriginalPrice, setPlusOriginalPrice] = useState("$39");
  const [plusPrice, setPlusPrice] = useState("$29");
  const [plusDesc, setPlusDesc] = useState("For indie developers and creators who need a fast, standalone offline preview studio.");
  const [plusLicenseBadge, setPlusLicenseBadge] = useState("Personal License");

  const [proOriginalPrice, setProOriginalPrice] = useState("$59");
  const [proPrice, setProPrice] = useState("$39");
  const [proDesc, setProDesc] = useState("For agencies, studios, and developers requiring commercial client licensing and full source code.");
  const [proLicenseBadge, setProLicenseBadge] = useState("Commercial License");

  // Mockup Asset
  const [imageSrc, setImageSrc] = useState("/banner-dual-mockup.png");

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Helper to load html2canvas on demand
  const loadHtml2Canvas = async () => {
    if ((window as any).html2canvas) return (window as any).html2canvas;
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = () => resolve((window as any).html2canvas);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handleExport = async (scaleMultiplier: number = 2) => {
    if (!bannerRef.current) return;
    try {
      setIsExporting(true);
      const html2canvas = await loadHtml2Canvas();
      
      const canvas = await html2canvas(bannerRef.current, {
        scale: scaleMultiplier,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const filename = aspectMode === "cover" 
        ? `store-preview-studio-gumroad-cover-${scaleMultiplier > 2 ? '4k' : '1280x720'}.png`
        : `store-preview-studio-gumroad-thumb-600x600.png`;
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export banner error:", err);
      alert("Không thể chụp banner: " + (err as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetDefaults = () => {
    setTitle("Store Preview Studio");
    setSubtitle("Dual-Store App Mockup & Metadata Studio");
    setBadgeText("100% Client-Side");
    setFeature1Title("Instant Dual Previews");
    setFeature1Desc("Side-by-side iOS & Android listings as you type");
    setFeature2Title("Zero-Rejection Audit");
    setFeature2Desc("Auto-check text limits & icon alpha compliance");
    setFeature3Title("Ready-to-Publish Export");
    setFeature3Desc("Download crisp 3x Retina mockups & developer docs");
    setFeature4Title("Pay Once, Own Forever");
    setFeature4Desc("100% offline in browser · No monthly subscriptions");
    setPlusOriginalPrice("$39");
    setPlusPrice("$29");
    setPlusDesc("For indie developers and creators who need a fast, standalone offline preview studio.");
    setPlusLicenseBadge("Personal License");
    setProOriginalPrice("$59");
    setProPrice("$39");
    setProDesc("For agencies, studios, and developers requiring commercial client licensing and full source code.");
    setProLicenseBadge("Commercial License");
    setImageSrc("/banner-dual-mockup.png");
  };

  return (
    <div className="min-h-screen bg-[#0E0F0E] text-[#EDEDED] font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#131413]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/[0.06] text-[#989A99] hover:text-white border border-white/10 transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D085] shadow-[0_0_8px_#00D085]" />
            <h1 className="text-sm font-bold text-white tracking-wide">
              Gumroad Banner & Visual Asset Studio
            </h1>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
            Internal Dev Tool
          </span>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={resetDefaults}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#989A99] hover:text-white transition-all flex items-center gap-1.5"
            title="Reset to default values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => handleExport(2)}
            disabled={isExporting}
            className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Rendering..." : "Export Standard (2x)"}</span>
          </button>

          <button
            onClick={() => handleExport(3)}
            disabled={isExporting}
            className="text-xs font-bold px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#006636] to-[#00D085] hover:opacity-95 text-white shadow-[0_2px_12px_rgba(0,208,133,0.35)] transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isExporting ? "Rendering 4K..." : "Export 4K Ultra HD"}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Side: Controls & Customization Forms */}
        <div className="w-full xl:w-[420px] shrink-0 bg-[#161716] border border-white/10 rounded-2xl p-5 space-y-6 shadow-xl">
          {/* Format Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#989A99] mb-2.5 block flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00D085]" /> Aspect Ratio & Format
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#121312] p-1.5 rounded-xl border border-white/5">
              <button
                onClick={() => setAspectMode("cover")}
                className={`text-xs font-bold py-2 rounded-lg transition-all ${
                  aspectMode === "cover"
                    ? "bg-[#1D1E1D] text-[#00D085] border border-[#00D085]/30 shadow-sm"
                    : "text-[#989A99] hover:text-white"
                }`}
              >
                Cover (1280 × 720 · 16:9)
              </button>
              <button
                onClick={() => setAspectMode("thumbnail")}
                className={`text-xs font-bold py-2 rounded-lg transition-all ${
                  aspectMode === "thumbnail"
                    ? "bg-[#1D1E1D] text-[#00D085] border border-[#00D085]/30 shadow-sm"
                    : "text-[#989A99] hover:text-white"
                }`}
              >
                Thumbnail (600 × 600 · 1:1)
              </button>
            </div>
          </div>

          {/* Mockup Image Control */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#989A99] block flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#00D085]" /> Mockup Image & Asset
            </label>
            
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-[#121312] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                <img src={imageSrc} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-[#00D085]" />
                  <span>Upload Custom PNG...</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#989A99] mt-1">
                  File: <span className="text-white font-mono">banner-dual-mockup.png</span> (100% gốc)
                </p>
              </div>
            </div>
          </div>

          {/* Typography Controls */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#989A99] block flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#00D085]" /> Text & Copy Content
            </label>

            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">App Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00D085]"
              />
            </div>

            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Subtitle</span>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00D085]"
              />
            </div>

            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Badge Chip</span>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00D085]"
              />
            </div>

            {/* Feature 1 */}
            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Feature 1 (Title + Desc)</span>
              <input
                type="text"
                value={feature1Title}
                onChange={(e) => setFeature1Title(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white mb-1 focus:outline-none focus:border-[#00D085]"
              />
              <input
                type="text"
                value={feature1Desc}
                onChange={(e) => setFeature1Desc(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
              />
            </div>

            {/* Feature 2 */}
            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Feature 2 (Title + Desc)</span>
              <input
                type="text"
                value={feature2Title}
                onChange={(e) => setFeature2Title(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white mb-1 focus:outline-none focus:border-[#00D085]"
              />
              <input
                type="text"
                value={feature2Desc}
                onChange={(e) => setFeature2Desc(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
              />
            </div>

            {/* Feature 3 */}
            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Feature 3 (Title + Desc)</span>
              <input
                type="text"
                value={feature3Title}
                onChange={(e) => setFeature3Title(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white mb-1 focus:outline-none focus:border-[#00D085]"
              />
              <input
                type="text"
                value={feature3Desc}
                onChange={(e) => setFeature3Desc(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
              />
            </div>

            {/* Feature 4 */}
            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Feature 4 (Title + Desc)</span>
              <input
                type="text"
                value={feature4Title}
                onChange={(e) => setFeature4Title(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white mb-1 focus:outline-none focus:border-[#00D085]"
              />
              <input
                type="text"
                value={feature4Desc}
                onChange={(e) => setFeature4Desc(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
              />
            </div>
          </div>

          {/* Pricing Controls */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#989A99]">
                Show Pricing Cards
              </label>
              <input
                type="checkbox"
                checked={showPricing}
                onChange={(e) => setShowPricing(e.target.checked)}
                className="accent-[#00D085] cursor-pointer"
              />
            </div>

            {showPricing && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[11px] text-[#989A99] mb-1 block">Plus Price ($)</span>
                    <input
                      type="text"
                      value={plusPrice}
                      onChange={(e) => setPlusPrice(e.target.value)}
                      className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00D085]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#989A99] mb-1 block">Plus Original ($)</span>
                    <input
                      type="text"
                      value={plusOriginalPrice}
                      onChange={(e) => setPlusOriginalPrice(e.target.value)}
                      className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[11px] text-[#989A99] mb-1 block">Pro Price ($)</span>
                    <input
                      type="text"
                      value={proPrice}
                      onChange={(e) => setProPrice(e.target.value)}
                      className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00D085]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#989A99] mb-1 block">Pro Original ($)</span>
                    <input
                      type="text"
                      value={proOriginalPrice}
                      onChange={(e) => setProOriginalPrice(e.target.value)}
                      className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#989A99] mb-1 block">Plus Short Description</span>
                  <input
                    type="text"
                    value={plusDesc}
                    onChange={(e) => setPlusDesc(e.target.value)}
                    className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-[#989A99] mb-1 block">Pro Short Description</span>
                  <input
                    type="text"
                    value={proDesc}
                    onChange={(e) => setProDesc(e.target.value)}
                    className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-[#989A99] focus:outline-none focus:border-[#00D085]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Canvas Viewport */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="w-full mb-3 flex items-center justify-between text-xs text-[#989A99]">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#00D085]" />
              <span>Canvas Live Viewport: <strong>{aspectMode === "cover" ? "1280 × 720 px (16:9)" : "600 × 600 px (1:1)"}</strong></span>
            </div>
            <span>Độ phân giải xuất ảnh: <strong>2x / 3x Retina</strong></span>
          </div>

          {/* Viewport Scroll Wrapper */}
          <div className="w-full overflow-x-auto pb-8 pt-2 flex justify-center bg-[#070807] rounded-3xl p-4 sm:p-8 border border-white/10 shadow-2xl">
            {/* =========================================================
                THE RENDERED BANNER CANVAS ELEMENT (Captured by html2canvas)
               ========================================================= */}
            {aspectMode === "cover" ? (
              <div
                ref={bannerRef}
                style={{ width: "1280px", height: "720px", minWidth: "1280px", minHeight: "720px" }}
                className="relative bg-[#131413] rounded-2xl overflow-hidden p-[44px_48px] flex gap-5 select-none border border-[#282928] shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
              >
                {/* Tech Grid Pattern */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Left Column Content (610px - extra breathing room for pricing cards) */}
                <div className="w-[610px] flex flex-col z-10 shrink-0">
                  {/* Store Badges Row */}
                  <div className="flex items-center gap-2.5 mb-5">
                    {/* Apple Store Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0071e3]/15 border border-[#0071e3]/45 text-[#38bdf8]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.37-.58.67-.99 1.76-.85 2.8.97.08 2.01-.52 2.58-1.26z"/>
                      </svg>
                      <span>App Store</span>
                    </div>

                    {/* Google Play Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#01875f]/15 border border-[#01875f]/45 text-[#34d399]">
                      <svg width="13" height="13" viewBox="0 0 24 24">
                        <path fill="#4285f4" d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z"/>
                        <path fill="#ea4335" d="M13.544 10.989l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973z"/>
                        <path fill="#34a853" d="M13.544 13.056l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
                        <path fill="#fbbc04" d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z"/>
                      </svg>
                      <span>Google Play</span>
                    </div>

                    {/* Client Side Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00D085]/12 border border-[#00D085]/35 text-[#00D085]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{badgeText}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h1 className="text-[44px] font-black text-white tracking-tight leading-[1.12] mb-2 drop-shadow-md">
                    {title}
                  </h1>
                  <p className="text-[18px] font-medium text-[#989A99] mb-7 leading-snug">
                    {subtitle}
                  </p>

                  {/* 4 Feature Items */}
                  <div className="space-y-3 mb-6">
                    {/* Item 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="text-[14px]">
                        <strong className="text-white font-bold">{feature1Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature1Desc}</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#00D085]/15 border border-[#00D085]/40 text-[#00D085] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="text-[14px]">
                        <strong className="text-white font-bold">{feature2Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature2Desc}</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="text-[14px]">
                        <strong className="text-white font-bold">{feature3Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature3Desc}</span>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f43f5e]/15 border border-[#f43f5e]/40 text-[#f43f5e] flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="text-[14px]">
                        <strong className="text-white font-bold">{feature4Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature4Desc}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Cards Footer (Exact match to Landing Page & User Design) */}
                  {showPricing && (
                    <div className="grid grid-cols-2 gap-3.5 mt-auto pt-1">
                      {/* Plus Tier Card */}
                      <div className="relative rounded-[20px] px-4 py-3.5 flex flex-col justify-between bg-[#1D1E1D] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.25)] overflow-hidden">
                        {/* Top hairline accent line */}
                        <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[20px] bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

                        <div>
                          {/* Header row: Title on left, License Scope on right */}
                          <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <h3 className="text-[17.5px] font-bold tracking-tight text-white shrink-0">
                              Plus Edition
                            </h3>
                            <span className="inline-flex items-center text-[10px] font-medium tracking-normal text-slate-400 bg-white/[0.05] px-2.5 py-0.5 rounded-md border border-white/[0.08] shrink-0">
                              {plusLicenseBadge}
                            </span>
                          </div>

                          <p className="text-[11.5px] text-slate-400 mb-3 leading-[1.4] line-clamp-2 min-h-[32px]">
                            {plusDesc}
                          </p>

                          {/* Price Display */}
                          <div className="flex items-baseline gap-2 pb-2.5 border-b border-white/[0.08]">
                            <span className="text-[19px] font-bold text-slate-500 line-through tracking-tight">
                              {plusOriginalPrice}
                            </span>
                            <span className="text-[36px] font-black text-white leading-none tracking-[-0.03em]">
                              {plusPrice}
                            </span>
                            <span className="text-[11.5px] font-medium text-slate-400 ml-0.5 whitespace-nowrap">
                              one-time payment
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pro Studio Tier Card (Supabase Emerald Top Hairline) */}
                      <div className="relative rounded-[20px] px-4 py-3.5 flex flex-col justify-between bg-[#1D1E1D] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.25)] overflow-hidden">
                        {/* Top hairline accent line with Supabase emerald gradient */}
                        <div className="absolute top-0 inset-x-0 h-[2.5px] rounded-t-[20px] bg-gradient-to-r from-[#00D085] via-emerald-400 to-transparent" />

                        <div>
                          {/* Header row: Title on left, License Scope on right */}
                          <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <h3 className="text-[17.5px] font-bold tracking-tight text-white shrink-0">
                              Pro Studio
                            </h3>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-normal text-slate-200 bg-white/[0.08] px-2.5 py-0.5 rounded-md border border-white/15 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] shrink-0" />
                              {proLicenseBadge}
                            </span>
                          </div>

                          <p className="text-[11.5px] text-slate-400 mb-3 leading-[1.4] line-clamp-2 min-h-[32px]">
                            {proDesc}
                          </p>

                          {/* Price Display */}
                          <div className="flex items-baseline gap-2 pb-2.5 border-b border-white/[0.08]">
                            <span className="text-[19px] font-bold text-slate-500 line-through tracking-tight">
                              {proOriginalPrice}
                            </span>
                            <span className="text-[36px] font-black text-white leading-none tracking-[-0.03em]">
                              {proPrice}
                            </span>
                            <span className="text-[11.5px] font-medium text-slate-400 ml-0.5 whitespace-nowrap">
                              one-time payment
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column (Visual Dual Mockup Frame - 100% natural scale, 0px offset, 0deg rotate, 0% ambient glow, no dark shadow) */}
                <div className="flex-1 flex items-center justify-center relative z-10 overflow-hidden">
                  <div className="relative flex items-center justify-center">
                    <img
                      src={imageSrc}
                      alt="Store Preview Studio Dual Mockup"
                      className="max-h-[610px] w-auto object-contain"
                      style={{
                        imageRendering: "-webkit-optimize-contrast",
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* =========================================================
                  SQUARE PRODUCT THUMBNAIL (600 × 600)
                 ========================================================= */
              <div
                ref={bannerRef}
                style={{ width: "600px", height: "600px", minWidth: "600px", minHeight: "600px" }}
                className="relative bg-[#131413] rounded-2xl overflow-hidden p-8 flex flex-col justify-between select-none border border-[#282928] shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
              >
                {/* Tech Grid */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                  }}
                />

                {/* Header info */}
                <div className="z-10 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00D085]/15 border border-[#00D085]/40 text-[#00D085] mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>App Store & Google Play Mockup Studio</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
                </div>

                {/* Center Mockup - 100% natural, 0px offset, 0deg rotate */}
                <div className="flex-1 flex items-center justify-center z-10">
                  <img
                    src={imageSrc}
                    alt="Mockup"
                    className="max-h-[380px] w-auto object-contain"
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </div>

                {/* Footer Badges */}
                <div className="z-10 flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#00D085]" /> 100% Offline in Browser
                  </span>
                  <span className="font-extrabold text-[#00D085] px-2.5 py-1 rounded-lg bg-[#006636]/60 border border-[#00D085]/40">
                    PAY ONCE · OWN FOREVER
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
