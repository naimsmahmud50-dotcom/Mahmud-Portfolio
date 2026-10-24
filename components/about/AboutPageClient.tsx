"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  Cpu,
  Layout,
  Smartphone,
  Database,
  Wrench,
  ArrowUpRight,
  Download,
  MapPin,
} from "lucide-react";
import Button from "@/components/Button";
import { usePreloader } from "@/context/TransitionContext";
import type { AboutData, SkillCluster, ExperienceData } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Layout,
  Smartphone,
  Database,
  Wrench,
};

// Word-by-word scroll illumination component (Dennis Snellenberg signature craft)
function WordReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.88", "start 0.35"],
  });

  const words = text.split(" ");
  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1 / words.length);
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span className="relative inline-block mr-[0.26em] my-0.5">
      <motion.span style={{ opacity }} className="transition-colors">
        {children}
      </motion.span>
    </span>
  );
}

// Interactive Photo Strip Items
const photoStripItems = [
  {
    id: 1,
    title: "Mahmud Hasan",
    subtitle: "Dhaka, Bangladesh · AI & Fullstack",
    image: "/images/mahmud.jpg",
    aspect: "aspect-[4/5]",
  },
  {
    id: 2,
    title: "Institutional Scale",
    subtitle: "Madrasah Ecosystem · 15+ Schools",
    image: "/images/projects/madrasah.svg",
    aspect: "aspect-[16/10]",
  },
  {
    id: 3,
    title: "Autonomous Agents",
    subtitle: "Lead Intelligence & Data Swarms",
    image: "/images/projects/ai-agent.svg",
    aspect: "aspect-[16/10]",
  },
  {
    id: 4,
    title: "Meta Commerce",
    subtitle: "Social Sales Automation Pipeline",
    image: "/images/projects/facebook.svg",
    aspect: "aspect-[16/10]",
  },
  {
    id: 5,
    title: "Endpoint Security",
    subtitle: "Hardware & Background Daemons",
    image: "/images/projects/security.svg",
    aspect: "aspect-[16/10]",
  },
  {
    id: 6,
    title: "Mobile Architecture",
    subtitle: "Offline-First Flutter Systems",
    image: "/images/projects/student.svg",
    aspect: "aspect-[16/10]",
  },
];

interface AboutPageClientProps {
  about: AboutData;
  skillClusters: SkillCluster[];
  experiences: ExperienceData[];
}

export default function AboutPageClient({
  about,
  skillClusters,
  experiences,
}: AboutPageClientProps) {
  const { isPreloaderDone } = usePreloader();
  const portraitRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);

  // Parallax on Portrait Photo
  const { scrollYProgress: portraitScroll } = useScroll({
    target: portraitRef,
    offset: ["start end", "end start"],
  });
  const portraitParallaxY = useTransform(portraitScroll, [0, 1], [-40, 40]);

  // Compute drag bounds dynamically
  useEffect(() => {
    if (dragContainerRef.current) {
      const scrollW = dragContainerRef.current.scrollWidth;
      const clientW = dragContainerRef.current.offsetWidth;
      setDragWidth(Math.max(0, scrollW - clientW + 60));
    }
  }, []);

  const headlineText =
    about.heroHeadlineEn ||
    "Developing digital systems that think, adapt, and scale—";
  const headlineWords = headlineText.split(" ");

  const avatar = about.avatarUrl || "/images/mahmud.jpg";
  const cvLink = about.cvUrl || "/cv.pdf";
  const location = about.locationEn || "Dhaka, Bangladesh";

  return (
    <div className="pt-36 sm:pt-44 md:pt-48 pb-24 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none">
      {/* 1. HERO EDITORIAL HEADER WITH LETTER / WORD STAGGER */}
      <div className="mb-20 sm:mb-28">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
            Biography &amp; Architecture
          </span>
          <span className="text-xs sm:text-sm font-mono text-muted">
            (About Mahmud)
          </span>
        </div>

        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-text leading-[1.05] max-w-5xl"
          aria-label={headlineText}
        >
          {headlineWords.map((word, wordIndex) => (
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

      {/* 2. EDITORIAL WORD-BY-WORD SCROLL ILLUMINATION (Dennis Snellenberg Signature) */}
      <div className="mb-24 sm:mb-32 max-w-5xl">
        <span className="block text-xs font-mono uppercase tracking-widest text-accent mb-6">
          The Approach
        </span>
        <WordReveal
          text="I bridge the divide between deep systems engineering and high-craft editorial design. From autonomous AI agent swarms and resilient database architectures to fluid 60fps micro-interactions, I treat every project as a durable commercial asset — engineered for speed, strictly type-safe, and built to withstand real-world scale."
          className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.3] text-text"
        />
      </div>

      {/* 3. PORTRAIT WITH SMOOTH SCROLL PARALLAX & SHORT STORY */}
      <div
        ref={portraitRef}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-32 sm:mb-40"
      >
        {/* Left Column: Parallax Portrait Photo Frame */}
        <div className="lg:col-span-5 relative">
          <motion.div
            style={{ y: portraitParallaxY }}
            className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-surface border border-line shadow-2xl group"
          >
            <Image
              src={avatar}
              alt="Mahmud Hasan Portrait"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent pointer-events-none" />

            {/* Floating Portrait Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="font-display text-lg font-medium text-text">
                  Mahmud Hasan
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-accent">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location} · UTC+6</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            </div>
          </motion.div>

          {/* Quick Action: CV Download Button */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              href={cvLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-accent" />
                <span>Curriculum Vitae (PDF)</span>
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Column: Original Story Narrative from Database */}
        <div className="lg:col-span-7 space-y-8 text-base sm:text-lg text-muted font-normal leading-relaxed">
          <div className="border-b border-line pb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-accent block mb-2">
              Engineering Narrative
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-text font-normal tracking-tight">
              Crafting intelligent systems from Dhaka to global stages.
            </h2>
          </div>

          <p>{about.storyP1En}</p>
          <p>{about.storyP2En}</p>
          <p>{about.storyP3En}</p>

          {/* Key Principles Checklist */}
          <div className="pt-6 border-t border-line space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <strong className="text-text font-medium">Autonomous by Design:</strong>
                <span className="text-muted text-sm block mt-0.5">
                  Building automated pipelines that monitor, retry, and heal themselves under varying network and API conditions.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <strong className="text-text font-medium">Sub-Second Performance:</strong>
                <span className="text-muted text-sm block mt-0.5">
                  Leveraging server components, edge caching, and lightweight bundles to achieve optimal Core Web Vitals.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <strong className="text-text font-medium">High-Craft Aesthetics:</strong>
                <span className="text-muted text-sm block mt-0.5">
                  Inertial smooth scrolling, custom cursors, and magnetic micro-interactions inspired by Dennis Snellenberg.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SKILL CLUSTERS FROM DATABASE (No Fake Percentages) */}
      <div className="mb-32 sm:mb-40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-line">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent block mb-2">
              Capabilities &amp; Arsenal
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-text font-normal tracking-tight">
              Skill Clusters &amp; Disciplines
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">
            Structured clusters · Verified production stack
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {skillClusters.map((cluster) => {
            const Icon = iconMap[cluster.iconName] || Cpu;
            return (
              <div
                key={cluster.category}
                className="p-8 rounded-3xl bg-surface border border-line hover:border-line/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-muted">
                      ({cluster.count})
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-medium text-text mb-3">
                    {cluster.category}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed mb-6">
                    {cluster.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-line/50">
                  {cluster.skills.map((skill) => (
                    <div
                      key={skill}
                      className="text-xs font-mono text-text/80 flex items-center gap-2.5 py-1 px-2.5 rounded-lg bg-bg/50 border border-line/30 hover:border-accent/40 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span className="truncate">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. HONEST TIMELINE FROM DATABASE */}
      <div className="mb-32 sm:mb-40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-line">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent block mb-2">
              Progression
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-text font-normal tracking-tight">
              Engineering Timeline
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">
            Production Milestones
          </span>
        </div>

        <div className="space-y-6">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="p-8 sm:p-10 rounded-3xl bg-surface border border-line hover:border-line/80 transition-colors grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
            >
              {/* Year & Phase Tag */}
              <div className="md:col-span-3 flex items-center gap-4">
                <span className="font-display text-3xl sm:text-4xl font-medium text-accent">
                  {item.year || item.period}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold">
                  {item.phase || item.company}
                </span>
              </div>

              {/* Title & Detail */}
              <div className="md:col-span-9 space-y-2">
                <h3 className="font-display text-xl sm:text-2xl font-normal text-text">
                  {item.title || item.roleEn}
                </h3>
                <p className="text-sm sm:text-base text-muted font-normal leading-relaxed">
                  {item.detail || item.descriptionEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PHOTO STRIP WITH HORIZONTAL DRAG (Cursor shows "Drag") */}
      <div className="mb-28 sm:mb-36">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-line">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent block mb-1">
              Field Showcase
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-text font-normal tracking-tight">
              Atmosphere &amp; System Artefacts
            </h2>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-muted">
            ← Drag to explore →
          </span>
        </div>

        {/* Draggable Carousel Track */}
        <div
          ref={dragContainerRef}
          data-cursor="drag"
          data-cursor-text="DRAG"
          className="overflow-hidden cursor-grab active:cursor-grabbing py-4 -mx-6 sm:-mx-10 md:-mx-14 px-6 sm:px-10 md:px-14"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: -dragWidth, right: 0 }}
            dragElastic={0.08}
            className="flex gap-6 sm:gap-8 w-max select-none"
          >
            {photoStripItems.map((item) => (
              <div
                key={item.id}
                className="relative w-[280px] sm:w-[360px] md:w-[420px] rounded-3xl overflow-hidden bg-surface border border-line shadow-xl shrink-0 group pointer-events-none"
              >
                <div className={`relative w-full ${item.aspect} bg-surface-raised overflow-hidden`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 280px, 420px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <h4 className="font-display text-lg sm:text-xl font-medium text-text">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-mono text-muted mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
