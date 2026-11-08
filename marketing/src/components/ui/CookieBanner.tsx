"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "sps_cookie_consent";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        setMounted(true);
        // Small delay for buttery smooth appearance after initial paint
        const timer = setTimeout(() => {
          setVisible(true);
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage availability errors in private/incognito mode
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {}
    setVisible(false);
    setTimeout(() => setMounted(false), 300);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "declined");
    } catch {}
    setVisible(false);
    setTimeout(() => setMounted(false), 300);
  };

  if (!mounted) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 max-w-[370px] w-[calc(100vw-2rem)] transition-all duration-300 ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-3 scale-95 pointer-events-none"
      }`}
    >
      <div className="rounded-2xl p-4 sm:p-4.5 bg-white/95 dark:bg-[#161716]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/[0.1] shadow-xl shadow-black/10 dark:shadow-black/50 select-none">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5 leading-none" role="img" aria-label="Cookie">
            🍪
          </span>
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We use anonymous cookies to analyze site traffic and improve your studio experience. Learn more in our{" "}
              <Link
                href="/privacy"
                className="underline hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <div className="pt-1.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDecline}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="text-xs font-medium bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
