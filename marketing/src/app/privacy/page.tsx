import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${siteConfig.name}`,
  description:
    "Learn how Store Preview Studio protects your privacy with browser-based local storage and transparent analytics policies.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background transition-colors">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 sm:mb-12 border-b border-border pb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-[oklch(0.76_0.15_157.5)] text-xs font-medium mb-3">
              <span>Legal &amp; Data Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0f172a] dark:text-white">
              Privacy Policy
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
                1. Core Architectural Principle: Local-First &amp; Browser-Based
              </h2>
              <p>
                Store Preview Studio is built with an offline-first, local-first architecture. When you design, preview, and format store listings in the studio, your draft copy, screenshots, app icons, and custom metadata are stored directly in your browser using standard Web Storage APIs (LocalStorage and IndexedDB).
              </p>
              <p>
                We do not operate backend databases that ingest, store, or analyze your unpublished app mockups or confidential metadata. Your assets remain on your machine at all times.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                2. Analytics &amp; User Experience Telemetry
              </h2>
              <p>
                On our public marketing pages and interactive live demo, we use <strong>Microsoft Clarity</strong> to capture aggregated, anonymous interaction metrics (such as page scrolls, navigation clicks, and performance diagnostics). This helps us identify usability friction and optimize page performance.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>Clarity masks sensitive text inputs automatically to protect visitor privacy.</li>
                <li>We do not sell, rent, or trade telemetry data to advertising brokers.</li>
                <li>
                  You can freely use browser privacy extensions or content blockers (such as uBlock Origin or Brave Shields) without affecting the offline capabilities of the studio.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                3. Optional App Cloner Network Requests
              </h2>
              <p>
                The studio includes an optional App Cloner feature that allows users to fetch publicly accessible listing metadata from store catalogs using a public application ID or URL. When invoked:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>Only publicly available store assets (e.g., publicly published descriptions and screenshots) are retrieved.</li>
                <li>No developer account credentials, private API keys, or session tokens are requested or stored.</li>
                <li>You can decline network access at any time by choosing &ldquo;Stay Offline&rdquo; in the cloner dialog.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                4. Payment Processing
              </h2>
              <p>
                Transactions for software licenses are handled directly through authorized third-party payment processors (including Stripe and Gumroad). Store Preview Studio does not process or retain full credit card numbers or banking credentials on our servers. Processing complies with Level 1 PCI-DSS standards managed by the respective merchant platform.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                5. Your Data Rights &amp; Deletion
              </h2>
              <p>
                Under global privacy frameworks including the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain full rights over your data. Because all project files and drafts live locally in your browser storage:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>You can erase all stored drafts at any moment by clicking &ldquo;Reset Draft&rdquo; in the studio toolbar.</li>
                <li>Clearing your browser cache and website data immediately removes all local state.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[#0f172a] dark:text-white tracking-tight">
                6. Contact &amp; Inquiries
              </h2>
              <p>
                If you have questions regarding this Privacy Policy or data protection practices, please contact us at:
              </p>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-border">
                <p className="font-medium text-slate-900 dark:text-white">Store Preview Studio by Kai DevLabs</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  General inquiries:{" "}
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
              href="/terms"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Read Terms of Service →</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
