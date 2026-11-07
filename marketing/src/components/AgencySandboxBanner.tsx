export function AgencySandboxBanner() {
  return (
    <aside
      aria-label="Interactive Demo Context"
      className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 pt-2 sm:pt-2.5 pb-2 text-center select-none"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-1 sm:gap-1.5">
        <h2 className="text-sm sm:text-[15px] font-medium text-slate-900 dark:text-white tracking-tight leading-snug">
          Save 2 hours of back-and-forth before every store submission.
        </h2>
        <p className="text-xs sm:text-[13px] text-slate-500 dark:text-[oklch(0.684_0.00275_157.5)] font-normal leading-normal text-balance">
          Preview and verify your listings on realistic device frames before submitting.
        </p>
      </div>
    </aside>
  );
}
