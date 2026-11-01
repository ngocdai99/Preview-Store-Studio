"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  ChevronDown,
  WifiOff,
  Shield,
  Target,
  Briefcase,
  Lock,
  RotateCw,
} from "lucide-react";

export function Faq() {
  const { faq } = siteConfig;
  const [openId, setOpenId] = useState<string | null>(faq.items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const getTopicIcon = (id: string) => {
    switch (id) {
      case "offline-architecture":
        return <WifiOff className="w-3 h-3 stroke-[2.5]" />;
      case "store-review-policy":
        return <Shield className="w-3 h-3 stroke-[2.5]" />;
      case "scope-coverage":
        return <Target className="w-3 h-3 stroke-[2.5]" />;
      case "commercial-license":
        return <Briefcase className="w-3 h-3 stroke-[2.5]" />;
      case "client-handoff":
        return <Lock className="w-3 h-3 stroke-[2.5]" />;
      case "product-updates":
        return <RotateCw className="w-3 h-3 stroke-[2.5]" />;
      default:
        return <Target className="w-3 h-3 stroke-[2.5]" />;
    }
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

        <div className="space-y-3.5">
          {faq.items.map((item, index) => {
            const isOpen = openId === item.id;
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.id}
                className={`group rounded-[18px] transition-colors duration-200 overflow-hidden border ${
                  isOpen
                    ? "bg-card dark:bg-[#0e1526] border-[var(--purple-brand)]/50 shadow-[0_12px_32px_-6px_rgba(139,92,246,0.22)] [html:not(.dark)_&]:shadow-[0_12px_32px_-4px_rgba(109,40,217,0.12)]"
                    : "bg-card/90 dark:bg-[#0e1526]/85 border-border hover:border-slate-400/40 dark:hover:border-white/[0.18] shadow-xs"
                }`}
              >
                {/* Header (Stable, motionless collapse card) */}
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none transition-colors duration-150 hover:bg-card-muted/30 dark:hover:bg-white/[0.02]"
                >
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    {/* Meta Row: Sequence Number + Small Icon + Topic Tag */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center font-extrabold text-[11px] tabular-nums px-2 py-0.5 rounded-[6px] border leading-tight transition-colors ${
                          isOpen
                            ? "text-[var(--purple-brand)] bg-[var(--purple-brand)]/15 border-[var(--purple-brand)]/35"
                            : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.06] border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {num}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.06em] text-[var(--purple-brand)]">
                        {getTopicIcon(item.id)}
                        <span>{item.topic}</span>
                      </span>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-foreground leading-snug tracking-[-0.01em]">
                      {item.question}
                    </h3>
                  </div>

                  {/* 36x36px Tactile Chevron Bubble */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_14px_rgba(99,102,241,0.4)] border-transparent"
                        : "bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-white/10 group-hover:text-foreground"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 stroke-[2.5] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Body (Smooth Accordion Expansion - Header stays 100% still) */}
                <div
                  className={`faq-accordion-grid grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? "open grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="faq-accordion-inner overflow-hidden min-h-0">
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 text-slate-600 dark:text-slate-300 text-[14px] sm:text-[14.5px] leading-relaxed">
                      <div className="pt-3 border-t border-border/40 dark:border-white/[0.06] leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
