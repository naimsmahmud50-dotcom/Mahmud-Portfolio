"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";
import LangSwitch from "./LangSwitch";
import { ThemeToggleButton } from "./ThemeToggle";
import { usePageTransition } from "@/context/TransitionContext";
import type { SiteSettingsData } from "@/lib/data";

interface NavPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettingsData;
}

const navItems = [
  { href: "/", label: "Home", index: "01" },
  { href: "/work", label: "Work", index: "02" },
  { href: "/about", label: "About", index: "03" },
  { href: "/contact", label: "Contact", index: "04" },
];

const fallbackSocialLinks = [
  { href: "https://github.com/naimsmahmud50-dotcom", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/mahmud-hasan-687908269",
    label: "LinkedIn",
  },
  { href: "https://wa.me/8801767850859", label: "WhatsApp" },
  { href: "https://t.me/naimsmahmud50", label: "Telegram" },
];

export default function NavPanel({ isOpen, onClose, settings }: NavPanelProps) {
  const socialLinks = settings?.socials && settings.socials.length > 0
    ? settings.socials
    : fallbackSocialLinks;
  const pathname = usePathname();
  const { navigate } = usePageTransition();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Listen for external close signals (e.g. page transition trigger)
  useEffect(() => {
    const handleCloseSignal = () => {
      onClose();
    };
    window.addEventListener("closeNavPanel", handleCloseSignal);
    return () => window.removeEventListener("closeNavPanel", handleCloseSignal);
  }, [onClose]);

  // Update viewport dimensions for SVG curve morph
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Trap focus within NavPanel when open
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Auto-focus first link after mount
      const timer = setTimeout(() => {
        const firstLink = panelRef.current?.querySelector<HTMLElement>("a");
        firstLink?.focus();
      }, 300);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, handleKeyDown]);

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // SVG Curve path definitions
  const h = dimensions.height || 800;
  // Curve bulging out to left as panel slides in
  const initialCurve = `M100 0 L100 ${h} Q-100 ${h / 2} 100 0 Z`;
  // Target: straight vertical line along x=100
  const targetCurve = `M100 0 L100 ${h} Q100 ${h / 2} 100 0 Z`;
  // Exit curve pulling back as it slides out
  const exitCurve = `M100 0 L100 ${h} Q-100 ${h / 2} 100 0 Z`;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop Overlay (rgba(0,0,0,0.55)) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/[0.55] backdrop-blur-sm z-40 cursor-pointer"
            aria-hidden="true"
          />

          {/* Liquid Sliding Drawer Container */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={{ x: "calc(100% + 100px)" }}
            animate={{ x: "0%" }}
            exit={{ x: "calc(100% + 100px)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            className="fixed right-0 top-0 bottom-0 h-screen w-full sm:w-[500px] md:w-[45vw] lg:w-[40vw] max-w-[620px] bg-surface z-50 flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none shadow-2xl border-l border-line"
          >
            {/* Dennis Snellenberg Liquid SVG Curved Left Edge */}
            <svg
              className="absolute top-0 -left-[99px] w-[100px] h-full pointer-events-none fill-surface stroke-none hidden sm:block"
              viewBox={`0 0 100 ${h}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                initial={{ d: initialCurve }}
                animate={{ d: targetCurve }}
                exit={{ d: exitCurve }}
                transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
              />
            </svg>

            {/* Top Navigation Index Label */}
            <div className="pt-2">
              <div className="text-[11px] font-mono tracking-widest text-muted uppercase pb-4 border-b border-line flex items-center justify-between">
                <span>Navigation</span>
                <span className="text-[10px] text-muted">Dhaka, BD (UTC+6)</span>
              </div>
            </div>

            {/* Center Big Navigation Links */}
            <nav className="my-auto py-8 flex flex-col gap-5 sm:gap-6">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredIdx === idx;
                const isAnyHovered = hoveredIdx !== null;
                const isDimmed = isAnyHovered && !isHovered;

                return (
                  <div
                    key={item.href}
                    className="overflow-hidden"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <motion.div
                      initial={{ y: "120%", opacity: 0 }}
                      animate={{ y: "0%", opacity: isDimmed ? 0.40 : 1 }}
                      exit={{ y: "120%", opacity: 0 }}
                      transition={{
                        y: { duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: 0.12 + idx * 0.08 },
                        opacity: { duration: 0.25, ease: "easeOut" },
                      }}
                      className="transition-opacity duration-300"
                    >
                      <MagneticWrapper strength={0.2}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            onClose();
                            navigate(item.href);
                          }}
                          className="group flex items-center gap-4 py-1"
                        >
                          {/* Active / Hover Indicator Dot in Accent */}
                          <span
                            className={`w-2 h-2 rounded-full bg-accent transition-all duration-300 ${
                              isActive || isHovered
                                ? "scale-100 opacity-100 translate-x-0"
                                : "scale-0 opacity-0 -translate-x-3"
                            }`}
                          />

                          {/* Number Label in --muted */}
                          <span className="text-xs font-mono text-muted mr-1">
                            {item.index}
                          </span>

                          {/* Giant Nav Link Text in --text */}
                          <span className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-text group-hover:text-accent transition-colors duration-300">
                            {item.label}
                          </span>
                        </a>
                      </MagneticWrapper>
                    </motion.div>
                  </div>
                );
              })}
            </nav>

            {/* Preferences & Utility Row */}
            <div className="pt-6 pb-4 border-t border-line flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest text-muted uppercase">
                Preferences
              </span>
              <div className="flex items-center gap-3">
                <LangSwitch />
                <ThemeToggleButton />
              </div>
            </div>

            {/* Bottom Socials Row */}
            <div className="pt-4 border-t border-line/50">
              <span className="block text-[11px] font-mono tracking-widest text-muted uppercase mb-3">
                Socials
              </span>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <MagneticWrapper strength={0.3}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group inline-block py-1 hover:text-accent transition-colors"
                      >
                        {social.label}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
                      </a>
                    </MagneticWrapper>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
