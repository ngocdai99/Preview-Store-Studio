import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
  withBadge?: boolean;
}

export function BrandIcon({
  className = "w-6 h-6",
  size = 24,
  withBadge = false,
}: BrandIconProps) {
  const content = (
    <g>
      {/* Dải 1: Thân trên Phone uốn thành Chân Hình Chữ Nhật Bo Góc iPad (#006553) */}
      <path
        d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
        fill="#006553"
      />
      {/* Dải 2: Thân dưới Phone đi lên thành tay iPhone (#00D085, đè lên tại tâm với đổ bóng) */}
      <g filter="url(#brand-k-shadow)">
        <path
          d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
          fill="#00D085"
        />
      </g>
    </g>
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id="brand-k-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
        </filter>
        <linearGradient id="brand-sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1F211F" />
          <stop offset="100%" stopColor="#121312" />
        </linearGradient>
      </defs>

      {withBadge ? (
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
