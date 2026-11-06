"use client";

import React from "react";

export function PulsefitPresetMockup() {
  return (
    <>
      {/* PulseFit Screen 1: Weekly Volume & Hypertrophy Bar Chart */}
      <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#2a0e05] via-[#140804] to-black border border-orange-500/30 relative overflow-hidden transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[8.5px] font-bold text-orange-200">Volume Load</span>
            <span className="text-[6.5px] text-emerald-400 font-semibold flex items-center gap-0.5">
              ↑ 18.4%
            </span>
          </div>
          <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono font-bold">
            12,480 KG
          </span>
        </div>

        {/* 7-Day Vertical Bar Chart */}
        <div className="my-auto px-1">
          <div className="h-12 flex items-end justify-between gap-1.5">
            {[
              { day: "M", val: 55, active: false },
              { day: "T", val: 78, active: false },
              { day: "W", val: 40, active: false },
              { day: "T", val: 96, active: true },
              { day: "F", val: 82, active: false },
              { day: "S", val: 65, active: false },
              { day: "S", val: 30, active: false },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className={`w-full rounded-t-[3px] transition-all duration-300 ${
                    item.active
                      ? "bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,146,60,0.6)]"
                      : "bg-gradient-to-t from-orange-950/80 to-orange-500/40 hover:to-orange-400/60"
                  }`}
                  style={{ height: `${item.val}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[6px] font-mono text-slate-400 pt-1 border-t border-white/10">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className={`flex-1 text-center ${i === 3 ? "text-amber-300 font-bold" : ""}`}>
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[6px] text-slate-400">
          <span>Progressive Overload</span>
          <span className="text-amber-400 font-semibold">Peak: Thursday (Legs)</span>
        </div>
      </div>

      {/* PulseFit Screen 2: Cardiac Zones & Real-time Waveform Area Chart */}
      <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#17071e] via-[#0d0414] to-black border border-rose-500/30 relative overflow-hidden transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[8.5px] font-bold text-rose-200">Heart Rate Zones</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-2.5 h-1.5 rounded-xs bg-slate-700" title="Z1" />
            <div className="w-2.5 h-1.5 rounded-xs bg-blue-500/60" title="Z2" />
            <div className="w-3.5 h-1.5 rounded-xs bg-emerald-500/80" title="Z3" />
            <div className="w-5 h-1.5 rounded-xs bg-amber-500" title="Z4" />
            <div className="w-3 h-1.5 rounded-xs bg-rose-500 font-bold" title="Z5" />
          </div>
        </div>

        <div className="relative my-auto h-13 w-full overflow-hidden">
          <svg viewBox="0 0 160 40" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hrAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#fb923c" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hrLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="85%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>

            <line x1="0" y1="12" x2="160" y2="12" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 3" strokeWidth="0.8" />
            <line x1="0" y1="26" x2="160" y2="26" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 3" strokeWidth="0.8" />

            <path
              d="M 0 35 Q 20 32 35 24 T 70 20 T 100 8 T 130 16 T 160 22 L 160 40 L 0 40 Z"
              fill="url(#hrAreaGrad)"
            />

            <path
              d="M 0 35 Q 20 32 35 24 T 70 20 T 100 8 T 130 16 T 160 22"
              fill="none"
              stroke="url(#hrLineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <circle cx="100" cy="8" r="3" fill="#ffffff" />
            <circle cx="100" cy="8" r="5" fill="#f43f5e" opacity="0.4" />
          </svg>

          <div className="absolute top-0 right-14 transform -translate-y-1">
            <span className="px-1 py-0.5 rounded bg-rose-500/90 text-white font-mono text-[6px] font-bold shadow">
              168 BPM
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[6px] text-slate-400">
          <span>Cardio Session: 42 mins</span>
          <span className="text-rose-400 font-semibold">Zone 4: 82% of workout</span>
        </div>
      </div>
    </>
  );
}
