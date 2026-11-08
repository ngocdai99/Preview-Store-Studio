"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TryStudioIframeInner() {
  const searchParams = useSearchParams();

  // Compute initial src directly so iframe never loads empty and reloads
  const iframeSrc = useMemo(() => {
    const rawSearch = searchParams ? searchParams.toString() : "";
    const sp = new URLSearchParams(rawSearch);
    if (typeof window !== "undefined" && window.location.search && !rawSearch) {
      const winSp = new URLSearchParams(window.location.search);
      winSp.forEach((val, key) => sp.set(key, val));
    }
    sp.set("embed", "true");
    const qs = sp.toString();
    return `/try-studio.html${qs ? `?${qs}` : "?embed=true"}`;
  }, [searchParams]);

  return (
    <iframe
      src={iframeSrc}
      suppressHydrationWarning
      title="Store Preview Studio Interactive Sandbox"
      className="absolute inset-0 w-full h-full border-0 block"
      allow="clipboard-read; clipboard-write"
    />
  );
}

export function TryStudioIframe() {
  return (
    <Suspense
      fallback={
        <iframe
          src="/try-studio.html?embed=true"
          title="Store Preview Studio Interactive Sandbox"
          className="absolute inset-0 w-full h-full border-0 block"
          allow="clipboard-read; clipboard-write"
        />
      }
    >
      <TryStudioIframeInner />
    </Suspense>
  );
}
