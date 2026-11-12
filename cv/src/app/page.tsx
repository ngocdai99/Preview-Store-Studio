"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Printer, ArrowLeft } from "lucide-react";
import { DeviceThemeSwitch } from "@/components/DeviceThemeSwitch";

// Printable A4 height at 96 DPI with 7.5mm top & bottom page margins: (297 - 15) / 25.4 * 96 ≈ 1066px
const A4_SHEET_WIDTH_PX = 794;
const A4_SHEET_HEIGHT_PX = 1123;
const A4_PRINTABLE_HEIGHT_PX = 1066;

type PageMetric = {
  height: number;
  pct: number;
  overflowPx: number;
};

interface A4SheetProps {
  pageNumber: number;
  totalPages: number;
  isDark: boolean;
  metric: PageMetric | null;
  contentRef: React.RefObject<HTMLDivElement | null>;
  breakBefore?: boolean;
  children: React.ReactNode;
}

/** Renders an A4 page container on screen with fit diagnostics and clean print page breaks. */
function A4Sheet({
  pageNumber,
  totalPages,
  isDark,
  metric,
  contentRef,
  breakBefore = false,
  children,
}: A4SheetProps) {
  return (
    <div className={breakBefore ? "cv-page-break" : undefined}>
      <div
        className={`no-print hidden sm:flex items-center justify-between text-[11px] font-mono px-0.5 mb-1.5 ${
          isDark ? "text-[#989A99]" : "text-slate-500"
        }`}
      >
        <span>
          Page {pageNumber} of {totalPages} · A4 ({A4_SHEET_WIDTH_PX} ×{" "}
          {A4_SHEET_HEIGHT_PX}px)
        </span>
        {metric && (
          <span
            className={
              metric.overflowPx > 0 ? "text-amber-500 font-medium" : undefined
            }
          >
            {metric.overflowPx > 0
              ? `Overflow +${metric.overflowPx}px (${metric.height}/${A4_PRINTABLE_HEIGHT_PX}px)`
              : `Fits A4 · ${metric.pct}% (${metric.height}/${A4_PRINTABLE_HEIGHT_PX}px)`}
          </span>
        )}
      </div>

      <article
        className={`cv-page relative w-full sm:min-h-[1123px] px-5 py-6 sm:px-[34px] sm:py-[28px] shadow-2xl rounded-sm overflow-hidden font-sans text-[12px] leading-[1.45] transition-colors duration-200 ${
          isDark
            ? "bg-[#181918] text-[#c2c5c3] border border-[#282928]"
            : "bg-white text-black border border-slate-200/80"
        }`}
      >
        {metric && metric.overflowPx > 0 && (
          <div
            aria-hidden="true"
            className="no-print pointer-events-none absolute inset-x-0 border-t border-dashed border-amber-500/80 z-10 hidden sm:flex justify-end pr-2"
            style={{ top: `${A4_SHEET_HEIGHT_PX}px` }}
          >
            <span
              className={`text-[10px] font-mono text-amber-500 -mt-4 px-1 ${
                isDark ? "bg-[#181918]" : "bg-white"
              }`}
            >
              A4 page {pageNumber} bottom limit
            </span>
          </div>
        )}

        <div ref={contentRef}>{children}</div>
      </article>
    </div>
  );
}

export default function CVPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const page1ContentRef = useRef<HTMLDivElement>(null);
  const page2ContentRef = useRef<HTMLDivElement>(null);
  const [pageMetrics, setPageMetrics] = useState<{
    p1: PageMetric | null;
    p2: PageMetric | null;
  }>({ p1: null, p2: null });

  const isDark = theme === "dark";

  useEffect(() => {
    const measure = () => {
      if (window.innerWidth < 640) {
        setPageMetrics({ p1: null, p2: null });
        return;
      }
      const calc = (el: HTMLDivElement | null): PageMetric | null => {
        if (!el) return null;
        const height = Math.round(el.getBoundingClientRect().height);
        const pct = Math.round((height / A4_PRINTABLE_HEIGHT_PX) * 100);
        const overflowPx = Math.max(0, height - A4_PRINTABLE_HEIGHT_PX);
        return { height, pct, overflowPx };
      };
      setPageMetrics({
        p1: calc(page1ContentRef.current),
        p2: calc(page2ContentRef.current),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (page1ContentRef.current) ro.observe(page1ContentRef.current);
    if (page2ContentRef.current) ro.observe(page2ContentRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Blue hyperlink matching Apple App Store / Google Play guidelines
  const storeLinkStyle = isDark
    ? "cv-print-link text-[#3B82F6] hover:text-[#60A5FA] font-medium underline transition-colors"
    : "cv-print-link text-[#0071E3] hover:text-[#0058B0] font-medium underline transition-colors";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      const prevTitle = document.title;
      document.title = "CV_Bui_Ngoc_Dai_Flutter";
      window.addEventListener(
        "afterprint",
        () => {
          document.title = prevTitle;
        },
        { once: true }
      );
      window.print();
    }
  };

  return (
    <div
      className={`cv-print-wrapper min-h-screen py-4 sm:py-8 px-2 sm:px-4 transition-colors duration-200 ${
        isDark ? "bg-[#101110] text-[#EDEDED]" : "bg-[#F3F4F6] text-black"
      }`}
    >
      {/* Top Floating Control Bar (Hidden when printing) */}
      <header className="no-print max-w-[794px] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <a
          href="https://kaidevlabs.pages.dev"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
            isDark
              ? "bg-[#1D1E1D] text-[#EDEDED] border-[#282928] hover:bg-[#252625]"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#989A99]" />
          <span>Back to Portfolio</span>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          {/* Device Theme Switcher (Light & Dark UI) */}
          <DeviceThemeSwitch value={theme} onChange={setTheme} />

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006636] text-white hover:bg-[#007a41] border border-[#1B845E] transition-colors font-medium shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </header>

      {/* Main A4 Pages Container */}
      <main className="cv-print-sheets max-w-[794px] mx-auto space-y-7">
        <A4Sheet
          pageNumber={1}
          totalPages={2}
          isDark={isDark}
          metric={pageMetrics.p1}
          contentRef={page1ContentRef}
        >
          {/* Document Header */}
          <section
            className={`cv-print-header pb-3 sm:pb-[7px] flex items-center justify-between gap-5 border-b ${
              isDark
                ? "text-white border-[#282928]"
                : "text-black border-slate-200"
            }`}
          >
          <div className="flex-1">
            <h1
              className={`cv-print-text text-2xl sm:text-[28px] font-bold tracking-tight uppercase leading-none ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Bui Ngoc Dai
            </h1>
            <p
              className={`cv-print-text text-[13px] font-semibold tracking-wider uppercase mt-1.5 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Mobile Developer | Flutter &amp; React Native
            </p>
            <div
              className={`cv-print-muted mt-2 flex flex-wrap items-center gap-2 text-[12px] ${
                isDark ? "text-[#989A99]" : "text-black"
              }`}
            >
              <span>HCM, Vietnam</span>
              <span>•</span>
              <a
                href="tel:0868441273"
                className={`transition-colors hover:underline ${
                  isDark ? "hover:text-white" : "hover:text-black"
                }`}
              >
                0868441273
              </a>
              <span>•</span>
              <a
                href="mailto:ngocdaibui99@gmail.com"
                className={`transition-colors hover:underline ${
                  isDark ? "hover:text-white" : "hover:text-black"
                }`}
              >
                ngocdaibui99@gmail.com
              </a>
              <span>•</span>
              <a
                href="https://kaidevlabs.pages.dev/"
                target="_blank"
                rel="noreferrer"
                className={storeLinkStyle}
              >
                Portfolio
              </a>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={`cv-print-avatar relative w-18 h-18 sm:w-19 sm:h-19 rounded-full overflow-hidden border ${
                isDark
                  ? "border-[#282928] bg-[#1D1E1D]"
                  : "border-slate-200 bg-slate-100"
              }`}
            >
              <Image
                src="/avatar.png"
                alt="Bui Ngoc Dai"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </section>

        {/* Page 1 Body */}
        <div className="cv-print-body cv-print-sections pt-2.5 sm:pt-[7px] space-y-3.5">
          {/* Summary */}
          <section>
            <h2
              className={`cv-print-title text-[13.5px] font-bold tracking-wider uppercase pb-0.5 border-b-[1.5px] mb-1.5 ${
                isDark
                  ? "text-white border-[#383a38]"
                  : "text-[#006636] border-[#006636]"
              }`}
            >
              Summary
            </h2>
            <p
              className={`cv-print-text leading-relaxed text-justify ${
                isDark ? "text-[#c2c5c3]" : "text-black"
              }`}
            >
              Mobile Developer with 2 years of production experience building,
              maintaining, and upgrading Flutter and React Native apps in
              healthcare, education, social networking, and travel. Owns the
              full app lifecycle: shipping from scratch to App Store and Google
              Play, managing releases and store rejections, large-scale upgrades
              (React Native New Architecture), and fixing performance issues on
              low-end devices.
            </p>
          </section>

          {/* Technical Skills Table */}
          <section>
            <h2
              className={`cv-print-title text-[13.5px] font-bold tracking-wider uppercase pb-0.5 border-b-[1.5px] mb-1.5 ${
                isDark
                  ? "text-white border-[#383a38]"
                  : "text-[#006636] border-[#006636]"
              }`}
            >
              Technical Skills
            </h2>
            <div
              className={`cv-print-table border overflow-hidden text-[12px] ${
                isDark ? "border-[#282928]" : "border-[#006636]/25"
              }`}
            >
              {[
                {
                  category: "Languages",
                  items: "Dart, TypeScript, JavaScript, Kotlin, Java",
                },
                {
                  category: "Frameworks",
                  items: "Flutter, React Native (New Architecture & Legacy)",
                },
                {
                  category: "Architecture & State",
                  items: "Clean Architecture, MVVM, Riverpod, Redux, Redux-Saga",
                },
                {
                  category: "Testing",
                  items: "Unit testing",
                },
                {
                  category: "APIs & Integrations",
                  items: "RESTful API, WebSocket, Google Maps",
                },
                {
                  category: "Release & Monitoring",
                  items:
                    "Store releases, Fastlane, Codemagic, Firebase (FCM, Remote Config, Crashlytics), Sentry",
                },
                {
                  category: "Performance",
                  items:
                    "Memory leak analysis, Android Studio Profiler, Layout Bounds, HWUI Rendering",
                },
                {
                  category: "Tools",
                  items: "Git, Figma, Jira",
                },
              ].map((row, idx, arr) => (
                <div
                  key={row.category}
                  className={`cv-print-table-row grid grid-cols-[165px_1fr] sm:grid-cols-[180px_1fr] ${
                    idx < arr.length - 1
                      ? isDark
                        ? "border-b border-[#282928]"
                        : "border-b border-[#006636]/20"
                      : ""
                  }`}
                >
                  <div
                    className={`cv-print-table-cat font-semibold px-3 py-1.5 border-r flex items-center ${
                      isDark
                        ? "bg-[#202220] text-[#EDEDED] border-[#282928]"
                        : `${
                            idx % 2 === 0 ? "bg-[#EAF5EF]" : "bg-[#F2F8F4]"
                          } text-black border-[#006636]/20 font-bold`
                    }`}
                  >
                    {row.category}
                  </div>
                  <div
                    className={`cv-print-table-val px-3 py-1.5 flex items-center ${
                      isDark
                        ? "bg-[#1A1B1A] text-[#d3d6d4]"
                        : "bg-white text-black"
                    }`}
                  >
                    {row.items}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section>
            <h2
              className={`cv-print-title text-[13.5px] font-bold tracking-wider uppercase pb-0.5 border-b-[1.5px] mb-1.5 ${
                isDark
                  ? "text-white border-[#383a38]"
                  : "text-[#006636] border-[#006636]"
              }`}
            >
              Work Experience
            </h2>

            {/* Sunshine Software */}
            <div className="cv-print-company cv-print-company-gap cv-print-keep-next flex items-baseline justify-between gap-2 mb-2 font-bold text-[12.5px]">
              <span
                className={`cv-print-text ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                SUNSHINE SOFTWARE — Ho Chi Minh City, Vietnam | Mobile Developer
              </span>
              <span
                className={`cv-print-muted cv-print-date text-[12px] font-medium shrink-0 ${
                  isDark ? "text-[#989A99]" : "text-black"
                }`}
              >
                12/2024 – Present
              </span>
            </div>

            <div className="cv-print-projects space-y-3.5 pl-0.5">
              {/* Project 1: AVN PMS */}
              <div>
                <h3
                  className={`cv-print-text font-bold text-[12.5px] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  1. Sức khoẻ Gia Đình Việt (AVN PMS) – Ajinomoto Vietnam
                </h3>
                <div
                  className={`cv-print-submeta cv-print-keep-next text-[12px] mt-0.5 mb-1.5 flex flex-wrap items-center gap-1.5 ${
                    isDark ? "text-[#989A99]" : "text-black"
                  }`}
                >
                  <a
                    href="https://apps.apple.com/vn/app/avn-pms/id6766154421?l=vi"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    App Store
                  </a>
                  <span>|</span>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.avn.pms.app&hl=vi"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    Google Play
                  </a>
                  <span>•</span>
                  <span>Sole Mobile Developer (Flutter, Clean Architecture, Riverpod)</span>
                </div>

                <ul
                  className={`list-disc pl-4 space-y-1 text-[12px] leading-[1.55] ${
                    isDark ? "text-[#c2c5c3]" : "text-black"
                  }`}
                >
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Clean Architecture Migration:
                    </strong>{" "}
                    Refactored 8+ core modules (130K+ LOC) from MVVM to Clean
                    Architecture with Riverpod and Result pattern; wrote a
                    Bash/Batch scaffolding script to standardize the
                    Domain/Data/Presentation structure across the team.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Startup &amp; Runtime Optimization:
                    </strong>{" "}
                    Cut cold-start latency by parallelizing SDK initialization
                    (Firebase, Crashlytics, Remote Config) via Future.wait;
                    replaced heavy WebViews with native widgets; built an asset
                    pipeline (pngquant, jpegoptim, sips) to batch-compress images.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Client-Side PDF Engine:
                    </strong>{" "}
                    Built a 1,300+ LOC custom PDF generator (package:pdf) with
                    Vietnamese typography and SVG to export meal plans,
                    calorie/salt/sugar calculations, and recipes for offline
                    sharing.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      AI Assistant &amp; Voice:
                    </strong>{" "}
                    Built a draggable floating AI avatar with reactive Lottie/SVG
                    emotion states and a bilingual voice pipeline: Vietnamese
                    Speech-to-Text with auto-send on silence detection and
                    configurable Text-to-Speech.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Unit Testing:
                    </strong>{" "}
                    Added unit tests for user-behavior analytics tracking.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Store Compliance &amp; Rejection Resolution:
                    </strong>{" "}
                    Unblocked production release by resolving Apple Guideline
                    1.4.1 (Physical Harm) with reusable in-app medical citations
                    (WHO, NIN, HUPH) and bilingual disclaimers; resolved Apple
                    Guideline 2.1(a) (Performance - App Completeness); fixed
                    Google Play User Data rejections via data retention
                    transparency and in-app account deletion; automated iOS
                    TestFlight deployment via Fastlane and Apple Transporter CLI.
                  </li>
                </ul>
              </div>

              {/* Project 2: WithPlay */}
              <div>
                <h3
                  className={`cv-print-text font-bold text-[12.5px] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  2. WithPlay: Sport Social App – Donghyun Moon
                </h3>
                <div
                  className={`cv-print-submeta cv-print-keep-next text-[12px] mt-0.5 mb-1.5 flex flex-wrap items-center gap-1.5 ${
                    isDark ? "text-[#989A99]" : "text-black"
                  }`}
                >
                  <a
                    href="https://apps.apple.com/vn/app/withplay-%C4%91%E1%BA%B7t-s%C3%A2n-pickleball/id6758744744?l=vi"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    App Store
                  </a>
                  <span>|</span>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.withplay.community.app"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    Google Play
                  </a>
                  <span>•</span>
                  <span>Flutter, MVVM, Riverpod</span>
                </div>

                <ul
                  className={`list-disc pl-4 space-y-1 text-[12px] leading-[1.55] ${
                    isDark ? "text-[#c2c5c3]" : "text-black"
                  }`}
                >
                  <li>
                    Developed a social sports app with Google Maps marker
                    clustering for location-based venue discovery, RESTful APIs
                    for community features, and Firebase Cloud Messaging for push
                    notifications.
                  </li>
                  <li>
                    Managed production releases, app updates, and platform
                    compliance checks on App Store and Google Play.
                  </li>
                </ul>
              </div>

              {/* Project 3: 5 Phút Thuộc Bài */}
              <div>
                <h3
                  className={`cv-print-text font-bold text-[12.5px] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  3. 5 Phút Thuộc Bài – Tâm Trí Lực (100K+ downloads)
                </h3>
                <div
                  className={`cv-print-submeta cv-print-keep-next text-[12px] mt-0.5 mb-1.5 flex flex-wrap items-center gap-1.5 ${
                    isDark ? "text-[#989A99]" : "text-black"
                  }`}
                >
                  <a
                    href="https://5phutthuocbai.com/"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    Website
                  </a>
                  <span>|</span>
                  <a
                    href="https://apps.apple.com/vn/app/5-ph%C3%BAt-thu%E1%BB%99c-b%C3%A0i-t%C3%A2m-tr%C3%AD-l%E1%BB%B1c/id1565648175"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    App Store
                  </a>
                  <span>|</span>
                  <a
                    href="https://play.google.com/store/search?q=5+phut+thu%E1%BB%99c+b%C3%A0i&c=apps&hl=vi"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    Google Play
                  </a>
                  <span>•</span>
                  <span>React Native, TypeScript, Redux-Saga</span>
                </div>

                <ul
                  className={`list-disc pl-4 space-y-1 text-[12px] leading-[1.55] ${
                    isDark ? "text-[#c2c5c3]" : "text-black"
                  }`}
                >
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Maintenance &amp; Ownership:
                    </strong>{" "}
                    Maintain and upgrade a React Native education app with 100K+
                    downloads on Google Play, alongside its companion Electron
                    desktop app and admin web platform.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Feature Development:
                    </strong>{" "}
                    Developed core learning features: video lessons, search,
                    quizzes, and leaderboard.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Release Management:
                    </strong>{" "}
                    Managed production releases and app updates on App Store and
                    Google Play, and S3.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      New Architecture Upgrade (RN 0.68 → 0.84):
                    </strong>{" "}
                    Migrated production app to React Native New Architecture
                    (Fabric &amp; Bridgeless), resolving native build conflicts
                    across 60+ dependencies and updating toolchain to Target SDK
                    35 (Android 15) and React 19.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      UI &amp; Rendering Optimization:
                    </strong>{" "}
                    Resolved severe frame drops on low-end devices (Redmi Note 11)
                    by analyzing Layout Bounds and cutting rendered UI views by
                    93% (5,200 to 380), optimizing navigation detaching and
                    replacing heavy SVG icons with static assets; tuned GPU
                    performance with Profile HWUI Rendering (on-screen bars and
                    gfxinfo) for smooth 60 FPS scrolling.
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Memory, Crash &amp; Storage Fixes:
                    </strong>{" "}
                    Eliminated crash-on-back (OOM) by cleaning up orphaned
                    animation timers and compressing 50 FPS GIF assets, cutting
                    RAM usage by over 50% (measured with dumpsys meminfo) and
                    stopping UI freezes; fixed WebView disk cache bloat (1.17 GB
                    to under 1 MB).
                  </li>
                  <li>
                    <strong
                      className={`cv-print-text ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Scripting &amp; Automation:
                    </strong>{" "}
                    Wrote scripts automating Android APK/AAB builds and
                    on-device install (USB/Wi-Fi ADB), and Electron Windows
                    builds on macOS via Wine with S3 deploy, version API update,
                    and signature checks (USB-token signing).
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        </A4Sheet>

        <A4Sheet
          pageNumber={2}
          totalPages={2}
          isDark={isDark}
          metric={pageMetrics.p2}
          contentRef={page2ContentRef}
          breakBefore
        >
          <div className="cv-print-sections space-y-3.5">
            {/* Products */}
            <section>
            <h2
              className={`cv-print-title text-[13.5px] font-bold tracking-wider uppercase pb-0.5 border-b-[1.5px] mb-1.5 ${
                isDark
                  ? "text-white border-[#383a38]"
                  : "text-[#006636] border-[#006636]"
              }`}
            >
              Products
            </h2>

            <div>
              <div className="cv-print-company cv-print-keep-next flex items-baseline justify-between gap-2 font-bold text-[12.5px]">
                <span
                  className={`cv-print-text ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Store Preview Studio —{" "}
                  <span
                    className={`cv-print-muted font-normal ${
                      isDark ? "text-[#989A99]" : "text-black"
                    }`}
                  >
                    Solo Indie Product
                  </span>{" "}
                  |{" "}
                  <a
                    href="https://storepreviewstudio.com/"
                    target="_blank"
                    rel="noreferrer"
                    className={storeLinkStyle}
                  >
                    Landing Page
                  </a>
                </span>
                <span
                  className={`cv-print-muted cv-print-date text-[12px] font-medium shrink-0 ${
                    isDark ? "text-[#989A99]" : "text-black"
                  }`}
                >
                  2026 – Present
                </span>
              </div>

              <p
                className={`cv-print-text cv-print-keep-next text-[12px] mt-1 leading-[1.45] ${
                  isDark ? "text-[#c2c5c3]" : "text-black"
                }`}
              >
                App Store &amp; Google Play mockup and preview studio for agencies.
              </p>

              <p
                className={`cv-print-muted cv-print-keep-next mt-1 text-[12px] leading-[1.45] ${
                  isDark ? "text-[#989A99]" : "text-black"
                }`}
              >
                <strong
                  className={`cv-print-text ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Role:
                </strong>{" "}
                Product owner, architect, designer (AI-assisted workflow).
              </p>

              <p
                className={`cv-print-text cv-print-keep-next text-[12px] font-semibold mt-1.5 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                What I built:
              </p>

              <ul
                className={`list-disc pl-4 space-y-1 text-[12px] leading-[1.45] mt-1 ${
                  isDark ? "text-[#c2c5c3]" : "text-black"
                }`}
              >
                <li>
                  <strong
                    className={`cv-print-text ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Zero-backend architecture:
                  </strong>{" "}
                  100% client-side processing, no server, no data upload.
                </li>
                <li>
                  Self-contained ~1.5MB single-file bundle (HTML + CSS + JS
                  inline) for the core studio.
                </li>
                <li>
                  Next.js 16 / React 19 marketing landing page with Tailwind CSS
                  v4, deployed on Cloudflare Pages.
                </li>
                <li>
                  <strong
                    className={`cv-print-text ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Custom Node.js build script:
                  </strong>{" "}
                  bundles the standalone HTML studio and Next.js static site.
                </li>
                <li>
                  Edge API proxy via Cloudflare Workers for iTunes Lookup.
                </li>
                <li>
                  Microsoft Clarity behavioral analytics across Next.js App
                  Router and embedded iframe sandbox.
                </li>
                <li>
                  <strong
                    className={`cv-print-text ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Device mockup system:
                  </strong>{" "}
                  iPhone, iPad, Android phone/tablet with accurate bezels,
                  Dynamic Island, viewport rendering.
                </li>
                <li>
                  <strong
                    className={`cv-print-text ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Export pipeline:
                  </strong>{" "}
                  high-resolution PNG up to 3x / 4K (framed, frameless, or
                  transparent), portable JSON config import/export, Markdown
                  spec sheet, and 1-click metadata copy.
                </li>
              </ul>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2
              className={`cv-print-title text-[13.5px] font-bold tracking-wider uppercase pb-0.5 border-b-[1.5px] mb-1.5 ${
                isDark
                  ? "text-white border-[#383a38]"
                  : "text-[#006636] border-[#006636]"
              }`}
            >
              Education
            </h2>

            <div
              className={`cv-print-edu space-y-2 text-[12px] ${
                isDark ? "text-[#c2c5c3]" : "text-black"
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`cv-print-text font-bold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    University of Transport and Communications (UTC)
                    <span
                      className={`cv-print-muted font-normal ${
                        isDark ? "text-[#989A99]" : "text-black"
                      }`}
                    >
                      {" "}
                      – Bachelor in Information Technology
                    </span>
                  </span>
                  <span
                    className={`cv-print-muted shrink-0 font-medium ${
                      isDark ? "text-[#989A99]" : "text-black"
                    }`}
                  >
                    12/2025 – Present
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`cv-print-text font-bold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    FPT Polytechnic Ho Chi Minh City
                    <span
                      className={`cv-print-muted font-normal ${
                        isDark ? "text-[#989A99]" : "text-black"
                      }`}
                    >
                      {" "}
                      – Associate Degree in Mobile App Development
                    </span>
                  </span>
                  <span
                    className={`cv-print-muted shrink-0 font-medium ${
                      isDark ? "text-[#989A99]" : "text-black"
                    }`}
                  >
                    03/2023 – 05/2025
                  </span>
                </div>
                <p
                  className={`cv-print-muted mt-0.5 ${
                    isDark ? "text-[#989A99]" : "text-black"
                  }`}
                >
                  High Distinction • GPA 3.90/4.00 – Top 1% of Cohort •{" "}
                  <span className={storeLinkStyle}>
                    Academic transcript
                  </span>
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`cv-print-text font-bold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Hanoi University of Science and Technology (HUST)
                    <span
                      className={`cv-print-muted font-normal ${
                        isDark ? "text-[#989A99]" : "text-black"
                      }`}
                    >
                      {" "}
                      – Electrical Systems Engineering
                    </span>
                  </span>
                  <span
                    className={`cv-print-muted shrink-0 font-medium ${
                      isDark ? "text-[#989A99]" : "text-black"
                    }`}
                  >
                    2017 – 2021
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
        </A4Sheet>
      </main>
    </div>
  );
}
