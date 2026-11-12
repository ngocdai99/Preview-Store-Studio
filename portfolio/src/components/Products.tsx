import React from "react";
import Image from "next/image";

export function Products() {
  return (
    <section id="products" className="py-12 border-b border-[#212221]">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-7">
        Products
      </h2>

      <div className="flex flex-col gap-6">
        {/* Product 1: The No-BS ASO Cheatsheet */}
        <article className="bg-[#1D1E1D] border border-[#282928] rounded-xl overflow-hidden flex flex-col sm:flex-row hover:border-[#383a38] transition-colors">
          <div className="relative aspect-square w-full sm:w-[200px] shrink-0 bg-[#131413] overflow-hidden">
            <Image
              src="/covers/gumroad_thumbnail_cheatsheet.png"
              alt="Cover of The No-BS ASO Cheatsheet"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-5 flex flex-col flex-1 justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                The No-BS ASO Cheatsheet
              </h3>

              <p className="text-sm text-[#989A99] leading-relaxed mt-2">
                A free guide to App Store and Google Play submission rules,
                character limits and asset specs.
              </p>
            </div>

            <div className="pt-1 flex items-center gap-3 text-sm">
              <a
                href="https://kaidevlabs.gumroad.com/l/aso-cheatsheet"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium bg-[#1D1E1D] text-[#EDEDED] border border-[#282928] hover:bg-[#222322] transition-colors"
              >
                Get it on Gumroad
              </a>
            </div>
          </div>
        </article>

        {/* Product 2: Store Preview Studio */}
        <article className="bg-[#1D1E1D] border border-[#282928] rounded-xl overflow-hidden flex flex-col sm:flex-row hover:border-[#383a38] transition-colors">
          <div className="relative aspect-square w-full sm:w-[200px] shrink-0 bg-[#131413] overflow-hidden">
            <Image
              src="/covers/gumroad-store_preview.png"
              alt="Store Preview Studio: see your listing before you submit"
              fill
              className="object-cover"
            />
          </div>

          <div className="p-5 flex flex-col flex-1 justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Store Preview Studio
              </h3>

              <p className="text-sm text-[#989A99] leading-relaxed mt-2">
                Preview your App Store and Google Play listing on accurate
                device mockups before you submit. Runs fully offline in your
                browser; nothing is uploaded.
              </p>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-sm">
              <a
                href="https://kaidevlabs.gumroad.com/l/store-preview-studio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium bg-[#EFF1F0] text-[#252625] hover:bg-[#E1E3E2] transition-colors"
              >
                Buy on Gumroad
              </a>
              <a
                href="https://storepreviewstudio.com/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-300/80 hover:text-blue-200 underline underline-offset-4 decoration-blue-300/30 hover:decoration-blue-200/70 transition-colors"
              >
                Open the live site →
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
