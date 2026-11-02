"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Smartphone, Layers } from "lucide-react";

export function MiniStudioSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Detect initial theme
    const getTheme = () => {
      const docTheme = document.documentElement.getAttribute("data-theme");
      if (docTheme === "light" || docTheme === "dark") return docTheme;
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    };

    const initial = getTheme();
    setCurrentTheme(initial);

    // Observer for real-time theme changes on documentElement
    const observer = new MutationObserver(() => {
      const updated = getTheme();
      setCurrentTheme(updated);
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "THEME_CHANGE", theme: updated },
          "*"
        );
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="showcase" className="relative pt-6 pb-20 md:pt-10 md:pb-28 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-[#00D085]/12 via-[#006553]/16 to-emerald-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase bg-[#00D085]/12 text-[#008759] dark:text-[#00D085] border border-[#00D085]/25 mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00D085] animate-pulse" />
            Live Interactive Preview
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Trải nghiệm Studio trực tiếp ngay bên dưới
          </h2>
          <p className="mt-2.5 text-[15px] sm:text-base text-slate-600 dark:text-slate-400">
            Thao tác trực tiếp với giao diện App Store & Google Play chuẩn thiết bị thực, đổi preset tức thì — 100% xử lý tại trình duyệt.
          </p>
        </div>

        {/* Mac Studio Window Container */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 bg-slate-100/80 dark:bg-[#0c1220]/90 backdrop-blur-xl shadow-2xl shadow-emerald-950/20 overflow-hidden transition-all duration-300">
          {/* Window Chrome Bar */}
          <div className="h-11 sm:h-12 px-4 sm:px-5 border-b border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-[#111726]/80 flex items-center justify-between gap-4">
            {/* Left Traffic Lights & Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase ml-2">
                <Smartphone className="w-3.5 h-3.5 text-[#00D085]" />
                Dual Device Canvas
              </span>
            </div>

            {/* Center Status URL Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-200/60 dark:bg-white/5 text-[12px] text-slate-600 dark:text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D085]" />
              <span>store-preview-studio.pages.dev/demo</span>
            </div>

            {/* Right Action: Open Fullscreen */}
            <div className="flex items-center gap-2">
              <Link
                href="/demo.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-lg text-[12px] sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200/80 dark:border-white/10 shadow-xs transition-colors"
                title="Mở toàn màn hình trong tab mới"
              >
                <span>Toàn màn hình</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div className="relative w-full bg-slate-50 dark:bg-[#070a14]">
            <iframe
              ref={iframeRef}
              src={`/demo.html?embed=true&theme=${currentTheme}`}
              title="Store Preview Studio Interactive Mini Demo"
              className="w-full h-[840px] sm:h-[900px] lg:h-[940px] border-0 display-block"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
