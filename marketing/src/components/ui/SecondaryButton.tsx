import React from "react";
import Link from "next/link";

export interface SecondaryButtonProps
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
 * Reusable Secondary Button (matches Supabase "Request a demo" button style)
 * - Background: #1D1E1D (brand dark surface)
 * - Border: #282928 (brand border)
 * - Hover: #282a28 (border #383938)
 * - Text: #ededed / #ffffff
 * - Supports custom fontSize and fontWeight
 */
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
    backgroundColor: "#1D1E1D",
    borderColor: "#282928",
    ...style,
    ...(fontSize !== undefined && {
      fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    }),
    ...(fontWeight !== undefined && {
      fontWeight,
    }),
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-white bg-[#1D1E1D] hover:bg-[#282a28] active:bg-[#171817] border border-[#282928] hover:border-[#383938] shadow-xs transition-colors duration-150 cursor-pointer select-none text-center font-sans";

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

export default SecondaryButton;

