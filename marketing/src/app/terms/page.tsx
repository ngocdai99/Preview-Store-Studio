import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { createPageMetadata, siteConfig } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: `Terms of Service & Refund Policy — ${siteConfig.name}`,
  description:
    "Review the terms of service, software licensing terms, and 14-day refund policy for Store Preview Studio.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background transition-colors">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10 border-b border-border pb-6">
            <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-foreground">
              Terms of Service &amp; Refund Policy
            </h1>
            <p className="mt-2 text-xs text-muted">
              Last updated: November 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 text-[#d1d5db] text-[13.5px] sm:text-[14px] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                1. Acceptance of Terms
              </h2>
              <p>
                By downloading, accessing, or purchasing a license for Store Preview Studio (&ldquo;Software&rdquo;, &ldquo;Product&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not purchase or use the software.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                2. Software License Grants
              </h2>
              <p>
                Store Preview Studio is sold as a perpetual, one-time purchase license. Depending on the tier you acquire:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border">
                  <h3 className="text-[13.5px] font-semibold text-foreground">Plus Edition License</h3>
                  <p className="text-xs text-muted mt-1 leading-normal">
                    Grants a non-exclusive, perpetual license for an individual developer or creator to prepare, preview, and export unlimited listings and mockups for personal and commercial applications.
                  </p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border">
                  <h3 className="text-[13.5px] font-semibold text-foreground">Pro Edition License</h3>
                  <p className="text-xs text-muted mt-1 leading-normal">
                    Grants a commercial team license including full unminified source code access, white-label client presentation rights, and multi-seat deployment across team members within your organization.
                  </p>
                </div>
              </div>
              <p>
                You may not sublicense, redistribute, resell, or publicly host the core standalone HTML software file as a competing standalone service.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                3. Ownership of Deliverables &amp; User Content
              </h2>
              <p>
                You retain 100% full copyright, title, and intellectual property rights to all screenshots, copywriting, graphic designs, metadata, and exported assets that you create or import into Store Preview Studio.
              </p>
              <p>
                Store Preview Studio claims no ownership or rights over your application listings, client deliverables, or commercial products.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                4. 14-Day Transparent Refund Policy
              </h2>
              <p>
                We stand behind the quality and practicality of Store Preview Studio. If the software fails to function on your supported modern browser (Chrome, Safari, Firefox, or Edge) or is unable to generate and export your listings as described, you are entitled to a full refund within <strong>14 days of purchase</strong>.
              </p>
              <p>
                To request a refund, simply reply to your receipt email or reach out through our merchant support link with your order reference. Refunds are processed promptly through the original payment method without complicated requirements.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                5. Disclaimer Regarding App Store Review &amp; Approval
              </h2>
              <p>
                Store Preview Studio provides validation checks and layout previews based on publicly accessible store formatting guidelines. However:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>
                  Store Preview Studio is an independent development tool and is not endorsed by, sponsored by, or affiliated with Apple Inc. or Google LLC.
                </li>
                <li>
                  The tool does not guarantee that any app, listing, or graphic asset will be accepted, certified, or approved by store review teams. Final editorial and compliance discretion resides solely with Apple Inc. and Google LLC.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                6. Limitation of Liability
              </h2>
              <p>
                The software is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. In no event shall Kai DevLabs or its contributors be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the software.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                7. Contact &amp; Support
              </h2>
              <p>
                For license verification, support, or refund inquiries:
              </p>
              <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border">
                <p className="font-medium text-foreground text-[13.5px]">Kai DevLabs</p>
                <p className="text-xs text-muted mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span>Kai Support:</span>
                  <a
                    href="mailto:support.kai.devlabs@gmail.com"
                    className="text-accent hover:text-accent-hover font-mono underline transition-colors"
                  >
                    support.kai.devlabs@gmail.com
                  </a>
                </p>
                <p className="text-[11.5px] text-muted mt-1">
                  Merchant storefront:{" "}
                  <a
                    href="https://kaidevlabs.gumroad.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    kaidevlabs.gumroad.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
