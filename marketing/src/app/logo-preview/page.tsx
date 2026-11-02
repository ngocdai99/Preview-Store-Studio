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
                Chân Chữ Nhật Bo Góc iPad (#006553 & #00D085)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Logo Chữ K: Chân Hình Chữ Nhật Bo Góc iPad
            </h1>
            <p className="mt-2 text-sm text-[#989A99] max-w-2xl leading-relaxed">
              Loại bỏ hoàn toàn hình dáng cánh quạt loe. Chân phải chữ K được thiết kế thành{" "}
              <strong className="text-white">hình chữ nhật bo góc với 2 cạnh thẳng song song</strong>, kích thước thon gọn vừa vặn đúng tỉ lệ màn hình{" "}
              <strong className="text-[#00D085]">iPad Tablet</strong>.
            </p>
          </div>
        </div>

        {/* 4 Concepts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* MẪU 2.1: DẢI UỐN SONG SONG DÁNG IPAD SLAB (KHUYÊN DÙNG ⭐) */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 2.1: Chân Chữ Nhật Song Song Dáng iPad (22px) ⭐
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Cạnh chéo thẳng song song tuyệt đối (không loe cánh quạt), 2 góc đuôi bo tròn chuẩn Apple iPad, kích thước 22px vừa vặn.
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
                      <filter id="p21-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                      fill="#006553"
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
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                      fill="#006553"
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
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                      fill="#006553"
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
                    d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                    fill="#006553"
                  />
                  <g filter="url(#p21-sh)">
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
              <div>📏 <strong>2 cạnh thẳng song song tuyệt đối</strong>: Chiều rộng 22px cố định xuyên suốt, không loe.</div>
              <div>✨ <strong>Đuôi phẳng bo góc r=6</strong>: Giống hệt một tấm màn hình iPad đặt chéo.</div>
            </div>
          </div>

          {/* MẪU 2.2: HÌNH CHỮ NHẬT BO GÓC IPAD THỰC THỤ (<RECT>) */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 2.2: Tấm Chữ Nhật Bo Góc iPad Riêng Biệt
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Sử dụng trực tiếp một hình chữ nhật bo góc độc lập (width=22, height=48, rx=6) đặt làm chân phải chữ K.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Khối Độc Lập
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
                    <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006553" />
                    <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006553" />
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
                    <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006553" />
                    <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006553" />
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
                    <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006553" />
                    <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006553" />
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
                  <path d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,50 L 18,50 Z" fill="#006553" />
                  <rect x="36" y="44" width="22" height="48" rx="6" transform="rotate(-45 36 44)" fill="#006553" />
                  <g filter="url(#p22-sh)">
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
              <div>💻 Thể hiện trực tiếp thẻ rect với 4 góc bo chuẩn xác 100%.</div>
              <div>📱 Cảm giác xếp lớp các tấm thiết bị vật lý cực kỳ rõ ràng.</div>
            </div>
          </div>

          {/* MẪU 1.0: BẢN CHỮ K CÂN ĐỐI CHUẨN (GIỮ NGUYÊN ĐỂ SO SÁNH) */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 1.0: Bản Chữ K Cân Đối Ban Đầu (20px / 20px)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Bản chữ K cân đối ban đầu được lưu giữ nguyên vẹn để đối chiếu và quyết định.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                  Bản Gốc Lưu Trữ
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <filter id="p10-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-2.5" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <path
                      d="M 18,24 C 18,17 22,14 28,14 C 34,14 38,17 38,24 L 38,44 L 72,74 C 77,78 77,86 72,90 C 67,94 59,94 55,90 L 26,64 C 21,60 18,56 18,50 Z"
                      fill="#006553"
                    />
                    <g filter="url(#p10-sh)">
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
                    <g filter="url(#p10-sh)">
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
                    <g filter="url(#p10-sh)">
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
                  <g filter="url(#p10-sh)">
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
              <div>⚖️ Hai dải kích thước đồng đều 20px, đối xứng typography.</div>
              <div>🌿 Chuẩn 2 màu độc quyền #006553 và #00D085.</div>
            </div>
          </div>

          {/* MẪU 2.4: SQUIRCLE APP ICON BADGE DÀNH CHO MẪU 2.1 */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mẫu 2.4: App Store Squircle Badge (Bản 2.1)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Bản 2.1 (Chân Chữ Nhật Song Song iPad) đóng gói trong khung Squircle đen bóng chuẩn macOS / iOS.
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
                        d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                        fill="#006553"
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
                        d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                        fill="#006553"
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
                        d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                        fill="#006553"
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
                      d="M 18,22 C 18,15 22,11 28,11 C 34,11 38,15 38,22 L 38,42 L 67,71 C 71,75 71,81 67,85 L 56,96 C 52,100 46,100 42,96 L 18,72 Z"
                      fill="#006553"
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
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006553] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📦 Chân chữ nhật iPad song song vừa vặn, không bị bè hay loe quạt.</div>
              <div>🌌 Viền hairline và squircle đen sâu tôn vinh màu ngọc lục bảo.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
