import Link from "next/link";

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-[#131413] text-[#EDEDED] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="text-xs text-[#989A99] hover:text-[#00D085] transition-colors"
              >
                ← Back to Landing Page
              </Link>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D085] bg-[#00D085]/10 border border-[#00D085]/30 px-2.5 py-1 rounded-md">
                Rounded iPad Slab Footprint (#006636 &amp; #00D085)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              K Brand Logo: Rounded iPad Slab Footprint
            </h1>
            <p className="mt-2 text-sm text-[#989A99] max-w-2xl leading-relaxed">
              Streamlined brand geometry: the right stem of the letter K is sculpted into a{" "}
              <strong className="text-white">rounded rectangle with parallel edges</strong>, mirroring the clean aspect ratio of an{" "}
              <strong className="text-[#00D085]">iPad Tablet</strong>.
            </p>
          </div>
        </div>

        {/* 4 Concepts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* CONCEPT 2.1: PARALLEL SLAB (RECOMMENDED) */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 2.1: Parallel Rounded Slab (22px) ⭐
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Strict parallel edges with authentic Apple iPad rounded radius.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Primary Pick ⭐
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <filter id="p21-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                      fill="#006636"
                    />
                    <g filter="url(#p21-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                      fill="#006636"
                    />
                    <g filter="url(#p21-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                      fill="#006636"
                    />
                    <g filter="url(#p21-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <path
                    d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                    fill="#006636"
                  />
                  <g filter="url(#p21-sh)">
                    <path
                      d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                      fill="#00D085"
                    />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006636] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📏 <strong>Parallel straight edges</strong>: Fixed 22px width without distortion.</div>
              <div>✨ <strong>Rounded corner r=6</strong>: Mirrors physical hardware tablet geometry.</div>
            </div>
          </div>

          {/* CONCEPT 2.2: SEPARATE SLAB RECTANGLE */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 2.2: Discrete Rounded Slab
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Utilizes an independent rounded rectangle (width=22, height=48, rx=6).
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Discrete Block
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <filter id="p22-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006636" />
                    <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006636" />
                    <g filter="url(#p22-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006636" />
                    <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006636" />
                    <g filter="url(#p22-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006636" />
                    <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006636" />
                    <g filter="url(#p22-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006636" />
                  <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006636" />
                  <g filter="url(#p22-sh)">
                    <path
                      d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                      fill="#00D085"
                    />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006636] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>💻 Direct rect shape with 4 rounded corners.</div>
              <div>📱 Tangible layered hardware aesthetic.</div>
            </div>
          </div>

          {/* CONCEPT 1.0: BALANCED ORIGINAL */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 1.0: Balanced Original (20px / 20px)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Balanced typography preserved for side-by-side comparison.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                  Archive Reference
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,36 L 70,64 C 74,68 74,74 70,78 L 60,88 C 56,92 50,92 46,88 L 18,64 Z"
                      fill="#006636"
                    />
                    <path
                      d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,58 L 70,28 C 74,24 74,16 70,12 C 66,8 58,8 54,12 L 26,38 C 21,42 18,46 18,52 Z"
                      fill="#00D085"
                    />
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,36 L 70,64 C 74,68 74,74 70,78 L 60,88 C 56,92 50,92 46,88 L 18,64 Z"
                      fill="#006636"
                    />
                    <path
                      d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,58 L 70,28 C 74,24 74,16 70,12 C 66,8 58,8 54,12 L 26,38 C 21,42 18,46 18,52 Z"
                      fill="#00D085"
                    />
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,36 L 70,64 C 74,68 74,74 70,78 L 60,88 C 56,92 50,92 46,88 L 18,64 Z"
                      fill="#006636"
                    />
                    <path
                      d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,58 L 70,28 C 74,24 74,16 70,12 C 66,8 58,8 54,12 L 26,38 C 21,42 18,46 18,52 Z"
                      fill="#00D085"
                    />
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <path
                    d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,36 L 70,64 C 74,68 74,74 70,78 L 60,88 C 56,92 50,92 46,88 L 18,64 Z"
                    fill="#006636"
                  />
                  <path
                    d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,58 L 70,28 C 74,24 74,16 70,12 C 66,8 58,8 54,12 L 26,38 C 21,42 18,46 18,52 Z"
                    fill="#00D085"
                  />
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006636] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>⚖️ Two uniform 20px paths, typographical symmetry.</div>
              <div>🌿 Signature #006636 and #00D085 palette.</div>
            </div>
          </div>

          {/* CONCEPT 2.4: SQUIRCLE APP ICON BADGE */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 2.4: Squircle App Icon Badge
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Packaged within an authentic squircle container.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  App Icon Badge
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="p24-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1F211F" />
                        <stop offset="100%" stopColor="#121312" />
                      </linearGradient>
                    </defs>
                    <rect width="100" height="100" rx="24" fill="url(#p24-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                        fill="#006636"
                      />
                      <g filter="url(#p21-sh)">
                        <path
                          d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                          fill="#00D085"
                        />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <rect width="100" height="100" rx="24" fill="url(#p24-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                        fill="#006636"
                      />
                      <g filter="url(#p21-sh)">
                        <path
                          d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                          fill="#00D085"
                        />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <rect width="100" height="100" rx="24" fill="url(#p24-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                        fill="#006636"
                      />
                      <g filter="url(#p21-sh)">
                        <path
                          d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                          fill="#00D085"
                        />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Favicon)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="24" height="24">
                  <rect width="100" height="100" rx="24" fill="url(#p24-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <g transform="scale(0.72) translate(19, 19)">
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,34 L 72,63 C 76,67 76,73 72,77 L 61,88 C 57,92 51,92 47,88 L 18,63 Z"
                      fill="#006636"
                    />
                    <g filter="url(#p21-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
                        fill="#00D085"
                      />
                    </g>
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006636] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📦 Proportional iPad slab geometry without flare distortion.</div>
              <div>🌌 Hairline border highlighting emerald identity.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
