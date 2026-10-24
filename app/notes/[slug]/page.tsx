import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, ArrowUpRight } from "lucide-react";
import { articles } from "@/data/articles";
import MagneticWrapper from "@/components/MagneticWrapper";

export async function generateStaticParams() {
  return articles.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};

  return {
    title: `${article.title} — Mahmud Hasan Notes`,
    description: article.summary,
  };
}

export default function NoteDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="pt-36 sm:pt-44 md:pt-48 pb-32 px-6 sm:px-10 md:px-14 max-w-[1000px] mx-auto select-none">
      {/* Back to Notes Navigation Link */}
      <div className="mb-12">
        <MagneticWrapper strength={0.25}>
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Engineering Notes</span>
          </Link>
        </MagneticWrapper>
      </div>

      {/* Note Header */}
      <header className="border-b border-line pb-12 mb-14 space-y-6">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
          <span className="px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent font-semibold uppercase flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>{article.category}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span>{article.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>{article.readTime}</span>
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-text leading-[1.1]">
          {article.title}
        </h1>

        <p className="text-base sm:text-xl text-muted font-normal leading-relaxed">
          {article.subtitle}
        </p>
      </header>

      {/* Note Content */}
      <div className="space-y-8 text-base sm:text-lg text-text/85 font-normal leading-relaxed">
        {article.content.map((paragraph, idx) => (
          <p key={idx} className="tracking-normal">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Post Footer CTA */}
      <div className="mt-20 pt-12 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-medium text-text">
            Have questions about this architecture?
          </h3>
          <p className="text-xs sm:text-sm font-mono text-muted mt-1">
            Let&apos;s discuss real-world automation, Next.js or Flutter systems.
          </p>
        </div>

        <MagneticWrapper strength={0.35}>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-accent text-accent-ink font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-lg hover:shadow-accent/20 transition-all duration-300"
          >
            <span>Discuss Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </MagneticWrapper>
      </div>
    </div>
  );
}
