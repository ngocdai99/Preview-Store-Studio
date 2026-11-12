import React from "react";

export function Hero() {
  return (
    <header id="top" className="py-12 sm:py-14 border-b border-[#212221]">
      <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-tight text-white leading-[1.25] max-w-[24em]">
        I ship Flutter and React Native apps, and get them through store review.
      </h1>

      <div className="mt-4 sm:mt-5 space-y-1.5 text-base text-[#989A99] leading-relaxed">
        <p>
          I’m Bui Ngoc Dai (Kai), a mobile engineer in Vietnam behind
          Kai DevLabs, creator of{" "}
          <a
            href="https://storepreviewstudio.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-300/80 hover:text-blue-200 underline underline-offset-4 decoration-blue-300/30 hover:decoration-blue-200/70 transition-colors"
          >
            Store Preview Studio
          </a>
          .
        </p>
        <p>
          Proven track record shipping apps to App Store and Google Play,
          including an education platform with 100K+ downloads.
        </p>
        <p>
          I also build tools for other developers who release apps.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <a
          href="#work"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-[#EFF1F0] text-[#252625] hover:bg-[#E1E3E2] transition-colors"
        >
          See my work
        </a>
        <a
          href="mailto:kai.devlabs@gmail.com"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-[#1D1E1D] text-[#EDEDED] border border-[#282928] hover:bg-[#222322] transition-colors"
        >
          Email me
        </a>
      </div>
    </header>
  );
}
