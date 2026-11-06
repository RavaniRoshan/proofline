"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

type BoundaryPillar = "sandbox" | "stateless" | "journal";

const PILLARS: {
  id: BoundaryPillar;
  index: string;
  badge: string;
  title: string;
  line1: string;
  line2: string;
  checks: string[];
  storageKey: string;
  retention: string;
}[] = [
  {
    id: "sandbox",
    index: "01",
    badge: "INCOGNITO READY",
    title: "Zero-Auth Workspace",
    line1: "Full evaluation runs immediately",
    line2: "without sign-in, cookies, or OAuth.",
    checks: [
      "✓ 42 facts seeded locally",
      "✓ Instant sample draft load",
      "✓ Custom register overrides",
      "✓ One-click Reset Demo",
    ],
    storageKey: "window.localStorage['proofline.v1']",
    retention: "Browser-scoped · Resettable any time",
  },
  {
    id: "stateless",
    index: "02",
    badge: "LOCAL-FIRST BOUNDARY",
    title: "Stateless Verification",
    line1: "Draft prose is verified in memory",
    line2: "and never persisted to a database.",
    checks: [
      "✓ 0 bytes of draft stored",
      "✓ Stage 3 strips citations",
      "✓ Deterministic span lookup",
      "✓ No training on user copy",
    ],
    storageKey: "POST /api/verify (ephemeral RAM)",
    retention: "0ms retention · Discarded after response",
  },
  {
    id: "journal",
    index: "03",
    badge: "AUDIT CHAIN",
    title: "Append-Only Ledger",
    line1: "Reviewer decisions require explicit",
    line2: "human action and written rationale.",
    checks: [
      "✓ Approve / Reject / Edit",
      "✓ Mandatory reviewer note",
      "✓ Complete 5-field citation",
      "✓ Never auto-publishes",
    ],
    storageKey: "proofline.v1.decisions[]",
    retention: "Immutable append-only client log",
  },
];

export function EnterpriseSecurityDiagram() {
  const [selected, setSelected] = useState<BoundaryPillar>("stateless");
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const root = svgRef.current;
    if (!root) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const activeEls = root.querySelectorAll(".pillar-check-active");
    if (activeEls.length > 0) {
      animate(activeEls, {
        opacity: [0.35, 1],
        translateX: [-4, 0],
        delay: stagger(45),
        duration: 320,
        ease: "outCubic",
      });
    }
  }, [selected]);

  const current = PILLARS.find((p) => p.id === selected) ?? PILLARS[1];

  return (
    <div className="w-full flex flex-col gap-4 p-1 sm:p-2">
      {/* Interactive Pillar Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2 font-mono text-[11px] text-ink">
          <span className="font-semibold text-accent">[ANATOMY 04]</span>
          <span className="font-semibold">
            LOCAL-FIRST PRIVACY &amp; HUMAN-IN-THE-LOOP BOUNDARY
          </span>
        </div>

        <div
          className="inline-flex rounded-[8px] border border-line-strong bg-paper p-0.5 font-mono text-[11px]"
          role="group"
          aria-label="Inspect security boundary pillar"
        >
          {PILLARS.map((p) => {
            const active = selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`px-2.5 py-1 rounded-[6px] transition-colors cursor-pointer ${
                  active
                    ? "bg-ink text-paper font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                {p.index} · {p.title}
              </button>
            );
          })}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 760 350"
        className="w-full h-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Enterprise Local-First Privacy and Audit Boundary Diagram"
      >
        <rect
          width="760"
          height="350"
          rx="16"
          fill="#1A1A18"
          stroke="#3A3A36"
          strokeWidth="1.5"
        />

        {/* Top Header */}
        <text
          x="28"
          y="34"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize="11"
          fill="#FFFFFF"
          fontWeight="600"
          letterSpacing="0.05em"
        >
          ENTERPRISE GOVERNANCE · ZERO SERVER RETENTION
        </text>
        <text
          x="732"
          y="34"
          textAnchor="end"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize="10"
          fill="#D4847A"
        >
          CLICK ANY PILLAR TO INSPECT ISOLATION
        </text>

        {/* Three Interactive Pillar Cards */}
        {PILLARS.map((pillar, idx) => {
          const x = 28 + idx * 240;
          const isSelected = pillar.id === selected;

          return (
            <g
              key={pillar.id}
              transform={`translate(${x}, 54)`}
              onClick={() => setSelected(pillar.id)}
              style={{ cursor: "pointer" }}
            >
              <rect
                width="224"
                height="226"
                rx="12"
                fill={isSelected ? "#262623" : "#20201E"}
                stroke={isSelected ? "#D4847A" : "#3A3A36"}
                strokeWidth={isSelected ? "2" : "1"}
              />

              {/* Badge */}
              <rect
                x="16"
                y="16"
                width="148"
                height="22"
                rx="4"
                fill={isSelected ? "#6E1F26" : "#3B4A45"}
              />
              <text
                x="24"
                y="31"
                fontFamily="var(--font-plex-mono), monospace"
                fontSize="10"
                fill="#FFFFFF"
                fontWeight="600"
              >
                {pillar.badge}
              </text>

              {/* Title */}
              <text
                x="16"
                y="62"
                fontFamily="var(--font-figtree), 'Figtree', sans-serif"
                fontSize="16"
                fontWeight="600"
                fill="#FFFFFF"
              >
                {pillar.title}
              </text>

              {/* Two cleanly wrapped lines of description */}
              <text
                x="16"
                y="84"
                fontFamily="var(--font-figtree), 'Figtree', sans-serif"
                fontSize="11.5"
                fill="#B8B8B0"
              >
                {pillar.line1}
              </text>
              <text
                x="16"
                y="101"
                fontFamily="var(--font-figtree), 'Figtree', sans-serif"
                fontSize="11.5"
                fill="#B8B8B0"
              >
                {pillar.line2}
              </text>

              <line
                x1="16"
                y1="116"
                x2="208"
                y2="116"
                stroke={isSelected ? "#52524C" : "#333330"}
              />

              {/* Check items */}
              <g transform="translate(16, 136)">
                {pillar.checks.map((chk, cIdx) => (
                  <text
                    key={chk}
                    x="0"
                    y={cIdx * 21}
                    className={isSelected ? "pillar-check-active" : undefined}
                    fontFamily="var(--font-plex-mono), monospace"
                    fontSize="11"
                    fill={isSelected ? "#FFFFFF" : "#A0A09A"}
                  >
                    {chk}
                  </text>
                ))}
              </g>
            </g>
          );
        })}

        {/* Bottom Storage & Retention Readout Bar */}
        <rect
          x="28"
          y="294"
          width="704"
          height="38"
          rx="8"
          fill="#141413"
          stroke="#3A3A36"
        />
        <text
          x="44"
          y="317"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize="11"
          fill="#D4847A"
          fontWeight="600"
        >
          ACTIVE BOUNDARY: {current.storageKey}
        </text>
        <text
          x="716"
          y="317"
          textAnchor="end"
          fontFamily="var(--font-plex-mono), monospace"
          fontSize="11"
          fill="#DEDED8"
        >
          {current.retention}
        </text>
      </svg>
    </div>
  );
}
