import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { MiniStudioToast } from "@/components/MiniStudioToast";

export const metadata: Metadata = {
  title: "Live Interactive Demo · Store Preview Studio",
  description:
    "Try Store Preview Studio live in your browser: dual-phone viewports, real device bezels, and instant store presets.",
};

export default function TryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background transition-colors">
      {/* Header matching Landing Page & demo.html */}
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        {/* Demo Hero Section matching demo.html */}
        <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10 overflow-hidden w-full text-center flex flex-col items-center px-4">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-500/18 via-[#00D085]/14 to-[#006636]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2.5 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/12 px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-5 tracking-tight shadow-sm select-none">
            <span className="w-2 h-2 rounded-full bg-[#00D085] shadow-[0_0_10px_#00D085] animate-pulse" />
            <span>Interactive Live Sandbox · 100% Client-Side</span>
          </div>

          {/* Main H1 */}
          <h1 className="text-[32px] sm:text-[44px] lg:text-[54px] font-extrabold tracking-[-0.03em] max-w-4xl mx-auto mb-4 leading-[1.15] text-[#0f172a] [html:not(.dark)_&]:bg-[linear-gradient(180deg,#0f172a_40%,#334155_100%)] [html:not(.dark)_&]:bg-clip-text [html:not(.dark)_&]:text-transparent dark:text-white dark:bg-[linear-gradient(180deg,#ffffff_40%,#94a3b8_100%)] dark:bg-clip-text dark:text-transparent">
            Stop guessing how your app listing <br className="hidden sm:inline" />
            looks before submitting.
          </h1>

          {/* Sub-headline */}
          <p className="hero-sub text-[15.5px] sm:text-[17.5px] text-slate-600 dark:text-slate-400 max-w-[820px] mx-auto leading-[1.6]">
            <span>Save 2 hours of back-and-forth with your client before every App Store submission.</span>
            <br className="hidden sm:inline" />{" "}
            <span>App Store Connect &amp; Google Play provide zero live preview — see exactly how your listing looks before submitting.</span>
          </p>
        </section>

        {/* Embedded Interactive Core Studio */}
        <section className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 pb-16 flex-1 flex flex-col">
          <div className="relative w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-[#282928] bg-[#0c0d0c] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden min-h-[1180px] h-[1180px] lg:h-[calc(100vh-70px)] lg:min-h-[830px] lg:max-h-[1030px]">
            <iframe
              src="/try-studio.html?embed=true"
              title="Store Preview Studio Interactive Sandbox"
              className="w-full h-full border-0 block"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </section>
      </main>

      {/* Floating Mini Studio Toast triggered by embedded sandbox actions */}
      <MiniStudioToast />

      {/* Footer matching Landing Page & demo.html */}
      <Footer />
    </div>
  );
}
