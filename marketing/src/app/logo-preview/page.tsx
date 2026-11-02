import React from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/ui/BrandIcon";

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
                Brand Identity
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Logo Exploration: Phone + Tablet Interlocking
            </h1>
            <p className="mt-2 text-sm text-[#989A99] max-w-2xl leading-relaxed">
              Lấy cảm hứng từ khối geometric vô cực của Supabase: kết hợp{" "}
              <strong className="text-white">2 thiết bị (Tablet rộng & Phone thon)</strong>{" "}
              lồng ghép tạo thành chữ <strong className="text-[#00D085]">V</strong> (PreView) hoặc{" "}
              <strong className="text-sky-400">K</strong> (Kai DevLabs) với hai dải màu xanh rừng đậm (
              <code className="text-[#00D085]">#006533</code>) và xanh ngọc sáng (
              <code className="text-[#00D085]">#00D085</code>).
            </p>
          </div>
        </div>

        {/* 4 Concepts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* CONCEPT 1: DUAL DEVICES INTERLOCKING V */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 1: Chữ V - Dual Devices
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Tablet (xanh đậm) + Phone (xanh sáng) chéo góc đè lên nhau, có đổ bóng 3D.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  Đề xuất số 1
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <BrandIcon className="w-24 h-24" />
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BrandIcon className="w-12 h-12" />
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BrandIcon className="w-6 h-6" />
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <BrandIcon className="w-5 h-5" />
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <div className="hidden sm:flex gap-3 text-[11px] text-[#989A99] ml-3">
                  <span>Studio</span>
                  <span>Features</span>
                  <span>Pricing</span>
                </div>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>
                🌿 <strong>Nhánh trái</strong>: Tablet iPad (Màu xanh rừng #006533, camera dot, góc nghiêng -23°)
              </div>
              <div>
                ✨ <strong>Nhánh phải</strong>: Phone iPhone (Màu xanh ngọc #00D085, Dynamic Island, đè lên đỉnh chữ V)
              </div>
            </div>
          </div>

          {/* CONCEPT 2: PURE MINIMALIST V */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 2: Chữ V - Supabase Minimalist
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Khối hình học tối giản phẳng, đường nét tinh gọn, nhận diện cực mạnh ở 16px.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                  Clean & Bold
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="v2-tab" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#008746" />
                        <stop offset="100%" stopColor="#004824" />
                      </linearGradient>
                      <linearGradient id="v2-pho" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                      <filter id="v2-sh" x="-25%" y="-25%" width="150%" height="150%">
                        <feDropShadow dx="-3" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
                      </filter>
                    </defs>
                    <g transform="rotate(-24 34 50)">
                      <rect x="18" y="14" width="32" height="70" rx="9" fill="url(#v2-tab)" />
                      <rect x="23" y="20" width="22" height="58" rx="5" fill="rgba(255,255,255,0.08)" />
                      <circle cx="34" cy="17" r="1.5" fill="rgba(255,255,255,0.3)" />
                    </g>
                    <g transform="rotate(24 66 50)" filter="url(#v2-sh)">
                      <rect x="54" y="12" width="24" height="74" rx="8" fill="url(#v2-pho)" />
                      <rect x="58" y="18" width="16" height="62" rx="4.5" fill="rgba(255,255,255,0.22)" />
                      <rect x="62" y="14.5" width="8" height="2.2" rx="1.1" fill="#00381a" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <g transform="rotate(-24 34 50)"><rect x="18" y="14" width="32" height="70" rx="9" fill="url(#v2-tab)" /></g>
                    <g transform="rotate(24 66 50)" filter="url(#v2-sh)"><rect x="54" y="12" width="24" height="74" rx="8" fill="url(#v2-pho)" /></g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <g transform="rotate(-24 34 50)"><rect x="18" y="14" width="32" height="70" rx="10" fill="url(#v2-tab)" /></g>
                    <g transform="rotate(24 66 50)" filter="url(#v2-sh)"><rect x="54" y="12" width="24" height="74" rx="9" fill="url(#v2-pho)" /></g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <g transform="rotate(-24 34 50)"><rect x="18" y="14" width="32" height="70" rx="10" fill="url(#v2-tab)" /></g>
                  <g transform="rotate(24 66 50)" filter="url(#v2-sh)"><rect x="54" y="12" width="24" height="74" rx="9" fill="url(#v2-pho)" /></g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>🎯 <strong>Nguyên lý</strong>: Đơn giản hoá tối đa, tạo mảng miếng đồ hoạ mạnh mẽ và khúc chiết.</div>
              <div>⚡ <strong>Tối ưu</strong>: Tương phản cao, phù hợp với favicon tab và status bar.</div>
            </div>
          </div>

          {/* CONCEPT 3: CHỮ K - DUAL DEVICES */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-sky-500/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 3: Chữ K - Phone Spine + Folded Tablet
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Phone thẳng đứng (xanh đậm) + Tablet gập cánh mở (xanh sáng) tạo thành chữ K (Kai DevLabs).
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Chữ K Creator
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-24 h-24">
                    <defs>
                      <linearGradient id="k1-pho" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#008746" />
                        <stop offset="100%" stopColor="#004824" />
                      </linearGradient>
                      <linearGradient id="k1-tab" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34F5A6" />
                        <stop offset="100%" stopColor="#00D085" />
                      </linearGradient>
                      <filter id="k1-sh" x="-25%" y="-25%" width="150%" height="150%">
                        <feDropShadow dx="-2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.75" />
                      </filter>
                    </defs>
                    <rect x="16" y="12" width="22" height="76" rx="7" fill="url(#k1-pho)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
                    <rect x="22.5" y="15.5" width="9" height="2" rx="1" fill="#002b14" />
                    <rect x="19.5" y="21" width="15" height="58" rx="3.5" fill="rgba(255,255,255,0.1)" />
                    <g transform="rotate(38 52 50)" filter="url(#k1-sh)">
                      <rect x="46" y="10" width="24" height="48" rx="6" fill="url(#k1-tab)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                      <rect x="50" y="15" width="16" height="38" rx="3.5" fill="rgba(255,255,255,0.22)" />
                    </g>
                    <g transform="rotate(-38 52 50)" filter="url(#k1-sh)">
                      <rect x="46" y="42" width="24" height="48" rx="6" fill="url(#k1-tab)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                      <rect x="50" y="47" width="16" height="38" rx="3.5" fill="rgba(255,255,255,0.22)" />
                    </g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <rect x="16" y="12" width="22" height="76" rx="7" fill="url(#k1-pho)" />
                    <g transform="rotate(38 52 50)" filter="url(#k1-sh)"><rect x="46" y="10" width="24" height="48" rx="6" fill="url(#k1-tab)" /></g>
                    <g transform="rotate(-38 52 50)" filter="url(#k1-sh)"><rect x="46" y="42" width="24" height="48" rx="6" fill="url(#k1-tab)" /></g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                    <rect x="16" y="12" width="22" height="76" rx="7" fill="url(#k1-pho)" />
                    <g transform="rotate(38 52 50)" filter="url(#k1-sh)"><rect x="46" y="10" width="24" height="48" rx="6" fill="url(#k1-tab)" /></g>
                    <g transform="rotate(-38 52 50)" filter="url(#k1-sh)"><rect x="46" y="42" width="24" height="48" rx="6" fill="url(#k1-tab)" /></g>
                  </svg>
                  <span className="text-[11px] font-mono text-neutral-500">24px (Navbar)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-5 h-5">
                  <rect x="16" y="12" width="22" height="76" rx="7" fill="url(#k1-pho)" />
                  <g transform="rotate(38 52 50)" filter="url(#k1-sh)"><rect x="46" y="10" width="24" height="48" rx="6" fill="url(#k1-tab)" /></g>
                  <g transform="rotate(-38 52 50)" filter="url(#k1-sh)"><rect x="46" y="42" width="24" height="48" rx="6" fill="url(#k1-tab)" /></g>
                </svg>
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📐 <strong>Thân thẳng</strong>: Phone xanh đậm đại diện cho cột dọc chữ K.</div>
              <div>📖 <strong>2 cánh tay</strong>: Tablet gập đôi góc mở đại diện cho 2 góc chéo của chữ K.</div>
            </div>
          </div>

          {/* CONCEPT 4: SQUIRCLE APP ICON */}
          <div className="bg-[#1D1E1D] border border-white/10 hover:border-[#00D085]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Concept 4: App Icon Squircle Badge
                  </h2>
                  <p className="text-xs text-[#989A99] mt-1">
                    Chữ V lồng ghép nằm trong khối Squircle bo tròn chuẩn iOS/macOS với viền hairline Supabase.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00D085]/15 text-[#00D085] border border-[#00D085]/30">
                  App Icon Badge
                </span>
              </div>

              {/* Showcase box */}
              <div className="bg-[#131413] border border-white/5 rounded-xl p-6 flex items-center justify-around mb-5">
                <div className="flex flex-col items-center gap-2">
                  <BrandIcon className="w-24 h-24" variant="squircle" />
                  <span className="text-[11px] font-mono text-neutral-500">96px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BrandIcon className="w-12 h-12" variant="squircle" />
                  <span className="text-[11px] font-mono text-neutral-500">48px</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BrandIcon className="w-6 h-6" variant="squircle" />
                  <span className="text-[11px] font-mono text-neutral-500">24px (Favicon)</span>
                </div>
              </div>

              {/* Live Navbar Mockup */}
              <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
                <BrandIcon className="w-6 h-6" variant="squircle" />
                <span className="text-xs font-bold text-white">Store Preview Studio</span>
                <span className="ml-auto text-[10.5px] font-semibold bg-[#006533] text-white px-2.5 py-1 rounded border border-[#00D085]/35">
                  Get Access
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-[12px] text-[#989A99] space-y-1">
              <div>📦 <strong>Ứng dụng</strong>: Sẵn sàng dùng làm App Icon macOS/iOS, file build desktop (.dmg/.exe).</div>
              <div>🌌 <strong>Nền</strong>: Khối đen sâu #121312 có viền phản quang hairline chuẩn Supabase.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
