"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectData } from "@/lib/data";
import MagneticWrapper from "@/components/MagneticWrapper";
import { usePageTransition, usePreloader } from "@/context/TransitionContext";

type FilterCategory = "all" | "web" | "android" | "ai";

const filterOptions: { label: string; value: FilterCategory }[] = [
  { label: "All", value: "all" },
  { label: "Web", value: "web" },
  { label: "Android", value: "android" },
  { label: "AI & Automation", value: "ai" },
];

interface WorkPageClientProps {
  initialProjects: ProjectData[];
}

export default function WorkPageClient({ initialProjects }: WorkPageClientProps) {
  const { navigate } = usePageTransition();
  const { isPreloaderDone } = usePreloader();
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const projects = initialProjects || [];

  // Filter projects based on active selection
  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  // Mouse tracking coordinates for cursor-following preview modal
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Smooth lerp spring physics (Dennis Snellenberg signature feel)
  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 };
  const modalX = useSpring(mouseX, springConfig);
  const modalY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIdx(null);
  }, [filter]);

  const handleRowClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    navigate(`/work/${slug}`);
  };

  const titleString = "Creating next-level digital products—";
  const titleWords = titleString.split(" ");

  return (
    <div className="pt-36 sm:pt-44 md:pt-48 pb-32 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none">
      {/* Editorial Page Title with Letter Stagger Reveal & Count */}
      <div className="mb-14 sm:mb-20">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            Portfolio Archive
          </span>
          <span className="text-xs sm:text-sm font-mono text-muted">
            ({projects.length.toString().padStart(2, "0")})
          </span>
        </div>

        {/* Huge Title with Staggered Word Reveal */}
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-text leading-[1.05] max-w-5xl"
          aria-label={titleString}
        >
          {titleWords.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="inline-block overflow-hidden mr-[0.28em] pb-1"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "115%" }}
                animate={isPreloaderDone ? { y: "0%" } : { y: "115%" }}
                transition={{
                  duration: 0.85,
                  ease: [0.25, 1, 0.5, 1], // power4.out
                  delay: 0.05 + wordIndex * 0.04,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* Filter Row: All / Web / Android / AI & Automation */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-16 pb-8 border-b border-line">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.value;
          const count =
            opt.value === "all"
              ? projects.length
              : projects.filter((p) => p.category === opt.value).length;

          return (
            <MagneticWrapper key={opt.value} strength={0.3}>
              <button
                onClick={() => setFilter(opt.value)}
                className={`relative px-6 py-3 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-accent text-accent-ink shadow-lg"
                    : "bg-transparent border border-line-strong text-text-2 hover:text-text hover:border-accent"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] ${
                    isActive ? "text-accent-ink/80" : "text-muted"
                  }`}
                >
                  ({count})
                </span>
              </button>
            </MagneticWrapper>
          );
        })}
      </div>

      {/* Floating Vertical Slider Preview Modal (Synchronized with Filtered Projects) */}
      <motion.div
        style={{
          x: modalX,
          y: modalY,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: activeIdx !== null ? 1 : 0,
          opacity: activeIdx !== null ? 1 : 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="hidden lg:block fixed pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-[12px] overflow-hidden bg-surface border border-line shadow-2xl"
      >
        <div
          className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            transform: `translateY(-${(activeIdx ?? 0) * 100}%)`,
          }}
        >
          {filteredProjects.map((proj) => (
            <div
              key={proj.slug}
              className="relative w-full h-[300px] flex items-center justify-center bg-surface overflow-hidden"
            >
              <Image
                src={proj.cover}
                alt={proj.title}
                fill
                sizes="400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent flex items-end p-5">
                <span className="text-[11px] font-mono tracking-widest uppercase text-muted font-semibold">
                  {proj.category.toUpperCase()} · {proj.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Project Rows List with Smooth Motion Layout Reordering */}
      <motion.div
        layout
        className="border-t border-b border-line divide-y divide-line"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((proj, idx) => {
            const isHovered = activeIdx === idx;
            const isAnyHovered = activeIdx !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <motion.div
                key={proj.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                data-cursor="view"
                data-cursor-text="VIEW"
                className={`transition-all duration-300 ${
                  isDimmed ? "opacity-40" : "opacity-100"
                } ${isHovered ? "bg-surface" : "bg-transparent"} px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-xl`}
              >
                <a
                  href={`/work/${proj.slug}`}
                  onClick={(e) => handleRowClick(e, proj.slug)}
                  className="group py-8 sm:py-12 md:py-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-400 cursor-pointer"
                >
                  {/* Left: Project Title (Stays --text on hover, shifts ~20px) */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-normal tracking-tight text-text transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-5">
                    {proj.title}
                  </h2>

                  {/* Right: Category + Year & Mobile Indicator */}
                  <div className="flex items-center gap-6 text-xs sm:text-sm font-mono text-muted uppercase tracking-wider">
                    <span className="hidden sm:inline-block">
                      {proj.category === "ai"
                        ? "AI Automation"
                        : proj.category === "android"
                        ? "Android App"
                        : "Web Platform"}
                    </span>
                    <span>·</span>
                    <span>{proj.year}</span>
                    <div className="w-8 h-8 rounded-full border border-line flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink transition-colors sm:hidden">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
