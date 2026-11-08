"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Lock, Check, Clock, ArrowLeft } from "lucide-react";

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierId: "plus" | "pro" | null;
}

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyb4fMRBy4fw8S7CxrvTj_DHh7WTUcAcgZ0ospEMLlvm2E__2eFk2aoAveDrprvXtX6/exec";

export function LaunchModal({ isOpen, onClose, tierId }: LaunchModalProps) {
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("preview_studio_waitlist");
        if (saved) {
          const data = JSON.parse(saved);
          return data?.email || "";
        }
      } catch {
        // Ignore localStorage error
      }
    }
    return "";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isPro = tierId === "pro";
  const tierName = isPro ? "Pro Studio" : "Plus Edition";
  const tierPrice = isPro ? "$49" : "$29";
  const originalPrice = isPro ? "$69" : "$39";

  // Handle ESC key to close and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) return;

    setIsSubmitting(true);

    let appId = "";
    let appName = "";
    let devName = "";

    try {
      const savedV = sessionStorage.getItem("sps_verified_app");
      if (savedV) {
        const vApp = JSON.parse(savedV);
        appId = vApp?.appid || "";
        appName = vApp?.app || "";
        devName = vApp?.dev || "";
      }
    } catch {
      // Ignore sessionStorage error
    }

    const isoTime = new Date().toISOString();
    const waitlistData = {
      email: cleanEmail,
      tier: tierName,
      price: tierPrice,
      appid: appId,
      app: appName,
      dev: devName,
      time: isoTime,
      timestamp: isoTime,
    };

    try {
      localStorage.setItem("preview_studio_waitlist", JSON.stringify(waitlistData));
    } catch {
      // Ignore localStorage error
    }

    const targetUrl =
      (typeof window !== "undefined" && (window as unknown as { SPS_WAITLIST_ENDPOINT?: string }).SPS_WAITLIST_ENDPOINT) ||
      GOOGLE_SCRIPT_URL;

    try {
      await fetch(targetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(waitlistData),
      });
    } catch (err) {
      console.warn("[Waitlist] Error posting to sheet:", err);
    }

    // Track Clarity if available
    if (typeof window !== "undefined" && typeof (window as unknown as { clarity?: (action: string, event: string) => void }).clarity === "function") {
      try {
        (window as unknown as { clarity: (action: string, event: string) => void }).clarity("event", "early_bird_signup");
      } catch {
        // Ignore clarity error
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 dark:bg-[#131413]/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="launchModalTitle"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[380px] bg-[radial-gradient(circle,rgba(0,208,133,0.18)_0%,rgba(0,101,51,0.12)_45%,transparent_70%)] pointer-events-none blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[520px] rounded-[26px] p-6 sm:p-8 bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/10 shadow-[0_32px_80px_-15px_rgba(15,23,42,0.18),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_32px_80px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden scale-100 transition-all duration-300">
        {/* Top subtle sheen */}
        <div
          className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-blue-500/25 dark:via-white/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.14] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-all duration-150 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header: Badges */}
            <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
              {/* Dynamic Tier Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                  isPro
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%),#006636] border border-[#1B845E] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1px_2px_0_rgba(0,0,0,0.12)] text-white"
                    : "bg-[#1D1E1D] border border-[#282928] text-white shadow-xs"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D085] shadow-[0_0_8px_rgba(0,208,133,0.95)] shrink-0" />
                <svg
                  className="w-3.5 h-3.5 fill-none stroke-white stroke-[2.4] shrink-0"
                  viewBox="0 0 24 24"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>
                  {tierName} · {tierPrice} Early Bird
                </span>
              </div>

              {/* Special Launch Offer Tag */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 dark:border-emerald-500/30 shadow-[0_1px_2px_rgba(16,185,129,0.1)]">
                <Clock className="w-3 h-3 stroke-[2.5]" />
                <span>Special Launch Offer</span>
              </span>
            </div>

            {/* Title & Description */}
            <h3
              id="launchModalTitle"
              className="text-[22px] sm:text-[24px] font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 leading-tight"
            >
              Official Launch Next Week
            </h3>
            <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
              Store Preview Studio is in the final stages of QA and polish, officially launching
              next week. Enter your email to reserve your early-bird price and get access the
              moment checkout opens.
            </p>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* Perk 1 */}
              <div className="bg-slate-50 dark:bg-white/[0.035] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-4 text-center flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 shrink-0">
                  <svg
                    className="w-4 h-4 stroke-current stroke-[2.2] fill-none"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="5" x2="5" y2="19" />
                    <circle cx="6.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Early Bird Launch Price
                  </div>
                  <div className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Lock in {tierPrice} one-time pricing before it increases to regular{" "}
                    {originalPrice}.
                  </div>
                </div>
              </div>

              {/* Perk 2 */}
              <div className="bg-slate-50 dark:bg-white/[0.035] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-4 text-center flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <svg
                    className="w-4 h-4 stroke-current stroke-[2.2] fill-none"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Instant Offline Delivery
                  </div>
                  <div className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Standalone single-file HTML studio with lifetime access and zero Node.js setup.
                  </div>
                </div>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-[#171817] border-2 border-slate-200 dark:border-white/15 focus-within:border-[#00D085] dark:focus-within:border-[#00D085] rounded-2xl p-1.5 sm:p-2 gap-2 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] focus-within:ring-4 focus-within:ring-[#00D085]/15 transition-all">
                <div className="flex items-center gap-2 px-3 py-1.5 flex-1 min-w-0">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@company.com"
                    required
                    className="w-full bg-transparent border-none text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                    aria-label="Email address"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-[13.5px] text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%),#006636] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_100%),#007a41] border border-[#1B845E] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1px_2px_0_rgba(0,0,0,0.12)] transition-all duration-150 disabled:opacity-60 cursor-pointer shrink-0"
                >
                  <span>{isSubmitting ? "Saving..." : "Get Early Invite"}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Privacy Footer */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Lock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>No spam. We only send 1 email when we officially launch.</span>
              </div>
            </form>
          </div>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center text-center py-4 px-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.25)] mb-4">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              You&apos;re on the VIP Early Bird List
            </h4>
            <p className="text-[13.5px] text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
              We&apos;ve reserved your slot for <strong>{tierName}</strong> at{" "}
              <strong>{tierPrice}</strong>. You will be among the first creators to receive the
              direct checkout link and special launch pricing.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Interactive Preview</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
