"use client";

import React, { useState } from "react";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { FeatureCard } from "./FeatureCard";
import { useDeviceTime } from "./DeviceHardwareHelpers";
import { PhoneFramesStage } from "./PhoneFramesStage";
import { TabletFramesStage } from "./TabletFramesStage";

export function DeviceFramesCard() {
  const [device, setDevice] = useState<"phone" | "tablet">("phone");
  const timeString = useDeviceTime();

  return (
    <FeatureCard
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      }
      title="Modern Device Frames"
      description="Adaptive device frames across multiple screen formats."
      className="col-span-1 md:col-span-2 lg:col-span-6"
      headerRight={
        <SlidingTabs
          value={device}
          onChange={(val) => setDevice(val as "phone" | "tablet")}
          className="w-[170px] sm:w-[180px] shrink-0"
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
      }
    >
      {/* Simulated Live Stage with Layered 3D Depth */}
      <div
        className="relative z-10 w-full h-[400px] sm:h-[420px] flex items-center justify-center select-none overflow-hidden rounded-b-2xl"
        style={{ perspective: "1200px" }}
      >
        {/* Subtle Ambient Backlight */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-[280px] h-[280px] rounded-full blur-[80px] opacity-25 transition-all duration-700 ease-out ${
              device === "phone"
                ? "bg-indigo-500/40 -translate-x-6"
                : "bg-sky-500/40 translate-x-6"
            }`}
          />
        </div>

        <PhoneFramesStage
          timeString={timeString}
          isForeground={device === "phone"}
          onSelect={() => setDevice("phone")}
        />
        <TabletFramesStage
          timeString={timeString}
          isForeground={device === "tablet"}
          onSelect={() => setDevice("tablet")}
        />
      </div>
    </FeatureCard>
  );
}
