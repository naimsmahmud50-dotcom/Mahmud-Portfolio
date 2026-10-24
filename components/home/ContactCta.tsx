"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Check, Sparkles } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { useI18n } from "@/lib/i18n";

interface ContactCtaProps {
  email?: string;
}

export default function ContactCta({ email: emailProp }: ContactCtaProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const email = emailProp || "mahmudhasan.infodev@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="relative py-32 sm:py-44 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/10 text-center flex flex-col items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t.cta.badge}</span>
      </div>

      <h2 className="title-huge text-4xl sm:text-6xl md:text-8xl font-black text-foreground max-w-4xl tracking-tight mb-8">
        {t.cta.headline}
      </h2>

      <p className="max-w-xl text-sm sm:text-lg text-muted mb-12">
        {t.cta.subtext}
      </p>

      {/* Large Email Link + Copy Interaction */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
        <Magnetic strength={0.3}>
          <a
            href={`mailto:${email}`}
            className="group text-2xl sm:text-4xl md:text-5xl font-display font-bold text-foreground hover:text-accent transition-colors underline decoration-accent/40 underline-offset-8"
          >
            {email}
          </a>
        </Magnetic>

        <button
          onClick={handleCopy}
          aria-label="Copy email address"
          className="px-4 py-2 rounded-full border border-white/10 bg-surface text-xs font-mono text-muted hover:text-white hover:border-accent flex items-center gap-2 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Email</span>
            </>
          )}
        </button>
      </div>

      {/* Start a Conversation Magnetic Button */}
      <Magnetic strength={0.4}>
        <Link
          href="/contact"
          className="group px-8 py-4 rounded-full bg-accent text-accent-ink font-semibold text-sm tracking-wide flex items-center gap-3 shadow-xl hover:shadow-accent/25 hover:scale-105 transition-all duration-300"
        >
          <span>{t.cta.button}</span>
          <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </Magnetic>
    </section>
  );
}
