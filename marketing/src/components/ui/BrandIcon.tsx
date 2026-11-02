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
      {/* Dải 1: Đỉnh Phone đi xuống rồi gập thành chân K (Xanh Đậm #007844 -> #00381a) */}
      <path
        d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
        fill="url(#brand-k-dark)"
      />
      {/* Dải 2: Đáy Phone đi lên rồi gập thành tay trên K (Xanh Sáng #34F5A6 -> #00D085, đè lên tại tâm) */}
      <g filter="url(#brand-k-shadow)">
        <path
          d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
          fill="url(#brand-k-light)"
        />
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
        <linearGradient id="brand-k-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#007844" />
          <stop offset="100%" stopColor="#00381a" />
        </linearGradient>
        <linearGradient id="brand-k-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34F5A6" />
          <stop offset="100%" stopColor="#00D085" />
        </linearGradient>
        <filter id="brand-k-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-2" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
        </filter>
        <linearGradient id="brand-sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
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
            fill="url(#brand-sq-bg)"
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
