"use client";

import React, { useEffect, useRef } from "react";
import { gsap, GSAP_EASING } from "@/lib/motion/gsap-config";
import { useGsapReducedMotion } from "@/lib/motion/gsap-config";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: number;
  duration?: number;
  staggerChildren?: boolean;
  staggerInterval?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  yOffset = 20,
  distance,
  direction = "up",
  blur = 4,
  duration = 0.55,
  staggerChildren = false,
  staggerInterval = 0.08,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useGsapReducedMotion();

  const effectiveOffset = distance !== undefined ? distance : yOffset;
  const initialY = direction === "up" ? effectiveOffset : direction === "down" ? -effectiveOffset : 0;
  const initialX = direction === "left" ? effectiveOffset : direction === "right" ? -effectiveOffset : 0;
  const blurFilter = blur > 0 ? `blur(${blur}px)` : "none";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, filter: "none" });
      const targets = el.querySelectorAll("[data-gsap-reveal]");
      if (targets.length > 0) {
        gsap.set(targets, { opacity: 1, x: 0, y: 0, filter: "none" });
      }
      return;
    }

    // Set initial state
    if (staggerChildren) {
      const targets = el.querySelectorAll("[data-gsap-reveal]");
      if (targets.length > 0) {
        gsap.set(targets, { opacity: 0, x: initialX, y: initialY, filter: blurFilter });
      } else {
        gsap.set(el, { opacity: 0, x: initialX, y: initialY, filter: blurFilter });
      }
    } else {
      gsap.set(el, { opacity: 0, x: initialX, y: initialY, filter: blurFilter });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (staggerChildren) {
              const targets = el.querySelectorAll("[data-gsap-reveal]");
              if (targets.length > 0) {
                gsap.to(targets, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  filter: "blur(0px)",
                  duration,
                  delay,
                  stagger: staggerInterval,
                  ease: GSAP_EASING.entrance,
                  clearProps: "filter",
                });
              } else {
                gsap.to(el, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  filter: "blur(0px)",
                  duration,
                  delay,
                  ease: GSAP_EASING.entrance,
                  clearProps: "filter",
                });
              }
            } else {
              gsap.to(el, {
                opacity: 1,
                x: 0,
                y: 0,
                filter: "blur(0px)",
                duration,
                delay,
                ease: GSAP_EASING.entrance,
                clearProps: "filter",
              });
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay, duration, reducedMotion, staggerChildren, staggerInterval, initialX, initialY, blurFilter]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
