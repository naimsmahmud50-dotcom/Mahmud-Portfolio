"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";

interface FloatingMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  scrollThreshold?: number;
}

export default function FloatingMenu({
  isOpen,
  onToggle,
  scrollThreshold = 160,
}: FloatingMenuProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  // Button is visible if user has scrolled past hero OR if menu is currently open
  const isVisible = isScrolled || isOpen;

  return (
    <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 pointer-events-none">
      <motion.div
        initial={false}
        animate={{
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.76, 0, 0.24, 1],
        }}
        className={isVisible ? "pointer-events-auto" : "pointer-events-none"}
      >
        <MagneticWrapper strength={0.4} innerStrength={0.65}>
          <button
            onClick={onToggle}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent text-accent-ink shadow-2xl flex flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent select-none group cursor-pointer transition-transform duration-300 active:scale-95"
          >
            {/* Morphing 2-Line Hamburger to X */}
            <div className="relative w-6 sm:w-7 h-4 flex flex-col justify-center items-center pointer-events-none">
              {/* Top Line */}
              <motion.span
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 0 : -3.5,
                }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                className="w-6 sm:w-7 h-[2px] bg-accent-ink rounded-full absolute"
              />

              {/* Bottom Line */}
              <motion.span
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? 0 : 3.5,
                }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                className="w-6 sm:w-7 h-[2px] bg-accent-ink rounded-full absolute"
              />
            </div>

            {/* Subtle Screen Reader Label */}
            <span className="sr-only">{isOpen ? "Close Menu" : "Open Menu"}</span>
          </button>
        </MagneticWrapper>
      </motion.div>
    </div>
  );
}
