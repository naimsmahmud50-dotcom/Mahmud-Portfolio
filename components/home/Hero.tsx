"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";
import { usePreloader, usePageTransition } from "@/context/TransitionContext";
import { useI18n } from "@/lib/i18n";
import type { HeroData, SiteSettingsData } from "@/lib/data";

interface HeroProps {
  hero?: HeroData;
  settings?: SiteSettingsData;
}

export default function Hero({ hero, settings }: HeroProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isPreloaderDone } = usePreloader();
  const { navigate } = usePageTransition();
  const { lang } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const reducedMotion = Boolean(shouldReduceMotion);

  // Live Dhaka Local Time Clock (Asia/Dhaka GMT+6)
  const [dhakaTime, setDhakaTime] = useState<string>("");

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

  // Subtle Scroll Parallax: Line 1 moves left (-4vw), Line 2 moves right (+4vw)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const line1X = useTransform(scrollYProgress, [0, 1], ["0vw", "-4vw"]);
  const line2X = useTransform(scrollYProgress, [0, 1], ["0vw", "4vw"]);
  const nameParallaxY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  // Dynamic Name & Letters for 2-Line Stagger Reveal
  const fullName = hero?.name || "Mahmud Hasan";
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "Mahmud";
  const lastName = nameParts.slice(1).join(" ") || "Hasan";
  const dashSymbol = hero?.dash || "—";

  // English letters
  const line1Letters = Array.from(firstName);
  const line2Letters = Array.from(lastName);

  const badgeText =
    lang === "bn"
      ? hero?.badgeBn || "এআই অটোমেশন বিশেষজ্ঞ ও ডেভেলপার"
      : hero?.badgeEn || "AI Automation Expert & Developer";

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/about");
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-36 sm:pt-44 md:pt-48 pb-12 sm:pb-16 px-6 sm:px-10 md:px-14 max-w-[1440px] mx-auto select-none overflow-hidden"
    >
      {/* Restrained Animated Background Element (Soft Ambient Glow Mesh) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-accent/[0.07] via-surface/40 to-transparent rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-[8000ms]" />

      {/* Top Small Line inside Overflow Mask */}
      <div className="overflow-hidden">
        <motion.p
          initial={reducedMotion ? { opacity: 0 } : { y: "110%", opacity: 0 }}
          animate={
            isPreloaderDone
              ? reducedMotion ? { opacity: 1 } : { y: "0%", opacity: 1 }
              : reducedMotion ? { opacity: 0 } : { y: "110%", opacity: 0 }
          }
          transition={{
            duration: reducedMotion ? 0.4 : 0.9,
            ease: [0.25, 1, 0.5, 1], // power4.out
            delay: reducedMotion ? 0 : 0.1,
          }}
          className="text-xs sm:text-sm font-mono tracking-widest text-muted uppercase flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>{badgeText}</span>
        </motion.p>
      </div>

      {/* Huge Editorial Name with Deliberate 2-Line Stagger Reveal & Scroll Parallax */}
      <motion.div
        style={reducedMotion ? undefined : { y: nameParallaxY }}
        className="my-auto py-6 sm:py-10 w-full overflow-hidden"
      >
        <h1
          className="hero-name font-display font-medium text-text tracking-tighter flex flex-col w-full max-w-full overflow-wrap-normal break-keep"
          aria-label={lang === "bn" ? "মাহমুদ হাসান—" : "Mahmud Hasan—"}
        >
          {lang === "bn" ? (
            /* ==========================================================
               BANGLA MODE: Animate by full word to protect complex conjuncts
               ========================================================== */
            <>
              {/* Line 1: মাহমুদ */}
              <motion.div
                style={reducedMotion ? undefined : { x: line1X }}
                className="w-full flex items-center justify-start overflow-visible"
              >
                <span className="inline-block whitespace-nowrap overflow-hidden pt-2 pb-3 align-baseline">
                  <motion.span
                    className="inline-block align-baseline"
                    initial={reducedMotion ? { opacity: 0 } : { y: "115%" }}
                    animate={
                      isPreloaderDone
                        ? reducedMotion ? { opacity: 1 } : { y: "0%" }
                        : reducedMotion ? { opacity: 0 } : { y: "115%" }
                    }
                    transition={{
                      duration: reducedMotion ? 0.4 : 0.95,
                      ease: [0.25, 1, 0.5, 1],
                      delay: reducedMotion ? 0.1 : 0.22,
                    }}
                  >
                    <span className="hero-letter-hover inline-block align-baseline cursor-default select-none">
                      মাহমুদ
                    </span>
                  </motion.span>
                </span>
              </motion.div>

              {/* Line 2: হাসান + accent-coloured em dash "—" with soft glow */}
              <motion.div
                style={reducedMotion ? undefined : { x: line2X }}
                className="w-full relative flex items-baseline justify-start pl-0 md:pl-[12vw] xl:pl-[160px] overflow-visible"
              >
                {/* Soft accent glow behind line 2 only (6-8% opacity) */}
                <div
                  className="absolute -inset-x-8 -inset-y-6 -z-10 pointer-events-none rounded-full blur-3xl opacity-[0.07]"
                  style={{
                    background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />

                <span className="inline-block whitespace-nowrap overflow-hidden pt-2 pb-3 align-baseline">
                  <motion.span
                    className="inline-block align-baseline"
                    initial={reducedMotion ? { opacity: 0 } : { y: "115%" }}
                    animate={
                      isPreloaderDone
                        ? reducedMotion ? { opacity: 1 } : { y: "0%" }
                        : reducedMotion ? { opacity: 0 } : { y: "115%" }
                    }
                    transition={{
                      duration: reducedMotion ? 0.4 : 0.95,
                      ease: [0.25, 1, 0.5, 1],
                      delay: reducedMotion ? 0.1 : 0.42,
                    }}
                  >
                    <span className="hero-letter-hover inline-block align-baseline cursor-default select-none">
                      হাসান
                    </span>
                  </motion.span>
                </span>

                {/* Accent-coloured em dash "—" */}
                <span className="inline-block whitespace-nowrap overflow-hidden pt-2 pb-3 ml-[0.1em] align-baseline">
                  <motion.span
                    className="inline-block text-accent font-light text-[0.88em] align-baseline cursor-default select-none"
                    initial={reducedMotion ? { opacity: 0 } : { y: "115%" }}
                    animate={
                      isPreloaderDone
                        ? reducedMotion ? { opacity: 1 } : { y: "0%" }
                        : reducedMotion ? { opacity: 0 } : { y: "115%" }
                    }
                    transition={{
                      duration: reducedMotion ? 0.4 : 0.95,
                      ease: [0.25, 1, 0.5, 1],
                      delay: reducedMotion ? 0.15 : 0.60,
                    }}
                    aria-hidden="true"
                  >
                    {dashSymbol}
                  </motion.span>
                </span>
              </motion.div>
            </>
          ) : (
            /* ==========================================================
               ENGLISH MODE: Two-level split (Word mask -> Character spans)
               ========================================================== */
            <>
              {/* Line 1: "Mahmud" */}
              <motion.div
                style={reducedMotion ? undefined : { x: line1X }}
                className="w-full flex items-center justify-start overflow-visible"
              >
                <span className="inline-block whitespace-nowrap overflow-hidden pt-2 pb-3 align-baseline">
                  {line1Letters.map((char, index) => (
                    <span
                      key={`l1-${index}`}
                      className="inline-block relative align-baseline"
                      aria-hidden="true"
                    >
                      <motion.span
                        className="inline-block align-baseline"
                        initial={reducedMotion ? { opacity: 0 } : { y: "115%" }}
                        animate={
                          isPreloaderDone
                            ? reducedMotion ? { opacity: 1 } : { y: "0%" }
                            : reducedMotion ? { opacity: 0 } : { y: "115%" }
                        }
                        transition={{
                          duration: reducedMotion ? 0.4 : 0.95,
                          ease: [0.25, 1, 0.5, 1],
                          delay: reducedMotion ? 0.1 : 0.2 + index * 0.035,
                        }}
                      >
                        <span className="hero-letter-hover inline-block align-baseline cursor-default select-none">
                          {char}
                        </span>
                      </motion.span>
                    </span>
                  ))}
                </span>
              </motion.div>

              {/* Line 2: "Hasan" + accent-coloured em dash "—" */}
              <motion.div
                style={reducedMotion ? undefined : { x: line2X }}
                className="w-full relative flex items-baseline justify-start pl-0 md:pl-[12vw] xl:pl-[160px] overflow-visible"
              >
                {/* Soft accent glow behind line 2 only (6-8% opacity) */}
                <div
                  className="absolute -inset-x-8 -inset-y-6 -z-10 pointer-events-none rounded-full blur-3xl opacity-[0.07]"
                  style={{
                    background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />

                <span className="inline-block whitespace-nowrap overflow-hidden pt-2 pb-3 align-baseline">
                  {line2Letters.map((char, index) => {
                    const overallIndex = line1Letters.length + index;
                    return (
                      <span
                        key={`l2-${index}`}
                        className="inline-block relative align-baseline"
                        aria-hidden="true"
                      >
                        <motion.span
                          className="inline-block align-baseline"
                          initial={reducedMotion ? { opacity: 0 } : { y: "115%" }}
                          animate={
                            isPreloaderDone
                              ? reducedMotion ? { opacity: 1 } : { y: "0%" }
                              : reducedMotion ? { opacity: 0 } : { y: "115%" }
                          }
                          transition={{
                            duration: reducedMotion ? 0.4 : 0.95,
                            ease: [0.25, 1, 0.5, 1],
                            delay: reducedMotion ? 0.1 : 0.2 + overallIndex * 0.035,
                          }}
                        >
                          <span className="hero-letter-hover inline-block align-baseline cursor-default select-none">
                            {char}
                          </span>
                        </motion.span>
                      </span>
                    );
                  })}
                </span>

                {/* Accent-coloured em dash "—" with distinct timing & smaller scale */}
                <span className="inline-block whitespace-nowrap overflow-hidden pt-2 pb-3 ml-[0.08em] align-baseline">
                  <motion.span
                    className="inline-block text-accent font-light text-[0.88em] align-baseline cursor-default select-none"
                    initial={reducedMotion ? { opacity: 0 } : { y: "115%" }}
                    animate={
                      isPreloaderDone
                        ? reducedMotion ? { opacity: 1 } : { y: "0%" }
                        : reducedMotion ? { opacity: 0 } : { y: "115%" }
                    }
                    transition={{
                      duration: reducedMotion ? 0.4 : 0.95,
                      ease: [0.25, 1, 0.5, 1],
                      delay: reducedMotion
                        ? 0.15
                        : 0.2 + (line1Letters.length + line2Letters.length) * 0.035 + 0.04,
                    }}
                    aria-hidden="true"
                  >
                    {dashSymbol}
                  </motion.span>
                </span>
              </motion.div>
            </>
          )}
        </h1>

        {/* Thin 1px Line Divider: draws from left to right (scaleX 0->1, 1s) */}
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { scaleX: 0 }}
          animate={
            isPreloaderDone
              ? reducedMotion ? { opacity: 1 } : { scaleX: 1 }
              : reducedMotion ? { opacity: 0 } : { scaleX: 0 }
          }
          transition={{
            duration: reducedMotion ? 0.4 : 1.0,
            ease: [0.25, 1, 0.5, 1],
            delay: reducedMotion ? 0.2 : 0.75,
          }}
          className="h-px w-full bg-line origin-left mt-6 sm:mt-10 mb-4 sm:mb-6"
        />

        {/* Small Meta Row under Divider */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={
            isPreloaderDone
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 15 }
          }
          transition={{
            duration: 0.8,
            ease: [0.25, 1, 0.5, 1],
            delay: reducedMotion ? 0.25 : 0.85,
          }}
          className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted"
        >
          {/* Left: Location */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-muted/60" />
            <span>
              {lang === "bn"
                ? settings?.location ? `অবস্থান: ${settings.location}` : "অবস্থান: বাংলাদেশ"
                : settings?.location ? `Based in ${settings.location}` : "Based in Bangladesh"}
            </span>
          </div>

          {/* Centre: Live Local Time (Asia/Dhaka) */}
          <div className="flex items-center gap-2 font-medium text-text">
            <span className="text-[10px] uppercase tracking-widest text-muted">
              Dhaka
            </span>
            <span className="tabular-nums" suppressHydrationWarning>
              {dhakaTime || "04:00 PM"} GMT+6
            </span>
          </div>

          {/* Right: Available for Work Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-[11px] font-semibold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>
              {lang === "bn"
                ? hero?.availableBadgeBn || "কাজের জন্য প্রস্তুত"
                : hero?.availableBadgeEn || "Available for work"}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Bottom: Two Columns + Circular "About me" Arrow Button */}
      <div className="border-t border-line/40 pt-8 sm:pt-12 flex flex-col md:flex-row md:items-end justify-between gap-8 sm:gap-12">
        {/* Two-Column Intro & Positioning Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-2xl text-xs sm:text-sm font-sans text-muted leading-relaxed">
          {/* Left Column: Positioning Line */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={
                isPreloaderDone
                  ? { y: "0%", opacity: 1 }
                  : { y: "110%", opacity: 0 }
              }
              transition={{
                duration: 0.85,
                ease: [0.25, 1, 0.5, 1],
                delay: reducedMotion ? 0.3 : 0.95,
              }}
              className="font-mono text-text/90 uppercase tracking-wider text-[11px] sm:text-xs"
            >
              {lang === "bn"
                ? hero?.positioningBn || "ঢাকা, বাংলাদেশভিত্তিক — বুদ্ধিমত্তা সম্পন্ন স্বায়ত্তশাসিত ওয়ার্কফ্লো, ফুল-স্ট্যাক ওয়েব প্ল্যাটফর্ম ও মোবাইল ইকোসিস্টেম নির্মাতা।"
                : hero?.positioningEn || "Based in Dhaka, Bangladesh — architecting intelligent autonomous workflows, full-stack web platforms & mobile ecosystems."}
            </motion.p>
          </div>

          {/* Right Column: Short Intro Paragraph */}
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={
                isPreloaderDone
                  ? { y: "0%", opacity: 1 }
                  : { y: "110%", opacity: 0 }
              }
              transition={{
                duration: 0.85,
                ease: [0.25, 1, 0.5, 1],
                delay: reducedMotion ? 0.35 : 1.05,
              }}
            >
              {lang === "bn"
                ? hero?.introBn || "আপসহীন পারফরম্যান্স, সাবলীল ইন্টারঅ্যাকশন ডিজাইন এবং স্বয়ংক্রিয় এআই পাইপলাইনের সমন্বয়ে উন্নতমানের ডিজিটাল পণ্য তৈরিতে নিবেদিত।"
                : hero?.introEn || "Dedicated to crafting exceptional digital products with uncompromising performance, fluid interaction design, and self-operating AI pipelines."}
            </motion.p>
          </div>
        </div>

        {/* Circular "About me" Magnetic Arrow Button */}
        <div className="self-end md:self-auto">
          <MagneticWrapper strength={0.4} innerStrength={0.65}>
            <a
              href="/about"
              onClick={handleAboutClick}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-accent text-accent-ink flex flex-col items-center justify-center p-3 shadow-xl transition-transform duration-300 active:scale-95 cursor-pointer select-none"
              aria-label="Learn more about Mahmud Hasan"
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-center leading-tight">
                  {lang === "bn" ? "আমার\nসম্পর্কে" : "About\nme"}
                </span>
                <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </div>
            </a>
          </MagneticWrapper>
        </div>
      </div>
    </section>
  );
}
