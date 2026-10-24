import React from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, Layout, Smartphone, Globe, Share2, Monitor, CheckCircle2 } from "lucide-react";
import { getServices } from "@/lib/data";
import Magnetic from "@/components/Magnetic";

export const revalidate = 5;

const iconMap = {
  Cpu,
  Layout,
  Smartphone,
  Globe,
  Share2,
  Monitor,
};

const engagementModels = [
  {
    title: "Fixed-Scope Architecture",
    tag: "Best for distinct products",
    desc: "Complete end-to-end design, implementation, and production deployment of your web app, mobile app, or automation pipeline with an agreed milestone timeline.",
    features: [
      "Full technical specification & system architecture",
      "UI/UX interface prototyping & micro-interaction design",
      "Frontend, backend, database & CI/CD deployment",
      "30-day post-launch warranty & handover documentation",
    ],
  },
  {
    title: "Fractional Lead Architect",
    tag: "Best for growing teams",
    desc: "Dedicated senior engineering leadership embedded into your sprint cycles to design scalable architectures, review pull requests, and optimize performance.",
    features: [
      "Direct async Slack / Telegram access",
      "Code audits, security reviews & refactoring guidance",
      "System design & AI agent roadmap guidance",
      "Sprint planning & technical mentoring",
    ],
  },
  {
    title: "Bespoke Automation Retainer",
    tag: "Best for agency & commerce",
    desc: "Continuous development and monitoring of custom AI agent swarms, Meta Graph API workflows, web scrapers, and data pipelines.",
    features: [
      "Proactive 24/7 error monitoring & failover recovery",
      "Continuous prompt tuning & model upgrades",
      "Dedicated scraper proxy & webhook maintenance",
      "Priority feature implementation within 48 hours",
    ],
  },
];

export const metadata = {
  title: "Services & Capabilities — Mahmud Hasan",
  description:
    "Comprehensive technical execution spanning from autonomous AI pipelines and Android Flutter mobile applications to Next.js fullstack web platforms.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="pt-36 sm:pt-44 pb-32 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-16 mb-20">
        <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Offerings</span>
        </div>
        <h1 className="title-huge text-5xl sm:text-7xl md:text-8xl font-black text-foreground tracking-tight">
          TECHNICAL
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-accent">
            SERVICES &amp;
          </span>{" "}
          CAPABILITIES
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted">
          From self-healing multi-agent swarms to 60fps editorial web platforms and native Flutter applications, here is how we can collaborate.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-16 mb-28">
        {services.map((srv) => {
          const Icon = iconMap[srv.icon as keyof typeof iconMap] || Cpu;

          return (
            <div
              key={srv.id}
              className="p-8 sm:p-12 rounded-3xl bg-surface border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8 pb-8 border-b border-white/10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-muted uppercase">
                      Service {srv.num}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground mt-1">
                      {srv.title}
                    </h2>
                  </div>
                </div>

                {srv.tagline && (
                  <p className="text-sm sm:text-base font-mono text-accent max-w-md">
                    {srv.tagline}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6">
                  <p className="text-sm sm:text-base text-muted leading-relaxed font-normal">
                    {srv.description}
                  </p>
                </div>
                <div className="lg:col-span-6 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
                    Key Deliverables
                  </h4>
                  {srv.deliverables.map((item, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs sm:text-sm font-mono text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Public GitHub Repositories for this Service */}
              {srv.githubRepos && srv.githubRepos.length > 0 && (
                <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-muted uppercase tracking-wider flex items-center gap-1.5 mr-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Verified Public Repositories:
                    </span>
                    {srv.githubRepos.map((repo, rIdx) => (
                      <a
                        key={rIdx}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent text-xs font-mono text-foreground hover:text-accent transition-all group/repo"
                      >
                        <span className="text-accent">⚡</span>
                        <span className="font-semibold">{repo.name}</span>
                        <span className="text-[10px] text-muted font-normal">({repo.badge})</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover/repo:text-accent transition-colors" />
                      </a>
                    ))}
                  </div>

                  {srv.caseStudySlug && (
                    <Link
                      href={`/work/${srv.caseStudySlug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono text-accent hover:underline font-bold shrink-0"
                    >
                      <span>Explore Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Engagement Models */}
      <div className="mb-28">
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-12">
          Collaboration Models
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {engagementModels.map((model, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-surface border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 uppercase tracking-wider font-bold">
                  {model.tag}
                </span>
                <h3 className="mt-6 text-xl sm:text-2xl font-display font-bold text-foreground">
                  {model.title}
                </h3>
                <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed">
                  {model.desc}
                </p>
                <div className="mt-8 space-y-2.5 pt-6 border-t border-white/10">
                  {model.features.map((f, fIdx) => (
                    <div
                      key={fIdx}
                      className="text-xs font-mono text-muted flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-16 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Have a project in mind?
          </h3>
          <p className="text-sm font-mono text-muted mt-1">
            Let&apos;s evaluate your requirements and architect a custom solution.
          </p>
        </div>

        <Magnetic strength={0.4}>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full bg-accent text-accent-ink font-semibold text-sm tracking-wide flex items-center gap-3 shadow-lg hover:shadow-accent/25 transition-all"
          >
            <span>Discuss Scope</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Magnetic>
      </div>
    </div>
  );
}
