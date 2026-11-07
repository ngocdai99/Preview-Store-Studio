import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ShowcaseCarousel } from "@/components/sections/ShowcaseCarousel";
import { Features } from "@/components/sections/Features";
import { Comparison } from "@/components/sections/Comparison";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background transition-colors">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Comparison />
        <ShowcaseCarousel />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
