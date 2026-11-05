import React from "react";

export function EvidenceGateDiagram() {
  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <svg
        viewBox="0 0 680 400"
        className="w-full h-auto max-w-2xl select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Proofline Evidence Gate Verification Architecture"
      >
        <defs>
          {/* Subtle linear gradients for nodes */}
          <linearGradient id="gateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A1A18" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2A2A26" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="oxbloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E1F26" />
            <stop offset="100%" stopColor="#9E2A34" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B4A45" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3B4A45" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6E1F26" stopOpacity="0.9" />
          </linearGradient>
          <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#3B4A45" fillOpacity="0.12" />
          </pattern>
        </defs>

        {/* Background Canvas Box */}
        <rect width="680" height="400" rx="20" fill="#F8F8F5" stroke="#DEDED8" strokeWidth="1" />
        <rect width="680" height="400" rx="20" fill="url(#dotGrid)" />

        {/* --- NODE 1: Ingested Draft Claim --- */}
        <g transform="translate(30, 45)">
          <rect width="180" height="90" rx="10" fill="#FFFFFF" stroke="#C9C9C1" strokeWidth="1.5" />
          <rect x="12" y="14" width="70" height="18" rx="4" fill="#3B4A45" fillOpacity="0.1" />
          <text x="18" y="27" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#2A3632" fontWeight="600">INPUT CLAIM</text>
          <text x="14" y="52" fontFamily="var(--font-plex-sans), sans-serif" fontSize="13" fill="#1A1A18" fontWeight="500">
            “Flowdesk starts at
          </text>
          <text x="14" y="70" fontFamily="var(--font-plex-sans), sans-serif" fontSize="13" fill="#6E1F26" fontWeight="600">
            ₹4,999 per month.”
          </text>
        </g>

        {/* Conduit 1: Claim to Deterministic Segmenter */}
        <path d="M 210 90 L 250 90" stroke="#3B4A45" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="250" cy="90" r="3" fill="#3B4A45" />

        {/* --- NODE 2: Deterministic Normalizer --- */}
        <g transform="translate(254, 45)">
          <rect width="170" height="90" rx="10" fill="#FFFFFF" stroke="#C9C9C1" strokeWidth="1.5" />
          <text x="14" y="24" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A" fontWeight="600">TOKEN NORMALIZER</text>
          <text x="14" y="46" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">entity: currency</text>
          <text x="14" y="62" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">amount: 4999 INR</text>
          <text x="14" y="78" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">interval: monthly</text>
        </g>

        {/* Conduit 2: Segmenter into Central Evidence Gate */}
        <path d="M 424 90 L 460 90 L 460 170 L 420 170" stroke="#3B4A45" strokeWidth="2" />
        <circle cx="420" cy="170" r="3" fill="#3B4A45" />

        {/* --- NODE 3: CENTRAL EVIDENCE GATE (The Core Invariant) --- */}
        <g transform="translate(60, 155)">
          <rect width="360" height="205" rx="14" fill="url(#gateGrad)" stroke="#3B4A45" strokeWidth="2" />
          
          {/* Header pill */}
          <rect x="18" y="16" width="135" height="24" rx="4" fill="#6E1F26" />
          <text x="26" y="32" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="600">
            EVIDENCE GATE v1
          </text>
          <text x="165" y="32" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">
            5/5 MANDATORY FIELDS
          </text>

          {/* 5 Invariant Check Rows */}
          {[
            { label: "FACT ID", val: "F-021 (Pricing starter rate)", pass: true, y: 70 },
            { label: "VERSION", val: "v4 · Superseded on 2026-03-31", pass: true, y: 96 },
            { label: "SOURCE DOC", val: "Pricing sheet v4 (Doc #3)", pass: true, y: 122 },
            { label: "CHARACTER SPAN", val: "[412, 468] exact byte range", pass: true, y: 148 },
            { label: "VALIDITY WINDOW", val: "Active value is ₹6,499/mo", pass: true, y: 174 },
          ].map((item, idx) => (
            <g key={idx} transform={`translate(18, ${item.y})`}>
              <rect width="324" height="22" rx="4" fill="#141412" stroke="#3A3A36" strokeWidth="1" />
              <circle cx="12" cy="11" r="5" fill="#1F5C43" />
              <path d="M 9.5 11 L 11.5 13 L 14.5 9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              <text x="24" y="15" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8" fontWeight="600">
                {item.label}:
              </text>
              <text x="130" y="15" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#A0A09A">
                {item.val}
              </text>
            </g>
          ))}
        </g>

        {/* Conduit 3: Gate output to Decision Node */}
        <path d="M 420 258 L 470 258" stroke="url(#lineGrad)" strokeWidth="2.5" />
        <polygon points="468,254 476,258 468,262" fill="#6E1F26" />

        {/* --- NODE 4: Final Deterministic Verdict --- */}
        <g transform="translate(480, 185)">
          <rect width="170" height="150" rx="12" fill="#FFFFFF" stroke="#6E1F26" strokeWidth="2" filter="drop-shadow(0 8px 16px rgba(110, 31, 38, 0.12))" />
          
          <rect x="14" y="14" width="112" height="24" rx="4" fill="#F7E3E0" stroke="#A8261C" strokeWidth="1" />
          <text x="20" y="30" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#A8261C" fontWeight="700">
            CONTRADICTED
          </text>

          <text x="14" y="58" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#4F4F4A" fontWeight="500">
            Entailment Check:
          </text>
          <text x="14" y="74" fontFamily="var(--font-plex-sans), sans-serif" fontSize="13" fill="#1A1A18" fontWeight="600">
            Conflict detected
          </text>

          <line x1="14" y1="86" x2="156" y2="86" stroke="#DEDED8" strokeWidth="1" />

          <text x="14" y="104" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A">
            SUGGESTED CORRECTION:
          </text>
          <text x="14" y="120" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#6E1F26" fontWeight="600">
            “₹6,499 per month”
          </text>
          <text x="14" y="136" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#2A3632">
            Confidence: 1.0 (exact match)
          </text>
        </g>
      </svg>
    </div>
  );
}
