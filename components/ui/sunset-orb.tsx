"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SunsetOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  intensity?: "subtle" | "medium" | "vibrant";
  grain?: boolean;
  children?: React.ReactNode;
}

/**
 * Sunset Orb, Pure CSS & SVG shader gradient background
 * Origin: 21st.dev Horizon Glow style by Serafim (recipe 2389ca2f-5232-48d2-af54-00d58fb5d063)
 * Palette: #B7282E (Madder Red), #EB6101 (Vermilion), #FFF1CF (Eggshell)
 * Features: Multi-pass radial arch, soft horizon blur, film grain noise shader.
 */
export function SunsetOrb({
  className,
  animated = true,
  intensity = "medium",
  grain = true,
  children,
  style,
  ...props
}: SunsetOrbProps) {
  const intensityOpacity = {
    subtle: "opacity-60 dark:opacity-40",
    medium: "opacity-85 dark:opacity-65",
    vibrant: "opacity-100 dark:opacity-85",
  }[intensity];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden pointer-events-none select-none",
        className
      )}
      aria-hidden="true"
      style={style}
      {...props}
    >
      {/* 1. Base Gradient Canvas (Radial Arch Horizon) */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          intensityOpacity,
          animated && "sunset-orb-mount animate-sunset-pulse"
        )}
        style={{
          backgroundImage: [
            // Layer 3: Ambient Atmosphere Flare
            "radial-gradient(53% 32% at 50% 68%, rgba(235, 97, 1, 0.22) 0%, rgba(235, 97, 1, 0) 80%)",
            // Layer 2: Core Horizon Glow
            "radial-gradient(42% 22% at 50% 68%, rgba(255, 246, 224, 0.55) 0%, rgba(255, 241, 207, 0.25) 38%, rgba(255, 241, 207, 0) 72%)",
            // Layer 1: Primary Sunset Arc
            "radial-gradient(100% 54% at 50% 68%, #fff3d7 0%, #FFF1CF 24%, #EB6101 52%, #B7282E 79%, rgba(183, 40, 46, 0) 86%)",
          ].join(", "),
          filter: "blur(28px)",
          transform: "translate3d(0, 0, 0) scale(1.04)",
          transformOrigin: "center 68%",
        }}
      />

      {/* 2. Dark-mode vignette and tonal absorption layer */}
      <div
        className="absolute inset-0 bg-radial from-transparent via-transparent to-paper opacity-80 dark:opacity-90"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 40%, var(--paper) 100%)",
        }}
      />

      {/* 3. Pure SVG Film Grain Shader (feTurbulence) */}
      {grain && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.045] dark:opacity-[0.07] mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="sunset-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#sunset-grain)" />
        </svg>
      )}

      {/* Optional inline children or hero slot */}
      {children}
    </div>
  );
}

// Re-export as GradientBackground for 21st.dev standard compatibility
export const GradientBackground = SunsetOrb;
export default SunsetOrb;
