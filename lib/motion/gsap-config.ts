"use client";

import gsap from "gsap";
import { useEffect, useState } from "react";

/**
 * Standardized Proofline Motion Easing Tokens
 * Based on /design-motion-principles:
 * - Jakub Krehel (200-450ms smooth deceleration curves, blur-augmented reveals)
 * - Emil Kowalski (sub-240ms interactive response curves, restraint)
 * - Jhey Tompkins (magnetic spring release)
 */
export const GSAP_EASING = {
  entrance: "cubic-bezier(0.22, 1, 0.36, 1)",
  entranceSmooth: "expo.out",
  interactive: "back.out(1.2)",
  springSnap: "elastic.out(1, 0.4)",
  exit: "power2.in",
  linear: "none",
} as const;

export const GSAP_TIMING = {
  instant: 0.14,
  snappy: 0.22,
  standard: 0.35,
  deliberate: 0.35,
  heroCurtain: 0.35,
  close: 0.24,
} as const;

/**
 * React hook to detect prefers-reduced-motion preference in real-time.
 */
export function useGsapReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reducedMotion;
}

export { gsap };
