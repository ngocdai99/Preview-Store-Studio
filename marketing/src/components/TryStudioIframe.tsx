"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";

function StudioLoadingSkeleton({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div
      aria-hidden={isLoaded}
      className={`absolute inset-0 z-10 flex flex-col bg-[#0e100f] text-neutral-300 transition-opacity duration-500 ease-out select-none ${
        isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Header Mockup */}
      <div className="h-12 border-b border-white/[0.07] px-4 flex items-center justify-between shrink-0 bg-[#121412]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="h-4 w-28 rounded bg-white/[0.08] animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-40 rounded-full bg-white/[0.06] animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-20 rounded-lg bg-white/[0.06] animate-pulse" />
        </div>
      </div>

      {/* Workspace Bar Mockup */}
      <div className="h-10 border-b border-white/[0.05] px-4 flex items-center justify-between shrink-0 bg-[#0c0d0c]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 rounded-full bg-white/[0.07] animate-pulse" />
          <div className="h-6 w-32 rounded-full bg-white/[0.05] animate-pulse" />
        </div>
        <div className="h-6 w-20 rounded-md bg-white/[0.06] animate-pulse" />
      </div>

      {/* Main Body Area: Left Editor Panel + Right Stage Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Simulated Sidebar (desktop only) */}
        <div className="hidden lg:flex flex-col w-[320px] shrink-0 border-r border-white/[0.06] p-4 gap-4 bg-[#111311]/50">
          <div className="h-8 w-3/4 rounded-lg bg-white/[0.06] animate-pulse" />
          <div className="h-28 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 flex gap-3 animate-pulse">
            <div className="w-14 h-14 rounded-xl bg-white/[0.08] shrink-0" />
            <div className="flex-1 flex flex-col gap-2 pt-1">
              <div className="h-3 w-3/4 rounded bg-white/[0.08]" />
              <div className="h-2.5 w-1/2 rounded bg-white/[0.05]" />
            </div>
          </div>
          <div className="h-24 rounded-xl border border-white/[0.06] bg-white/[0.03] animate-pulse" />
          <div className="h-24 rounded-xl border border-white/[0.06] bg-white/[0.03] animate-pulse" />
        </div>

        {/* Right Stage Center Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          {/* Subtle Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Simulated Device Frame Silhouette */}
          <div className="relative w-[240px] sm:w-[260px] h-[480px] sm:h-[520px] rounded-[38px] border-2 border-white/[0.08] bg-[#141614]/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-4">
            <div className="w-20 h-4 rounded-full bg-white/[0.08] mb-auto mt-1" />

            {/* High-end Brand Loader Center */}
            <div className="flex flex-col items-center justify-center gap-3 my-auto z-10 text-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-14 h-14 rounded-2xl bg-emerald-500/20 animate-ping opacity-30" />
                <BrandIcon withBadge size={44} className="relative z-10" />
              </div>

              <div className="flex flex-col items-center gap-1 mt-1">
                <span className="text-xs font-medium text-neutral-200 tracking-wide">
                  Initializing Preview Studio
                </span>
                <span className="text-[11px] text-neutral-500">
                  Loading interactive device sandbox...
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-28 h-1 rounded-full bg-white/[0.08] overflow-hidden mt-1 relative">
                <div className="w-full h-full bg-emerald-500/80 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="w-16 h-1 rounded-full bg-white/[0.1] mt-auto mb-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TryStudioIframeInner() {
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);

  // Compute initial src directly so iframe never loads empty and reloads
  const iframeSrc = useMemo(() => {
    const rawSearch = searchParams ? searchParams.toString() : "";
    const sp = new URLSearchParams(rawSearch);
    if (typeof window !== "undefined" && window.location.search && !rawSearch) {
      const winSp = new URLSearchParams(window.location.search);
      winSp.forEach((val, key) => sp.set(key, val));
    }

    const activeAppId = sp.get("appid") || sp.get("id");
    if (activeAppId) {
      sp.set("appid", activeAppId);
    }
    sp.set("embed", "true");
    const qs = sp.toString();
    return `/try-studio.html${qs ? `?${qs}` : "?embed=true"}`;
  }, [searchParams]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && (e.data.type === "sps-studio-ready" || e.data.type === "sps-ready")) {
        setIsLoaded(true);
      }
    };
    window.addEventListener("message", handleMessage);

    // Safety fallback so skeleton never gets permanently stuck
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 4000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <StudioLoadingSkeleton isLoaded={isLoaded} />
      <iframe
        src={iframeSrc}
        suppressHydrationWarning
        title="Store Preview Studio Interactive Sandbox"
        onLoad={() => setIsLoaded(true)}
        className="absolute inset-0 w-full h-full border-0 block"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}

export function TryStudioIframe() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full h-full">
          <StudioLoadingSkeleton isLoaded={false} />
          <iframe
            src="/try-studio.html?embed=true"
            title="Store Preview Studio Interactive Sandbox"
            className="absolute inset-0 w-full h-full border-0 block"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      }
    >
      <TryStudioIframeInner />
    </Suspense>
  );
}
