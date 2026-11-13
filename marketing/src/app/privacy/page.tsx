import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { createPageMetadata, siteConfig } from "@/config/site";

export const metadata: Metadata = createPageMetadata({
  title: `Privacy Policy — ${siteConfig.name}`,
  description:
    "Learn how Store Preview Studio protects your privacy with browser-based local storage and transparent analytics policies.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background transition-colors">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10 border-b border-border pb-6">
            <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-foreground">
              Privacy Policy
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
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                2. Analytics &amp; User Experience Telemetry
              </h2>
              <p>
                On our public marketing pages and interactive live demo, we use <strong>Microsoft Clarity</strong> to capture aggregated, anonymous interaction metrics (such as page scrolls, navigation clicks, and performance diagnostics). This helps us identify usability friction and optimize page performance.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Clarity masks sensitive text inputs automatically to protect visitor privacy.</li>
                <li>We do not sell, rent, or trade telemetry data to advertising brokers.</li>
                <li>
                  You can freely use browser privacy extensions or content blockers (such as uBlock Origin or Brave Shields) without affecting the offline capabilities of the studio.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                3. Optional App Cloner Network Requests
              </h2>
              <p>
                The studio includes an optional App Cloner feature that allows users to fetch publicly accessible listing metadata from store catalogs using a public application ID or URL. When invoked:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>Only publicly available store assets (e.g., publicly published descriptions and screenshots) are retrieved.</li>
                <li>No developer account credentials, private API keys, or session tokens are requested or stored.</li>
                <li>You can decline network access at any time by choosing &ldquo;Stay Offline&rdquo; in the cloner dialog.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                4. Payment Processing
              </h2>
              <p>
                Transactions for software licenses are handled directly through authorized third-party payment processors (including Stripe and Gumroad). Store Preview Studio does not process or retain full credit card numbers or banking credentials on our servers. Processing complies with Level 1 PCI-DSS standards managed by the respective merchant platform.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                5. Your Data Rights &amp; Deletion
              </h2>
              <p>
                Under global privacy frameworks including the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain full rights over your data. Because all project files and drafts live locally in your browser storage:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>You can erase all stored drafts at any moment by clicking &ldquo;Reset Draft&rdquo; in the studio toolbar.</li>
                <li>Clearing your browser cache and website data immediately removes all local state.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-2">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
                6. Contact &amp; Inquiries
              </h2>
              <p>
                If you have questions regarding this Privacy Policy or data protection practices, please contact us at:
              </p>
              <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-border">
                <p className="font-medium text-foreground text-[13.5px]">Store Preview Studio by Kai DevLabs</p>
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
                  Store &amp; license inquiries:{" "}
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
