import React from "react";

interface BrandIconProps {
  className?: string;
  variant?: "standalone" | "squircle";
}

export function BrandIcon({
  className = "w-6 h-6",
  variant = "standalone",
}: BrandIconProps) {
  const content = (
    <g>
      {/* Left Limb: Tablet (Deep Forest Emerald #006533 -> #004824) */}
      <g transform="rotate(-23 35 49)">
        <rect
          x="21"
          y="15"
          width="28"
          height="67"
          rx="6.5"
          fill="url(#brand-tablet-grad)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.2"
        />
        {/* Tablet Camera */}
        <circle cx="35" cy="19.5" r="1.2" fill="rgba(255,255,255,0.4)" />
        {/* Screen Preview Cards */}
        <rect x="25" y="24" width="20" height="22" rx="2" fill="rgba(255,255,255,0.12)" />
        <rect x="25" y="49" width="20" height="14" rx="2" fill="rgba(255,255,255,0.12)" />
        <rect x="25" y="66" width="20" height="8" rx="2" fill="rgba(255,255,255,0.18)" />
      </g>

      {/* Right Limb: Phone (Electric Emerald #34F5A6 -> #00D085) - Overlapping with drop shadow */}
      <g transform="rotate(23 65 49)" filter="url(#brand-phone-shadow)">
        <rect
          x="55"
          y="13"
          width="20"
          height="71"
          rx="6"
          fill="url(#brand-phone-grad)"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="1.2"
        />
        {/* Dynamic Island */}
        <rect x="61.5" y="16.5" width="7" height="2" rx="1" fill="#00381a" />
        {/* Screen Preview Cards */}
        <rect x="58.5" y="22" width="13" height="20" rx="2" fill="rgba(255,255,255,0.25)" />
        <rect x="58.5" y="45" width="13" height="18" rx="2" fill="rgba(255,255,255,0.25)" />
        <rect x="58.5" y="66" width="13" height="10" rx="2" fill="rgba(255,255,255,0.35)" />
      </g>
    </g>
  );

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brand-tablet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#008746" />
          <stop offset="100%" stopColor="#004824" />
        </linearGradient>
        <linearGradient id="brand-phone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34F5A6" />
          <stop offset="100%" stopColor="#00D085" />
        </linearGradient>
        <filter id="brand-phone-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-2" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.75" />
        </filter>
        <linearGradient id="brand-squircle-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1F211F" />
          <stop offset="100%" stopColor="#121312" />
        </linearGradient>
      </defs>

      {variant === "squircle" ? (
        <>
          <rect
            width="100"
            height="100"
            rx="24"
            fill="url(#brand-squircle-bg)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />
          <g transform="scale(0.72) translate(19, 19)">{content}</g>
        </>
      ) : (
        content
      )}
    </svg>
  );
}
