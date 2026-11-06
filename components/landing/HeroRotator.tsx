"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["pricing", "features", "limits", "disclaimers"];

export function HeroRotator() {
  const [index, setIndex] = useState(0);
  const [widthPx, setWidthPx] = useState<number | null>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const measureActive = () => {
      const ghost = ghostRef.current;
      if (!ghost) return;
      const target = ghost.children[index] as HTMLElement | undefined;
      if (target) {
        const w = target.getBoundingClientRect().width;
        if (w > 0) setWidthPx(Math.ceil(w));
      }
    };
    measureActive();
    window.addEventListener("resize", measureActive);
    return () => window.removeEventListener("resize", measureActive);
  }, [index]);

  return (
    <span className="relative inline-flex items-baseline align-baseline">
      {/* Off-screen ghost measurement list matching Composio's exact technique */}
      <span
        ref={ghostRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 left-0 -z-10 flex whitespace-nowrap"
      >
        {WORDS.map((w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {w}
          </span>
        ))}
      </span>

      {/* Width-morphing horizontal slide container */}
      <span
        aria-live="polite"
        className="relative inline-block overflow-x-clip whitespace-nowrap align-baseline transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={widthPx ? { width: `${widthPx}px` } : undefined}
      >
        <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {WORDS[index]}
        </span>
      </span>
    </span>
  );
}
