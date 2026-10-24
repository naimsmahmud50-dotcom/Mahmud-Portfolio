"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { defaultProjects as fallbackProjects, type ProjectData } from "@/lib/data";
import MagneticWrapper from "@/components/MagneticWrapper";
import { usePageTransition } from "@/context/TransitionContext";

interface FeaturedProjectsProps {
  projects?: ProjectData[];
}

export default function FeaturedProjects({ projects: propProjects }: FeaturedProjectsProps = {}) {
  const projects = propProjects && propProjects.length > 0 ? propProjects : fallbackProjects;
  const { navigate } = usePageTransition();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Mouse tracking coordinates for cursor-following preview modal
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Smooth lerp spring physics for modal positioning (Dennis Snellenberg feel)
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

  const handleRowClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    navigate(`/work/${slug}`);
  };

  const handleMoreWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/work");
  };

  return (
    <section className="relative py-28 sm:py-36 md:py-44 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none">
      {/* Section Header with Project Count */}
      <div className="flex items-baseline justify-between mb-12 sm:mb-16">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <h2 className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            Recent Work
          </h2>
        </div>
        <span className="text-xs sm:text-sm font-mono text-muted">
          ({projects.length.toString().padStart(2, "0")})
        </span>
      </div>

      {/* Floating Vertical Slider Preview Modal (Dennis Snellenberg Signature) */}
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
        {/* Inner Vertical Slider containing stacked project images */}
        <div
          className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{
            transform: `translateY(-${(activeIdx ?? 0) * 100}%)`,
          }}
        >
          {projects.map((proj) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent flex items-end p-5">
                <span className="text-[11px] font-mono tracking-widest uppercase text-muted font-semibold">
                  {proj.category.toUpperCase()} · {proj.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Project Rows List with 1px Line Separators */}
      <div className="border-t border-b border-line divide-y divide-line">
        {projects.map((proj, idx) => {
          const isHovered = activeIdx === idx;
          const isAnyHovered = activeIdx !== null;
          const isDimmed = isAnyHovered && !isHovered;

          return (
            <div
              key={proj.slug}
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
                {/* Left: Project Title & Mobile Thumbnail */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden border border-line shrink-0 lg:hidden bg-surface">
                    <Image
                      src={proj.cover}
                      alt={proj.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-normal tracking-tight text-text transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] lg:group-hover:translate-x-5">
                    {proj.title}
                  </h3>
                </div>

                {/* Right: Category + Year & Mobile Arrow */}
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
            </div>
          );
        })}
      </div>

      {/* Circular "More work" Magnetic Button */}
      <div className="mt-16 sm:mt-24 flex justify-center">
        <MagneticWrapper strength={0.35} innerStrength={0.55}>
          <a
            href="/work"
            onClick={handleMoreWorkClick}
            className="group w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-line bg-surface hover:bg-accent hover:text-accent-ink hover:border-accent text-text transition-colors duration-400 flex flex-col items-center justify-center gap-1.5 shadow-xl select-none cursor-pointer"
            aria-label="View all portfolio projects"
          >
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold">
              More work
            </span>
            <span className="text-[10px] font-mono text-muted group-hover:text-accent-ink/80">
              ({projects.length})
            </span>
          </a>
        </MagneticWrapper>
      </div>
    </section>
  );
}
