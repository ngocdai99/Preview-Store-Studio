"use client";

import React, { useEffect, useRef, useState } from "react";

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
    <section id="showcase" className="relative pt-2 pb-16 md:pt-4 md:pb-24 overflow-hidden">
      {/* Background Soft Emerald Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-gradient-to-tr from-[#00D085]/12 via-[#006553]/15 to-emerald-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Direct Seamless Embedded Studio Viewport - 100% borderless, zero double-chrome */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-200/90 dark:border-white/10 bg-transparent">
          <iframe
            ref={iframeRef}
            src={`/demo.html?embed=true&theme=${currentTheme}`}
            title="Store Preview Studio Live Interactive Showcase"
            className="w-full h-[880px] sm:h-[930px] lg:h-[970px] border-0 block bg-transparent"
            loading="lazy"
            allow="clipboard-write"
          />
        </div>
      </div>
    </section>
  );
}
