"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";
import { usePageTransition } from "@/context/TransitionContext";
import { useI18n } from "@/lib/i18n";
import { buildTelUrl } from "@/lib/contact-links";
import type { SiteSettingsData } from "@/lib/data";

const fallbackSocials = [
  { label: "GitHub", href: "https://github.com/naimsmahmud50-dotcom" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mahmud-hasan-687908269?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  { label: "WhatsApp", href: "https://wa.me/8801767850859" },
  { label: "Telegram", href: "https://t.me/naimsmahmud50" },
];

interface FooterProps {
  settings?: SiteSettingsData;
}

export default function Footer({ settings }: FooterProps = {}) {
  const footerRef = useRef<HTMLElement | null>(null);
  const { navigate } = usePageTransition();
  const { lang } = useI18n();
  const [dhakaTime, setDhakaTime] = useState<string>("");

  const email = settings?.email || "mahmudhasan.infodev@gmail.com";
  const phone = settings?.phone || "+880 1767-850859";
  const activeSocials = settings?.socials && settings.socials.length > 0 ? settings.socials : fallbackSocials;

  // Live Dhaka Local Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setDhakaTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallax rise on enter & curved bottom edge flattening
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const contentParallaxY = useTransform(scrollYProgress, [0, 1], [-80, 0]);
  const curveHeight = useTransform(scrollYProgress, [0, 0.6], [100, 0]);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/contact");
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-surface text-text select-none overflow-hidden"
    >
      {/* Dennis Snellenberg Liquid Curved Transition Boundary (Flattens on Scroll) */}
      <motion.div
        style={{ height: curveHeight }}
        className="w-full overflow-hidden bg-bg pointer-events-none"
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-full fill-surface"
        >
          <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </motion.div>

      {/* Main Footer Content with Parallax Rise */}
      <motion.div
        style={{ y: contentParallaxY }}
        className="relative pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto flex flex-col justify-between min-h-[85vh]"
      >
        {/* Very Soft Ambient Radial Glow behind the big heading & button area (max 10% opacity) */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[450px] sm:h-[600px] rounded-full blur-[160px] pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Top: Massive Headline */}
        <div>
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase font-medium text-muted">
              {lang === "bn"
                ? "কিউ৪/২০২৬ যৌথ কাজের জন্য উপলব্ধ"
                : "Available for Q4/2026 Collaboration"}
            </span>
          </div>

          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-medium leading-[0.9] tracking-tight text-text">
            {lang === "bn" ? (
              <>
                একসাথে কাজ<br />
                <span className="text-accent">করি</span>
              </>
            ) : (
              <>
                Let’s work<br />
                <span className="text-accent">together</span>
              </>
            )}
          </h2>
        </div>

        {/* Middle Section: Divider Line with Overlapping Magnetic "Get in touch" Disc */}
        <div className="relative my-16 sm:my-24">
          {/* Horizontal Line across the section */}
          <div className="w-full h-[1px] bg-line" />

          {/* Overlapping Magnetic Round "Get in touch" Button */}
          <div className="absolute right-6 sm:right-16 md:right-24 top-1/2 -translate-y-1/2">
            <MagneticWrapper strength={0.4} innerStrength={0.65}>
              <a
                href="/contact"
                onClick={handleContactClick}
                className="group w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-accent text-accent-ink flex flex-col items-center justify-center transition-all duration-300 hover:bg-accent-hover hover:scale-[1.06] active:scale-95 cursor-pointer shadow-[0_20px_60px_rgba(200,242,74,0.18)]"
                aria-label="Get in touch with Mahmud Hasan"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-xs sm:text-sm md:text-base font-mono font-bold uppercase tracking-wider text-center leading-tight text-accent-ink">
                    {lang === "bn" ? (
                      <>
                        যোগাযোগ<br />করুন
                      </>
                    ) : (
                      <>
                        Get in<br />touch
                      </>
                    )}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-accent-ink/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ArrowUpRight className="w-4 h-4 text-accent-ink" />
                  </div>
                </div>
              </a>
            </MagneticWrapper>
          </div>
        </div>

        {/* Contact Pill Buttons Row */}
        <div className="flex flex-wrap items-center gap-4 mb-16 sm:mb-24">
          <MagneticWrapper strength={0.3}>
            <a
              href={`mailto:${email}`}
              className="px-7 sm:px-9 py-4 sm:py-4.5 rounded-full border border-line-strong bg-transparent text-text hover:bg-surface-2 hover:border-accent hover:text-accent font-mono text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 inline-block"
            >
              {email}
            </a>
          </MagneticWrapper>

          <MagneticWrapper strength={0.3}>
            <a
              href={buildTelUrl(phone)}
              className="px-7 sm:px-9 py-4 sm:py-4.5 rounded-full border border-line-strong bg-transparent text-text hover:bg-surface-2 hover:border-accent hover:text-accent font-mono text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 inline-block"
            >
              {phone}
            </a>
          </MagneticWrapper>
        </div>

        {/* Bottom 3 Columns: Version, Local Time, Socials */}
        <div className="pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 items-baseline text-xs font-mono text-text">
          {/* Column 1: Version */}
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-muted mb-1.5">
              Version
            </span>
            <span className="font-semibold text-text">
              © 2026 EDITION
            </span>
          </div>

          {/* Column 2: Local Time Live Clock */}
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-muted mb-1.5">
              Local Time
            </span>
            <span className="font-semibold text-text flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span suppressHydrationWarning>{dhakaTime || "02:00 PM"} GMT+6 (Dhaka)</span>
            </span>
          </div>

          {/* Column 3: Socials Slide-up Hover Links */}
          <div>
            <span className="block text-[10px] uppercase tracking-widest text-muted mb-2">
              Socials
            </span>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {activeSocials.map((soc) => (
                <li key={soc.label}>
                  <MagneticWrapper strength={0.25}>
                    <a
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-block py-0.5 font-medium text-text hover:text-accent transition-colors"
                    >
                      <span className="relative overflow-hidden inline-block h-[1.3em]">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                          {soc.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute top-full left-0 inline-block transition-transform duration-300 group-hover:-translate-y-full font-bold underline text-accent"
                        >
                          {soc.label}
                        </span>
                      </span>
                    </a>
                  </MagneticWrapper>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
