"use client";

import React, { useState, useEffect, useRef } from "react";
import { animate } from "animejs";

interface VersionRecord {
  ver: string;
  date: string;
  val: string;
  status: "ARCHIVED" | "SUPERSEDED" | "ACTIVE APPROVED";
  doc: string;
  span: string;
  windowLabel: string;
  approver: string;
  sha: string;
  barWidth: number;
  barOffset: number;
}

const VERSIONS: VersionRecord[] = [
  {
    ver: "v1.0",
    date: "2024-06-01",
    val: "₹3,499 per month",
    status: "ARCHIVED",
    doc: "Pricing sheet v1 (DOC-001)",
    span: "chars 110–156",
    windowLabel: "2024-06-01 → 2024-12-31 (Expired)",
    approver: "Product Ops Lead",
    sha: "3a91c0e2...",
    barWidth: 70,
    barOffset: 10,
  },
  {
    ver: "v2.0",
    date: "2025-01-01",
    val: "₹4,999 per month",
    status: "SUPERSEDED",
    doc: "Pricing sheet v2 (DOC-002)",
    span: "chars 204–252",
    windowLabel: "2025-01-01 → 2025-09-30 (Superseded)",
    approver: "VP Product Marketing",
    sha: "9d42f8b1...",
    barWidth: 95,
    barOffset: 45,
  },
  {
    ver: "v3.0",
    date: "2025-10-01",
    val: "₹4,999 per month",
    status: "SUPERSEDED",
    doc: "Pricing sheet v3 (DOC-002)",
    span: "chars 318–370",
    windowLabel: "2025-10-01 → 2026-03-31 (Superseded)",
    approver: "VP Product Marketing",
    sha: "4c18e7a9...",
    barWidth: 120,
    barOffset: 85,
  },
  {
    ver: "v4.0",
    date: "2026-04-01",
    val: "₹6,499 per month",
    status: "ACTIVE APPROVED",
    doc: "Pricing sheet v4 (DOC-003)",
    span: "chars 412–468",
    windowLabel: "2026-04-01 → 2027-03-31 (Active)",
    approver: "VP Marketing & Legal Counsel",
    sha: "7f83b1c4...",
    barWidth: 165,
    barOffset: 125,
  },
];

export function RegisterLockupDiagram() {
  const [selectedIdx, setSelectedIdx] = useState(3);
  const specRef = useRef<SVGGElement>(null);
  const current = VERSIONS[selectedIdx];
  const isActive = current.status === "ACTIVE APPROVED";

  useEffect(() => {
    if (!specRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    animate(specRef.current, {
      opacity: [0.4, 1],
      translateY: [4, 0],
      duration: 320,
      ease: "outCubic",
    });
  }, [selectedIdx]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-2 mb-3 px-1 font-mono text-[11px]">
        <span className="text-ink-soft">
          INTERACTIVE LINEAGE INSPECTOR · Click any version row (v1.0–v4.0) to inspect historical state:
        </span>
        <div className="flex items-center gap-1 p-1 rounded-[6px] bg-paper border border-line">
          {VERSIONS.map((v, idx) => (
            <button
              key={v.ver}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`px-2.5 py-1 rounded-[4px] transition-all cursor-pointer tabular-nums active:scale-[0.98] ${
                selectedIdx === idx
                  ? "bg-ink text-paper font-semibold"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {v.ver}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 680 390"
        className="w-full h-auto max-w-3xl select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Proofline Seed Register Versioned Record"
      >
        <defs>
          <pattern id="regGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#1A1A18" fillOpacity="0.08" />
          </pattern>
        </defs>

        <rect width="680" height="390" rx="16" fill="var(--panel)" stroke="var(--line)" strokeWidth="1.5" />
        <rect width="680" height="390" rx="16" fill="url(#regGrid)" />

        {/* Top Header Strip */}
        <g transform="translate(28, 24)">
          <rect width="624" height="46" rx="8" fill="#1A1A18" />
          <text x="20" y="28" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="600">
            FACT REGISTER · B-FLOWDESK · F-021 ({current.ver})
          </text>
          <rect x="476" y="13" width="132" height="20" rx="4" fill="#3B4A45" />
          <text x="486" y="27" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#FFFFFF">
            IMMUTABLE LEDGER
          </text>
        </g>

        {/* Left Column: Clickable Version Lineage Tree */}
        <g transform="translate(28, 86)">
          <rect width="268" height="278" rx="12" fill="var(--panel-elevated)" stroke="var(--line)" strokeWidth="1.2" />
          <text x="18" y="26" fontFamily="var(--font-plex-mono), monospace" fontSize="11.5" fill="#4F4F4A" fontWeight="600">
            VERSION LINEAGE (CLICK TO INSPECT)
          </text>

          {VERSIONS.map((row, i) => {
            const selected = i === selectedIdx;
            const activeRow = row.status === "ACTIVE APPROVED";
            return (
              <g
                key={row.ver}
                transform={`translate(14, ${44 + i * 55})`}
                onClick={() => setSelectedIdx(i)}
                className="cursor-pointer"
              >
                <rect
                  x="0"
                  y="-6"
                  width="240"
                  height="46"
                  rx="6"
                  fill={selected ? "#F5F5F2" : "transparent"}
                  stroke={selected ? "#1A1A18" : "transparent"}
                  strokeWidth="1.2"
                />
                <circle
                  cx="14"
                  cy="16"
                  r="5"
                  fill={activeRow ? "#6E1F26" : selected ? "#1A1A18" : "#C9C9C1"}
                />
                {i < 3 && <line x1="14" y1="22" x2="14" y2="50" stroke="#DEDED8" strokeWidth="2" />}
                <text
                  x="28"
                  y="14"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="12"
                  fill="#1A1A18"
                  fontWeight="600"
                >
                  {row.ver}
                </text>
                <text x="68" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A">
                  {row.date}
                </text>
                <text x="28" y="31" fontFamily="var(--font-plex-mono), monospace" fontSize="11.5" fill="#1A1A18">
                  {row.val}
                </text>
                <rect
                  x="138"
                  y="3"
                  width="94"
                  height="18"
                  rx="3"
                  fill={activeRow ? "#DDEBE0" : "#ECEAE3"}
                />
                <text
                  x="185"
                  y="15"
                  textAnchor="middle"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="9.5"
                  fill={activeRow ? "#1F5C43" : "#4F4F4A"}
                  fontWeight="600"
                >
                  {row.status}
                </text>
              </g>
            );
          })}
        </g>

        {/* Right Column: Active Record Specification Card */}
        <g transform="translate(312, 86)">
          <rect width="340" height="278" rx="12" fill="#FFFFFF" stroke="#DEDED8" strokeWidth="1.2" />

          <g ref={specRef}>
            <text x="20" y="26" fontFamily="var(--font-plex-mono), monospace" fontSize="11.5" fill="#4F4F4A" fontWeight="600">
              RECORD SPECIFICATION · {current.ver}
            </text>

            <g transform="translate(20, 42)">
              <text x="0" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A">
                Registered Value:
              </text>
              <text
                x="0"
                y="34"
                fontFamily="var(--font-figtree), 'Figtree', sans-serif"
                fontSize="19"
                fill={isActive ? "#1A1A18" : "#7E4A10"}
                fontWeight="600"
              >
                {current.val}
              </text>

              <line x1="0" y1="46" x2="300" y2="46" stroke="#DEDED8" strokeWidth="1" />

              <text x="0" y="64" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A">
                Source Document &amp; Byte Span:
              </text>
              <text x="0" y="82" fontFamily="var(--font-plex-mono), monospace" fontSize="11.5" fill="#2A3632" fontWeight="600">
                {current.doc} · {current.span}
              </text>

              <line x1="0" y1="96" x2="300" y2="96" stroke="#DEDED8" strokeWidth="1" />

              {/* Validity Timeline Visualizer */}
              <text x="0" y="114" fontFamily="var(--font-plex-mono), monospace" fontSize="11" fill="#4F4F4A">
                Validity Window at Review Date:
              </text>
              <rect x="0" y="124" width="300" height="26" rx="4" fill="#F5F5F2" stroke="#DEDED8" strokeWidth="1" />
              <rect
                x={current.barOffset}
                y="127"
                width={current.barWidth}
                height="20"
                rx="3"
                fill={isActive ? "#DDEBE0" : "#F8EEDA"}
                stroke={isActive ? "#1F5C43" : "#7E4A10"}
                strokeWidth="1"
              />
              <text
                x="150"
                y="141"
                textAnchor="middle"
                fontFamily="var(--font-plex-mono), monospace"
                fontSize="10.5"
                fill={isActive ? "#1F5C43" : "#7E4A10"}
                fontWeight="700"
              >
                {current.windowLabel}
              </text>

              <line x1="0" y1="164" x2="300" y2="164" stroke="#DEDED8" strokeWidth="1" />

              {/* Approval Stamp */}
              <g transform="translate(0, 176)">
                <rect
                  width="300"
                  height="44"
                  rx="6"
                  fill={isActive ? "#DDEBE0" : "#F8EEDA"}
                  stroke={isActive ? "#1F5C43" : "#7E4A10"}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x="12"
                  y="18"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="10.5"
                  fill={isActive ? "#1F5C43" : "#7E4A10"}
                  fontWeight="600"
                >
                  {isActive ? "ACTIVE OWNER SIGN-OFF" : "HISTORICAL AUDIT RECORD"}
                </text>
                <text x="12" y="34" fontFamily="var(--font-plex-mono), monospace" fontSize="10" fill="#1A1A18">
                  {current.approver} · SHA: {current.sha}
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
