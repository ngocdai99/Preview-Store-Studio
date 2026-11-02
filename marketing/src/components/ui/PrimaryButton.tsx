import React from "react";
import Link from "next/link";

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
 * Reusable Primary Button component with customizable fontSize and fontWeight.
 * Matches brand identity: Supabase emerald tone (#006553) with vibrant green border (#00D085).
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
    ...style,
    ...(fontSize !== undefined && {
      fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    }),
    ...(fontWeight !== undefined && {
      fontWeight,
    }),
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-white bg-[#006553] hover:bg-[#007a64] active:bg-[#005445] border border-[#00D085] shadow-xs transition-colors duration-150 cursor-pointer select-none text-center font-sans";

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
