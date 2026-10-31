"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { ChevronDown } from "lucide-react";

export function Faq() {
  const { faq } = siteConfig;
  const [openId, setOpenId] = useState<string | null>(faq.items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 border-t border-border bg-card/30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {faq.title}
          </h2>
          <p className="mt-4 text-muted text-sm sm:text-base leading-relaxed">
            {faq.description}
          </p>
        </div>

        <div className="space-y-3">
          {faq.items.map((item, index) => {
            const isOpen = openId === item.id;
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-colors shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors hover:bg-card-muted/50"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-semibold text-muted mt-0.5">{num}</span>
                    <div>
                      <span className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">
                        {item.topic}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 bg-foreground text-background"
                        : "bg-card-muted text-muted"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 text-muted text-sm sm:text-base leading-relaxed pl-13 sm:pl-16 border-t border-border/50 mt-1">
                    <div className="pt-3">{item.answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
