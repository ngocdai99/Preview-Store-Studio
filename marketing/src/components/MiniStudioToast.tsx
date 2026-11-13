"use client";

import { useEffect, useState, useRef } from "react";

export interface MiniStudioToastData {
  title: string;
  desc: string;
  ctaText?: string;
  url?: string;
  tagText?: string;
}

export function MiniStudioToast() {
  const [toast, setToast] = useState<MiniStudioToastData | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === "sps-mini-toast") {
        const data = event.data.toast as MiniStudioToastData;
        if (!data) return;

        setToast(data);
        setVisible(true);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setVisible(false);
        }, 4500);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleClose() {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-[78px] lg:bottom-8 left-1/2 -translate-x-1/2 z-[99999] max-w-[560px] w-[calc(100vw-24px)] sm:w-[94vw] bg-[#141514]/95 border border-[#282928] shadow-[0_20px_48px_-12px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.06),0_0_24px_-4px_rgba(0,208,133,0.12)] backdrop-blur-xl rounded-[16px] sm:rounded-[18px] p-3.5 sm:py-3 sm:pr-9 sm:pl-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 transition-all duration-300 ease-out select-none ${
        visible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex-1 flex flex-col gap-1 min-w-0 text-left">
        <div className="flex items-center gap-2 min-w-0 pr-7 sm:pr-0">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center text-[#8A8C8A] shrink-0"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <b className="text-[13px] font-bold text-[#EDEDED] tracking-tight truncate">
            {toast.title}
          </b>
        </div>
        <span className="text-[12px] sm:text-[11.5px] text-[#989A99] leading-relaxed sm:leading-tight">
          {toast.desc}
        </span>
      </div>

      <a
        href={toast.url || "/#pricing"}
        className="w-full sm:w-auto justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_100%)] bg-[#006636] hover:bg-[#007a41] border border-[#1B845E] hover:border-[#209d70] text-white text-[12px] font-semibold py-2 sm:py-1.5 px-4 rounded-lg whitespace-nowrap inline-flex items-center shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_3px_12px_rgba(0,102,54,0.35)] transition-all cursor-pointer"
      >
        <span>{toast.ctaText || "Buy Now"}</span>
      </a>

      <button
        type="button"
        onClick={handleClose}
        className="absolute top-3 right-3 sm:top-2.5 sm:right-2.5 bg-white/5 hover:bg-white/10 border border-[#282928] hover:border-white/20 text-[#8A8C8A] hover:text-white w-[22px] h-[22px] rounded-full inline-flex items-center justify-center cursor-pointer transition-all shrink-0"
        aria-label="Close notification"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
