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
                Tích hợp DNA Apple Hardware
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Logo Chữ K: Dáng Uốn Lượn + Chi Tiết iPhone & iPad
            </h1>
            <p className="mt-2 text-sm text-[#989A99] max-w-2xl leading-relaxed">
              Giữ nguyên <strong className="text-white">dáng gập liên tục mềm mại, uyển chuyển của Option 3</strong>{" "}
              nhưng cấy thêm đầy đủ đặc trưng phần cứng của Apple:{" "}
              <strong className="text-[#00D085]">Dynamic Island, viền bezel màn hình kính, camera trước iPad, vạch Home Bar và thẻ layout App Store</strong>.
            </p>
          </div>
        </div>

        {/* 4 Concepts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* K-OPTION 3.1: DUAL RIBBON + DYNAMIC ISLAND & IPAD BEZEL */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 3.1: Dual Ribbon + Dynamic Island & iPad Bezel
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Dáng uốn lượn liên tục của Option 3, tích hợp Dynamic Island rõ nét trên iPhone + viền màn hình iPad với camera trước.
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
                      <linearGradient id="k31-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007844" />
                        <stop offset="100%" stopColor="#00381a" />
                      </linearGradient>
                      <linearGradient id="k31-light" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                      <filter id="k31-sh" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="-3" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.75" />
                      </filter>
                    </defs>
                    <g>
                      <path
                        d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                        fill="url(#k31-dark)"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1.2"
                      />
                      <rect x="26" y="15" width="10" height="2.8" rx="1.4" fill="#00180a" />
                      <circle cx="33.5" cy="16.4" r="0.6" fill="#00d085" opacity="0.8" />
                      <rect
                        x="19.5"
                        y="21"
                        width="17"
                        height="20"
                        rx="2.5"
                        fill="rgba(255,255,255,0.1)"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="0.8"
                      />
                      <rect x="22" y="24" width="12" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
                      <rect x="22" y="30" width="8" height="2" rx="0.6" fill="rgba(255,255,255,0.2)" />
                      <rect
                        x="48"
                        y="68"
                        width="16"
                        height="14"
                        rx="2.5"
                        transform="rotate(45 56 75)"
                        fill="rgba(255,255,255,0.12)"
                      />
                    </g>
                    <g filter="url(#k31-sh)">
                      <path
                        d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                        fill="url(#k31-light)"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="66"
                        cy="15"
                        r="1.3"
                        fill="#00381a"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="0.5"
                      />
                      <rect
                        x="48"
                        y="25"
                        width="16"
                        height="14"
                        rx="2.5"
                        transform="rotate(-45 56 32)"
                        fill="rgba(255,255,255,0.28)"
                      />
                      <rect x="27" y="84" width="8" height="1.2" rx="0.6" fill="rgba(255,255,255,0.5)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                      fill="url(#k31-dark)"
                    />
                    <rect x="26" y="15" width="10" height="2.8" rx="1.4" fill="#00180a" />
                    <g filter="url(#k31-sh)">
                      <path
                        d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                        fill="url(#k31-light)"
                      />
                      <circle cx="66" cy="15" r="1.4" fill="#00381a" />
                      <rect x="27" y="84" width="8" height="1.2" rx="0.6" fill="rgba(255,255,255,0.6)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                      fill="url(#k31-dark)"
                    />
                    <rect x="26" y="15" width="10" height="3" rx="1.5" fill="#00180a" />
                    <g filter="url(#k31-sh)">
                      <path
                        d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                        fill="url(#k31-light)"
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
                    d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                    fill="url(#k31-dark)"
                  />
                  <rect x="26" y="15" width="10" height="3" rx="1.5" fill="#00180a" />
                  <g filter="url(#k31-sh)">
                    <path
                      d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                      fill="url(#k31-light)"
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
                📱 <strong>iPhone rõ rệt</strong>: Dynamic Island viên thuốc + Camera selfie + Home Indicator bar ở chân.
              </div>
              <div>
                💻 <strong>iPad rõ rệt</strong>: Tỉ lệ màn hình rộng + Camera trước + Thẻ giao diện tabletOS.
              </div>
            </div>
          </div>

          {/* K-OPTION 3.2: MULTI-DEVICE SCREEN CONTIGUOUS */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 3.2: Phone + Unfolded Tablet Screen
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Thân Phone đứng thẳng nguyên vẹn (100% dáng iPhone) + Màn hình Tablet mở góc tiếp giáp khít rãnh gập.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Rõ Dáng Thiết Bị Nhất
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="k32-phone" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007844" />
                        <stop offset="100%" stopColor="#00381a" />
                      </linearGradient>
                      <linearGradient id="k32-ipad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                      <filter id="k32-sh" x="-25%" y="-25%" width="150%" height="150%">
                        <feDropShadow dx="-2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.75" />
                      </filter>
                    </defs>
                    <g>
                      <rect
                        x="16"
                        y="11"
                        width="24"
                        height="78"
                        rx="7.5"
                        fill="url(#k32-phone)"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1.2"
                      />
                      <rect x="23.5" y="15" width="9" height="2.6" rx="1.3" fill="#00180a" />
                      <circle cx="30" cy="16.3" r="0.55" fill="#00d085" />
                      <rect x="19" y="20" width="18" height="62" rx="4" fill="rgba(255,255,255,0.08)" />
                      <rect x="21.5" y="24" width="13" height="16" rx="2" fill="rgba(255,255,255,0.18)" />
                      <rect x="21.5" y="43" width="13" height="14" rx="2" fill="rgba(255,255,255,0.18)" />
                      <rect x="25" y="78" width="6" height="1.2" rx="0.6" fill="rgba(255,255,255,0.4)" />
                    </g>
                    <g transform="rotate(38 46 50)" filter="url(#k32-sh)">
                      <rect
                        x="42"
                        y="12"
                        width="24"
                        height="46"
                        rx="6"
                        fill="url(#k32-ipad)"
                        stroke="rgba(255,255,255,0.38)"
                        strokeWidth="1.2"
                      />
                      <circle cx="54" cy="16" r="1.3" fill="#00381a" />
                      <rect x="45.5" y="20" width="17" height="32" rx="3" fill="rgba(255,255,255,0.25)" />
                      <rect x="48" y="24" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.3)" />
                      <rect x="48" y="37" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.3)" />
                    </g>
                    <g transform="rotate(-38 46 50)" filter="url(#k32-sh)">
                      <rect
                        x="42"
                        y="42"
                        width="24"
                        height="46"
                        rx="6"
                        fill="url(#k32-ipad)"
                        stroke="rgba(255,255,255,0.38)"
                        strokeWidth="1.2"
                      />
                      <rect x="45.5" y="48" width="17" height="32" rx="3" fill="rgba(255,255,255,0.25)" />
                      <rect x="48" y="52" width="12" height="10" rx="1.5" fill="rgba(255,255,255,0.3)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <rect x="16" y="11" width="24" height="78" rx="7.5" fill="url(#k32-phone)" />
                    <rect x="23.5" y="15" width="9" height="2.6" rx="1.3" fill="#00180a" />
                    <g transform="rotate(38 46 50)" filter="url(#k32-sh)">
                      <rect x="42" y="12" width="24" height="46" rx="6" fill="url(#k32-ipad)" />
                    </g>
                    <g transform="rotate(-38 46 50)" filter="url(#k32-sh)">
                      <rect x="42" y="42" width="24" height="46" rx="6" fill="url(#k32-ipad)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <rect x="16" y="11" width="24" height="78" rx="7.5" fill="url(#k32-phone)" />
                    <rect x="23.5" y="15" width="9" height="2.8" rx="1.4" fill="#00180a" />
                    <g transform="rotate(38 46 50)" filter="url(#k32-sh)">
                      <rect x="42" y="12" width="24" height="46" rx="6" fill="url(#k32-ipad)" />
                    </g>
                    <g transform="rotate(-38 46 50)" filter="url(#k32-sh)">
                      <rect x="42" y="42" width="24" height="46" rx="6" fill="url(#k32-ipad)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <rect x="16" y="11" width="24" height="78" rx="7.5" fill="url(#k32-phone)" />
                  <rect x="23.5" y="15" width="9" height="2.8" rx="1.4" fill="#00180a" />
                  <g transform="rotate(38 46 50)" filter="url(#k32-sh)">
                    <rect x="42" y="12" width="24" height="46" rx="6" fill="url(#k32-ipad)" />
                  </g>
                  <g transform="rotate(-38 46 50)" filter="url(#k32-sh)">
                    <rect x="42" y="42" width="24" height="46" rx="6" fill="url(#k32-ipad)" />
                  </g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📱 Chiếc Phone đứng thẳng nguyên vẹn, tỷ lệ khung viền hoàn hảo.</div>
              <div>💻 Cánh Tablet mở góc chevron tiếp xúc khít cạnh phải tạo chữ K vững chãi.</div>
            </div>
          </div>

          {/* K-OPTION 3.3: SEAMLESS ORIGAMI SCREEN RIBBON */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 3.3: Seamless Origami Screen Ribbon
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Dải lụa không gian tích hợp đường viền màn hình bezel siêu mảnh + camera selfie, cực kỳ hiện đại.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Tối Giản Hiện Đại
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="k33-d" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#007844" />
                        <stop offset="100%" stopColor="#00381a" />
                      </linearGradient>
                      <linearGradient id="k33-l" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z"
                      fill="url(#k33-d)"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="1.2"
                    />
                    <rect x="26" y="15" width="9" height="2.5" rx="1.25" fill="#00180a" />
                    <path
                      d="M 22,22 L 22,58 L 34,58 L 56,80 C 58,82 62,82 64,80 L 66,78 C 68,76 68,72 66,70 L 43,47 L 43,22 Z"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                    <g filter="url(#k31-sh)">
                      <path
                        d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z"
                        fill="url(#k33-l)"
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth="1.2"
                      />
                      <circle cx="64" cy="17" r="1.3" fill="#00381a" />
                      <path
                        d="M 22,78 L 22,42 L 34,42 L 56,20 C 58,18 62,18 64,20 L 66,22 C 68,24 68,28 66,30 L 43,53 L 43,78 Z"
                        fill="none"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="1"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <path
                      d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z"
                      fill="url(#k33-d)"
                    />
                    <rect x="26" y="15" width="9" height="2.5" rx="1.25" fill="#00180a" />
                    <g filter="url(#k31-sh)">
                      <path
                        d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z"
                        fill="url(#k33-l)"
                      />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <path
                      d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z"
                      fill="url(#k33-d)"
                    />
                    <rect x="26" y="15" width="9" height="2.5" rx="1.25" fill="#00180a" />
                    <g filter="url(#k31-sh)">
                      <path
                        d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z"
                        fill="url(#k33-l)"
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
                    d="M 18,22 C 18,15 24,12 30,12 L 36,12 C 42,12 47,15 47,22 L 47,44 C 47,47 50,49 53,52 L 72,71 C 77,76 77,84 72,89 C 67,94 59,94 54,89 L 36,71 C 32,67 28,65 24,65 L 18,65 Z"
                    fill="url(#k33-d)"
                  />
                  <rect x="26" y="15" width="9" height="2.5" rx="1.25" fill="#00180a" />
                  <g filter="url(#k31-sh)">
                    <path
                      d="M 18,78 C 18,85 24,88 30,88 L 36,88 C 42,88 47,85 47,78 L 47,56 C 47,53 50,51 53,48 L 72,29 C 77,24 77,16 72,11 C 67,6 59,6 54,11 L 36,29 C 32,33 28,35 24,35 L 18,35 Z"
                      fill="url(#k33-l)"
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
              <div>✨ Khắc laser đường viền bezel siêu mảnh bên trong dải lụa.</div>
              <div>🎯 Dynamic Island sắc nét giúp nhận diện thiết bị Apple từ xa.</div>
            </div>
          </div>

          {/* K-OPTION 3.4: SQUIRCLE APP ICON BADGE */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    K-Option 3.4: App Store Squircle Badge (K3.1 Edition)
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Bản K-Option 3.1 đặt trong khung Squircle đen bóng chuẩn macOS / iOS với viền phát sáng hairline.
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
                      <linearGradient id="k34-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1F211F" />
                        <stop offset="100%" stopColor="#121312" />
                      </linearGradient>
                    </defs>
                    <rect width="100" height="100" rx="24" fill="url(#k34-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                        fill="url(#k31-dark)"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1.2"
                      />
                      <rect x="26" y="15" width="10" height="2.8" rx="1.4" fill="#00180a" />
                      <g filter="url(#k31-sh)">
                        <path
                          d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                          fill="url(#k31-light)"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="1.2"
                        />
                        <circle cx="66" cy="15" r="1.3" fill="#00381a" />
                        <rect x="27" y="84" width="8" height="1.2" rx="0.6" fill="rgba(255,255,255,0.5)" />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <rect width="100" height="100" rx="24" fill="url(#k34-bg)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                        fill="url(#k31-dark)"
                      />
                      <rect x="26" y="15" width="10" height="2.8" rx="1.4" fill="#00180a" />
                      <g filter="url(#k31-sh)">
                        <path
                          d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                          fill="url(#k31-light)"
                        />
                      </g>
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <rect width="100" height="100" rx="24" fill="url(#k34-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                    <g transform="scale(0.72) translate(19, 19)">
                      <path
                        d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                        fill="url(#k31-dark)"
                      />
                      <rect x="26" y="15" width="10" height="3" rx="1.5" fill="#00180a" />
                      <g filter="url(#k31-sh)">
                        <path
                          d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                          fill="url(#k31-light)"
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
                  <rect width="100" height="100" rx="24" fill="url(#k34-bg)" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <g transform="scale(0.72) translate(19, 19)">
                    <path
                      d="M 16,22 C 16,14 22,11 30,11 L 36,11 C 44,11 48,15 48,23 L 48,44 C 48,47 51,50 54,53 L 73,72 C 78,77 78,85 73,90 C 68,95 60,95 55,90 L 37,72 C 32,67 27,65 22,65 L 16,65 Z"
                      fill="url(#k31-dark)"
                    />
                    <rect x="26" y="15" width="10" height="3" rx="1.5" fill="#00180a" />
                    <g filter="url(#k31-sh)">
                      <path
                        d="M 16,78 C 16,86 22,89 30,89 L 36,89 C 44,89 48,85 48,77 L 48,56 C 48,53 51,50 54,47 L 73,28 C 78,23 78,15 73,10 C 68,5 60,5 55,10 L 37,28 C 32,33 27,35 22,35 L 16,35 Z"
                        fill="url(#k31-light)"
                      />
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
              <div>📦 Biểu tượng chữ K vô cực được đóng gói hoàn hảo trong icon bo góc.</div>
              <div>🌌 Đầy đủ tỉ lệ tương phản và độ nhận diện cao để xuất file app desktop và mobile.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
