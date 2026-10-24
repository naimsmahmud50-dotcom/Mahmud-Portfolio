"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import MagneticWrapper from "./MagneticWrapper";

export default function LangSwitch() {
  const { lang, toggleLang } = useI18n();

  return (
    <MagneticWrapper strength={0.35}>
      <button
        onClick={toggleLang}
        type="button"
        aria-label="Toggle language between English and Bengali"
        className="px-3.5 py-1.5 rounded-full border border-line bg-surface/60 backdrop-blur-md text-xs font-mono tracking-wider font-semibold hover:border-accent hover:text-accent transition-all duration-300 flex items-center gap-1.5 select-none cursor-pointer"
      >
        <span
          className={
            lang === "en" ? "text-accent font-bold" : "text-muted hover:text-text"
          }
        >
          EN
        </span>
        <span className="text-line">/</span>
        <span
          className={
            lang === "bn"
              ? "text-accent font-bold font-bengali"
              : "text-muted hover:text-text font-bengali"
          }
        >
          বাংলা
        </span>
      </button>
    </MagneticWrapper>
  );
}
