"use client";

import React from "react";

/**
 * StageWallpaperBackdrop
 * 
 * Static architectural wallpaper inspired by modern macOS wallpapers and technical schematics.
 * Renders layered vector topography mesh ribbons in Proofline's brand palette:
 * Ink (#1A1A18), Oxide (#8B1E27), Coral (#D4847A), and Slate (#2A3531).
 * Completely static — zero canvas loops, zero fishbowl animations, crisp in light & dark mode.
 */
export function StageWallpaperBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* 1. Subtle warm radial lighting gradient */}
      <div
        className="absolute inset-0 opacity-75 dark:opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 38%, rgba(139, 30, 39, 0.08) 0%, rgba(212, 132, 122, 0.03) 42%, transparent 75%)",
        }}
      />

      {/* 2. Static Architectural SVG macOS-Style Mesh Topography */}
      <svg
        className="absolute inset-0 h-full w-full opacity-85 dark:opacity-55"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 680"
        preserveAspectRatio="xMidYMid slice"
        style={{
          maskImage:
            "radial-gradient(ellipse 88% 80% at 50% 48%, black 45%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 88% 80% at 50% 48%, black 45%, transparent 95%)",
        }}
      >
        <defs>
          {/* Subtle architectural dot grid pattern */}
          <pattern
            id="pl-wallpaper-dots"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1"
              cy="1"
              r="0.8"
              className="fill-ink/15 dark:fill-white/20"
            />
          </pattern>

          {/* Gradients for layered architectural ribbons */}
          <linearGradient id="ribbon-oxblood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B1E27" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#8B1E27" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#D4847A" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="ribbon-coral" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4847A" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#D4847A" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#8B1E27" stopOpacity="0.01" />
          </linearGradient>

          <linearGradient id="ribbon-slate" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3B4A45" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1A1A18" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="stroke-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B1E27" stopOpacity="0.1" />
            <stop offset="35%" stopColor="#D4847A" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#8B1E27" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B4A45" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Base Dot Matrix */}
        <rect width="100%" height="100%" fill="url(#pl-wallpaper-dots)" />

        {/* =========================================================
            LAYERED ARCHITECTURAL TOPOGRAPHIC RIBBONS (macOS Wallpaper)
            ========================================================= */}
        {/* Ribbon 1: Deep Base Foundation Wave */}
        <path
          d="M -100 520 C 250 440, 520 620, 850 510 C 1050 440, 1220 540, 1300 560 L 1300 750 L -100 750 Z"
          fill="url(#ribbon-slate)"
        />

        {/* Ribbon 2: Midground Oxide Swell */}
        <path
          d="M -100 360 C 200 480, 480 260, 780 390 C 1020 500, 1180 340, 1300 380 L 1300 680 C 1150 640, 950 680, 720 590 C 450 490, 180 620, -100 560 Z"
          fill="url(#ribbon-oxblood)"
        />

        {/* Ribbon 3: Focal Coral Ribbon (Flowing through center stage) */}
        <path
          d="M -100 240 C 280 160, 540 380, 880 230 C 1080 140, 1220 260, 1300 280 L 1300 440 C 1150 410, 980 470, 750 360 C 500 240, 220 400, -100 320 Z"
          fill="url(#ribbon-coral)"
        />

        {/* Contour Wirelines (Precision Topographic Strokes) */}
        <path
          d="M -100 240 C 280 160, 540 380, 880 230 C 1080 140, 1220 260, 1300 280"
          fill="none"
          stroke="url(#stroke-glow)"
          strokeWidth="1.25"
        />
        <path
          d="M -100 280 C 290 190, 550 410, 890 260 C 1090 170, 1220 290, 1300 310"
          fill="none"
          stroke="currentColor"
          className="text-accent-brand/25 dark:text-accent-readable/25"
          strokeWidth="0.75"
          strokeDasharray="4 4"
        />
        <path
          d="M -100 360 C 200 480, 480 260, 780 390 C 1020 500, 1180 340, 1300 380"
          fill="none"
          stroke="currentColor"
          className="text-ink/15 dark:text-white/20"
          strokeWidth="1"
        />
        <path
          d="M -100 420 C 220 530, 500 310, 800 440 C 1040 550, 1190 390, 1300 430"
          fill="none"
          stroke="currentColor"
          className="text-ink/10 dark:text-white/10"
          strokeWidth="0.75"
        />

        {/* Vertical Registration Axes framing the hero card */}
        <g className="text-ink/20 dark:text-white/20">
          <line
            x1="180"
            y1="40"
            x2="180"
            y2="640"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 4"
          />
          <line
            x1="1020"
            y1="40"
            x2="1020"
            y2="640"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 4"
          />
          {/* Subtle horizontal alignment guide */}
          <line
            x1="80"
            y1="340"
            x2="1120"
            y2="340"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="6 6"
          />
        </g>

        {/* Fine Schematic Crosshairs */}
        <g className="text-accent-brand/40 dark:text-accent-readable/40" strokeWidth="1">
          {/* Top Left */}
          <path d="M 174 120 L 186 120 M 180 114 L 180 126" stroke="currentColor" />
          {/* Top Right */}
          <path d="M 1014 120 L 1026 120 M 1020 114 L 1020 126" stroke="currentColor" />
          {/* Center Coordinates */}
          <path d="M 594 340 L 606 340 M 600 334 L 600 346" stroke="currentColor" />
          {/* Bottom Left */}
          <path d="M 174 540 L 186 540 M 180 534 L 180 546" stroke="currentColor" />
          {/* Bottom Right */}
          <path d="M 1014 540 L 1026 540 M 1020 534 L 1020 546" stroke="currentColor" />
        </g>

        {/* Precision coordinate callouts */}
        <text
          x="195"
          y="124"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="0.08em"
          className="fill-ink/40 dark:fill-white/40"
        >
          AXIS_01 · 24°N
        </text>
        <text
          x="1005"
          y="124"
          textAnchor="end"
          fontFamily="monospace"
          fontSize="9"
          letterSpacing="0.08em"
          className="fill-ink/40 dark:fill-white/40"
        >
          REF_STAGE_1240
        </text>
      </svg>
    </div>
  );
}
