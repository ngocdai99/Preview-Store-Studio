"use client";

import React, { useState, useEffect } from "react";

// Hook to keep device clocks synchronized in real time
export function useDeviceTime() {
  const [timeString, setTimeString] = useState("9:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTimeString(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return timeString;
}

// Hook providing smooth drag-to-scroll, wheel-to-horizontal-scroll, and arrow navigation
export function useDraggableScroll() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDownRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);

  const updateScrollState = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    // Convert mouse wheel vertical scroll into horizontal scroll with preventDefault
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 2) {
        el.scrollLeft += e.deltaY * 0.9;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      el.removeEventListener("wheel", handleWheel);
    };
  }, [updateScrollState]);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  }, []);

  const onMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    const el = ref.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    el.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const onMouseUp = React.useCallback(() => {
    isDownRef.current = false;
  }, []);

  const scrollByAmount = React.useCallback((amount: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  return {
    ref,
    canScrollLeft,
    canScrollRight,
    scrollBy: scrollByAmount,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
    },
  };
}

// Reusable iPad / Tablet Status Bar
export function IPadStatusBar({ timeString }: { timeString?: string }) {
  const defaultTime = useDeviceTime();
  const time = timeString ?? defaultTime;

  return (
    <div className="w-full h-4 px-1 mb-2 sm:mb-2.5 flex items-center justify-between select-none shrink-0 text-white z-20">
      <span className="text-[9.5px] font-semibold text-white tracking-tight">
        {time}
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      <div className="flex items-center gap-1.5 text-white">
        {/* Wi-Fi Icon */}
        <svg className="w-2.5 h-2 text-white" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
          <path d="M4.5 7.5a5 5 0 0 1 7 0 .8.8 0 0 1-1.1 1.1 3.4 3.4 0 0 0-4.8 0 .8.8 0 1 1-1.1-1.1z" />
          <path d="M2 4.5a8.5 8.5 0 0 1 12 0 .8.8 0 0 1-1.1 1.1 6.9 6.9 0 0 0-9.8 0 .8.8 0 1 1-1.1-1.1z" />
        </svg>
        {/* Battery with Nub */}
        <div className="flex items-center">
          <div className="w-3.5 h-2 rounded-[2px] border border-white p-[0.8px] flex items-center">
            <div className="w-full h-full rounded-[0.8px] bg-white" />
          </div>
          <div className="w-[0.8px] h-1 rounded-r-[0.5px] bg-white ml-[0.5px]" />
        </div>
      </div>
    </div>
  );
}

// Reusable iPad Mockup Hardware Frame (shared across Card 1 & Card 2)
export interface IPadMockupFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  timeString?: string;
}

export function IPadMockupFrame({
  children,
  className = "",
  style,
  timeString,
}: IPadMockupFrameProps) {
  return (
    <div
      className={`relative w-[285px] sm:w-[315px] h-[392px] sm:h-[412px] rounded-[32px] p-[6px] border border-[#3e4046] bg-[#25262a] transition-all duration-300 ${className}`}
      style={style}
    >
      {/* Outer Physical Hardware Buttons for iPad (Top Power Button & Two Side Volume Buttons) */}
      <div className="absolute -top-[4px] right-[30px] w-[26px] h-[3px] rounded-t-sm bg-[#363840]" />
      <div className="absolute -right-[4px] top-[32px] w-[3px] h-[16px] rounded-r-sm bg-[#363840]" />
      <div className="absolute -right-[4px] top-[52px] w-[3px] h-[16px] rounded-r-sm bg-[#363840]" />

      {/* Screen Inner (Portrait iPad) */}
      <div className="w-full h-full rounded-[26px] pt-1.5 px-3 pb-3 sm:px-3.5 sm:pb-3.5 bg-black text-white flex flex-col justify-between">
        <IPadStatusBar timeString={timeString} />
        {children}
        {/* Tablet Home Bar */}
        <div className="w-24 h-1 rounded-full mx-auto mt-1.5 bg-white/30 shrink-0" />
      </div>
    </div>
  );
}
