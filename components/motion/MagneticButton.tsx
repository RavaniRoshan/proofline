"use client";

import React, { useRef } from "react";
import { gsap } from "@/lib/motion/gsap-config";
import { useGsapReducedMotion } from "@/lib/motion/gsap-config";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxDistance?: number;
  pullStrength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  maxDistance = 5,
  pullStrength,
  className = "",
  ...props
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useGsapReducedMotion();
  const effectiveDistance = pullStrength !== undefined ? pullStrength * 20 : maxDistance;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);

    gsap.to(containerRef.current, {
      x: distanceX * effectiveDistance,
      y: distanceY * effectiveDistance,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion || !containerRef.current) return;

    gsap.to(containerRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  };

  const handleMouseDown = () => {
    if (reducedMotion || !containerRef.current) return;

    gsap.to(containerRef.current, {
      scale: 0.97,
      duration: 0.12,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseUp = () => {
    if (reducedMotion || !containerRef.current) return;

    gsap.to(containerRef.current, {
      scale: 1,
      duration: 0.25,
      ease: "back.out(2)",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
