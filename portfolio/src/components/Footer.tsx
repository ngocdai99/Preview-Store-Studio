import React from "react";

export function Footer() {
  return (
    <footer id="contact" className="py-12 sm:py-14">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-2">
        Let’s talk
      </h2>
      <p className="text-sm text-[#989A99] leading-relaxed mb-5">
        Open to mobile roles and to questions about Store Preview Studio.
      </p>

      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href="mailto:kai.devlabs@gmail.com"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-[#EFF1F0] text-[#252625] hover:bg-[#E1E3E2] transition-colors"
        >
          kai.devlabs@gmail.com
        </a>
        <a
          href="https://kaidevlabs.gumroad.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium bg-[#1D1E1D] text-[#EDEDED] border border-[#282928] hover:bg-[#222322] transition-colors"
        >
          Kai DevLabs on Gumroad
        </a>
      </div>
    </footer>
  );
}
