"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import type { ProjectData } from "@/lib/data";
import MagneticWrapper from "@/components/MagneticWrapper";
import { usePageTransition } from "@/context/TransitionContext";

interface ProjectDetailViewProps {
  project: ProjectData;
  nextProject: ProjectData;
}

export default function ProjectDetailView({
  project,
  nextProject,
}: ProjectDetailViewProps) {
  const { navigate } = usePageTransition();
  const coverRef = useRef<HTMLDivElement | null>(null);

  // Parallax on cover image
  const { scrollYProgress: coverScroll } = useScroll({
    target: coverRef,
    offset: ["start end", "end start"],
  });
  const coverParallaxY = useTransform(coverScroll, [0, 1], [-30, 30]);

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/work");
  };

  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`/work/${nextProject.slug}`);
  };

  return (
    <article className="pt-36 sm:pt-44 md:pt-48 pb-20 select-none">
      <div className="px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto">
        {/* Back Link */}
        <div className="mb-10 sm:mb-14">
          <MagneticWrapper strength={0.3}>
            <a
              href="/work"
              onClick={handleBackClick}
              className="group inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-muted hover:text-accent transition-colors py-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to all work</span>
            </a>
          </MagneticWrapper>
        </div>

        {/* Hero Header */}
        <div className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
              {project.category === "ai"
                ? "AI Automation"
                : project.category === "android"
                ? "Android Engineering"
                : "Web Platform"}{" "}
              · {project.year}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-text leading-[1] max-w-5xl mb-8">
            {project.title}
          </h1>

          <p className="text-lg sm:text-2xl text-muted font-normal max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Meta Grid Row: Role, Year, Stack, Status, Link */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mt-12 pt-8 border-t border-line text-xs font-mono">
            <div>
              <p className="text-muted uppercase text-[10px] tracking-widest mb-1.5">
                Role
              </p>
              <p className="text-text font-bold">{project.role}</p>
            </div>
            <div>
              <p className="text-muted uppercase text-[10px] tracking-widest mb-1.5">
                Year
              </p>
              <p className="text-text font-bold">{project.year}</p>
            </div>
            <div>
              <p className="text-muted uppercase text-[10px] tracking-widest mb-1.5">
                Category
              </p>
              <p className="text-accent font-bold uppercase">{project.category}</p>
            </div>
            <div>
              <p className="text-muted uppercase text-[10px] tracking-widest mb-1.5">
                Status
              </p>
              <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{project.status}</span>
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-muted uppercase text-[10px] tracking-widest mb-1.5">
                Repository
              </p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-accent hover:underline font-bold"
              >
                <span>Inspect Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Full-Width Cover Image with Dennis Snellenberg Clip-Path Reveal & Slight Parallax */}
        <div
          ref={coverRef}
          className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-surface border border-line shadow-2xl mb-24 sm:mb-32"
        >
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.25 }}
            animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
            transition={{
              duration: 1.1,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.15,
            }}
            className="w-full h-full relative"
          >
            <motion.div
              style={{ y: coverParallaxY }}
              className="relative w-full h-[115%] -top-[7.5%]"
            >
              <Image
                src={project.cover}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Alternating Case Study Content Blocks */}
        <div className="space-y-20 sm:space-y-28 max-w-4xl mx-auto mb-28 sm:mb-40">
          {/* Block 1: Problem */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
            className="p-8 sm:p-12 rounded-3xl bg-surface border border-line"
          >
            <span className="text-[11px] font-mono tracking-widest text-muted uppercase block mb-3">
              01 · The Problem
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-text mb-6">
              Challenges & Operational Friction
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed font-normal">
              {project.problem}
            </p>
          </motion.section>

          {/* Block 2: Solution */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
            className="p-8 sm:p-12 rounded-3xl bg-surface border border-line"
          >
            <span className="text-[11px] font-mono tracking-widest text-accent uppercase block mb-3">
              02 · The Solution
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-text mb-6">
              Architectural Implementation & Engineering
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed font-normal">
              {project.solution}
            </p>
          </motion.section>

          {/* Block 3: Technology Stack */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
          >
            <span className="text-[11px] font-mono tracking-widest text-muted uppercase block mb-3">
              03 · Technology Stack
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-text mb-6">
              Core Technologies & Architecture
            </h2>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-surface border border-line text-xs sm:text-sm font-mono text-text/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Block 4: Result */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
            className="p-8 sm:p-12 rounded-3xl bg-surface border border-line flex flex-col gap-4"
          >
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase block">
              04 · The Result
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-text">
              Production Impact & Reliability
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed font-normal">
              {project.result}
            </p>
          </motion.section>
        </div>
      </div>

      {/* "Next project" Full-Width Block (Dennis Snellenberg Signature) */}
      <div className="border-t border-line">
        <a
          href={`/work/${nextProject.slug}`}
          onClick={handleNextClick}
          className="group relative block w-full py-24 sm:py-36 md:py-44 px-6 sm:px-10 md:px-14 overflow-hidden transition-colors duration-500 hover:bg-accent cursor-pointer"
        >
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-8 relative z-10">
            <div>
              <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-muted group-hover:text-accent-ink/80 transition-colors duration-500 block mb-3">
                Next Project
              </span>
              <h3 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-text group-hover:text-accent-ink transition-colors duration-500">
                {nextProject.title}
              </h3>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-line group-hover:border-accent-ink group-hover:bg-accent-ink text-text group-hover:text-accent flex items-center justify-center transition-all duration-500 shrink-0 self-end sm:self-auto">
              <ArrowUpRight className="w-7 h-7 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>
        </a>
      </div>
    </article>
  );
}
