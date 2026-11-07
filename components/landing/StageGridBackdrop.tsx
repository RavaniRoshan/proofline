"use client";

import React from "react";

/**
 * Static Architectural SVG Stage Backdrop
 * Replaces heavy competing video loop shader with clean, high-precision
 * coordinate blueprint grid that harmonizes with the outer Sunset Orb.
 */
export function StageGridBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* 1. Subtle warm radial ambient glow that harmonizes with Sunset Orb */}
      <div
        className="absolute inset-0 opacity-70 dark:opacity-35"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(139, 30, 39, 0.05) 0%, rgba(212, 132, 122, 0.02) 45%, transparent 75%)",
        }}
      />

      {/* 2. Hardware-Accelerated Ambient Radar Scanner Sweep (Zero-CPU Compositor Layer) */}
      <div className="stage-radar-sweep-container absolute inset-0 pointer-events-none overflow-hidden">
        <div className="stage-radar-sweep-bar" />
      </div>

      {/* 3. Static SVG Precision Coordinate Grid */}
      <svg
        className="absolute inset-0 h-full w-full opacity-65 dark:opacity-45"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 35%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 35%, transparent 95%)",
        }}
      >
        <defs>
          <pattern
            id="pl-stage-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              className="text-ink/10 dark:text-white/10"
            />
            <circle
              cx="0"
              cy="0"
              r="1"
              className="fill-ink/25 dark:fill-white/30"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#pl-stage-grid)" />

        {/* Structural perspective guide lines framing the product card */}
        <g className="text-accent/20 dark:text-accent-readable/20">
          <line
            x1="8%"
            y1="0"
            x2="22%"
            y2="100%"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="92%"
            y1="0"
            x2="78%"
            y2="100%"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1="18%"
            x2="100%"
            y2="18%"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1="82%"
            x2="100%"
            y2="82%"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="4 4"
          />
        </g>
      </svg>

      {/* 4. Strategic POI Beacon Pings at Perspective Intersections (Video 2 Anchorage) */}
      <div className="absolute top-[18%] left-[22%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="stage-poi-beacon" />
      </div>
      <div className="absolute top-[18%] right-[22%] translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="stage-poi-beacon" />
      </div>

      {/* 5. Blueprint Corner Registration Marks */}
      <div className="absolute top-3.5 left-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink/35 dark:text-white/35">
        <span className="font-bold text-accent">┌</span>
        <span>BAY-01 · VERIFICATION BRIEF</span>
      </div>

      <div className="absolute top-3.5 right-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink/35 dark:text-white/35">
        <span>LINEAGE: F-021 (V4)</span>
        <span className="font-bold text-accent">┐</span>
      </div>

      <div className="absolute bottom-3.5 left-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink/35 dark:text-white/35">
        <span className="font-bold text-accent">└</span>
        <span>42 SEEDED FACTS</span>
      </div>

      <div className="absolute bottom-3.5 right-4 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink/35 dark:text-white/35">
        <span>GATE: LOCKED (100%)</span>
        <span className="font-bold text-accent">┘</span>
      </div>

      {/* 4. Subtle Bottom Gradient Edge Transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/40 dark:to-paper/60 pointer-events-none" />
    </div>
  );
}
