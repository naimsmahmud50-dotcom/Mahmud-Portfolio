"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

import type { ServiceData } from "@/lib/data";

interface ServiceItem {
  num: string;
  title: string;
  description: string;
  deliverables: string[];
}

const fallbackServiceItems: ServiceItem[] = [
  {
    num: "01",
    title: "AI Automation",
    description:
      "Architecting self-healing enterprise workflow automation, multi-channel client acquisition pipelines, CRM synchronizations, and data extraction engines that eliminate manual operational bottlenecks.",
    deliverables: ["n8n / Make Pipelines", "Lead Generation Graphs", "Automated Outbound", "Data Scraping Engine"],
  },
  {
    num: "02",
    title: "Web App Development",
    description:
      "Engineering robust, scalable full-stack web applications with Next.js 14 App Router, TypeScript, NestJS microservices, event-driven backends, and high-concurrency PostgreSQL databases.",
    deliverables: ["Next.js 14 Applications", "NestJS Microservices", "PostgreSQL Architectures", "Secure REST & GraphQL APIs"],
  },
  {
    num: "03",
    title: "Android App Development",
    description:
      "Developing high-craft, native-grade Flutter Android applications featuring offline-first local SQLite caching, real-time push notification infrastructure, and streamlined Play Store deployment.",
    deliverables: ["Cross-Platform Flutter Apps", "Offline-First Local Sync", "Hardware & Sensor Integration", "Play Store CI/CD Pipelines"],
  },
  {
    num: "04",
    title: "Website Development",
    description:
      "Crafting world-class, luxury agency-grade digital experiences, bespoke portfolios, and editorial landing pages engineered with GSAP, Lenis smooth scrolling, and cinematic interaction design.",
    deliverables: ["Award-Winning Web Experiences", "Lenis + GSAP Motion Systems", "Headless CMS Solutions", "Responsive Design Systems"],
  },
  {
    num: "05",
    title: "Facebook Automation",
    description:
      "Building enterprise Meta Graph API automation tools, automated real-time Facebook page moderation systems, customer inquiry routing bots, and targeted ad campaign lead-capture pipelines.",
    deliverables: ["Meta Graph API Integrations", "Auto-Moderation Bots", "Messenger Lead Workflows", "Campaign Data Analytics"],
  },
  {
    num: "06",
    title: "AI Agents",
    description:
      "Deploying intelligent multi-agent swarms with LangChain, Claude & OpenAI APIs, tool calling, recursive problem solving, stateful memory graphs, and automated headless browser executors.",
    deliverables: ["LangChain Multi-Agent Swarms", "Browser-Automated Workers", "Context-Aware Research Agents", "RAG & Knowledge Retrieval"],
  },
];

interface ServicesAccordionProps {
  services?: ServiceData[];
}

export default function ServicesAccordion({ services: propServices }: ServicesAccordionProps = {}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const items = propServices && propServices.length > 0 ? propServices : fallbackServiceItems;

  const toggle = (index: number) => {
    setActiveIdx((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative py-28 sm:py-36 md:py-44 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none">
      {/* Section Header */}
      <div className="flex items-baseline justify-between mb-12 sm:mb-16">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h2 className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            Services & Expertise
          </h2>
        </div>
        <span className="text-xs sm:text-sm font-mono text-muted">
          ({items.length.toString().padStart(2, "0")})
        </span>
      </div>

      {/* Accordion List with 1px Line Separators */}
      <div className="border-t border-b border-line divide-y divide-line">
        {items.map((item, idx) => {
          const isOpen = activeIdx === idx;

          return (
            <div
              key={item.num}
              className="group transition-colors duration-300"
              onMouseEnter={() => setActiveIdx(idx)}
            >
              <button
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full py-8 sm:py-10 md:py-12 flex items-center justify-between gap-6 text-left cursor-pointer focus:outline-none"
              >
                {/* Left: Number & Service Title */}
                <div className="flex items-center gap-6 sm:gap-12 md:gap-16">
                  <span className="text-xs sm:text-sm font-mono text-muted group-hover:text-accent transition-colors">
                    {item.num}
                  </span>
                  <h3
                    className={`text-2xl sm:text-4xl md:text-5xl font-display font-normal tracking-tight transition-all duration-400 ${
                      isOpen
                        ? "text-accent translate-x-3"
                        : "text-text group-hover:text-accent group-hover:translate-x-3"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Right: Expand/Collapse Plus/Minus Icon */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-line flex items-center justify-center transition-colors duration-300 ${
                    isOpen
                      ? "bg-accent text-accent-ink border-accent"
                      : "group-hover:border-accent text-muted group-hover:text-accent"
                  }`}
                >
                  {isOpen ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Collapsible Content Drawer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pb-10 sm:pb-14 pl-12 sm:pl-24 md:pl-28 pr-6 max-w-4xl">
                      <p className="text-sm sm:text-base md:text-lg text-muted font-sans font-normal leading-relaxed mb-6">
                        {item.description}
                      </p>

                      {/* Deliverables Stack Tags */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {item.deliverables.map((tag) => (
                          <span
                            key={tag}
                            className="px-3.5 py-1.5 rounded-full bg-surface border border-line text-[11px] sm:text-xs font-mono text-text/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
