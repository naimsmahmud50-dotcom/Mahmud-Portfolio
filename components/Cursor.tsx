"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export type CursorVariant = "default" | "link" | "view" | "drag";

interface CursorContextType {
  setCursor: (variant: CursorVariant, text?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType>({
  setCursor: () => {},
  resetCursor: () => {},
});

export const useCursor = () => useContext(CursorContext);

export default function Cursor() {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [text, setText] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inertial smooth lerp springs for trailing ring (Dennis Snellenberg signature feel)
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check touch device or reduced motion
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Check data-cursor attributes first
      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor") as CursorVariant;
        const customText = cursorTarget.getAttribute("data-cursor-text");

        if (type === "view") {
          setVariant("view");
          setText(customText || "View");
          return;
        }
        if (type === "drag") {
          setVariant("drag");
          setText(customText || "Drag");
          return;
        }
        if (type === "link") {
          setVariant("link");
          setText("");
          return;
        }
      }

      // 2. Check interactive / clickable elements
      const isClickable =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === "pointer";

      if (isClickable) {
        setVariant("link");
        setText("");
      } else {
        setVariant("default");
        setText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouch || !isVisible) {
    return null;
  }

  // Dimension and style mappings based on state
  const isViewOrDrag = variant === "view" || variant === "drag";
  const isLink = variant === "link";

  const ringSize = isViewOrDrag ? 88 : isLink ? 54 : 32;

  return (
    <>
      {/* Trailing Ring / View Pill (Lerp smoothed) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full font-sans font-bold uppercase select-none tracking-wider overflow-hidden"
        style={{
          x: smoothX,
          y: smoothY,
          mixBlendMode: isViewOrDrag ? "normal" : "difference",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: isViewOrDrag
            ? "var(--accent-fill)"
            : isLink
            ? "var(--accent-soft)"
            : "transparent",
          borderColor: isViewOrDrag
            ? "transparent"
            : isLink
            ? "var(--accent)"
            : "rgba(255, 255, 255, 0.8)",
          borderWidth: isViewOrDrag ? 0 : 1.5,
          color: isViewOrDrag ? "var(--accent-ink)" : "var(--text)",
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
          mass: 0.4,
        }}
      >
        {isViewOrDrag && (
          <motion.span
            key={text}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[13px] font-black tracking-widest text-accent-ink"
          >
            {text || (variant === "view" ? "View" : "Drag")}
          </motion.span>
        )}
      </motion.div>

      {/* Tiny precision inner dot (Locked to exact mouse coordinates without spring lag) */}
      {variant === "default" && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            x: mouseX,
            y: mouseY,
            mixBlendMode: "difference",
          }}
        />
      )}
    </>
  );
}
