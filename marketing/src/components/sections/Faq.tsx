import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Faq() {
  const { faq } = siteConfig;

  return (
    <section id="faq" className="py-20 sm:py-28 border-t border-border bg-background transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column on Desktop (Q&A List) */}
          <div className="flex-1 space-y-9 sm:space-y-11 order-2 lg:order-1">
            {faq.items.map((item) => (
              <div key={item.id} className="space-y-2">
                <h3 className="text-[16.5px] sm:text-[17.5px] font-bold text-foreground tracking-[-0.01em] leading-snug">
                  {item.question}
                </h3>
                <p className="text-[14.5px] sm:text-[15.5px] text-muted-foreground dark:text-[#989A99] leading-[1.68]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column on Desktop (Heading & Contact Note) */}
          <div className="w-full lg:w-[320px] shrink-0 order-1 lg:order-2">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[30px] sm:text-[36px] font-extrabold tracking-[-0.02em] text-foreground leading-[1.18]">
                Frequently asked<br className="hidden sm:inline" /> questions
              </h2>
              <div className="mt-4 text-[14.5px] sm:text-[15px] text-muted-foreground dark:text-[#989A99] leading-relaxed">
                <p>Can&apos;t find the answer you&apos;re looking for?</p>
                <p className="mt-0.5">
                  Reach out to Kai and{" "}
                  <Link
                    href="#pricing"
                    className="font-medium text-[#006533] dark:text-[#00D085] hover:underline inline-flex items-center"
                  >
                    ask
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
