"use client";

import React from "react";

export function CyberstrikePresetMockup() {
  return (
    <>
      {/* CyberStrike Screen 1: Open World Action RPG */}
      <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl relative overflow-hidden bg-[#060714] border border-cyan-500/40 shadow-inner select-none transition-all duration-300">
        <svg viewBox="0 0 180 96" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e0b36" />
              <stop offset="60%" stopColor="#0b081d" />
              <stop offset="100%" stopColor="#03040c" />
            </linearGradient>
            <linearGradient id="neonMoon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#ff007f" />
            </linearGradient>
          </defs>
          <rect width="180" height="96" fill="url(#skyGrad)" />

          <circle cx="140" cy="30" r="20" fill="none" stroke="url(#neonMoon)" strokeWidth="2.5" opacity="0.6" />
          <circle cx="140" cy="30" r="26" fill="none" stroke="#00f5ff" strokeWidth="0.8" opacity="0.3" strokeDasharray="4 4" />

          <path d="M10 52 L25 52 L25 35 L40 35 L40 52 L55 52 L55 28 L72 28 L72 52 L85 52 L85 38 L105 38 L105 52 L125 52 L125 22 L145 22 L145 52 L165 52 L165 35 L175 35 L175 52 Z" fill="#0b0c1c" opacity="0.9" />
          <rect x="58" y="32" width="2" height="3" fill="#00f5ff" opacity="0.8" />
          <rect x="64" y="36" width="2" height="3" fill="#ff007f" opacity="0.8" />
          <rect x="128" y="26" width="2" height="4" fill="#00f5ff" opacity="0.9" />
          <rect x="136" y="30" width="2" height="4" fill="#ff007f" opacity="0.9" />

          <line x1="0" y1="54" x2="180" y2="54" stroke="#00f5ff" strokeWidth="1" opacity="0.7" />
          <line x1="0" y1="62" x2="180" y2="62" stroke="#00f5ff" strokeWidth="0.8" opacity="0.5" />
          <line x1="0" y1="72" x2="180" y2="72" stroke="#00f5ff" strokeWidth="0.7" opacity="0.35" />
          <line x1="0" y1="84" x2="180" y2="84" stroke="#00f5ff" strokeWidth="0.6" opacity="0.2" />
          <line x1="90" y1="54" x2="10" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
          <line x1="90" y1="54" x2="50" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
          <line x1="90" y1="54" x2="90" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
          <line x1="90" y1="54" x2="130" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />
          <line x1="90" y1="54" x2="170" y2="96" stroke="#00f5ff" strokeWidth="0.8" opacity="0.4" />

          <g transform="translate(85, 42)">
            <line x1="14" y1="36" x2="28" y2="12" stroke="#00f5ff" strokeWidth="3" strokeLinecap="round" />
            <line x1="14" y1="36" x2="28" y2="12" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M0 38 L4 20 L2 14 L5 8 L9 8 L12 14 L10 20 L14 38 Z" fill="#04040a" />
            <line x1="6" y1="10" x2="10" y2="10" stroke="#ff007f" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>

        {/* Top Bar */}
        <div className="absolute top-1.5 left-2 right-2 flex items-center justify-between text-[6.5px] font-mono">
          <div className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">LV.88</span>
            <span className="text-cyan-400">NEO-SHINJUKU</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            OPEN WORLD
          </span>
        </div>

        {/* Bottom In-Game Controls HUD */}
        <div className="absolute bottom-1.5 left-2 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border border-cyan-400/40 bg-black/40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 shadow" />
          </div>
        </div>

        <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-slate-900/80 border border-purple-500/50 flex items-center justify-center text-[7px] text-purple-300 shadow">
            💨
          </div>
          <div className="w-5 h-5 rounded-full bg-slate-900/80 border border-fuchsia-500/60 flex items-center justify-center text-[7px] text-fuchsia-300 shadow">
            ⚡
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border border-white/60 flex items-center justify-center text-[8px] text-white shadow-lg">
            ⚔️
          </div>
        </div>
      </div>

      {/* CyberStrike Screen 2: Boss Battle & Combat Slash */}
      <div className="w-[205px] sm:w-[220px] h-[132px] sm:h-[140px] shrink-0 rounded-xl relative overflow-hidden bg-[#0a0410] border border-pink-500/40 shadow-inner select-none transition-all duration-300">
        <svg viewBox="0 0 180 96" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="arenaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#250522" />
              <stop offset="50%" stopColor="#0c0414" />
              <stop offset="100%" stopColor="#030108" />
            </linearGradient>
            <linearGradient id="neonSlash" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="50%" stopColor="#ff007f" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <rect width="180" height="96" fill="url(#arenaGrad)" />

          <g transform="translate(130, 20)">
            <polygon points="10,42 35,25 45,68 5,68" fill="#14061a" opacity="0.9" />
            <polygon points="15,25 30,12 38,28" fill="#1b0825" />
            <circle cx="24" cy="22" r="3.5" fill="#ff0055" />
            <circle cx="24" cy="22" r="1.5" fill="#ffffff" />
          </g>

          <path
            d="M 18 85 Q 85 18 160 36"
            fill="none"
            stroke="url(#neonSlash)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M 22 83 Q 85 20 155 35"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <g transform="translate(120, 34)">
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#00f5ff" strokeWidth="2" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#00f5ff" strokeWidth="2" />
            <line x1="-6" y1="-6" x2="6" y2="6" stroke="#ff007f" strokeWidth="2" />
            <line x1="-6" y1="6" x2="6" y2="-6" stroke="#ff007f" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>

          <path
            d="M 45 28 Q 95 62 145 72"
            fill="none"
            stroke="#00f5ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>

        {/* Boss Health Bar */}
        <div className="absolute top-1.5 inset-x-3 flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[6.5px] font-mono font-bold">
            <span className="text-rose-400 flex items-center gap-1">
              <span>💀</span> BOSS: TITAN-DREADNOUGHT
            </span>
            <span className="text-slate-400 text-[6px]">PHASE 2</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 border border-rose-500/40 p-[1px] flex gap-0.5 overflow-hidden">
            <div className="w-[45%] h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" />
            <div className="w-[30%] h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full" />
          </div>
        </div>

        {/* Combat Floating Damage Text & Combo Badge */}
        <div className="absolute top-7 left-3">
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-fuchsia-600/30 border border-fuchsia-500/50">
            <span className="text-[9.5px] font-black text-white font-mono leading-none">142</span>
            <span className="text-[5.5px] text-fuchsia-200 font-extrabold uppercase tracking-wider">COMBO</span>
          </div>
        </div>

        {/* Big Dramatic Critical Hit Text */}
        <div className="absolute bottom-2.5 left-9 transform -rotate-6">
          <div className="text-[11px] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 drop-shadow-[0_2px_8px_rgba(255,0,127,0.8)] font-mono leading-none">
            CRIT 98,420!
          </div>
        </div>

        {/* Parry / Perfect Evade Badge */}
        <div className="absolute bottom-2 right-2.5">
          <div className="px-1.5 py-0.5 rounded bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-[7px] font-mono font-black tracking-wide shadow-lg">
            ⚡ PARRY!
          </div>
        </div>
      </div>
    </>
  );
}
