import React from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { articles } from "@/data/articles";
import Magnetic from "@/components/Magnetic";

export const metadata = {
  title: "Engineering Notes & Insights — Mahmud Hasan",
  description:
    "Architectural essays, engineering case reflections, and automation deep-dives by Mahmud Hasan.",
};

export default function BlogPage() {
  return (
    <div className="pt-36 sm:pt-44 pb-32 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-16 mb-20">
        <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Technical Field Notes</span>
        </div>
        <h1 className="title-huge text-5xl sm:text-7xl md:text-8xl font-black text-foreground tracking-tight">
          ENGINEERING
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-accent">
            INSIGHTS
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted">
          Reflections on multi-agent AI systems, high-speed Next.js architectures, and resilient Flutter mobile engineering.
        </p>
      </div>

      {/* Articles List */}
      <div className="space-y-10">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="p-8 sm:p-12 rounded-3xl bg-surface border border-white/10 hover:border-accent transition-all group"
          >
            <Link href={`/blog/${art.slug}`} className="block">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted mb-4">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent font-bold uppercase">
                  {art.category}
                </span>
                <span>{art.date}</span>
                <span>•</span>
                <span>{art.readTime}</span>
              </div>

              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground group-hover:text-accent transition-colors">
                    {art.title}
                  </h2>
                  <p className="mt-3 text-base sm:text-lg text-muted font-normal max-w-3xl leading-relaxed">
                    {art.subtitle}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 group-hover:border-accent group-hover:bg-accent group-hover:text-black flex items-center justify-center shrink-0 transition-colors">
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <p className="mt-6 text-sm text-muted line-clamp-2 leading-relaxed">
                {art.summary}
              </p>
            </Link>
          </article>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-24 pt-16 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Want to discuss these concepts?
          </h3>
          <p className="text-sm font-mono text-muted mt-1">
            Always open to technical dialogues on AI architectures and systems design.
          </p>
        </div>

        <Magnetic strength={0.4}>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-accent text-accent-ink font-semibold text-sm tracking-wide flex items-center gap-3 shadow-lg hover:shadow-accent/25 transition-all"
          >
            <span>Start a Dialogue</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}
