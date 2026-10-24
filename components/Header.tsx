"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";
import SlideLink from "./SlideLink";
import FloatingMenu from "./FloatingMenu";
import NavPanel from "./NavPanel";
import LangSwitch from "./LangSwitch";
import { ThemeToggleButton } from "./ThemeToggle";
import { usePageTransition } from "@/context/TransitionContext";
import type { SiteSettingsData } from "@/lib/data";

interface HeaderProps {
  settings?: SiteSettingsData;
}

export default function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const { navigate } = usePageTransition();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/");
  };

  const handleClose = React.useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleToggle = React.useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Past hero threshold (approx 160px)
      setIsScrolled(window.scrollY > 160);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-10 md:px-14 py-8 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Dennis Snellenberg Wordmark: "© Code by Mahmud" -> reveals "Mahmud Hasan" */}
          <div className="pointer-events-auto">
            <MagneticWrapper strength={0.3}>
              <a
                href="/"
                onClick={handleHomeClick}
                className="group flex items-center gap-2 font-display text-sm tracking-tight text-text select-none py-1"
                aria-label="Mahmud Hasan — Home"
              >
                {/* 360-degree rotating copyright symbol */}
                <span className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:rotate-[360deg] text-muted group-hover:text-accent font-mono text-xs">
                  ©
                </span>

                {/* Sliding Dual-Line Reveal Text */}
                <div className="relative inline-block overflow-hidden h-[1.35em] leading-[1.35em]">
                  {/* Primary text sliding up */}
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full font-medium">
                    Code by Mahmud
                  </span>
                  {/* Alternate revealed text rolling in */}
                  <span
                    aria-hidden="true"
                    className="block absolute top-full left-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full font-semibold text-accent"
                  >
                    Mahmud Hasan
                  </span>
                </div>
              </a>
            </MagneticWrapper>
          </div>

          {/* Desktop Navigation Links: Scale out once scrolled past hero */}
          <motion.nav
            initial={false}
            animate={{
              scale: isScrolled ? 0 : 1,
              opacity: isScrolled ? 0 : 1,
            }}
            transition={{
              duration: 0.45,
              ease: [0.76, 0, 0.24, 1],
            }}
            className={`hidden md:flex items-center gap-10 origin-right ${
              isScrolled ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            <SlideLink href="/work" isActive={pathname.startsWith("/work")}>
              Work
            </SlideLink>
            <SlideLink href="/about" isActive={pathname === "/about"}>
              About
            </SlideLink>
            <SlideLink href="/contact" isActive={pathname === "/contact"}>
              Contact
            </SlideLink>

            {/* Quick Utility Switchers (Language & Theme) */}
            <div className="flex items-center gap-3 pl-4 border-l border-line">
              <LangSwitch />
              <ThemeToggleButton />
            </div>
          </motion.nav>
        </div>
      </header>

      {/* Floating Circular Menu Button (~80px, fixed top-right, magnetic, morphs to X) */}
      <FloatingMenu
        isOpen={menuOpen}
        onToggle={handleToggle}
        scrollThreshold={160}
      />

      {/* Dennis Snellenberg Liquid Sliding Nav Panel with SVG Curved Left Edge */}
      <NavPanel isOpen={menuOpen} onClose={handleClose} settings={settings} />
    </>
  );
}
