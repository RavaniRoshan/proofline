"use client";

import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe React hook that queries and subscribes to the browser's
 * `(prefers-reduced-motion: reduce)` media query.
 *
 * - Defaults safely to `false` during SSR and initial hydration to prevent hydration mismatches.
 * - Reads `window.matchMedia` immediately upon client mount.
 * - Attaches a `change` event listener with cross-browser cleanup for real-time reactivity.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQueryList = window.matchMedia(QUERY);
    setPrefersReducedMotion(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent | { matches: boolean }) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else if ("addListener" in mediaQueryList) {
      // Legacy WebKit / Safari fallback
      (mediaQueryList as any).addListener(listener);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else if ("removeListener" in mediaQueryList) {
        (mediaQueryList as any).removeListener(listener);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Convenient alias for usePrefersReducedMotion.
 */
export const useReducedMotion = usePrefersReducedMotion;

/**
 * One-off imperative query for use outside React component lifecycles.
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}
