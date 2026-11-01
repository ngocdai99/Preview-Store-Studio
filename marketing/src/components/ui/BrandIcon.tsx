import React from "react";

export function BrandIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        {/* Supabase Emerald Gradient (#3ecf8e -> #1a8c5b) */}
        <linearGradient id="brand-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3ecf8e" />
          <stop offset="100%" stopColor="#1a8c5b" />
        </linearGradient>
        <linearGradient id="brand-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#24b47e" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#brand-bg)" />
      <rect
        x="10.5"
        y="4.5"
        width="16.5"
        height="18"
        rx="2.5"
        fill="rgba(255,255,255,0.2)"
        stroke="#ffffff"
        strokeWidth="1.6"
      />
      <circle cx="18.75" cy="6.2" r="0.65" fill="#ffffff" />
      <rect x="12.5" y="8.5" width="6" height="7" rx="1" fill="#ffffff" opacity="0.35" />
      <rect x="19.5" y="8.5" width="5.5" height="7" rx="1" fill="#ffffff" opacity="0.35" />
      <rect x="12.5" y="17" width="12.5" height="3" rx="0.8" fill="#ffffff" opacity="0.5" />
      <rect x="5" y="8" width="11.5" height="19.5" rx="3" fill="url(#brand-front)" />
      <rect
        x="5"
        y="8"
        width="11.5"
        height="19.5"
        rx="3"
        fill="rgba(255,255,255,0.22)"
        stroke="#ffffff"
        strokeWidth="1.8"
      />
      <rect x="8.5" y="9.8" width="4.5" height="1.2" rx="0.6" fill="#ffffff" />
      <rect x="6.8" y="12.5" width="8" height="7.5" rx="1" fill="#ffffff" opacity="0.35" />
      <rect x="6.8" y="21.5" width="8" height="3.5" rx="0.8" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}
