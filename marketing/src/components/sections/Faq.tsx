import { siteConfig } from "@/config/site";
import { ArrowUpRight } from "lucide-react";

export function Faq() {
  const { faq } = siteConfig;

  return (
    <section id="faq" className="py-20 sm:py-28 border-t border-border bg-background transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column on Desktop (Heading & Context Note) */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[22px] sm:text-[28px] lg:text-[32px] font-medium tracking-[-0.02em] text-foreground leading-[1.2]">
                Frequently asked<br className="hidden sm:inline" /> questions
              </h2>
              <p className="mt-4 text-[14.5px] sm:text-[15px] text-muted-foreground dark:text-[#989A99] leading-relaxed">
                Everything you need to know about Store Preview Studio, licensing, and offline usage.
              </p>
            </div>
          </div>

          {/* Right Column on Desktop (Q&A List) */}
          <div className="flex-1 space-y-9 sm:space-y-11">
            {faq.items.map((item) => (
              <div key={item.id} className="space-y-2">
                <h3 className="text-[16.5px] sm:text-[17.5px] font-bold text-foreground tracking-[-0.01em] leading-snug">
                  {item.question}
                </h3>
                <p className="text-[14.5px] sm:text-[15.5px] text-muted-foreground dark:text-[#989A99] leading-[1.68]">
                  {item.answer}
                </p>
                {"link" in item && item.link && (
                  <div className="pt-0.5">
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-[#006636] dark:text-[#00D085] hover:underline"
                    >
                      <span>{item.link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80 stroke-[2.2]" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
