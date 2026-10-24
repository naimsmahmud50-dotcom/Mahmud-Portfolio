"use client";

import React from "react";
import { Workflow } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ProcessSection() {
  const { t } = useI18n();

  return (
    <section className="py-28 sm:py-36 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-3">
            <Workflow className="w-3.5 h-3.5" />
            <span>{t.process.badge}</span>
          </div>
          <h2 className="title-huge text-4xl sm:text-6xl md:text-7xl font-bold text-foreground">
            {t.process.title}
          </h2>
        </div>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {t.process.steps.map((step, idx) => (
          <div
            key={idx}
            className="group relative p-8 rounded-3xl bg-surface border border-white/10 hover:border-accent transition-all duration-300 flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <span className="text-4xl sm:text-5xl font-display font-extrabold text-white/20 group-hover:text-accent transition-colors">
                {step.num}
              </span>
              <h3 className="mt-6 text-xl sm:text-2xl font-display font-bold text-foreground group-hover:text-accent transition-colors">
                {step.title}
              </h3>
            </div>

            <p className="mt-4 text-xs sm:text-sm font-mono text-muted leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
