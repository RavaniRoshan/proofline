"use client";

import React, { useState, useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

type GateMode = "verified" | "missing_span";

export function EvidenceGateDiagram() {
  const [mode, setMode] = useState<GateMode>("verified");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pins = svgRef.current.querySelectorAll(".gate-tumbler-pin");
    const bolt = svgRef.current.querySelector(".gate-verdict-bolt");

    if (mode === "verified") {
      animate(pins, {
        translateY: [-18, 0],
        opacity: [0.5, 1],
        duration: 520,
        delay: stagger(75),
        ease: "outBack(1.4)",
      });
      if (bolt) {
        animate(bolt, {
          translateX: [-12, 0],
          opacity: [0.6, 1],
          duration: 460,
          delay: 360,
          ease: "outCubic",
        });
      }
    } else {
      // Pin #4 (source_span) jams upward, blocking the shear line
      animate(pins, {
        translateY: (_el, i) => (i === 3 ? -12 : 0),
        duration: 420,
        ease: "outElastic(1, .6)",
      });
      if (bolt) {
        animate(bolt, {
          translateX: [8, 0],
          duration: 360,
          ease: "outCubic",
        });
      }
    }
  }, [mode]);

  const isVerified = mode === "verified";

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Interactive Mechanical Anatomy Control Strip */}
      <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-3 mb-4 px-2 font-mono text-[12px]">
        <div className="flex items-center gap-2 text-ink-soft">
          <span className="font-semibold text-ink">MECHANICAL ANATOMY:</span>
          <span>5-Pin Tumbler Evidence Lock (LAW.md §5)</span>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-[6px] bg-paper border border-line">
          <button
            type="button"
            onClick={() => setMode("verified")}
            className={`px-3 py-1 rounded-[4px] text-[11px] font-mono transition-all cursor-pointer active:scale-[0.98] ${
              isVerified
                ? "bg-ink text-paper font-semibold"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            All 5 Pins Aligned → CONTRADICTED
          </button>
          <button
            type="button"
            onClick={() => setMode("missing_span")}
            className={`px-3 py-1 rounded-[4px] text-[11px] font-mono transition-all cursor-pointer active:scale-[0.98] ${
              !isVerified
                ? "bg-accent text-paper font-semibold"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Inject Fault (Null Span) → Downgrade UNVERIFIED
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 720 390"
        className="w-full h-auto max-w-3xl select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Proofline Evidence Gate Mechanical Pin-Tumbler Verification Architecture"
      >
        <defs>
          <linearGradient id="gateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A1A18" />
            <stop offset="100%" stopColor="#262622" />
          </linearGradient>
          <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#3B4A45" fillOpacity="0.12" />
          </pattern>
        </defs>

        {/* Background Canvas Box */}
        <rect width="720" height="390" rx="16" fill="#F8F8F5" stroke="#DEDED8" strokeWidth="1.2" />
        <rect width="720" height="390" rx="16" fill="url(#dotGrid)" />

        {/* --- NODE 1: Ingested Draft Claim --- */}
        <g transform="translate(26, 36)">
          <rect width="200" height="84" rx="10" fill="#FFFFFF" stroke="#C9C9C1" strokeWidth="1.5" />
          <text x="14" y="24" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#2A3632" fontWeight="600">
            01 / INPUT CLAIM
          </text>
          <text x="14" y="48" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="13" fill="#1A1A18" fontWeight="500">
            “Flowdesk starts at
          </text>
          <text x="14" y="66" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="13" fill="#6E1F26" fontWeight="600">
            ₹4,999 per month.”
          </text>
        </g>

        {/* Conduit 1 */}
        <path d="M 226 78 L 266 78" stroke="#3B4A45" strokeWidth="2" strokeDasharray="3 3" />

        {/* --- NODE 2: Deterministic Normalizer --- */}
        <g transform="translate(266, 36)">
          <rect width="190" height="84" rx="10" fill="#FFFFFF" stroke="#C9C9C1" strokeWidth="1.5" />
          <text x="14" y="24" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A" fontWeight="600">
            02 / SCALAR NORMALIZER
          </text>
          <text x="14" y="46" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">
            claim: 4999 INR/mo
          </text>
          <text x="14" y="66" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#A8261C" fontWeight="600">
            fact F-021: 6499 INR/mo
          </text>
        </g>

        {/* Conduit into Central Mechanical Lock */}
        <path d="M 361 120 L 361 148" stroke="#3B4A45" strokeWidth="2" />

        {/* --- NODE 3: CENTRAL 5-PIN MECHANICAL EVIDENCE LOCK --- */}
        <g transform="translate(26, 148)">
          <rect width="450" height="214" rx="14" fill="url(#gateGrad)" stroke="#3B4A45" strokeWidth="2" />

          {/* Header Bar */}
          <rect x="18" y="16" width="142" height="22" rx="4" fill="#6E1F26" />
          <text x="26" y="31" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#FFFFFF" fontWeight="600">
            EVIDENCE GATE v1
          </text>
          <text x="172" y="31" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#DEDED8">
            {isVerified ? "SHEAR LINE CLEAR · 5/5 PINS SEATED" : "SHEAR LINE BLOCKED · PIN #4 MISSING"}
          </text>

          {/* Horizontal Shear Line Reference */}
          <line
            x1="18"
            y1="126"
            x2="432"
            y2="126"
            stroke={isVerified ? "#1F5C43" : "#D97706"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* 5 Mechanical Tumbler Pins */}
          {[
            { id: "PIN 01", field: "fact_id", val: "F-021", x: 22, ok: true },
            { id: "PIN 02", field: "version", val: "v4 · Active", x: 105, ok: true },
            { id: "PIN 03", field: "source_doc", val: "DOC-003", x: 188, ok: true },
            {
              id: "PIN 04",
              field: "source_span",
              val: isVerified ? "[412..468]" : "null (FAULT)",
              x: 271,
              ok: isVerified,
            },
            { id: "PIN 05", field: "valid_dates", val: "2026..2027", x: 354, ok: true },
          ].map((pin) => (
            <g key={pin.id} transform={`translate(${pin.x}, 54)`}>
              <g className="gate-tumbler-pin">
                <rect
                  width="74"
                  height="138"
                  rx="6"
                  fill="#121210"
                  stroke={pin.ok ? "#1F5C43" : "#D97706"}
                  strokeWidth="1.5"
                />
                <text
                  x="37"
                  y="20"
                  textAnchor="middle"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="10"
                  fill="#A0A09A"
                >
                  {pin.id}
                </text>
                <text
                  x="37"
                  y="38"
                  textAnchor="middle"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="10"
                  fill="#FFFFFF"
                  fontWeight="600"
                >
                  {pin.field}
                </text>

                {/* Brass / Emerald Plunger Core */}
                <rect
                  x="8"
                  y="54"
                  width="58"
                  height="42"
                  rx="4"
                  fill={pin.ok ? "#DDEBE0" : "#F8EEDA"}
                />
                <text
                  x="37"
                  y="79"
                  textAnchor="middle"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="9.5"
                  fill={pin.ok ? "#1F5C43" : "#7E4A10"}
                  fontWeight="700"
                >
                  {pin.val}
                </text>

                <text
                  x="37"
                  y="122"
                  textAnchor="middle"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="10"
                  fill={pin.ok ? "#4ADE80" : "#FBBF24"}
                  fontWeight="600"
                >
                  {pin.ok ? "✓ LOCKED" : "✕ JAMMED"}
                </text>
              </g>
            </g>
          ))}
        </g>

        {/* Conduit 3: Gate output to Decision Bolt */}
        <path
          d="M 476 255 L 516 255"
          stroke={isVerified ? "#6E1F26" : "#7E4A10"}
          strokeWidth="3"
        />

        {/* --- NODE 4: Output Verdict Bolt --- */}
        <g transform="translate(516, 168)">
          <g className="gate-verdict-bolt">
            <rect
              width="178"
              height="174"
              rx="12"
              fill="#FFFFFF"
              stroke={isVerified ? "#A8261C" : "#7E4A10"}
              strokeWidth="2"
            />

            <rect
              x="14"
              y="16"
              width="136"
              height="26"
              rx="4"
              fill={isVerified ? "#F7E3E0" : "#F8EEDA"}
              stroke={isVerified ? "#A8261C" : "#7E4A10"}
              strokeWidth="1"
            />
            <text
              x="22"
              y="33"
              fontFamily="var(--font-plex-mono), monospace"
              fontSize="12"
              fill={isVerified ? "#A8261C" : "#7E4A10"}
              fontWeight="700"
            >
              {isVerified ? "CONTRADICTED" : "UNVERIFIED"}
            </text>

            <text x="14" y="64" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="12" fill="#4F4F4A">
              {isVerified ? "Runtime Gate Passed:" : "Runtime Gate Intercepted:"}
            </text>
            <text x="14" y="82" fontFamily="var(--font-figtree), 'Figtree', sans-serif" fontSize="13" fill="#1A1A18" fontWeight="600">
              {isVerified ? "Full Proof Attached" : "Safe Fallback Active"}
            </text>

            <line x1="14" y1="96" x2="164" y2="96" stroke="#DEDED8" strokeWidth="1" />

            <text x="14" y="116" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A">
              {isVerified ? "SUGGESTED CORRECTION:" : "INVARIANT PROTECTION:"}
            </text>
            <text
              x="14"
              y="134"
              fontFamily="var(--font-plex-mono), monospace"
              fontSize="11.5"
              fill={isVerified ? "#6E1F26" : "#7E4A10"}
              fontWeight="600"
            >
              {isVerified ? "“₹6,499 per month”" : "Never ships unbacked"}
            </text>
            <text x="14" y="154" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#2A3632">
              {isVerified ? "Confidence: 1.0 (rule)" : "Downgraded in code"}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
