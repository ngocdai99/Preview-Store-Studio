export function AgencySandboxBanner() {
  return (
    <aside
      aria-label="Interactive Demo Context"
      className="w-full max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 pt-2 sm:pt-2.5 pb-1.5 flex items-center justify-center"
    >
      <div className="inline-flex items-center flex-wrap sm:flex-nowrap justify-center gap-2.5 sm:gap-3 select-none max-w-full text-xs sm:text-[13px] leading-snug">
        {/* Nút Live Sandbox: Primary Brand Button, không hover scale hay translate Y */}
        <div
          role="status"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white font-semibold text-xs tracking-tight border transition-colors duration-150 cursor-pointer shadow-xs shrink-0 hover:bg-[#007a41] hover:border-[#209d70]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%), #006636",
            borderColor: "#1B845E",
            boxShadow:
              "inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12)",
            transform: "none",
          }}
        >
          {/* Circle xanh lá nhấp nháy chậm và rõ ràng */}
          <span className="live-pulse-dot" aria-hidden="true">
            <span className="live-pulse-dot-ring" />
            <span className="live-pulse-dot-core" />
          </span>
          <span>Live Sandbox</span>
        </div>

        {/* Phần còn lại: White text đặt bên cạnh nút Live Sandbox */}
        <span className="text-white font-medium text-left sm:text-center">
          Preview &amp; validate App Store / Google Play listings before client review.
        </span>
      </div>
    </aside>
  );
}
