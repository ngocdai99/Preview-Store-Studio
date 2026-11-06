"use client";

import React from "react";

export function ZenmindPresetMockup() {
  return (
    <>
      {/* ZenMind Screen 1: Mindful Paced Breathing Halo */}
      <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#031d15] via-[#082e22] to-black border border-emerald-500/35 relative overflow-hidden transition-all duration-300">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[8.5px] font-bold text-emerald-200">Mindful Breath</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
            4-7-8 PACED
          </span>
        </div>

        {/* Ethereal Glowing Breathing Halo SVG */}
        <div className="relative my-auto flex items-center justify-center">
          <svg viewBox="0 0 160 42" className="w-full h-14" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#059669" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#05140e" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <ellipse cx="80" cy="21" rx="60" ry="18" fill="url(#haloGrad)" />
            <ellipse cx="80" cy="21" rx="42" ry="16" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="1" strokeDasharray="3 3" />
            <ellipse cx="80" cy="21" rx="30" ry="12" fill="none" stroke="url(#orbitGrad)" strokeWidth="1.8" />
            <ellipse cx="80" cy="21" rx="18" ry="8" fill="rgba(52,211,153,0.15)" stroke="#6ee7b7" strokeWidth="1.2" />

            <circle cx="106" cy="17" r="2.5" fill="#fde68a" />
            <circle cx="106" cy="17" r="4.5" fill="#fde68a" opacity="0.4" />
            <circle cx="54" cy="25" r="1.8" fill="#a7f3d0" />

            <text x="80" y="21" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="9" fontWeight="800" fontFamily="monospace">
              4s
            </text>
          </svg>

          <div className="absolute -bottom-1 inset-x-0 text-center">
            <span className="text-[6.5px] font-extrabold uppercase tracking-widest text-emerald-300 drop-shadow">
              INHALE · EXPAND
            </span>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5 border-t border-white/10">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            🌿 14-Day Calm Streak
          </span>
          <span className="text-slate-400">Heart coherence: 94%</span>
        </div>
      </div>

      {/* ZenMind Screen 2: 3D Binaural Soundscape & Waveform Mixer */}
      <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl p-2.5 flex flex-col justify-between bg-gradient-to-br from-[#021f24] via-[#06292b] to-black border border-teal-500/35 relative overflow-hidden transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[8.5px] font-bold text-teal-200">3D Soundscapes</span>
            <span className="text-[6.5px] text-amber-300">🌙</span>
          </div>
          <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold">
            432 HZ SOLFEGGIO
          </span>
        </div>

        <div className="relative my-auto h-14 w-full">
          <svg viewBox="0 0 160 44" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="waveEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <path d="M 148 6 A 6 6 0 0 0 154 12 A 7 7 0 1 1 146 6 Z" fill="#fde68a" opacity="0.9" />
            <circle cx="138" cy="8" r="0.8" fill="#ffffff" opacity="0.8" />
            <circle cx="128" cy="14" r="0.8" fill="#ffffff" opacity="0.6" />

            <path
              d="M 0 28 C 30 18, 50 36, 80 26 C 110 16, 130 32, 160 22"
              fill="none"
              stroke="url(#waveEmerald)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M 0 20 C 25 32, 55 12, 85 24 C 115 34, 135 14, 160 26"
              fill="none"
              stroke="url(#waveCyan)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            <path
              d="M 0 34 C 40 30, 70 38, 110 32 C 135 28, 150 34, 160 30"
              fill="none"
              stroke="rgba(167,243,208,0.3)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </svg>

          <div className="absolute bottom-0 inset-x-0 flex items-center justify-between text-[6px] font-mono px-1">
            <span className="flex items-center gap-0.5 text-teal-300">
              🌧️ Rain 75%
            </span>
            <span className="flex items-center gap-0.5 text-emerald-300">
              🌲 Pines 50%
            </span>
            <span className="flex items-center gap-0.5 text-cyan-300">
              🧠 Delta 2.5Hz
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[6px] text-slate-400 pt-0.5 border-t border-white/10">
          <span>Night Rain on Leaves</span>
          <span className="text-teal-400 font-semibold">Auto-fade 45m ⏱</span>
        </div>
      </div>
    </>
  );
}
