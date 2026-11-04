export function AgencySandboxBanner() {
  return (
    <aside
      aria-label="Interactive Demo Context"
      className="w-full max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 pt-2 sm:pt-2.5 pb-1.5 flex items-center justify-center"
    >
      <div className="btn-white inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-[13px] shadow-sm select-none max-w-full">
        {/* Nút màu xanh nhấp nháy chậm và rõ ràng (Slow, pronounced live green beacon) */}
        <span className="live-pulse-dot" aria-hidden="true">
          <span className="live-pulse-dot-ring" />
          <span className="live-pulse-dot-core" />
        </span>

        {/* Live Sandbox text */}
        <span className="font-semibold shrink-0">Live Sandbox</span>
        <span className="opacity-40 shrink-0">·</span>

        {/* Value statement */}
        <span className="font-medium opacity-85 truncate sm:whitespace-normal text-left sm:text-center">
          Preview &amp; validate App Store / Google Play listings before client review.
        </span>
      </div>
    </aside>
  );
}
