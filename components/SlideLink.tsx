"use client";

import React from "react";
import MagneticWrapper from "./MagneticWrapper";
import { usePageTransition } from "@/context/TransitionContext";

interface SlideLinkProps {
  href: string;
  children: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export default function SlideLink({
  href,
  children,
  isActive = false,
  className = "",
  onClick,
  strength = 0.25,
}: SlideLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("/")) {
      e.preventDefault();
      onClick?.();
      navigate(href);
    } else {
      onClick?.();
    }
  };

  return (
    <MagneticWrapper strength={strength}>
      <a
        href={href}
        onClick={handleClick}
        className={`group relative flex flex-col items-center py-1 text-sm font-medium transition-colors select-none ${
          isActive ? "text-accent font-semibold" : "text-text hover:text-text"
        } ${className}`}
      >
        {/* Dennis Snellenberg Rolling Text Swap Effect */}
        <span className="relative inline-block overflow-hidden h-[1.35em] leading-[1.35em]">
          {/* Primary Text Sliding Up */}
          <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
            {children}
          </span>
          {/* Duplicate Text Rolling In From Below */}
          <span
            aria-hidden="true"
            className="absolute top-full left-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full text-accent"
          >
            {children}
          </span>
        </span>

        {/* Small Dot Indicator: Scales in on hover, persists on active route */}
        <span
          className={`w-1.5 h-1.5 rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] mt-1 ${
            isActive
              ? "scale-100 opacity-100"
              : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
          }`}
        />
      </a>
    </MagneticWrapper>
  );
}
