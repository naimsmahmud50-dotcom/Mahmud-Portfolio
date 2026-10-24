"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";
import { usePageTransition } from "@/context/TransitionContext";

export default function NotFound() {
  const { navigate } = usePageTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackHome = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const digits = ["4", "0", "4"];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 sm:px-10 text-center select-none pt-24 pb-20">
      {/* Top Label */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
        <span className="text-xs sm:text-sm font-mono tracking-widest text-accent uppercase">
          Error 404 · Coordinate Not Found
        </span>
      </div>

      {/* Big "404" with Dennis Snellenberg Letter Reveal Animation */}
      <h1
        className="font-display text-8xl sm:text-[140px] md:text-[180px] lg:text-[220px] font-medium tracking-tight text-text leading-[0.9] flex items-center justify-center mb-6 overflow-hidden"
        aria-label="404"
      >
        {digits.map((digit, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden pb-2"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "115%" }}
              animate={mounted ? { y: "0%" } : { y: "115%" }}
              transition={{
                duration: 0.9,
                ease: [0.25, 1, 0.5, 1], // power4.out
                delay: 0.1 + index * 0.08,
              }}
            >
              {digit}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* Narrative Subtitle */}
      <p className="max-w-md mx-auto text-base sm:text-lg text-muted font-normal leading-relaxed mb-10">
        The route you are searching for does not exist in Mahmud Hasan&apos;s digital portfolio or may have been decoupled.
      </p>

      {/* Magnetic "Back Home" Button */}
      <MagneticWrapper strength={0.4} innerStrength={0.6}>
        <a
          href="/"
          onClick={handleBackHome}
          className="group px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-accent text-accent-ink font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-xl hover:shadow-accent/20 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </a>
      </MagneticWrapper>
    </div>
  );
}
