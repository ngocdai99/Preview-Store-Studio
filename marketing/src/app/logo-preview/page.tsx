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
                Dáng Uốn Chữ K Chuẩn Typography (#006553 & #00D085)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Logo Chữ K: Tinh Chỉnh Uốn Gập Chuẩn Dáng K
            </h1>
            <p className="mt-2 text-sm text-[#989A99] max-w-2xl leading-relaxed">
              Cột sống đứng bên trái được giữ{" "}
              <strong className="text-white">thẳng tắp liền mạch</strong>, kết hợp{" "}
              <strong className="text-[#00D085]">2 cánh chéo vươn rộng chuẩn tỉ lệ chữ K</strong> với 2 sắc xanh độc quyền:{" "}
              Xanh đậm (<code className="text-[#00D085]">#006553</code>) + Xanh sáng (
              <code className="text-[#00D085]">#00D085</code>).
            </p>
          </div>
        </div>

        {/* 4 Concepts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* MẪU 1.1: CHUẨN TỈ LỆ CHỮ K */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 1.1: Chuẩn Tỉ Lệ Chữ K (True Proportions K)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Cột sống trái thẳng tắp không bị thắt eo + 2 cánh chéo mở góc 45° vươn rộng rõ nét chữ K.
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
                      <filter id="p11-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p11-sh)">
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
                      d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p11-sh)">
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
                      d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p11-sh)">
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
                    d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                    fill="#006553"
                  />
                  <g filter="url(#p11-sh)">
                    <path
                      d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
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
              <div>🌿 <strong>Cột sống đứng bên trái</strong>: Liền mạch từ trên xuống dưới, không gãy khúc.</div>
              <div>✨ <strong>2 cánh chéo</strong>: Vươn tới x=72..77, tạo góc mở &lt; sắc lẹm chuẩn chữ K.</div>
            </div>
          </div>

          {/* MẪU 1.2: CÁNH CHÉO VƯƠN XA NĂNG ĐỘNG */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 1.2: Cánh Chéo Vươn Xa Năng Động (Dynamic Extended K)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Cánh chéo vươn xa hơn tới x=82, góc mở phóng khoáng hơn mang phong cách công nghệ thể thao.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Phong Khoáng
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <filter id="p12-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 17,22 C 17,15 21,11 27,11 C 33,11 37,15 37,22 L 37,42 L 77,76 C 82,80 82,88 77,93 C 72,97 64,97 60,93 L 26,64 C 21,59 17,55 17,49 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p12-sh)">
                      <path
                        d="M 17,78 C 17,85 21,89 27,89 C 33,89 37,85 37,78 L 37,58 L 77,24 C 82,20 82,12 77,7 C 72,3 64,3 60,7 L 26,36 C 21,41 17,45 17,51 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 17,22 C 17,15 21,11 27,11 C 33,11 37,15 37,22 L 37,42 L 77,76 C 82,80 82,88 77,93 C 72,97 64,97 60,93 L 26,64 C 21,59 17,55 17,49 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p12-sh)">
                      <path
                        d="M 17,78 C 17,85 21,89 27,89 C 33,89 37,85 37,78 L 37,58 L 77,24 C 82,20 82,12 77,7 C 72,3 64,3 60,7 L 26,36 C 21,41 17,45 17,51 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 17,22 C 17,15 21,11 27,11 C 33,11 37,15 37,22 L 37,42 L 77,76 C 82,80 82,88 77,93 C 72,97 64,97 60,93 L 26,64 C 21,59 17,55 17,49 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p12-sh)">
                      <path
                        d="M 17,78 C 17,85 21,89 27,89 C 33,89 37,85 37,78 L 37,58 L 77,24 C 82,20 82,12 77,7 C 72,3 64,3 60,7 L 26,36 C 21,41 17,45 17,51 Z"
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
                    d="M 17,22 C 17,15 21,11 27,11 C 33,11 37,15 37,22 L 37,42 L 77,76 C 82,80 82,88 77,93 C 72,97 64,97 60,93 L 26,64 C 21,59 17,55 17,49 Z"
                    fill="#006553"
                  />
                  <g filter="url(#p12-sh)">
                    <path
                      d="M 17,78 C 17,85 21,89 27,89 C 33,89 37,85 37,78 L 37,58 L 77,24 C 82,20 82,12 77,7 C 72,3 64,3 60,7 L 26,36 C 21,41 17,45 17,51 Z"
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
              <div>🚀 Góc sải cánh rộng hơn, tạo cảm giác chuyển động và vươn xa.</div>
              <div>⚡ Lấp đầy không gian khung hình một cách mạnh mẽ.</div>
            </div>
          </div>

          {/* MẪU 1.3: DẢI LỤA UỐN LƯỢN MỀM */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 1.3: Dải Lụa Uốn Lượn Mềm (Continuous Flow K)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Giao điểm giữa thân đứng và cánh chéo được bo cong mềm mại hơn, tạo cảm giác uốn lượn liên tục.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Mềm Mại
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <filter id="p13-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,24 C 18,16 23,12 30,12 C 37,12 40,16 40,24 L 40,40 C 40,46 44,50 49,54 L 72,73 C 77,77 77,85 72,89 C 67,93 59,93 55,89 L 32,68 C 24,61 18,56 18,48 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p13-sh)">
                      <path
                        d="M 18,76 C 18,84 23,88 30,88 C 37,88 40,84 40,76 L 40,60 C 40,54 44,50 49,46 L 72,27 C 77,23 77,15 72,11 C 67,7 59,7 55,11 L 32,32 C 24,39 18,44 18,52 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 18,24 C 18,16 23,12 30,12 C 37,12 40,16 40,24 L 40,40 C 40,46 44,50 49,54 L 72,73 C 77,77 77,85 72,89 C 67,93 59,93 55,89 L 32,68 C 24,61 18,56 18,48 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p13-sh)">
                      <path
                        d="M 18,76 C 18,84 23,88 30,88 C 37,88 40,84 40,76 L 40,60 C 40,54 44,50 49,46 L 72,27 C 77,23 77,15 72,11 C 67,7 59,7 55,11 L 32,32 C 24,39 18,44 18,52 Z"
                        fill="#00D085"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 18,24 C 18,16 23,12 30,12 C 37,12 40,16 40,24 L 40,40 C 40,46 44,50 49,54 L 72,73 C 77,77 77,85 72,89 C 67,93 59,93 55,89 L 32,68 C 24,61 18,56 18,48 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p13-sh)">
                      <path
                        d="M 18,76 C 18,84 23,88 30,88 C 37,88 40,84 40,76 L 40,60 C 40,54 44,50 49,46 L 72,27 C 77,23 77,15 72,11 C 67,7 59,7 55,11 L 32,32 C 24,39 18,44 18,52 Z"
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
                    d="M 18,24 C 18,16 23,12 30,12 C 37,12 40,16 40,24 L 40,40 C 40,46 44,50 49,54 L 72,73 C 77,77 77,85 72,89 C 67,93 59,93 55,89 L 32,68 C 24,61 18,56 18,48 Z"
                    fill="#006553"
                  />
                  <g filter="url(#p13-sh)">
                    <path
                      d="M 18,76 C 18,84 23,88 30,88 C 37,88 40,84 40,76 L 40,60 C 40,54 44,50 49,46 L 72,27 C 77,23 77,15 72,11 C 67,7 59,7 55,11 L 32,32 C 24,39 18,44 18,52 Z"
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
              <div>🌊 Bo cong mềm mại tại ngã ba giao nhau, uyển chuyển như dòng chảy.</div>
              <div>✨ Vừa giữ được chất hình học vừa tạo cảm giác thân thiện, thanh lịch.</div>
            </div>
          </div>

          {/* MẪU 1.4: SQUIRCLE APP ICON BADGE */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 1.4: App Store Squircle Badge (Bản Mẫu 1.1)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Bản Mẫu 1.1 đặt trong khung Squircle đen bóng chuẩn macOS / iOS với 2 màu #006553 và #00D085.
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
                      <linearGradient id="p14-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1F211F" />
                        <stop offset="100%" stopColor="#121312" />
                      </linearGradient>
                    </defs>
                    <rect width="100" height="100" rx="24" fill="url(#p14-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                        fill="#006553"
                      />
                      <g filter="url(#p11-sh)">
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
                    <rect width="100" height="100" rx="24" fill="url(#p14-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                        fill="#006553"
                      />
                      <g filter="url(#p11-sh)">
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
                    <rect width="100" height="100" rx="24" fill="url(#p14-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                        fill="#006553"
                      />
                      <g filter="url(#p11-sh)">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                  <rect width="100" height="100" rx="24" fill="url(#p14-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <g transform="scale(0.72) translate(19, 19)">
                    <path
                      d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p11-sh)">
                      <path
                        d="M 18,76 C 18,83 22,86 28,86 C 34,86 38,83 38,76 L 38,56 L 72,26 C 77,22 77,14 72,10 C 67,6 59,6 55,10 L 26,36 C 21,40 18,44 18,50 Z"
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
              <div>📦 Biểu tượng chữ K cân đối chuẩn mực trong icon bo góc macOS/iOS.</div>
              <div>🌌 Đầy đủ tỉ lệ tương phản và độ nhận diện cao để xuất file app desktop và mobile.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
