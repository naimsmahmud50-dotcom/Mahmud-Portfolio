import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/data/articles";

export const metadata = {
  title: "Engineering Notes & Architectural Essays — Mahmud Hasan",
  description:
    "Reflections on autonomous AI agent swarms, sub-second Next.js performance, and offline-first mobile systems by Mahmud Hasan.",
};

export default function NotesPage() {
  return (
    <div className="pt-36 sm:pt-44 md:pt-48 pb-32 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none">
      {/* Header */}
      <div className="border-b border-line pb-16 mb-20">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            Field Notes &amp; Architectural Reflections
          </span>
          <span className="text-xs sm:text-sm font-mono text-muted">
            ({articles.length.toString().padStart(2, "0")})
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-text leading-[1.05] max-w-5xl">
          Engineering Notes &amp; Systems Craft—
        </h1>
        <p className="mt-6 max-w-3xl text-base sm:text-lg text-muted font-normal leading-relaxed">
          Deep technical breakdowns on architecting self-healing multi-agent swarms, achieving 60fps editorial physics in Next.js, and building offline-first mobile applications in Bangladesh.
        </p>
      </div>

      {/* Notes List */}
      <div className="space-y-8">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="p-8 sm:p-12 rounded-3xl bg-surface border border-line hover:border-line/80 transition-all duration-300 group"
          >
            <Link href={`/notes/${art.slug}`} className="block">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted mb-4">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent font-semibold uppercase">
                  {art.category}
                </span>
                <span>{art.date}</span>
                <span>•</span>
                <span>{art.readTime}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-text group-hover:text-accent transition-colors duration-300">
                    {art.title}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-muted font-normal max-w-3xl leading-relaxed">
                    {art.subtitle}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full border border-line group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink flex items-center justify-center shrink-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
