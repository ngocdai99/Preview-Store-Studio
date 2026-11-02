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
                Bộ Đôi Màu Chuẩn (#006553 & #00D085)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Logo Chữ K: Chuẩn 2 Màu (#006553 & #00D085)
            </h1>
            <p className="mt-2 text-sm text-[#989A99] max-w-2xl leading-relaxed">
              Lược bỏ hoàn toàn camera, vạch thẻ, chi tiết thừa. Chỉ giữ lại{" "}
              <strong className="text-white">khối hình học chữ K sắc lẹm</strong> với{" "}
              <strong className="text-[#00D085]">tỉ lệ dáng Phone & iPad bo tròn Apple</strong> và 2 sắc xanh:{" "}
              Xanh đậm (<code className="text-[#00D085]">#006553</code>) + Xanh sáng (
              <code className="text-[#00D085]">#00D085</code>).
            </p>
          </div>
        </div>

        {/* 4 Concepts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* MẪU 1: HAI DẢI VÔ CỰC LỒNG NHAU */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 1: Hai Dải Vô Cực Uốn Gập (Pure 2-Ribbon K)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    2 dải uốn liền mạch lồng vào nhau tại tâm: 1 dải xanh đậm (#006553) + 1 dải xanh sáng (#00D085). Không vạch thừa.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Khuyên dùng số 1 ⭐
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <filter id="m1-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-3" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                      fill="#006553"
                    />
                    <g filter="url(#m1-sh)">
                      <path
                        d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                      fill="#006553"
                    />
                    <g filter="url(#m1-sh)">
                      <path
                        d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                      fill="#006553"
                    />
                    <g filter="url(#m1-sh)">
                      <path
                        d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
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
                    d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                    fill="#006553"
                  />
                  <g filter="url(#m1-sh)">
                    <path
                      d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
                      fill="#00D085"
                    />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006553] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>🌿 <strong>Xanh đậm (#006553)</strong>: Thân trên Phone bẻ góc 45° thành chân phải chữ K.</div>
              <div>✨ <strong>Xanh sáng (#00D085)</strong>: Thân dưới Phone bẻ góc 45° thành tay trên chữ K.</div>
            </div>
          </div>

          {/* MẪU 2: PHONE ĐỨNG + CÁNH GẬP CHEVRON */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 2: Phone Thẳng Đứng + Cánh Gập Tablet (Clean Duo)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Thân Phone đứng vững chãi màu xanh đậm (#006553) + Cánh Tablet mở góc màu xanh sáng (#00D085).
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Rõ Dáng Thiết Bị
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <filter id="m2-sh" x="-25%" y="-25%" width="150%" height="150%">
                        <feDropShadow dx="-2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.75" />
                      </filter>
                    </defs>
                    <rect x="16" y="11" width="24" height="78" rx="7.5" fill="#006553" />
                    <g transform="rotate(38 46 50)" filter="url(#m2-sh)">
                      <rect x="42" y="12" width="24" height="46" rx="6" fill="#00D085" />
                    </g>
                    <g transform="rotate(-38 46 50)" filter="url(#m2-sh)">
                      <rect x="42" y="42" width="24" height="46" rx="6" fill="#00D085" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <rect x="16" y="11" width="24" height="78" rx="7.5" fill="#006553" />
                    <g transform="rotate(38 46 50)" filter="url(#m2-sh)">
                      <rect x="42" y="12" width="24" height="46" rx="6" fill="#00D085" />
                    </g>
                    <g transform="rotate(-38 46 50)" filter="url(#m2-sh)">
                      <rect x="42" y="42" width="24" height="46" rx="6" fill="#00D085" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <rect x="16" y="11" width="24" height="78" rx="7.5" fill="#006553" />
                    <g transform="rotate(38 46 50)" filter="url(#m2-sh)">
                      <rect x="42" y="12" width="24" height="46" rx="6" fill="#00D085" />
                    </g>
                    <g transform="rotate(-38 46 50)" filter="url(#m2-sh)">
                      <rect x="42" y="42" width="24" height="46" rx="6" fill="#00D085" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <rect x="16" y="11" width="24" height="78" rx="7.5" fill="#006553" />
                  <g transform="rotate(38 46 50)" filter="url(#m2-sh)">
                    <rect x="42" y="12" width="24" height="46" rx="6" fill="#00D085" />
                  </g>
                  <g transform="rotate(-38 46 50)" filter="url(#m2-sh)">
                    <rect x="42" y="42" width="24" height="46" rx="6" fill="#00D085" />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006553] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📱 <strong>Thân Phone (#006553)</strong>: Đúng tỉ lệ 19.5:9 của iPhone đứng thẳng.</div>
              <div>💻 <strong>Cánh Tablet (#00D085)</strong>: Đúng tỉ lệ màn hình gập bo cong góc chuẩn Apple.</div>
            </div>
          </div>

          {/* MẪU 3: DẢI LỤA KHÍ ĐỘNG HỌC MỀM */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 3: Dải Lụa Khí Động Học Mềm (Air-Curve K)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Phiên bản đường cong khí động học mượt mà hơn với 2 màu #006553 và #00D085.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Mượt Mà
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <path
                      d="M 18,24 C 18,15 24,11 32,11 L 36,11 C 44,11 48,15 48,24 L 48,44 C 48,48 51,51 54,54 L 72,72 C 77,77 77,85 72,90 C 67,95 59,95 54,90 L 36,72 C 32,68 28,66 24,66 L 18,66 Z"
                      fill="#006553"
                    />
                    <g filter="url(#m1-sh)">
                      <path
                        d="M 18,76 C 18,85 24,89 32,89 L 36,89 C 44,89 48,85 48,76 L 48,56 C 48,52 51,49 54,46 L 72,28 C 77,23 77,15 72,10 C 67,5 59,5 54,10 L 36,28 C 32,32 28,34 24,34 L 18,34 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 18,24 C 18,15 24,11 32,11 L 36,11 C 44,11 48,15 48,24 L 48,44 C 48,48 51,51 54,54 L 72,72 C 77,77 77,85 72,90 C 67,95 59,95 54,90 L 36,72 C 32,68 28,66 24,66 L 18,66 Z"
                      fill="#006553"
                    />
                    <g filter="url(#m1-sh)">
                      <path
                        d="M 18,76 C 18,85 24,89 32,89 L 36,89 C 44,89 48,85 48,76 L 48,56 C 48,52 51,49 54,46 L 72,28 C 77,23 77,15 72,10 C 67,5 59,5 54,10 L 36,28 C 32,32 28,34 24,34 L 18,34 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 18,24 C 18,15 24,11 32,11 L 36,11 C 44,11 48,15 48,24 L 48,44 C 48,48 51,51 54,54 L 72,72 C 77,77 77,85 72,90 C 67,95 59,95 54,90 L 36,72 C 32,68 28,66 24,66 L 18,66 Z"
                      fill="#006553"
                    />
                    <g filter="url(#m1-sh)">
                      <path
                        d="M 18,76 C 18,85 24,89 32,89 L 36,89 C 44,89 48,85 48,76 L 48,56 C 48,52 51,49 54,46 L 72,28 C 77,23 77,15 72,10 C 67,5 59,5 54,10 L 36,28 C 32,32 28,34 24,34 L 18,34 Z"
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
                    d="M 18,24 C 18,15 24,11 32,11 L 36,11 C 44,11 48,15 48,24 L 48,44 C 48,48 51,51 54,54 L 72,72 C 77,77 77,85 72,90 C 67,95 59,95 54,90 L 36,72 C 32,68 28,66 24,66 L 18,66 Z"
                    fill="#006553"
                  />
                  <g filter="url(#m1-sh)">
                    <path
                      d="M 18,76 C 18,85 24,89 32,89 L 36,89 C 44,89 48,85 48,76 L 48,56 C 48,52 51,49 54,46 L 72,28 C 77,23 77,15 72,10 C 67,5 59,5 54,10 L 36,28 C 32,32 28,34 24,34 L 18,34 Z"
                      fill="#00D085"
                    />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006553] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>🌊 Bo tròn khí động học, tạo cảm giác vô cực thanh thoát.</div>
              <div>⚡ Tối giản hoàn toàn, nhận diện chữ K tức thì ở kích thước micro.</div>
            </div>
          </div>

          {/* MẪU 4: SQUIRCLE APP ICON BADGE */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 4: App Store Squircle Badge (Bản Mẫu 1)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Bản Mẫu 1 đặt trong khung Squircle đen bóng chuẩn macOS / iOS với 2 màu #006553 và #00D085.
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
                      <linearGradient id="m4-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1F211F" />
                        <stop offset="100%" stopColor="#121312" />
                      </linearGradient>
                    </defs>
                    <rect width="100" height="100" rx="24" fill="url(#m4-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                        fill="#006553"
                      />
                      <g filter="url(#m1-sh)">
                        <path
                          d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
                          fill="#00D085"
                        />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <rect width="100" height="100" rx="24" fill="url(#m4-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                        fill="#006553"
                      />
                      <g filter="url(#m1-sh)">
                        <path
                          d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
                          fill="#00D085"
                        />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <rect width="100" height="100" rx="24" fill="url(#m4-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                        fill="#006553"
                      />
                      <g filter="url(#m1-sh)">
                        <path
                          d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                  <rect width="100" height="100" rx="24" fill="url(#m4-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <g transform="scale(0.72) translate(19, 19)">
                    <path
                      d="M 18,22 C 18,15 24,11 32,11 C 40,11 44,15 44,22 L 44,42 L 67,65 C 72,70 72,78 67,83 L 61,89 C 56,94 48,94 43,89 L 26,72 C 22,68 18,63 18,57 Z"
                      fill="#006553"
                    />
                    <g filter="url(#m1-sh)">
                      <path
                        d="M 18,78 C 18,85 24,89 32,89 C 40,89 44,85 44,78 L 44,58 L 67,35 C 72,30 72,22 67,17 L 61,11 C 56,6 48,6 43,11 L 26,28 C 22,32 18,37 18,43 Z"
                        fill="#00D085"
                      />
                    </g>
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006553] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📦 Biểu tượng chữ K vô cực được đóng gói hoàn hảo trong icon bo góc.</div>
              <div>🌌 Đầy đủ tỉ lệ tương phản và độ nhận diện cao để xuất file app desktop và mobile.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
