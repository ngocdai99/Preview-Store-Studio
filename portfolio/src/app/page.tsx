import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CaseStudies } from "@/components/CaseStudies";
import { Products } from "@/components/Products";
import { ExperienceEducation } from "@/components/ExperienceEducation";
import { Footer } from "@/components/Footer";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#131413] text-[#f8fafc]">
      <div className="max-w-[960px] mx-auto px-5 sm:px-6">
        <Navbar />
        <main>
          <Hero />
          <CaseStudies />
          <Products />
          <ExperienceEducation />
        </main>
        <Footer />
      </div>
    </div>
  );
}
