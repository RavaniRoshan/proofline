"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

export function DeterministicSplitDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeBranch, setActiveBranch] = useState<"all" | "deterministic" | "semantic">("all");

  useEffect(() => {
    if (!svgRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fastTokens = svgRef.current.querySelectorAll(".fast-path-token");
    const slowTokens = svgRef.current.querySelectorAll(".semantic-path-token");

    animate(fastTokens, {
      translateX: [0, 82],
      opacity: [0, 1, 0],
      duration: 1500,
      loop: true,
      ease: "outQuad",
      delay: stagger(360),
    });

    animate(slowTokens, {
      translateX: [0, 82],
      opacity: [0, 1, 0],
      duration: 2400,
      loop: true,
      ease: "inOutSine",
      delay: stagger(700),
    });
  }, [activeBranch]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-2 mb-3 px-1 font-mono text-[11px]">
        <span className="text-ink-soft">
          STAGE 1 ROUTING ANATOMY · Select branch to isolate claim traffic:
        </span>
        <div className="flex items-center gap-1 p-1 rounded-[6px] bg-paper border border-line">
          {(
            [
              { id: "all", label: "Both Branches (100%)" },
              { id: "deterministic", label: "78% TypeScript Rules (0ms)" },
              { id: "semantic", label: "22% Bounded LLM (≤5 facts)" },
            ] as const
          ).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveBranch(b.id)}
              className={`px-2.5 py-1 rounded-[4px] transition-all cursor-pointer active:scale-[0.98] ${
                activeBranch === b.id
                  ? "bg-ink text-paper font-semibold"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 680 360"
        className="w-full h-auto max-w-3xl select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Deterministic 78% Rule Routing Architecture"
      >
        <defs>
          <pattern id="splitGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#3B4A45" fillOpacity="0.1" />
          </pattern>
        </defs>

        <rect width="680" height="360" rx="16" fill="#FFFFFF" stroke="#DEDED8" strokeWidth="1.5" />
        <rect width="680" height="360" rx="16" fill="url(#splitGrid)" />

        {/* Input Claim Stream (Left) */}
        <g transform="translate(26, 98)">
          <rect width="164" height="160" rx="12" fill="#F5F5F2" stroke="#C9C9C1" strokeWidth="1.5" />
          <text x="14" y="26" fontFamily="var(--font-plex-mono), monospace" fontSize="11.5" fill="#1A1A18" fontWeight="600">
            INGESTED DRAFT (18)
          </text>
          <line x1="14" y1="36" x2="150" y2="36" stroke="#DEDED8" strokeWidth="1" />

          <g transform="translate(14, 48)">
            <rect width="136" height="24" rx="4" fill="#FFFFFF" stroke="#DEDED8" />
            <text x="8" y="16" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#1F5C43" fontWeight="600">
              Numeric &amp; Pricing (9)
            </text>
          </g>
          <g transform="translate(14, 80)">
            <rect width="136" height="24" rx="4" fill="#FFFFFF" stroke="#DEDED8" />
            <text x="8" y="16" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#1F5C43" fontWeight="600">
              Dates &amp; Entities (5)
            </text>
          </g>
          <g transform="translate(14, 112)">
            <rect width="136" height="24" rx="4" fill="#FFFFFF" stroke="#DEDED8" />
            <text x="8" y="16" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A">
              Qualitative Copy (4)
            </text>
          </g>
        </g>

        {/* Splitting Conduits */}
        <g opacity={activeBranch === "semantic" ? 0.25 : 1}>
          <path d="M 190 145 C 230 145, 240 85, 284 85" stroke="#1F5C43" strokeWidth="2.8" />
          <circle className="fast-path-token" cx="195" cy="115" r="4" fill="#1F5C43" />
          <circle className="fast-path-token" cx="195" cy="115" r="4" fill="#1F5C43" />
        </g>

        <g opacity={activeBranch === "deterministic" ? 0.25 : 1}>
          <path
            d="M 190 215 C 230 215, 240 265, 284 265"
            stroke="#3B4A45"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle className="semantic-path-token" cx="195" cy="240" r="3.5" fill="#6E1F26" />
        </g>

        {/* --- TOP NODE: 78% DETERMINISTIC ENGINE --- */}
        <g
          transform="translate(284, 32)"
          opacity={activeBranch === "semantic" ? 0.35 : 1}
        >
          <rect width="368" height="122" rx="12" fill="#DDEBE0" stroke="#1F5C43" strokeWidth="1.5" />
          <rect x="16" y="14" width="210" height="22" rx="4" fill="#1F5C43" />
          <text x="24" y="29" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#FFFFFF" fontWeight="700">
            DETERMINISTIC RULES · 78%
          </text>
          <text x="352" y="29" textAnchor="end" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#1F5C43" fontWeight="700">
            0.4ms · $0 COST
          </text>

          <text x="16" y="58" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="12.5" fill="#1A1A18" fontWeight="500">
            Pure TypeScript rules normalize currency, units, seat tiers,
          </text>
          <text x="16" y="76" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="12.5" fill="#1A1A18" fontWeight="500">
            date windows, and mandatory disclaimers in memory.
          </text>
          <text x="16" y="102" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#1F5C43" fontWeight="600">
            14 OF 18 SAMPLE CLAIMS SOLVED WITH ZERO LLM CALLS
          </text>
        </g>

        {/* --- BOTTOM NODE: 22% SEMANTIC MODEL GATE --- */}
        <g
          transform="translate(284, 202)"
          opacity={activeBranch === "deterministic" ? 0.35 : 1}
        >
          <rect width="368" height="122" rx="12" fill="#F5F5F2" stroke="#3B4A45" strokeWidth="1.5" />
          <rect x="16" y="14" width="210" height="22" rx="4" fill="#3B4A45" />
          <text x="24" y="29" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#FFFFFF" fontWeight="700">
            SEMANTIC GATEWAY · 22%
          </text>
          <text x="352" y="29" textAnchor="end" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A">
            SINGLE PASS ONLY
          </text>

          <text x="16" y="58" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="12.5" fill="#1A1A18" fontWeight="500">
            Consulted only for qualitative claims rules cannot settle.
          </text>
          <text x="16" y="76" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="12.5" fill="#1A1A18" fontWeight="500">
            Returns fact IDs only — never hallucinated citations or dates.
          </text>
          <text x="16" y="102" fontFamily="var(--font-plex-mono), monospace" fontSize="11.5" fill="#6E1F26" fontWeight="600">
            BOUNDED TO ≤ 5 LEXICALLY RETRIEVED CANDIDATE FACTS
          </text>
        </g>
      </svg>
    </div>
  );
}
