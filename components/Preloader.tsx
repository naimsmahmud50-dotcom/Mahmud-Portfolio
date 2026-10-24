"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "@/context/TransitionContext";

const words = [
  "Assalamu Alaikum",
  "হ্যালো",
  "Hello",
  "مرحبا",
  "Hola",
  "Bonjour",
  "こんにちは",
];

export default function Preloader() {
  const { setPreloaderDone } = usePreloader();
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // 1. Check if already preloaded in this session
    const hasPreloaded = sessionStorage.getItem("portfolio_preloaded");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (hasPreloaded === "true" || prefersReducedMotion) {
      setPreloaderDone(true);
      return;
    }

    // First load in session: show preloader
    setIsLoading(true);
    document.body.style.overflow = "hidden";

    const updateDim = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDim();
    window.addEventListener("resize", updateDim);

    return () => {
      window.removeEventListener("resize", updateDim);
      document.body.style.overflow = "";
    };
  }, [setPreloaderDone]);

  // Word cycling: ~150ms per word
  useEffect(() => {
    if (!isLoading) return;

    if (index === words.length - 1) {
      // Landed on the last greeting (こんにちは): hold for 320ms, then slide up to reveal
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("portfolio_preloaded", "true");
        document.body.style.overflow = "";
        // Signal hero and other components that preloader has completed
        setTimeout(() => {
          setPreloaderDone(true);
        }, 800);
      }, 320);

      return () => clearTimeout(exitTimer);
    }

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 150);

    return () => clearTimeout(timer);
  }, [index, isLoading, setPreloaderDone]);

  const w = dimension.width;
  const h = dimension.height;

  // Dennis Snellenberg curved SVG bottom edge morph
  const initialPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0 Z`;
  const targetPath = `M0 0 L${w} 0 L${w} 0 Q${w / 2} 0 0 0 L0 0 Z`;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="dennis-preloader"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-bg text-text select-none overflow-hidden"
        >
          {/* Centered Dot + Fast Cycling Word */}
          <div className="relative z-10 flex items-center gap-4 text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight">
            {/* Pulsing Accent Dot */}
            <span className="w-3.5 h-3.5 rounded-full bg-accent animate-pulse" />

            {/* Word Display */}
            <span className="min-w-[220px] sm:min-w-[300px]">
              {words[index]}
            </span>
          </div>

          {/* Dennis Snellenberg Liquid Curved Bottom Edge SVG */}
          {w > 0 && h > 0 && (
            <svg
              className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none fill-bg -z-10"
              viewBox={`0 0 ${w} ${h + 300}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                initial={{ d: initialPath }}
                exit={{
                  d: targetPath,
                  transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                }}
              />
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
