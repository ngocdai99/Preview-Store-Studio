"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TryStudioIframeInner() {
  const searchParams = useSearchParams();

  // Compute initial src during render to avoid redundant iframe reloads
  const [src, setSrc] = useState<string>(() => {
    if (typeof window !== "undefined" && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      sp.set("embed", "true");
      return `/try-studio.html?${sp.toString()}`;
    }
    return "/try-studio.html?embed=true";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      sp.set("embed", "true");
      const nextSrc = `/try-studio.html?${sp.toString()}`;
      setSrc((prev) => (prev !== nextSrc ? nextSrc : prev));
    }
  }, [searchParams]);

  return (
    <iframe
      src={src}
      suppressHydrationWarning
      title="Store Preview Studio Interactive Sandbox"
      className="w-full h-full border-0 block"
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
          className="w-full h-full border-0 block"
          allow="clipboard-read; clipboard-write"
        />
      }
    >
      <TryStudioIframeInner />
    </Suspense>
  );
}
