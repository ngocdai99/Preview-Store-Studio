import React from "react";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5 border-b border-[#212221] text-sm">
      <a
        href="#top"
        className="flex items-center gap-2.5 font-semibold text-white tracking-tight"
      >
        <Image
          src="/kai.webp"
          alt="Kai DevLabs"
          width={28}
          height={28}
          className="rounded-full border border-[#282928] object-cover"
        />
        <span>Kai DevLabs</span>
      </a>

      <div className="flex items-center gap-5 sm:gap-6 text-sm text-[#989A99]">
        <a href="#work" className="hover:text-white transition-colors">
          Work
        </a>
        <a href="#products" className="hover:text-white transition-colors">
          Products
        </a>
        <a href="#resume" className="hover:text-white transition-colors">
          Resume
        </a>
        <a href="#contact" className="hover:text-white transition-colors">
          Contact
        </a>
      </div>
    </nav>
  );
}
