"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";

export default function MarqueeTicker() {
  const { t } = useI18n();
  const items = [...t.ticker, ...t.ticker, ...t.ticker];

  return (
    <div className="relative w-full py-8 sm:py-12 border-y border-white/10 bg-surface/30 backdrop-blur-sm overflow-hidden select-none">
      {/* Side Vignettes for Infinite Gradient Blend */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-6 sm:gap-10 mx-4 sm:mx-6 text-xl sm:text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white/70 hover:text-accent transition-colors"
          >
            <span>{item}</span>
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-accent/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
