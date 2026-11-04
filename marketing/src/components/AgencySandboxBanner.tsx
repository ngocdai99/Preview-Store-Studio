export function AgencySandboxBanner() {
  return (
    <aside
      aria-label="Interactive Demo Context"
      className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 pt-2 sm:pt-2.5 pb-2 text-center select-none"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-1 sm:gap-1.5">
        <h2 className="text-sm sm:text-[15.5px] font-semibold text-white tracking-tight leading-snug">
          Save 2 hours of back-and-forth with your client before every App Store submission.
        </h2>
        <p className="text-xs sm:text-[13px] text-slate-400 dark:text-[#989A99] font-normal leading-normal">
          App Store Connect &amp; Google Play provide no live preview — see exactly how your listing looks before submitting
        </p>
      </div>
    </aside>
  );
}
