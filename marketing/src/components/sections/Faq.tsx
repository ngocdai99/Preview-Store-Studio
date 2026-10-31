"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { ChevronDown } from "lucide-react";

export function Faq() {
  const { faq } = siteConfig;
  const [openId, setOpenId] = useState<string | null>(faq[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about offline architecture, store review compliance,
            client handoff, and licensing.
          </p>
        </div>

        <div className="space-y-3.5">
          {faq.map((item, index) => {
            const isOpen = openId === item.id;
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-bold text-slate-500 mt-0.5">{num}</span>
                    <div>
                      <span className="block text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                        {item.topic}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-indigo-600 text-white" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 text-slate-300 text-sm sm:text-base leading-relaxed pl-13 sm:pl-16 border-t border-slate-800/50 mt-1">
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

