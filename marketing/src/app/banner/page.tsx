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
  const [badgeStyle, setBadgeStyle] = useState<"pills" | "dock">("pills");
  const [footerLeft, setFooterLeft] = useState("Ultra HD 4K Export");
  const [footerRight, setFooterRight] = useState("PAY ONCE · OWN FOREVER");
  const [footerButtonStyle, setFooterButtonStyle] = useState<"primary" | "white">("primary");
  
  // Brand Logo configuration
  const [showLogo, setShowLogo] = useState(true);
  const [logoPosition, setLogoPosition] = useState<"inline" | "above">("inline");
  
  // Device Headers row above mockups
  const [showDeviceHeaders, setShowDeviceHeaders] = useState(true);
  const [appleHeaderLabel, setAppleHeaderLabel] = useState("APP STORE · iPhone");
  const [googleHeaderLabel, setGoogleHeaderLabel] = useState("GOOGLE PLAY · Android");
  
  // Feature bullet points
  const [featureCount, setFeatureCount] = useState<4 | 5>(4);
  const [feature1Title, setFeature1Title] = useState("Instant Dual Previews");
  const [feature1Desc, setFeature1Desc] = useState("Side-by-side iOS & Android listings as you type");
  
  const [feature2Title, setFeature2Title] = useState("1-Click App Cloner");
  const [feature2Desc, setFeature2Desc] = useState("Instant competitor metadata & screenshot importing");
  
  const [feature3Title, setFeature3Title] = useState("Zero-Rejection Audit");
  const [feature3Desc, setFeature3Desc] = useState("Auto-check text limits & icon alpha compliance");
  
  const [feature4Title, setFeature4Title] = useState("Ready-to-Publish Export");
  const [feature4Desc, setFeature4Desc] = useState("Download crisp 3x Retina mockups & developer docs");

  const [feature5Title, setFeature5Title] = useState("Pay Once, Own Forever");
  const [feature5Desc, setFeature5Desc] = useState("Single-file browser studio · Zero recurring subscriptions");

  // Pricing configuration
  const [showPricing, setShowPricing] = useState(true);
  const [plusOriginalPrice, setPlusOriginalPrice] = useState("$39");
  const [plusPrice, setPlusPrice] = useState("$29");
  const [plusDesc, setPlusDesc] = useState("For indie developers and creators who need a fast, standalone offline preview studio.");
  const [plusLicenseBadge, setPlusLicenseBadge] = useState("Personal License");

  const [proOriginalPrice, setProOriginalPrice] = useState("$59");
  const [proPrice, setProPrice] = useState("$39");
  const [proDesc, setProDesc] = useState("For agencies, studios, and devs requiring commercial client licensing & full source code.");
  const [proLicenseBadge, setProLicenseBadge] = useState("Commercial License");

  // Mockup Asset
  const [imageSrc, setImageSrc] = useState("/banner-dual-mockup.svg");

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Helper to load html2canvas on demand (using local patched version to support modern CSS colors)
  const loadHtml2Canvas = async () => {
    // Always reload fresh - never use cached version (stale cache causes lab/oklch errors)
    return new Promise((resolve, reject) => {
      const oldScript = document.getElementById("html2canvas-script");
      if (oldScript) oldScript.remove();
      delete (window as any).html2canvas;
      delete (window as any).__patchedHtml2Canvas;

      const script = document.createElement("script");
      script.id = "html2canvas-script";
      script.src = "/html2canvas.min.js?v=" + Date.now();
      script.onload = () => {
        (window as any).__patchedHtml2Canvas = (window as any).html2canvas;
        resolve((window as any).html2canvas);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handleExport = async (scaleMultiplier: number = 2) => {
    if (!bannerRef.current) return;
    try {
      setIsExporting(true);

      // Snapshot the img element BEFORE html2canvas (getBoundingClientRect only valid while mounted)
      const imgEl = bannerRef.current.querySelector("img");
      const bannerRect = bannerRef.current.getBoundingClientRect();
      let imgSnapshot: {
        el: HTMLImageElement;
        dx: number;
        dy: number;
        dw: number;
        dh: number;
        clipX: number;
        clipY: number;
        clipW: number;
        clipH: number;
      } | null = null;
      if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
        const imgRect = imgEl.getBoundingClientRect();
        const clipParent = (imgEl.parentElement?.parentElement as HTMLElement) || bannerRef.current;
        const clipRect = clipParent.getBoundingClientRect();
        imgSnapshot = {
          el: imgEl,
          dx: (imgRect.left - bannerRect.left) * scaleMultiplier,
          dy: (imgRect.top - bannerRect.top) * scaleMultiplier,
          dw: imgRect.width * scaleMultiplier,
          dh: imgRect.height * scaleMultiplier,
          clipX: Math.max(0, (clipRect.left - bannerRect.left) * scaleMultiplier),
          clipY: Math.max(0, (clipRect.top - bannerRect.top) * scaleMultiplier),
          clipW: clipRect.width * scaleMultiplier,
          clipH: clipRect.height * scaleMultiplier,
        };
      }

      // PRE-PROCESS: Resolve "currentColor" on all SVG elements in the LIVE DOM
      // html2canvas serializes SVGs as <img src="data:image/svg+xml"> which loses CSS
      // inheritance — so we must bake in the actual color before capture
      const svgRestores: Array<{ el: SVGElement; attr: string; oldVal: string | null; newVal: string }> = [];
      bannerRef.current.querySelectorAll<SVGElement>("svg").forEach((svgEl) => {
        const computedColor = window.getComputedStyle(svgEl).color || "#ffffff";
        const allSvgEls: SVGElement[] = [svgEl, ...Array.from(svgEl.querySelectorAll<SVGElement>("*"))];
        allSvgEls.forEach((el) => {
          (["fill", "stroke"] as const).forEach((attr) => {
            const val = el.getAttribute(attr);
            if (val === "currentColor") {
              svgRestores.push({ el, attr, oldVal: val, newVal: computedColor });
              el.setAttribute(attr, computedColor);
            }
          });
        });
      });

      const html2canvas = (await loadHtml2Canvas()) as any;

      // Inline-replace all CSS variables and modern color functions in the cloned DOM
      // so html2canvas never encounters lab/oklch/color-mix which it cannot parse
      const canvas = await html2canvas(bannerRef.current, {
        scale: scaleMultiplier,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#131413",
        logging: false,
        onclone: (clonedDoc: Document) => {
          const iframeWin = (clonedDoc.defaultView || window) as any;
          const helperCanvas = document.createElement("canvas");
          helperCanvas.width = 1;
          helperCanvas.height = 1;
          const ctx2d = helperCanvas.getContext("2d");

          // Convert any modern color to a canvas-safe rgba string
          const toSafeColor = (val: string): string => {
            if (!val || typeof val !== "string") return val;
            const isModern = val.includes("lab(") || val.includes("oklch(") || val.includes("color-mix(") || val.includes("oklab(");
            if (!isModern) return val;
            if (!ctx2d) return "rgba(255,255,255,0.9)";
            try {
              ctx2d.clearRect(0, 0, 1, 1);
              ctx2d.fillStyle = val;
              ctx2d.fillRect(0, 0, 1, 1);
              const [r, g, b, a] = ctx2d.getImageData(0, 0, 1, 1).data;
              return `rgba(${r},${g},${b},${(a / 255).toFixed(3)})`;
            } catch {
              return "rgba(255,255,255,0.9)";
            }
          };

          // CRITICAL FIX: resolve "currentColor" inside SVG elements before html2canvas
          // serializes them — otherwise SVG icons lose all color in the exported PNG
          const resolveSvgCurrentColors = (svgEl: SVGElement) => {
            const parentColor = window.getComputedStyle(svgEl).color || "#ffffff";
            svgEl.querySelectorAll<SVGElement>("*").forEach((child) => {
              const fill = child.getAttribute("fill");
              const stroke = child.getAttribute("stroke");
              if (fill === "currentColor") {
                child.setAttribute("fill", parentColor);
              }
              if (stroke === "currentColor") {
                child.setAttribute("stroke", parentColor);
              }
            });
            // Also fix the root SVG fill/stroke
            const rootFill = svgEl.getAttribute("fill");
            if (rootFill === "currentColor") {
              svgEl.setAttribute("fill", parentColor);
            }
            const rootStroke = svgEl.getAttribute("stroke");
            if (rootStroke === "currentColor") {
              svgEl.setAttribute("stroke", parentColor);
            }
          };

          // Apply SVG fix to all SVGs in the cloned document
          clonedDoc.querySelectorAll<SVGElement>("svg").forEach(resolveSvgCurrentColors);

          // Hide cloned mockup img during html2canvas pass so we can draw it once at full native resolution
          if (imgSnapshot) {
            clonedDoc.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
              img.style.opacity = "0";
            });
          }

          // Walk all elements and sanitize inline styles (modern color values)
          clonedDoc.querySelectorAll<HTMLElement>("*").forEach((el) => {
            if (!el.style || el.style.length === 0) return;
            const props: string[] = [];
            for (let i = 0; i < el.style.length; i++) props.push(el.style[i]);
            props.forEach((prop) => {
              const raw = el.style.getPropertyValue(prop);
              const safe = toSafeColor(raw);
              if (safe !== raw) el.style.setProperty(prop, safe, el.style.getPropertyPriority(prop));
            });
          });

          // Patch getComputedStyle so html2canvas never reads back modern color values
          const origGCS = iframeWin.getComputedStyle;
          if (origGCS) {
            iframeWin.getComputedStyle = function (el: Element, pseudo?: string | null) {
              const cs = origGCS.call(iframeWin, el, pseudo);
              return new Proxy(cs, {
                get(target: any, prop: string | symbol) {
                  if (prop === "getPropertyValue") {
                    return (key: string) => toSafeColor(target.getPropertyValue(key));
                  }
                  const v = target[prop as string];
                  if (typeof v === "string") return toSafeColor(v);
                  return typeof v === "function" ? v.bind(target) : v;
                },
              });
            };
          }
        },
      });

      // RESTORE: Put "currentColor" back so live UI looks correct
      svgRestores.forEach(({ el, attr, oldVal }) => {
        if (oldVal !== null) el.setAttribute(attr, oldVal);
        else el.removeAttribute(attr);
      });

      // Overdraw the mockup image at full native/vector resolution (bypasses html2canvas downsampling)
      if (imgSnapshot) {
        try {
          await imgSnapshot.el.decode();
        } catch {
          // Ignore decode errors if already decoded
        }
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.save();
          // CRITICAL: html2canvas leaves ctx.scale(scale, scale) and ctx.translate(-x, -y) active on ctx!
          // Reset transform to identity matrix so coordinates are in physical canvas pixels.
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.beginPath();
          ctx.rect(imgSnapshot.clipX, imgSnapshot.clipY, imgSnapshot.clipW, imgSnapshot.clipH);
          ctx.clip();
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(
            imgSnapshot.el,
            imgSnapshot.dx,
            imgSnapshot.dy,
            imgSnapshot.dw,
            imgSnapshot.dh
          );
          ctx.restore();
        }
      }

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const filename = aspectMode === "cover"
        ? `store-preview-studio-gumroad-cover-${scaleMultiplier > 2 ? "4k" : "1280x720"}.png`
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
    setBadgeStyle("pills");
    setFooterLeft("Ultra HD 4K Export");
    setFooterRight("PAY ONCE · OWN FOREVER");
    setFooterButtonStyle("primary");
    setShowLogo(true);
    setLogoPosition("inline");
    setShowDeviceHeaders(true);
    setAppleHeaderLabel("APP STORE · iPhone");
    setGoogleHeaderLabel("GOOGLE PLAY · Android");
    setFeature1Title("Instant Dual Previews");
    setFeature1Desc("Side-by-side iOS & Android listings as you type");
    setFeature2Title("1-Click App Cloner");
    setFeature2Desc("Instant competitor metadata & screenshot importing");
    setFeature3Title("Zero-Rejection Audit");
    setFeature3Desc("Auto-check text limits & icon alpha channel compliance");
    setFeature4Title("4K Ultra HD Export");
    setFeature4Desc("Crisp 3x Retina mockups & LISTING_METADATA.md handoff");
    setFeature5Title("Zero Cloud & Private");
    setFeature5Desc("Single-file browser studio · Pay once, own forever with zero subs");
    setPlusOriginalPrice("$39");
    setPlusPrice("$29");
    setPlusDesc("For indie developers and creators who need a fast, standalone offline preview studio.");
    setPlusLicenseBadge("Personal License");
    setProOriginalPrice("$59");
    setProPrice("$39");
    setProDesc("For agencies, studios, and developers requiring commercial client licensing and full source code.");
    setProLicenseBadge("Commercial License");
    setImageSrc("/banner-dual-mockup.svg");
  };

  const renderBrandLogo = (size: number = 32, iconSize: number = 22) => (
    <div 
      className="rounded-xl flex items-center justify-center shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "linear-gradient(135deg, #1F211F 0%, #121312 100%)",
        border: "1.5px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      }}
    >
      <svg viewBox="0 0 100 100" width={iconSize} height={iconSize} className="block">
        <path
          d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
          fill="#006636"
        />
        <path
          d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
          fill="#00D085"
        />
      </svg>
    </div>
  );

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
                  <span>Upload Custom PNG/SVG...</span>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#989A99] mt-1">
                  File: <span className="text-white font-mono">banner-dual-mockup.svg</span> (Vector 4K)
                </p>
              </div>
            </div>
          </div>

          {/* Device Headers Control */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#989A99] block flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#00D085]" /> Device Headers (Cover)
              </label>
              <input
                type="checkbox"
                checked={showDeviceHeaders}
                onChange={(e) => setShowDeviceHeaders(e.target.checked)}
                className="accent-[#00D085] cursor-pointer"
              />
            </div>
            {showDeviceHeaders && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-[#7dd3fc] mb-1 block font-semibold">iOS Header</span>
                  <input
                    type="text"
                    value={appleHeaderLabel}
                    onChange={(e) => setAppleHeaderLabel(e.target.value)}
                    className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-[#7dd3fc]"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-[#6ee7b7] mb-1 block font-semibold">Android Header</span>
                  <input
                    type="text"
                    value={googleHeaderLabel}
                    onChange={(e) => setGoogleHeaderLabel(e.target.value)}
                    className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-[#6ee7b7]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Typography Controls */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#989A99] block flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#00D085]" /> Text & Copy Content
            </label>

            {/* Brand Logo Settings */}
            <div className="space-y-2 pb-1 border-b border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#989A99] font-medium">Brand Logo Squircle</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showLogoCheckbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="accent-[#00D085] cursor-pointer"
                  />
                  <label htmlFor="showLogoCheckbox" className="text-xs text-white font-medium cursor-pointer">
                    Hiển thị Logo
                  </label>
                </div>
              </div>

              {showLogo && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoPosition("inline")}
                    className={`text-[11px] py-1.5 rounded-md font-semibold border transition-all ${
                      logoPosition === "inline"
                        ? "bg-white/15 border-white/30 text-white shadow-xs"
                        : "bg-white/[0.04] border-white/5 text-[#989A99] hover:text-white"
                    }`}
                  >
                    Cạnh tiêu đề
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoPosition("above")}
                    className={`text-[11px] py-1.5 rounded-md font-semibold border transition-all ${
                      logoPosition === "above"
                        ? "bg-white/15 border-white/30 text-white shadow-xs"
                        : "bg-white/[0.04] border-white/5 text-[#989A99] hover:text-white"
                    }`}
                  >
                    Nằm phía trên
                  </button>
                </div>
              )}
            </div>

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

            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Badge Style</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBadgeStyle("pills")}
                  className={`text-[11px] py-1.5 rounded-md font-semibold border transition-all ${
                    badgeStyle === "pills"
                      ? "bg-white/15 border-white/30 text-white shadow-xs"
                      : "bg-white/[0.04] border-white/5 text-[#989A99] hover:text-white"
                  }`}
                >
                  3 Glass Pills
                </button>
                <button
                  type="button"
                  onClick={() => setBadgeStyle("dock")}
                  className={`text-[11px] py-1.5 rounded-md font-semibold border transition-all ${
                    badgeStyle === "dock"
                      ? "bg-white/15 border-white/30 text-white shadow-xs"
                      : "bg-white/[0.04] border-white/5 text-[#989A99] hover:text-white"
                  }`}
                >
                  Dock Island
                </button>
              </div>
            </div>

            {/* Thumbnail Footer Inputs */}
            <div className="space-y-2.5 pt-1 border-t border-white/5">
              <div>
                <span className="text-[11px] text-[#989A99] mb-1 block">Footer Trái (Thumbnail)</span>
                <input
                  type="text"
                  value={footerLeft}
                  onChange={(e) => setFooterLeft(e.target.value)}
                  placeholder="VD: Ultra HD 4K Export"
                  className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00D085]"
                />
              </div>

              <div>
                <span className="text-[11px] text-[#989A99] mb-1 block">Footer Phải (Thumbnail)</span>
                <input
                  type="text"
                  value={footerRight}
                  onChange={(e) => setFooterRight(e.target.value)}
                  placeholder="VD: PAY ONCE · OWN FOREVER"
                  className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#00D085]"
                />
              </div>

              <div>
                <span className="text-[11px] text-[#989A99] mb-1 block">Style nút Footer Phải</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFooterButtonStyle("primary")}
                    className={`text-[11px] py-1.5 rounded-md font-semibold border transition-all ${
                      footerButtonStyle === "primary"
                        ? "bg-[#006636] border-[#1B845E] text-white shadow-xs"
                        : "bg-white/[0.04] border-white/5 text-[#989A99] hover:text-white"
                    }`}
                  >
                    Primary Emerald
                  </button>
                  <button
                    type="button"
                    onClick={() => setFooterButtonStyle("white")}
                    className={`text-[11px] py-1.5 rounded-md font-semibold border transition-all ${
                      footerButtonStyle === "white"
                        ? "bg-[#EFF1F0] border-black/20 text-[#252625] shadow-xs"
                        : "bg-white/[0.04] border-white/5 text-[#989A99] hover:text-white"
                    }`}
                  >
                    White Button
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Layout Selector */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] text-[#989A99] font-medium">Bố cục tính năng</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setFeatureCount(4)}
                  className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${
                    featureCount === 4
                      ? "bg-[#00D085] text-black shadow-xs"
                      : "bg-white/5 text-[#989A99] hover:text-white"
                  }`}
                >
                  4 Mục (Dãn thoáng)
                </button>
                <button
                  type="button"
                  onClick={() => setFeatureCount(5)}
                  className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${
                    featureCount === 5
                      ? "bg-[#00D085] text-black shadow-xs"
                      : "bg-white/5 text-[#989A99] hover:text-white"
                  }`}
                >
                  5 Mục (Đầy đủ)
                </button>
              </div>
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

            {/* Feature 5 */}
            <div>
              <span className="text-[11px] text-[#989A99] mb-1 block">Feature 5 (Title + Desc)</span>
              <input
                type="text"
                value={feature5Title}
                onChange={(e) => setFeature5Title(e.target.value)}
                className="w-full text-xs bg-[#121312] border border-white/10 rounded-lg px-2.5 py-1.5 text-white mb-1 focus:outline-none focus:border-[#00D085]"
              />
              <input
                type="text"
                value={feature5Desc}
                onChange={(e) => setFeature5Desc(e.target.value)}
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
                  <div className="flex items-center gap-2.5 mb-3.5">
                    {badgeStyle === "dock" ? (
                      /* Segmented Dock Island Style (100% Trademark-Safe Custom Vectors) */
                      <div 
                        className="inline-flex items-center p-1 rounded-full"
                        style={{
                          backgroundColor: "rgba(24, 25, 24, 0.95)",
                          border: "1px solid rgba(255, 255, 255, 0.14)",
                          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3)"
                        }}
                      >
                        {/* Apple Store */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0 block">
                            <path d="M12.5 2.5c-.3 1.8 1 3.2 2.5 3.5.3-1.6-.9-3.2-2.5-3.5z" />
                            <path d="M12 7c-1.2 0-2.2.7-3.2.7s-2.1-.7-3.3-.7C3.6 7 2 8.7 2 12c0 3.7 2.3 8 4.7 8 1.2 0 1.9-.8 3.3-.8s2.1.8 3.3.8c2.4 0 4.7-4.3 4.7-8 0-3.3-1.6-5-3.5-5-1.2 0-2.3.7-3.3.7S13.2 7 12 7z" />
                          </svg>
                          <span className="leading-none">App Store</span>
                        </div>
                        <div className="w-px h-3.5 mx-0.5" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }} />
                        {/* Google Play */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0 block">
                            <path d="M6 3.5C6 2.4 7.2 1.7 8.2 2.3L20 10.8C20.9 11.4 20.9 12.6 20 13.2L8.2 21.7C7.2 22.3 6 21.6 6 20.5V3.5Z" />
                          </svg>
                          <span className="leading-none">Google Play</span>
                        </div>
                        <div className="w-px h-3.5 mx-0.5" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }} />
                        {/* Client-side */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#00D085] shrink-0 block" />
                          <span className="leading-none">{badgeText}</span>
                        </div>
                      </div>
                    ) : (
                      /* Distinct Elevated Rich Pills */
                      <>
                        {/* Apple Store Pill */}
                        <div 
                          className="h-[32px] px-3.5 rounded-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white tracking-wide shrink-0 transition-all"
                          style={{
                            background: "linear-gradient(180deg, #132D54 0%, #0B1C36 100%)",
                            border: "1px solid rgba(59, 130, 246, 0.65)",
                            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 2px 6px rgba(0, 0, 0, 0.4)"
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#93C5FD" className="shrink-0 block">
                            <path d="M12.5 2.5c-.3 1.8 1 3.2 2.5 3.5.3-1.6-.9-3.2-2.5-3.5z" />
                            <path d="M12 7c-1.2 0-2.2.7-3.2.7s-2.1-.7-3.3-.7C3.6 7 2 8.7 2 12c0 3.7 2.3 8 4.7 8 1.2 0 1.9-.8 3.3-.8s2.1.8 3.3.8c2.4 0 4.7-4.3 4.7-8 0-3.3-1.6-5-3.5-5-1.2 0-2.3.7-3.3.7S13.2 7 12 7z" />
                          </svg>
                          <span className="leading-none">App Store</span>
                        </div>

                        {/* Google Play Pill */}
                        <div 
                          className="h-[32px] px-3.5 rounded-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white tracking-wide shrink-0 transition-all"
                          style={{
                            background: "linear-gradient(180deg, #093E28 0%, #052618 100%)",
                            border: "1px solid rgba(16, 185, 129, 0.65)",
                            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 2px 6px rgba(0, 0, 0, 0.4)"
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#34D399" className="shrink-0 block">
                            <path d="M6 3.5C6 2.4 7.2 1.7 8.2 2.3L20 10.8C20.9 11.4 20.9 12.6 20 13.2L8.2 21.7C7.2 22.3 6 21.6 6 20.5V3.5Z" />
                          </svg>
                          <span className="leading-none">Google Play</span>
                        </div>

                        {/* Client Side Pill */}
                        <div 
                          className="h-[32px] px-3.5 rounded-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white tracking-wide shrink-0 transition-all"
                          style={{
                            background: "linear-gradient(180deg, #242629 0%, #151618 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.4)"
                          }}
                        >
                          <ShieldCheck className="w-[14px] h-[14px] text-[#00D085] shrink-0 block" />
                          <span className="leading-none">{badgeText}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex items-center gap-3.5 mb-1.5">
                    {showLogo && renderBrandLogo(38, 26)}
                    <h1 className="text-[40px] font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
                      {title}
                    </h1>
                  </div>
                  <p className="text-[16px] font-medium text-[#989A99] mb-4 leading-snug">
                    {subtitle}
                  </p>

                  {/* Feature Items (Spacious & Optically Centered) */}
                  <div className={`${featureCount === 4 ? "space-y-4" : "space-y-3"} mb-3.5`}>
                    {/* Item 1 */}
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "rgba(56, 189, 248, 0.14)",
                          border: "1.5px solid rgba(56, 189, 248, 0.45)",
                          color: "#38bdf8"
                        }}
                      >
                        <Smartphone className="w-[18px] h-[18px] shrink-0 block" />
                      </div>
                      <div className="text-[13.5px] leading-snug">
                        <strong className="text-white font-bold tracking-tight">{feature1Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature1Desc}</span>
                      </div>
                    </div>

                    {/* Item 2 (Shown if 5 items) */}
                    {featureCount === 5 && (
                      <div className="flex items-center gap-3.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: "rgba(168, 85, 247, 0.14)",
                            border: "1.5px solid rgba(168, 85, 247, 0.45)",
                            color: "#a855f7"
                          }}
                        >
                          <Sparkles className="w-[18px] h-[18px] shrink-0 block" />
                        </div>
                        <div className="text-[13.5px] leading-snug">
                          <strong className="text-white font-bold tracking-tight">{feature2Title}</strong>
                          <span className="text-[#989A99] font-normal"> — {feature2Desc}</span>
                        </div>
                      </div>
                    )}

                    {/* Item 3 */}
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "rgba(0, 208, 133, 0.14)",
                          border: "1.5px solid rgba(0, 208, 133, 0.45)",
                          color: "#00D085"
                        }}
                      >
                        <ShieldCheck className="w-[18px] h-[18px] shrink-0 block" />
                      </div>
                      <div className="text-[13.5px] leading-snug">
                        <strong className="text-white font-bold tracking-tight">{feature3Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature3Desc}</span>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "rgba(245, 158, 11, 0.14)",
                          border: "1.5px solid rgba(245, 158, 11, 0.45)",
                          color: "#f59e0b"
                        }}
                      >
                        <Zap className="w-[18px] h-[18px] shrink-0 block" />
                      </div>
                      <div className="text-[13.5px] leading-snug">
                        <strong className="text-white font-bold tracking-tight">{feature4Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature4Desc}</span>
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div className="flex items-center gap-3.5">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "rgba(244, 63, 94, 0.14)",
                          border: "1.5px solid rgba(244, 63, 94, 0.45)",
                          color: "#f43f5e"
                        }}
                      >
                        <Lock className="w-[18px] h-[18px] shrink-0 block" />
                      </div>
                      <div className="text-[13.5px] leading-snug">
                        <strong className="text-white font-bold tracking-tight">{feature5Title}</strong>
                        <span className="text-[#989A99] font-normal"> — {feature5Desc}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Cards Footer (Strict Mathematical Alignment Across Cards) */}
                  {showPricing && (
                    <div className="grid grid-cols-2 gap-3.5 mt-auto pt-1">
                      {/* Plus Tier Card */}
                      <div 
                        className="relative rounded-[20px] p-4 flex flex-col justify-between overflow-hidden h-[154px]"
                        style={{
                          backgroundColor: "#1D1E1D",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)"
                        }}
                      >
                        {/* Top hairline accent line */}
                        <div 
                          className="absolute top-0 inset-x-0 h-[2px] rounded-t-[20px]" 
                          style={{
                            background: "linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), transparent)"
                          }}
                        />

                        {/* Top info section */}
                        <div>
                          {/* Header row: Title on left, License Scope on right */}
                          <div className="h-[26px] flex items-center justify-between gap-1.5 mb-1.5">
                            <h3 className="text-[17.5px] font-bold tracking-tight text-white shrink-0 leading-none">
                              Plus Edition
                            </h3>
                            <span 
                              className="h-[22px] inline-flex items-center justify-center text-[10px] font-medium tracking-normal text-[#94a3b8] px-2.5 rounded-md shrink-0 leading-none"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.12)"
                              }}
                            >
                              <span className="leading-none">{plusLicenseBadge}</span>
                            </span>
                          </div>

                          {/* Fixed height description container so both cards align horizontally */}
                          <p className="h-[34px] text-[11.5px] text-[#94a3b8] leading-[1.4] overflow-hidden">
                            {plusDesc}
                          </p>
                        </div>

                        {/* Price Display: Pinned to bottom baseline */}
                        <div 
                          className="flex items-baseline gap-2 pt-2.5 leading-none"
                          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
                        >
                          <span className="text-[18px] font-bold text-[#64748b] line-through tracking-tight leading-none">
                            {plusOriginalPrice}
                          </span>
                          <span className="text-[34px] font-black text-white leading-none tracking-[-0.03em]">
                            {plusPrice}
                          </span>
                          <span className="text-[11px] font-medium text-[#94a3b8] ml-0.5 whitespace-nowrap leading-none">
                            one-time payment
                          </span>
                        </div>
                      </div>

                      {/* Pro Studio Tier Card */}
                      <div 
                        className="relative rounded-[20px] p-4 flex flex-col justify-between overflow-hidden h-[154px]"
                        style={{
                          backgroundColor: "#1D1E1D",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)"
                        }}
                      >
                        {/* Top hairline accent line with Supabase emerald gradient */}
                        <div 
                          className="absolute top-0 inset-x-0 h-[2.5px] rounded-t-[20px]" 
                          style={{
                            background: "linear-gradient(to right, #00D085, #34d399, transparent)"
                          }}
                        />

                        {/* Top info section */}
                        <div>
                          {/* Header row: Title on left, License Scope on right */}
                          <div className="h-[26px] flex items-center justify-between gap-1.5 mb-1.5">
                            <h3 className="text-[17.5px] font-bold tracking-tight text-white shrink-0 leading-none">
                              Pro Studio
                            </h3>
                            <span 
                              className="h-[22px] inline-flex items-center justify-center gap-1.5 text-[10px] font-semibold tracking-normal text-[#e2e8f0] px-2.5 rounded-md shrink-0 leading-none"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.15)"
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.6)] shrink-0 block" />
                              <span className="leading-none">{proLicenseBadge}</span>
                            </span>
                          </div>

                          {/* Fixed height description container so both cards align horizontally */}
                          <p className="h-[34px] text-[11.5px] text-[#94a3b8] leading-[1.4] overflow-hidden">
                            {proDesc}
                          </p>
                        </div>

                        {/* Price Display: Pinned to bottom baseline */}
                        <div 
                          className="flex items-baseline gap-2 pt-2.5 leading-none"
                          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
                        >
                          <span className="text-[18px] font-bold text-[#64748b] line-through tracking-tight leading-none">
                            {proOriginalPrice}
                          </span>
                          <span className="text-[34px] font-black text-white leading-none tracking-[-0.03em]">
                            {proPrice}
                          </span>
                          <span className="text-[11px] font-medium text-[#94a3b8] ml-0.5 whitespace-nowrap leading-none">
                            one-time payment
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column (Visual Dual Mockup Frame with Store Device Labels) */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 overflow-hidden">
                  {showDeviceHeaders && (
                    <div className="w-full flex items-center justify-between mb-2 px-3 max-w-[580px]">
                      <div className="w-1/2 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold tracking-wider text-[#7dd3fc]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#7dd3fc" className="shrink-0 block">
                          <path d="M12.5 2.5c-.3 1.8 1 3.2 2.5 3.5.3-1.6-.9-3.2-2.5-3.5z" />
                          <path d="M12 7c-1.2 0-2.2.7-3.2.7s-2.1-.7-3.3-.7C3.6 7 2 8.7 2 12c0 3.7 2.3 8 4.7 8 1.2 0 1.9-.8 3.3-.8s2.1.8 3.3.8c2.4 0 4.7-4.3 4.7-8 0-3.3-1.6-5-3.5-5-1.2 0-2.3.7-3.3.7S13.2 7 12 7z" />
                        </svg>
                        <span className="leading-none">{appleHeaderLabel}</span>
                      </div>
                      <div className="w-1/2 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold tracking-wider text-[#6ee7b7]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#6ee7b7" className="shrink-0 block">
                          <path d="M6 3.5C6 2.4 7.2 1.7 8.2 2.3L20 10.8C20.9 11.4 20.9 12.6 20 13.2L8.2 21.7C7.2 22.3 6 21.6 6 20.5V3.5Z" />
                        </svg>
                        <span className="leading-none">{googleHeaderLabel}</span>
                      </div>
                    </div>
                  )}

                  <div className="relative flex items-center justify-center">
                    <img
                      src={imageSrc}
                      alt="Store Preview Studio Dual Mockup"
                      className="max-h-[580px] max-w-full w-auto object-contain"
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
                className="relative bg-[#131413] rounded-2xl overflow-hidden p-6 flex flex-col justify-between select-none border border-[#282928] shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
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
                <div className="z-10 text-center pt-1">
                  {/* Store Badges / Pill (Row 1) */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {badgeStyle === "dock" ? (
                      /* Segmented Dock Island Style */
                      <div 
                        className="inline-flex items-center p-1 rounded-full"
                        style={{
                          backgroundColor: "rgba(24, 25, 24, 0.95)",
                          border: "1px solid rgba(255, 255, 255, 0.14)",
                          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3)"
                        }}
                      >
                        {/* Apple Store */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold text-white">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0 block">
                            <path d="M12.5 2.5c-.3 1.8 1 3.2 2.5 3.5.3-1.6-.9-3.2-2.5-3.5z" />
                            <path d="M12 7c-1.2 0-2.2.7-3.2.7s-2.1-.7-3.3-.7C3.6 7 2 8.7 2 12c0 3.7 2.3 8 4.7 8 1.2 0 1.9-.8 3.3-.8s2.1.8 3.3.8c2.4 0 4.7-4.3 4.7-8 0-3.3-1.6-5-3.5-5-1.2 0-2.3.7-3.3.7S13.2 7 12 7z" />
                          </svg>
                          <span className="leading-none">App Store</span>
                        </div>
                        <div className="w-px h-3 mx-0.5" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }} />
                        {/* Google Play */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold text-white">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0 block">
                            <path d="M6 3.5C6 2.4 7.2 1.7 8.2 2.3L20 10.8C20.9 11.4 20.9 12.6 20 13.2L8.2 21.7C7.2 22.3 6 21.6 6 20.5V3.5Z" />
                          </svg>
                          <span className="leading-none">Google Play</span>
                        </div>
                        <div className="w-px h-3 mx-0.5" style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }} />
                        {/* Client-side */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold text-white">
                          <ShieldCheck className="w-3 h-3 text-[#00D085] shrink-0 block" />
                          <span className="leading-none">{badgeText}</span>
                        </div>
                      </div>
                    ) : (
                      /* Distinct Elevated Rich Pills */
                      <>
                        {/* Apple Store Pill */}
                        <div 
                          className="h-[26px] px-2.5 rounded-full inline-flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-white tracking-wide shrink-0 transition-all"
                          style={{
                            background: "linear-gradient(180deg, #132D54 0%, #0B1C36 100%)",
                            border: "1px solid rgba(59, 130, 246, 0.65)",
                            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 2px 6px rgba(0, 0, 0, 0.4)"
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="#93C5FD" className="shrink-0 block">
                            <path d="M12.5 2.5c-.3 1.8 1 3.2 2.5 3.5.3-1.6-.9-3.2-2.5-3.5z" />
                            <path d="M12 7c-1.2 0-2.2.7-3.2.7s-2.1-.7-3.3-.7C3.6 7 2 8.7 2 12c0 3.7 2.3 8 4.7 8 1.2 0 1.9-.8 3.3-.8s2.1.8 3.3.8c2.4 0 4.7-4.3 4.7-8 0-3.3-1.6-5-3.5-5-1.2 0-2.3.7-3.3.7S13.2 7 12 7z" />
                          </svg>
                          <span className="leading-none">App Store</span>
                        </div>

                        {/* Google Play Pill */}
                        <div 
                          className="h-[26px] px-2.5 rounded-full inline-flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-white tracking-wide shrink-0 transition-all"
                          style={{
                            background: "linear-gradient(180deg, #093E28 0%, #052618 100%)",
                            border: "1px solid rgba(16, 185, 129, 0.65)",
                            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 2px 6px rgba(0, 0, 0, 0.4)"
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#34D399" className="shrink-0 block">
                            <path d="M6 3.5C6 2.4 7.2 1.7 8.2 2.3L20 10.8C20.9 11.4 20.9 12.6 20 13.2L8.2 21.7C7.2 22.3 6 21.6 6 20.5V3.5Z" />
                          </svg>
                          <span className="leading-none">Google Play</span>
                        </div>

                        {/* Client Side Pill */}
                        <div 
                          className="h-[26px] px-2.5 rounded-full inline-flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-white tracking-wide shrink-0 transition-all"
                          style={{
                            background: "linear-gradient(180deg, #242629 0%, #151618 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.4)"
                          }}
                        >
                          <ShieldCheck className="w-3 h-3 text-[#00D085] shrink-0 block" />
                          <span className="leading-none">{badgeText}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Brand Logo Centered Above Title (if selected) */}
                  {showLogo && logoPosition === "above" && (
                    <div className="flex justify-center mb-3">
                      {renderBrandLogo(36, 24)}
                    </div>
                  )}

                  {/* Title row (Row 2, with inline logo if selected) */}
                  <div className="flex items-center justify-center gap-3 mb-2.5">
                    {showLogo && logoPosition === "inline" && renderBrandLogo(32, 22)}
                    <h2 className="text-[25px] font-black text-white tracking-tight leading-none drop-shadow-md">
                      {title}
                    </h2>
                  </div>

                  {/* Subtitle (Row 3) */}
                  <p className="text-[13.5px] font-medium text-[#989A99] max-w-[480px] mx-auto leading-relaxed mb-2">
                    {subtitle}
                  </p>
                </div>

                {/* Center Mockup - 100% natural, 0px offset, 0deg rotate */}
                <div className="flex-1 flex items-center justify-center z-10 overflow-hidden my-auto py-1">
                  <img
                    src={imageSrc}
                    alt="Store Preview Studio Dual Mockup"
                    className="max-h-[315px] max-w-full w-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Footer Badges */}
                <div 
                  className="z-10 flex items-center justify-between pt-3.5 text-xs"
                  style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
                >
                  <div 
                    className="inline-flex items-center text-xs font-bold text-white select-none"
                    style={{ color: "#ffffff" }}
                  >
                    <Sparkles 
                      className="w-4 h-4 text-[#00D085] shrink-0 block mr-2" 
                      style={{ color: "#00D085", width: "16px", height: "16px" }} 
                    />
                    <span 
                      style={{ color: "#ffffff", display: "inline-block", fontSize: "12px", lineHeight: "16px" }}
                      className="font-bold text-white tracking-normal"
                    >
                      {footerLeft}
                    </span>
                  </div>
                  {footerButtonStyle === "primary" ? (
                    <span 
                      className="text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-[9px] text-white leading-none inline-flex items-center justify-center shadow-md transition-all select-none"
                      style={{
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 100%), #006636",
                        border: "1px solid #1B845E",
                        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 2px 8px rgba(0, 0, 0, 0.35)",
                        color: "#ffffff"
                      }}
                    >
                      {footerRight}
                    </span>
                  ) : (
                    <span 
                      className="btn-white text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-[9px] shadow-sm leading-none"
                      style={{
                        backgroundColor: "#EFF1F0",
                        color: "#252625",
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)"
                      }}
                    >
                      {footerRight}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
