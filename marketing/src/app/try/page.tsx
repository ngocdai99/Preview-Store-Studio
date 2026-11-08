import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { MiniStudioToast } from "@/components/MiniStudioToast";
import { TryStudioIframe } from "@/components/TryStudioIframe";
import { AgencySandboxBanner } from "@/components/AgencySandboxBanner";

export const metadata: Metadata = {
  title: "Live Interactive Demo · Store Preview Studio",
  description:
    "Save hours of back-and-forth before every store submission. Preview and verify your listings on realistic device frames before submitting.",
};

export default function TryPage() {
  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background transition-colors">
      {/* Header matching Landing Page & demo.html */}
      <Navbar />

      <main className="flex-1 flex flex-col items-center w-full min-h-0 overflow-hidden">
        {/* Compact Agency Strip (Replacing 300px Hero with ~40px Context Bar) */}
        <AgencySandboxBanner />

        {/* Embedded Interactive Core Studio (/try-studio.html?embed=true with query params forwarding) */}
        <section className="w-full max-w-[1880px] mx-auto px-2 sm:px-4 lg:px-6 pb-2 sm:pb-3 flex-1 flex flex-col min-h-0">
          <div className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#282928] bg-[#0c0d0c] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden flex-1 h-full min-h-[500px]">
            <TryStudioIframe />
          </div>
        </section>
      </main>

      {/* Floating Mini Studio Toast triggered by embedded sandbox actions */}
      <MiniStudioToast />
    </div>
  );
}
