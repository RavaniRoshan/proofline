"use client";

import { useEffect, useRef } from "react";

/**
 * Replicates Composio's Hero WebGL perspective bar tunnel (from hero-shaders.json & 01/02 screenshots)
 * using Proofline's strictly defined color tokens:
 * - Deep Ink (#1A1A18)
 * - Oxide Burgundy (#6E1F26)
 * - Readable Oxide Rose (#D4847A)
 * - Archival Slate (#3B4A45)
 * - Supported Sage (#58C892)
 */
export function HeroTunnelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;

    // Proofline spectral bar palette (no blue/neon — strictly Proofline tokens)
    const PALETTE = [
      { r: 110, g: 31, b: 38 },   // --oxide (#6E1F26)
      { r: 212, g: 132, b: 122 }, // --accent-readable (#D4847A)
      { r: 158, g: 59, b: 68 },   // mid-oxide
      { r: 59, g: 74, b: 69 },    // --slate (#3B4A45)
      { r: 88, g: 200, b: 146 },  // --v-supported-fg (#58C892) subtle accent
    ];

    interface BarCluster {
      side: -1 | 1;
      yNorm: number; // -0.95 to 0.95
      z: number; // 0 to 100
      speed: number;
      barCount: number;
      clusterWidth: number;
      barHeight: number;
      colorIdx: number;
      opacity: number;
    }

    const CLUSTERS: BarCluster[] = [];
    const NUM_CLUSTERS = 44;

    for (let i = 0; i < NUM_CLUSTERS; i++) {
      const side: -1 | 1 = i % 2 === 0 ? -1 : 1;
      const band = (i % 5) - 2; // -2, -1, 0, 1, 2
      CLUSTERS.push({
        side,
        yNorm: band * 0.34 + ((i * 17) % 10) * 0.015,
        z: (i * (100 / NUM_CLUSTERS)) % 100,
        speed: 0.45 + (i % 4) * 0.14,
        barCount: 14 + (i % 12),
        clusterWidth: 90 + (i % 5) * 28,
        barHeight: 42 + (i % 4) * 18,
        colorIdx: i % PALETTE.length,
        opacity: 0.42 + (i % 4) * 0.14,
      });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.48;
      const isMobile = width < 768;
      const minCorridorHalf = isMobile ? width * 0.28 : width * 0.31;
      const maxCorridorHalf = width * 0.54;

      // Sort back-to-front so nearer spectral clusters layer cleanly
      const sorted = [...CLUSTERS].sort((a, b) => b.z - a.z);

      for (const c of sorted) {
        if (!prefersReducedMotion) {
          c.z -= dt * 11 * c.speed;
          if (c.z < 0) c.z += 100;
        }

        const normDepth = c.z / 100; // 0 = near camera, 1 = far horizon
        // Smoothstep S-curve pinch matching hero-shaders.json
        const t = normDepth * normDepth * (3 - 2 * normDepth);
        const perspective = 1 - t * 0.72;

        // Fade at far horizon and very close camera edge
        const farFade = normDepth > 0.75 ? Math.max(0, 1 - (normDepth - 0.75) / 0.25) : 1;
        const nearFade = normDepth < 0.12 ? normDepth / 0.12 : 1;
        const alpha = c.opacity * farFade * nearFade;

        if (alpha <= 0.01) continue;

        const wallXOffset = minCorridorHalf + (maxCorridorHalf - minCorridorHalf) * (1 - t);
        const clusterCenterX = cx + c.side * wallXOffset;
        const clusterCenterY = cy + c.yNorm * (height * 0.46) * perspective;

        const w = c.clusterWidth * perspective;
        const h = c.barHeight * perspective;
        const barSpacing = w / c.barCount;
        const barW = Math.max(1.5, barSpacing * 0.62);

        const col = PALETTE[c.colorIdx];
        const secondaryCol = PALETTE[(c.colorIdx + 1) % PALETTE.length];

        const startX = clusterCenterX - w * 0.5;

        for (let b = 0; b < c.barCount; b++) {
          const bx = startX + b * barSpacing;
          const u = b / c.barCount;
          // Subtle wave modulation on bar height
          const wave = Math.sin(u * Math.PI) * 0.85 + 0.15;
          const bh = h * wave;
          const by = clusterCenterY - bh * 0.5;

          const r = Math.round(col.r * (1 - u * 0.35) + secondaryCol.r * (u * 0.35));
          const g = Math.round(col.g * (1 - u * 0.35) + secondaryCol.g * (u * 0.35));
          const bl = Math.round(col.b * (1 - u * 0.35) + secondaryCol.b * (u * 0.35));

          ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, ${(alpha * (0.45 + wave * 0.55)).toFixed(3)})`;
          ctx.fillRect(bx, by, barW, bh);
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 48%, rgba(0,0,0,0.22) 25%, rgba(0,0,0,0.95) 68%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 48%, rgba(0,0,0,0.22) 25%, rgba(0,0,0,0.95) 68%, transparent 100%)",
        }}
      />
      {/* Subtle architectural grid overlay matching Composio's hero depth */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

/**
 * Replicates Composio's diagonal silk mesh card backdrop (seen in Band 4 05-band4-sticky-timeline.png
 * and Band 12 10-band12-bottom-cta.png), rendered strictly with Proofline's warm paper, panel,
 * oxide (#6E1F26 / #D4847A), and archival slate (#3B4A45) color tokens.
 */
export function MeshCardBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Base surface — light warm paper / dark graphite */}
      <div className="absolute inset-0 bg-[#FAF9F6] dark:bg-[#111115]" />
      
      {/* Light mode diagonal silk ribbons */}
      <div
        className="dark:hidden absolute -inset-[20%] opacity-90"
        style={{
          background: [
            "radial-gradient(ellipse 55% 32% at 18% 22%, rgba(212, 132, 122, 0.34) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 35% at 82% 28%, rgba(59, 74, 69, 0.16) 0%, transparent 72%)",
            "radial-gradient(ellipse 65% 40% at 24% 78%, rgba(110, 31, 38, 0.20) 0%, transparent 70%)",
            "radial-gradient(ellipse 55% 35% at 85% 82%, rgba(212, 132, 122, 0.28) 0%, transparent 70%)",
            "linear-gradient(125deg, rgba(245,245,242,0.9) 0%, rgba(255,255,255,0.95) 38%, rgba(249,229,228,0.55) 54%, rgba(255,255,255,0.95) 72%, rgba(232,244,237,0.5) 100%)",
          ].join(", "),
          transform: "rotate(-6deg) scale(1.08)",
        }}
      />

      {/* Dark mode high-tech luminescent mesh ribbons */}
      <div
        className="hidden dark:block absolute -inset-[20%] opacity-80"
        style={{
          background: [
            "radial-gradient(ellipse 55% 35% at 18% 22%, rgba(212, 132, 122, 0.16) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 35% at 82% 28%, rgba(59, 74, 69, 0.22) 0%, transparent 72%)",
            "radial-gradient(ellipse 65% 45% at 24% 78%, rgba(158, 45, 54, 0.25) 0%, transparent 70%)",
            "radial-gradient(ellipse 55% 35% at 85% 82%, rgba(212, 132, 122, 0.14) 0%, transparent 70%)",
            "linear-gradient(125deg, rgba(17,17,21,0.95) 0%, rgba(22,22,27,0.95) 40%, rgba(45,18,22,0.3) 55%, rgba(22,22,27,0.95) 75%, rgba(17,17,21,0.95) 100%)",
          ].join(", "),
          transform: "rotate(-6deg) scale(1.08)",
        }}
      />

      {/* Architectural dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
    </div>
  );
}
