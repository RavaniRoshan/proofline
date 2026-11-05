"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["pricing", "features", "limits", "disclaimers"];

export function HeroRotator() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slotRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setIsTransitioning(false);
      }, 250);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const slot = slotRef.current;
    const ghost = ghostRef.current;
    if (!slot || !ghost) return;
    const word = WORDS[index];
    const measure = Array.from(ghost.children).find(
      (el) => el.textContent === word,
    ) as HTMLElement | undefined;
    if (measure) {
      const parent = slot.parentElement;
      if (parent) {
        parent.style.width = `${measure.getBoundingClientRect().width}px`;
      }
    }
  }, [index]);

  return (
    <span className="rotator">
      <span className="rotator__ghost" aria-hidden="true" ref={ghostRef}>
        {WORDS.map((w) => (
          <span className="rotator__word" key={w}>
            {w}
          </span>
        ))}
      </span>
      <span className="rotator__live" aria-live="polite">
        <span
          className={`rotator__slot transition-all duration-300 transform ${
            isTransitioning ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
          }`}
          ref={slotRef}
        >
          {WORDS[index]}
        </span>
      </span>
    </span>
  );
}
