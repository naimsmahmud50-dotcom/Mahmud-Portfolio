"use client";

import React, { useRef } from "react";
import MagneticWrapper from "./MagneticWrapper";
import { usePageTransition } from "@/context/TransitionContext";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "outline" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  target?: string;
  rel?: string;
  strength?: number;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "outline",
  size = "md",
  className = "",
  target,
  rel,
  strength = 0.35,
}: ButtonProps) {
  const fillRef = useRef<HTMLDivElement | null>(null);
  const { navigate } = usePageTransition();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href && href.startsWith("/")) {
      e.preventDefault();
      onClick?.();
      navigate(href);
    } else {
      onClick?.();
    }
  };

  const sizeClasses = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-7 py-3.5 text-sm",
    lg: "px-9 py-4.5 text-base",
  }[size];

  const content = (
    <div
      className={`group relative overflow-hidden rounded-full font-mono uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-3 select-none ${sizeClasses} ${
        variant === "outline"
          ? "border border-line-strong bg-surface hover:border-accent text-text hover:text-accent-ink shadow-sm hover:shadow-lg hover:shadow-accent/20"
          : variant === "filled"
          ? "bg-accent text-accent-ink shadow-lg shadow-accent/20 hover:bg-accent-hover"
          : "text-text hover:text-accent"
      } ${className}`}
    >
      {/* Dennis Snellenberg Rising Accent Fill Overlay */}
      {variant === "outline" && (
        <span
          ref={fillRef}
          className="absolute inset-0 w-full h-full rounded-full bg-accent translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 pointer-events-none -z-0"
        />
      )}

      {/* Button Content / Label with z-index to stay above fill */}
      <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
        {children}
      </span>
    </div>
  );

  return (
    <MagneticWrapper strength={strength}>
      {href ? (
        <a href={href} target={target} rel={rel} onClick={handleLinkClick}>
          {content}
        </a>
      ) : (
        <button onClick={onClick} type="button">
          {content}
        </button>
      )}
    </MagneticWrapper>
  );
}
