import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms of Service & Refund Policy — ${siteConfig.name}`,
  description:
    "Review the terms of service, software licensing terms, and 14-day refund policy for Store Preview Studio.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background transition-colors">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 sm:mb-12 border-b border-border pb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-[oklch(0.76_0.15_157.5)] text-xs font-medium mb-3">
              <span>Agreement &amp; Licensing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0f172a] dark:text-white">
              Terms of Service &amp; Refund Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last updated: November 8, 2026 · Effective date: November 8, 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-10 text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                1. Acceptance of Terms
              </h2>
              <p>
                By downloading, accessing, or purchasing a license for Store Preview Studio (&ldquo;Software&rdquo;, &ldquo;Product&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not purchase or use the software.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                2. Software License Grants
              </h2>
              <p>
                Store Preview Studio is sold as a perpetual, one-time purchase license. Depending on the tier you acquire:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-border">
                  <h3 className="font-medium text-slate-900 dark:text-white">Plus Edition License</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Grants a non-exclusive, perpetual license for an individual developer or creator to prepare, preview, and export unlimited listings and mockups for personal and commercial applications.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-border">
                  <h3 className="font-medium text-slate-900 dark:text-white">Pro Edition License</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Grants a commercial team license including full unminified source code access, white-label client presentation rights, and multi-seat deployment across team members within your organization.
                  </p>
                </div>
              </div>
              <p>
                You may not sublicense, redistribute, resell, or publicly host the core standalone HTML software file as a competing standalone service.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
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
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
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
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                5. Disclaimer Regarding App Store Review &amp; Approval
              </h2>
              <p>
                Store Preview Studio provides validation checks and layout previews based on publicly accessible store formatting guidelines. However:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>
                  Store Preview Studio is an independent development tool and is not endorsed by, sponsored by, or affiliated with Apple Inc. or Google LLC.
                </li>
                <li>
                  The tool does not guarantee that any app, listing, or graphic asset will be accepted, certified, or approved by store review teams. Final editorial and compliance discretion resides solely with Apple Inc. and Google LLC.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                6. Limitation of Liability
              </h2>
              <p>
                The software is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. In no event shall Kai DevLabs or its contributors be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the software.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                7. Contact
              </h2>
              <p>
                For license verification, support, or terms inquiries:
              </p>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-border">
                <p className="font-medium text-slate-900 dark:text-white">Kai DevLabs</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Store &amp; Support:{" "}
                  <a
                    href="https://kaidevlabs.gumroad.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 dark:text-[oklch(0.76_0.15_157.5)] underline hover:opacity-80"
                  >
                    kaidevlabs.gumroad.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-12 pt-8 border-t border-border flex items-center justify-between text-sm">
            <Link
              href="/"
              className="text-emerald-700 dark:text-[oklch(0.76_0.15_157.5)] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>← Back to Home</span>
            </Link>
            <Link
              href="/privacy"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Read Privacy Policy →</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
