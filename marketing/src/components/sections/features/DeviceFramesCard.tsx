"use client";

import React, { useState } from "react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { useDeviceTime } from "./DeviceHardwareHelpers";
import { PhoneFramesStage } from "./PhoneFramesStage";
import { TabletFramesStage } from "./TabletFramesStage";

export function DeviceFramesCard() {
  const [device, setDevice] = useState<"phone" | "tablet">("phone");
  const timeString = useDeviceTime();

  return (
    <div className="group relative rounded-[28px] px-6 py-3.5 sm:px-8 sm:py-4 flex flex-col overflow-hidden bg-white dark:bg-[#1D1E1D] border border-slate-200/90 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.16] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 col-span-1 md:col-span-2 lg:col-span-6">
      {/* Top hairline accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-[28px] bg-gradient-to-r from-[#00D085] via-emerald-400 to-transparent" />

      {/* Top Header & Interactive Switchers */}
      <div className="relative z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2 sm:mb-2.5">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-mono font-bold tracking-wider text-emerald-600 dark:text-[#00D085] shrink-0">
              01
            </span>
            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              Modern Device Frames
            </h3>
          </div>
          <p className="mt-0.5 text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-400 max-w-sm leading-normal">
            Adaptive device frames across multiple screen formats.
          </p>
        </div>

        {/* Interactive Controls Bar: Device Sliding Tabs */}
        <div className="relative z-40 self-start lg:self-center">
          <SlidingTabs
            value={device}
            onChange={(val) => setDevice(val as "phone" | "tablet")}
            options={[
              {
                value: "phone",
                label: "iPhone",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <rect x="6" y="2" width="12" height="20" rx="2.5" />
                    <line x1="10" y1="18" x2="14" y2="18" />
                  </svg>
                ),
              },
              {
                value: "tablet",
                label: "iPad",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </svg>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Simulated Live Stage */}
      <div className="relative z-10 w-full h-[400px] sm:h-[420px] flex items-center justify-center select-none">
        <PhoneFramesStage timeString={timeString} isActive={device === "phone"} />
        <TabletFramesStage timeString={timeString} isActive={device === "tablet"} />
      </div>
    </div>
  );
}
