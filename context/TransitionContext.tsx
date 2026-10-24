"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TransitionContextType {
  isPreloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;
  isTransitioning: boolean;
  targetRouteName: string;
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isPreloaderDone: false,
  setPreloaderDone: () => {},
  isTransitioning: false,
  targetRouteName: "",
  navigate: () => {},
});

export const usePreloader = () => {
  const { isPreloaderDone, setPreloaderDone } = useContext(TransitionContext);
  return { isPreloaderDone, setPreloaderDone };
};

export const usePageTransition = () => {
  const { isTransitioning, targetRouteName, navigate } =
    useContext(TransitionContext);
  return { isTransitioning, targetRouteName, navigate };
};

function formatRouteName(href: string): string {
  const clean = href.split("?")[0].split("#")[0];
  if (clean === "" || clean === "/") return "Home";
  if (clean === "/work") return "Work";
  if (clean === "/about") return "About";
  if (clean === "/contact") return "Contact";
  if (clean.startsWith("/work/")) {
    const slug = clean.replace("/work/", "");
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return clean.replace("/", "").toUpperCase();
}

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isPreloaderDone, setIsPreloaderDoneState] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetRouteName, setTargetRouteName] = useState("");
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setPreloaderDone = useCallback((done: boolean) => {
    setIsPreloaderDoneState(done);
    if (done && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("preloaderDone"));
    }
  }, []);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      // On browser back/forward, reset scroll and refresh GSAP ScrollTrigger
      window.scrollTo(0, 0);
      try {
        ScrollTrigger.refresh();
      } catch {
        // ScrollTrigger may not be initialized yet
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      // 1. External links or hash anchors: let standard browser behavior take over
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("wa.me")
      ) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }

      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      // 2. Edge Case: Clicking current route -> do nothing (no duplicate curtain)
      const targetPath = href.split("?")[0].split("#")[0];
      if (pathname === targetPath) {
        return;
      }

      // 3. Edge Case: Fast double-clicks -> guard against transition queuing
      if (isTransitioning) {
        return;
      }

      // Check prefers-reduced-motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        window.dispatchEvent(new CustomEvent("closeNavPanel"));
        router.push(href);
        window.scrollTo(0, 0);
        return;
      }

      // 4. Trigger Dennis Snellenberg Liquid Page Transition
      setIsTransitioning(true);
      setTargetRouteName(formatRouteName(href));

      // Signal nav panel to close immediately so drawer does not clash with curtain
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("closeNavPanel"));
      }

      // Midpoint: Swap route when curtain is at 100% full screen (~550ms)
      transitionTimerRef.current = setTimeout(() => {
        router.push(href);
        window.scrollTo(0, 0);
        try {
          ScrollTrigger.refresh();
        } catch {
          // Fallback if ScrollTrigger not active
        }

        // Completion: Exit curtain out the top (~1200ms total)
        setTimeout(() => {
          setIsTransitioning(false);
          setTargetRouteName("");
          try {
            ScrollTrigger.refresh();
          } catch {
            // Refresh
          }
        }, 650);
      }, 550);
    },
    [pathname, isTransitioning, router]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        isPreloaderDone,
        setPreloaderDone,
        isTransitioning,
        targetRouteName,
        navigate,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
