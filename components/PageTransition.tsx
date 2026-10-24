"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/context/TransitionContext";

export default function PageTransition() {
  const { isTransitioning, targetRouteName } = usePageTransition();
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const w = dimension.width;

  // Dennis Snellenberg SVG curve math:
  // Top curve bulging upward as curtain slides in from bottom
  const topCurveInitial = `M0 300 Q${w / 2} 0 ${w} 300 L${w} 300 L0 300 Z`;
  const topCurveFlat = `M0 300 Q${w / 2} 300 ${w} 300 L${w} 300 L0 300 Z`;

  // Bottom curve hanging downward as curtain exits through top
  const bottomCurveHanging = `M0 0 Q${w / 2} 300 ${w} 0 L${w} 0 L0 0 Z`;
  const bottomCurveFlat = `M0 0 Q${w / 2} 0 ${w} 0 L${w} 0 L0 0 Z`;

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="route-curtain"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.55,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-surface text-text select-none pointer-events-auto"
        >
          {/* Top Curved Edge SVG (Active on Entry) */}
          {w > 0 && (
            <svg
              className="absolute -top-[299px] left-0 w-full h-[300px] pointer-events-none fill-surface"
              viewBox={`0 0 ${w} 300`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                initial={{ d: topCurveInitial }}
                animate={{ d: topCurveFlat }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
              />
            </svg>
          )}

          {/* Centered Route Destination Label with Accent Dot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-3 sm:gap-4 text-3xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-text"
          >
            <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-accent animate-pulse" />
            <span>{targetRouteName || "Loading"}</span>
          </motion.div>

          {/* Bottom Curved Edge SVG (Active on Exit) */}
          {w > 0 && (
            <svg
              className="absolute -bottom-[299px] left-0 w-full h-[300px] pointer-events-none fill-surface"
              viewBox={`0 0 ${w} 300`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                initial={{ d: bottomCurveHanging }}
                animate={{ d: bottomCurveFlat }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              />
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
