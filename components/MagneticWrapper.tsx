"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MagneticWrapperProps {
  children: React.ReactNode;
  strength?: number;
  innerStrength?: number;
  className?: string;
  onClick?: () => void;
}

export default function MagneticWrapper({
  children,
  strength = 0.35,
  innerStrength = 0.5,
  className = "",
  onClick,
}: MagneticWrapperProps) {
  const magneticRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = magneticRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    let innerXTo: ((v: number) => void) | null = null;
    let innerYTo: ((v: number) => void) | null = null;

    if (innerRef.current) {
      innerXTo = gsap.quickTo(innerRef.current, "x", { duration: 0.45, ease: "power3.out" });
      innerYTo = gsap.quickTo(innerRef.current, "y", { duration: 0.45, ease: "power3.out" });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);

      xTo(middleX * strength);
      yTo(middleY * strength);

      if (innerXTo && innerYTo) {
        innerXTo(middleX * innerStrength);
        innerYTo(middleY * innerStrength);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      if (innerXTo && innerYTo) {
        innerXTo(0);
        innerYTo(0);
      }
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength, innerStrength]);

  return (
    <div ref={magneticRef} onClick={onClick} className={`inline-block ${className}`}>
      <div ref={innerRef} className="w-full h-full flex items-center justify-center pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
