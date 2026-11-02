import React from "react";
import Link from "next/link";

/**
 * Standard Brand Color Tokens
 */
export const BRAND_COLORS = {
  primary: "#006636", // Base Primary Emerald (Supabase oklch(0.43627 0.11 157.5))
  primaryBorder: "#1B845E", // Primary Button crisp border
  primaryHover: "#007a41", // Primary Button hover background
  primaryHoverBorder: "#209d70", // Primary Button hover border
  secondary: "#00D085", // Secondary Brand Emerald / Accent
} as const;

export interface PrimaryButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  href?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  target?: string;
  rel?: string;
}

/**
 * Reusable Primary Button Component
 *
 * Implements Supabase's signature button:
 * - Base color: #006636
 * - Subtle vertical light gradient (linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%))
 * - Border: #1B845E
 * - Top edge specular highlight (inset 0 1px 0 0 rgba(255,255,255,0.2))
 * - Customizable fontSize and fontWeight
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  href,
  fontSize,
  fontWeight,
  className = "",
  children,
  onClick,
  style,
  ...rest
}) => {
  const customStyle: React.CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), #006636",
    borderColor: "#1B845E",
    boxShadow:
      "inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12)",
    ...style,
    ...(fontSize !== undefined && {
      fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    }),
    ...(fontWeight !== undefined && {
      fontWeight,
    }),
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-white border transition-all duration-150 cursor-pointer select-none text-center font-sans hover:brightness-105 active:translate-y-[1px]";

  if (href) {
    const isExternal =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.endsWith(".html");

    if (isExternal) {
      return (
        <a
          href={href}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          style={customStyle}
          className={`${baseClasses} ${className}`}
          target={rest.target}
          rel={rest.rel}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        style={customStyle}
        className={`${baseClasses} ${className}`}
        target={rest.target}
        rel={rest.rel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={rest.type || "button"}
      onClick={onClick}
      style={customStyle}
      className={`${baseClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
