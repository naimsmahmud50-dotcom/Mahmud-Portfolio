"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Button from "@/components/Button";
import type { AboutData } from "@/lib/data";

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <span className="relative inline-block mr-[0.28em] my-[0.1em]">
      <motion.span style={{ opacity }} className="text-text">
        {children}
      </motion.span>
    </span>
  );
}

interface AboutPreviewProps {
  about?: AboutData;
}

export default function AboutPreview({ about }: AboutPreviewProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.45"],
  });

  const photoParallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const paragraphText =
    about?.storyP1En ||
    "Helping visionary founders, modern brands, and ambitious engineering teams succeed in the digital era by architecting intelligent AI automation, high-performance web applications, and mission-critical Android solutions that operate flawlessly and scale without limits.";

  const words = paragraphText.split(" ");
  const avatar = about?.avatarUrl || "/images/mahmud.jpg";

  return (
    <section
      ref={containerRef}
      className="relative py-28 sm:py-36 md:py-48 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 items-center">
        {/* Left Column: Photo Placeholder with Parallax & Rotating Circular Text Badge */}
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden bg-surface border border-line shadow-2xl">
            <motion.div
              style={{ y: photoParallaxY }}
              className="relative w-full h-[120%] -top-[10%]"
            >
              <Image
                src={avatar}
                alt="Mahmud Hasan — AI Automation & Full-Stack Architect"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-top filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700 ease-out"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Rotating Circular Text Badge (Dennis Snellenberg Signature) */}
          <div className="absolute -bottom-8 -right-4 sm:-bottom-10 sm:-right-6 w-32 h-32 sm:w-36 sm:h-36 z-20 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 14,
                ease: "linear",
                repeat: Infinity,
              }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full fill-accent">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text className="text-[10px] font-mono uppercase tracking-[0.2em] fill-text">
                  <textPath href="#circlePath">
                    • MAHMUD HASAN • AI ARCHITECT • BANGLADESH
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* Center dot in circular badge */}
            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-accent" />
          </div>
        </div>

        {/* Right Column: Word-by-Word Scroll Scrubbed Large Paragraph */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase">
              About Mahmud
            </span>
          </div>

          {/* Word-by-Word Scrub Typography Statement */}
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-display font-normal leading-[1.3] tracking-tight">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </p>

          {/* About Me Action */}
          <div className="mt-10 sm:mt-14">
            <Button href="/about" variant="outline" size="md">
              <span>More about me</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
