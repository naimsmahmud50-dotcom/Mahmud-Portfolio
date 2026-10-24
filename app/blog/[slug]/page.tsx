import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { articles } from "@/data/articles";
import Magnetic from "@/components/Magnetic";

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export function generateMetadata({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} — Notes by Mahmud Hasan`,
    description: article.summary,
  };
}

export default function ArticleDetailPage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) {
    notFound();
  }

  return (
    <article className="pt-36 sm:pt-44 pb-32 px-6 sm:px-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-12">
        <Magnetic strength={0.3}>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Field Notes</span>
          </Link>
        </Magnetic>
      </div>

      {/* Article Header */}
      <div className="border-b border-white/10 pb-12 mb-12">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted mb-6">
          <span className="px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold uppercase">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="title-huge text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed font-normal">
          {article.subtitle}
        </p>
      </div>

      {/* Article Body */}
      <div className="prose prose-invert max-w-none space-y-6 text-base sm:text-lg text-muted font-normal leading-relaxed">
        {article.content.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Author Footnote */}
      <div className="mt-20 p-8 rounded-3xl bg-surface border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">
            Written by Mahmud Hasan
          </h3>
          <p className="text-xs font-mono text-muted mt-1">
            AI Automation Expert · Full-Stack &amp; Android Developer · Dhaka, Bangladesh
          </p>
        </div>

        <Magnetic strength={0.4}>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-accent text-accent-ink font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span>Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </Magnetic>
      </div>
    </article>
  );
}
