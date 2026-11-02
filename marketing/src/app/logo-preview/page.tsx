import React from "react";
import Link from "next/link";

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-[#131413] text-[#ededed] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/"
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/[0.06] text-[#989A99] hover:text-white border border-white/10 transition-colors"
              >
                ← Back to Landing Page
              </Link>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D085] bg-[#00D085]/10 border border-[#00D085]/30 px-2.5 py-1 rounded-md">
                Chữ K Liên Tục (Supabase Style)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Logo Chữ K: Dạng Liên Tục Gấp Khúc (Faceted Ribbon Fold)
            </h1>
            <p className="mt-2 text-sm text-[#989A99] max-w-2xl leading-relaxed">
              Khắc phục tình trạng các khối chữ nhật xếp chồng rời rạc. Áp dụng{" "}
              <strong className="text-white">ngôn ngữ dải băng / khối đa giác uốn gập liên tục (Origami Ribbon)</strong>{" "}
              với đường gập chéo 45°, ăn khớp nhau như dải lụa không gian 3D vô cực của Supabase.
            </p>
          </div>
        </div>

        {/* 4 Concepts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* K-OPTION 1: 2-RIBBON INTERLOCKING FOLD */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 1: Hai Dải Gập Vô Cực (2-Ribbon Loop)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    2 dải uốn khúc lồng ghép nhau: Dải 1 (Đỉnh trái → Đáy phải) lồng vào Dải 2 (Đáy trái → Đỉnh phải).
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Khuyên dùng ⭐
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="k1-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007844" />
                        <stop offset="100%" stopColor="#00381a" />
                      </linearGradient>
                      <linearGradient id="k1-light" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                      <filter id="k1-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-3" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z"
                      fill="url(#k1-dark)"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1.2"
                    />
                    <rect x="27" y="16" width="9" height="2.2" rx="1.1" fill="#00220f" />
                    <g filter="url(#k1-sh)">
                      <path
                        d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z"
                        fill="url(#k1-light)"
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth="1.2"
                      />
                      <line x1="45" y1="54" x2="24" y2="34" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
                      <circle cx="58" cy="18" r="1.4" fill="#00381a" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z"
                      fill="url(#k1-dark)"
                    />
                    <g filter="url(#k1-sh)">
                      <path
                        d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z"
                        fill="url(#k1-light)"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z"
                      fill="url(#k1-dark)"
                    />
                    <g filter="url(#k1-sh)">
                      <path
                        d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z"
                        fill="url(#k1-light)"
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
                    d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z"
                    fill="url(#k1-dark)"
                  />
                  <g filter="url(#k1-sh)">
                    <path
                      d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z"
                      fill="url(#k1-light)"
                    />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>
                🌿 <strong>Dải 1</strong>: Đi từ đỉnh phone xuống và bẻ góc tạo thành chân phải chữ K.
              </div>
              <div>
                ✨ <strong>Dải 2</strong>: Đi từ đáy phone lên và bẻ góc tạo thành tay phải chữ K, đè chéo ở tâm.
              </div>
            </div>
          </div>

          {/* K-OPTION 2: 3-FACET ORIGAMI FOLD */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 2: Khối Màn Hình Gập 3 Mảnh (Faceted Origami)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Thân Phone có ngàm đón + 2 cánh gập trên/dưới tiếp giáp khít rãnh hairline 1.5px.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Origami 3D
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="k2-stem" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007844" />
                        <stop offset="100%" stopColor="#004824" />
                      </linearGradient>
                      <linearGradient id="k2-top" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                      <linearGradient id="k2-bot" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00B371" />
                        <stop offset="100%" stopColor="#006533" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 16,20 C 16,14 21,11 27,11 L 38,11 L 38,36 L 46,50 L 38,64 L 38,89 L 27,89 C 21,89 16,86 16,80 Z"
                      fill="url(#k2-stem)"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 48,47 L 40,33 L 64,11 C 69,7 77,7 82,12 L 85,15 C 90,20 90,28 85,33 L 53,52 Z"
                      fill="url(#k2-top)"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 53,56 L 85,73 C 90,78 90,86 85,91 L 82,94 C 77,99 69,99 64,95 L 40,73 L 48,59 Z"
                      fill="url(#k2-bot)"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path d="M 16,20 C 16,14 21,11 27,11 L 38,11 L 38,36 L 46,50 L 38,64 L 38,89 L 27,89 C 21,89 16,86 16,80 Z" fill="url(#k2-stem)" />
                    <path d="M 48,47 L 40,33 L 64,11 C 69,7 77,7 82,12 L 85,15 C 90,20 90,28 85,33 L 53,52 Z" fill="url(#k2-top)" />
                    <path d="M 53,56 L 85,73 C 90,78 90,86 85,91 L 82,94 C 77,99 69,99 64,95 L 40,73 L 48,59 Z" fill="url(#k2-bot)" />
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path d="M 16,20 C 16,14 21,11 27,11 L 38,11 L 38,36 L 46,50 L 38,64 L 38,89 L 27,89 C 21,89 16,86 16,80 Z" fill="url(#k2-stem)" />
                    <path d="M 48,47 L 40,33 L 64,11 C 69,7 77,7 82,12 L 85,15 C 90,20 90,28 85,33 L 53,52 Z" fill="url(#k2-top)" />
                    <path d="M 53,56 L 85,73 C 90,78 90,86 85,91 L 82,94 C 77,99 69,99 64,95 L 40,73 L 48,59 Z" fill="url(#k2-bot)" />
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <path d="M 16,20 C 16,14 21,11 27,11 L 38,11 L 38,36 L 46,50 L 38,64 L 38,89 L 27,89 C 21,89 16,86 16,80 Z" fill="url(#k2-stem)" />
                  <path d="M 48,47 L 40,33 L 64,11 C 69,7 77,7 82,12 L 85,15 C 90,20 90,28 85,33 L 53,52 Z" fill="url(#k2-top)" />
                  <path d="M 53,56 L 85,73 C 90,78 90,86 85,91 L 82,94 C 77,99 69,99 64,95 L 40,73 L 48,59 Z" fill="url(#k2-bot)" />
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📐 <strong>Khối gập 3 module</strong>: Liên kết chuẩn xác qua ngàm vát, liền lạc một khối.</div>
              <div>⚡ <strong>Phối 3 dải màu</strong>: Xanh rừng tối → Xanh ngọc trung → Xanh ngọc sáng rực.</div>
            </div>
          </div>

          {/* K-OPTION 3: FLUID MÖBIUS K */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 3: Dải Lụa Khí Động Học (Möbius K)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Đường nét uốn cong mượt mà như chữ S vô cực của Supabase, tạo thành chữ K liền mạch.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Mượt Mà Khí Động Học
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="k3-left" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007844" />
                        <stop offset="100%" stopColor="#004824" />
                      </linearGradient>
                      <linearGradient id="k3-right" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                      <filter id="k3-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-3" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.75" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z"
                      fill="url(#k3-left)"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="1.2"
                    />
                    <g filter="url(#k3-sh)">
                      <path
                        d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z"
                        fill="url(#k3-right)"
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth="1.2"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z" fill="url(#k3-left)" />
                    <g filter="url(#k3-sh)">
                      <path d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z" fill="url(#k3-right)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z" fill="url(#k3-left)" />
                    <g filter="url(#k3-sh)">
                      <path d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z" fill="url(#k3-right)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <path d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z" fill="url(#k3-left)" />
                  <g filter="url(#k3-sh)">
                    <path d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z" fill="url(#k3-right)" />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>🌊 <strong>Dáng mềm</strong>: Các góc bo chuyển tiếp mượt mà như 2 dải uốn lượn Supabase.</div>
              <div>⚡ <strong>Năng động</strong>: Độc đáo, hiện đại và không bị cứng nhắc.</div>
            </div>
          </div>

          {/* K-OPTION 4: SQUIRCLE APP ICON BADGE */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 4: App Store Squircle Badge (K1 Edition)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Bản K-Option 1 đặt trong khung Squircle đen bóng chuẩn macOS/iOS với viền hairline.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  App Store Badge
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="k4-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1F211F" />
                        <stop offset="100%" stopColor="#121312" />
                      </linearGradient>
                    </defs>
                    <rect width="100" height="100" rx="24" fill="url(#k4-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z"
                        fill="url(#k1-dark)"
                      />
                      <g filter="url(#k1-sh)">
                        <path
                          d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z"
                          fill="url(#k1-light)"
                        />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <rect width="100" height="100" rx="24" fill="url(#k4-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z" fill="url(#k1-dark)" />
                      <g filter="url(#k1-sh)">
                        <path d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z" fill="url(#k1-light)" />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <rect width="100" height="100" rx="24" fill="url(#k4-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z" fill="url(#k1-dark)" />
                      <g filter="url(#k1-sh)">
                        <path d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z" fill="url(#k1-light)" />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Favicon)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                  <rect width="100" height="100" rx="24" fill="url(#k4-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <g transform="scale(0.72) translate(19, 19)">
                    <path d="M 18,22 C 18,16 23,12 29,12 L 35,12 C 41,12 45,16 45,22 L 45,40 L 71,66 C 76,71 76,79 71,84 L 66,89 C 61,94 53,94 48,89 L 29,70 C 27,68 25,65 24,62 L 24,52 C 24,46 20,43 18,43 Z" fill="url(#k1-dark)" />
                    <g filter="url(#k1-shadow)">
                      <path d="M 18,78 C 18,84 23,88 29,88 L 35,88 C 41,88 45,84 45,78 L 45,54 L 70,29 C 75,24 75,16 70,11 L 65,6 C 60,1 52,1 47,6 L 27,26 C 25,28 24,31 24,34 L 24,46 C 24,50 20,54 18,54 Z" fill="url(#k1-light)" />
                    </g>
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📦 <strong>Ứng dụng</strong>: Sẵn sàng dùng làm App Icon macOS/iOS, file build desktop (.dmg/.exe).</div>
              <div>🌌 <strong>Độ hoàn thiện</strong>: Đồng nhất hoàn toàn với bảng màu dark theme Supabase.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
