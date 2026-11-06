"use client";

import { useState } from "react";
import { Check, Copy, Download, FileText, Package, Upload } from "lucide-react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";

// ============================================================================
// CARD 4: EXPORT DELIVERABLES & BACKUP (Real Application Actions)
// ============================================================================
export function ExportCard() {
  const [tab, setTab] = useState<"png" | "md" | "json">("png");
  const [pngFraming, setPngFraming] = useState<"frame" | "screen">("frame");
  const [pngResolution, setPngResolution] = useState<"2x" | "3x">("3x");
  const [copiedPng, setCopiedPng] = useState(false);
  const [downloadedPng, setDownloadedPng] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [downloadedMd, setDownloadedMd] = useState(false);
  const [downloadedJson, setDownloadedJson] = useState(false);

  const handleCopyPng = () => {
    setCopiedPng(true);
    setTimeout(() => setCopiedPng(false), 1800);
  };

  const handleDownloadPng = () => {
    setDownloadedPng(true);
    setTimeout(() => setDownloadedPng(false), 1800);
  };

  const handleCopyMd = () => {
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 1800);
  };

  const handleDownloadMd = () => {
    setDownloadedMd(true);
    setTimeout(() => setDownloadedMd(false), 1800);
  };

  const handleDownloadJson = () => {
    setDownloadedJson(true);
    setTimeout(() => setDownloadedJson(false), 1800);
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
            Export Deliverables &amp; Project Backup
          </h3>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          Export transparent 3x Retina PNG mockups, developer markdown (LISTING_METADATA.md), or full project backups (.json).
        </p>

        {/* Tab Switcher with Sliding Pill */}
        <div className="my-3.5">
          <SlidingTabs
            value={tab}
            onChange={(val) => setTab(val as "png" | "md" | "json")}
            className="w-full"
            ariaLabel="Export format tabs"
            options={[
              { value: "png", label: "Mockup Image" },
              { value: "md", label: "Metadata" },
              { value: "json", label: "Project File" },
            ]}
          />
        </div>

        {/* Interactive Visual Canvas matching Real App Actions */}
        <div className="rounded-xl bg-slate-100 dark:bg-[#141514] border border-slate-200/80 dark:border-white/[0.06] p-3 min-h-[142px] flex flex-col justify-center">
          {tab === "png" && (
            <div className="h-[118px] flex flex-col justify-between">
              <div className="space-y-2">
                {/* Framing & Resolution Radios */}
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPngFraming("frame")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        pngFraming === "frame"
                          ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Device Frame
                    </button>
                    <button
                      type="button"
                      onClick={() => setPngFraming("screen")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        pngFraming === "screen"
                          ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Screen Only
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPngResolution("2x")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        pngResolution === "2x"
                          ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      2x HD
                    </button>
                    <button
                      type="button"
                      onClick={() => setPngResolution("3x")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        pngResolution === "3x"
                          ? "bg-white dark:bg-[#25262a] text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      3x Ultra HD
                    </button>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1c1d1f] border border-black/5 dark:border-white/5 flex items-center justify-between text-[10.5px]">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{pngResolution === "3x" ? "3x Ultra HD" : "2x HD"} · {pngFraming === "frame" ? "Device Frame" : "Screen Only"} · Transparent</span>
                  </span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-bold shrink-0 ml-1">
                    .png
                  </span>
                </div>
              </div>

              {/* Action Buttons: Copy Image & Download PNG */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyPng}
                  className="py-1.5 px-2 rounded-lg bg-white dark:bg-[#1c1d1f] hover:bg-slate-50 dark:hover:bg-[#25262a] border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  {copiedPng ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="btn-dark w-full py-1.5 px-2 text-[11px]"
                >
                  {downloadedPng ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Downloaded!
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Download
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {tab === "md" && (
            <div className="h-[118px] flex flex-col justify-between">
              <div>
                {/* Header with Title & Badge */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>LISTING_METADATA.md</span>
                  </div>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                    .md
                  </span>
                </div>

                {/* Description with generous breathing space */}
                <p className="mt-2.5 text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complete store listing document with titles, subtitles, descriptions &amp; keywords.
                </p>
              </div>

              {/* Action Buttons: Copy to Clipboard & Download .md */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyMd}
                  className="py-1.5 px-2 rounded-lg bg-white dark:bg-[#1c1d1f] hover:bg-slate-50 dark:hover:bg-[#25262a] border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  {copiedMd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMd}
                  className="btn-dark w-full py-1.5 px-2 text-[11px]"
                >
                  {downloadedMd ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Exported!
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Export
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {tab === "json" && (
            <div className="h-[118px] flex flex-col justify-between">
              <div>
                {/* Header with Title & Badge */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    <span>store-preview-project.json</span>
                  </div>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold">
                    .json
                  </span>
                </div>

                {/* Description with generous breathing space */}
                <p className="mt-2.5 text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Save full backup of text, images &amp; settings locally in your browser.
                </p>
              </div>

              {/* Action Buttons: Import Preview & Export Project File */}
              <div className="grid grid-cols-2 gap-2">
                <div className="py-1.5 px-2 rounded-lg bg-white dark:bg-[#1c1d1f] border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 select-none opacity-85">
                  <Upload className="w-3.5 h-3.5" /> Import
                </div>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="btn-dark w-full py-1.5 px-2 text-[11px]"
                >
                  {downloadedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Exported!
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Export
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
