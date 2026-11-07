"use client";

import React from "react";

/**
 * StageWallpaperBackdrop
 * 
 * High-performance atmospheric stage backdrop optimized for web performance (<10KB WebP).
 * Features an aerial layered blue mountain vista, framed with subtle ambient vignettes in both
 * light and dark themes. Zero layout shift, eager loaded, fully responsive across all viewports.
 */
export function StageWallpaperBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* 1. Optimized High-Performance Responsive Backdrop Image */}
      <picture className="absolute inset-0 h-full w-full">
        <source
          type="image/avif"
          srcSet="/images/stage-backdrop.avif"
        />
        <source
          type="image/webp"
          srcSet="/images/stage-backdrop-640.webp 640w, /images/stage-backdrop.webp 1024w, /images/stage-backdrop-1920.webp 1920w"
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"
        />
        <img
          src="/images/stage-backdrop.webp"
          alt=""
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-center transition-all duration-300 opacity-90 dark:opacity-35 dark:brightness-[0.70] dark:contrast-[1.2] dark:saturate-[0.85]"
          style={{
            maskImage:
              "radial-gradient(ellipse 95% 90% at 50% 50%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 90% at 50% 50%, black 55%, transparent 100%)",
          }}
        />
      </picture>

      {/* 2. Soft ambient vignette and lighting integration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgba(14, 14, 18, 0.4) 100%)",
        }}
      />

      {/* 3. Subtle dark mode tone-harmonizer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E0E12]/10 to-[#0E0E12]/60 dark:block hidden pointer-events-none" />
    </div>
  );
}
