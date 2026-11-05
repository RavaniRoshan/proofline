import React from "react";

export function DeterministicSplitDiagram() {
  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <svg
        viewBox="0 0 680 380"
        className="w-full h-auto max-w-2xl select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Deterministic 78% Rule Routing Architecture"
      >
        <defs>
          <pattern id="splitGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#3B4A45" fillOpacity="0.1" />
          </pattern>
        </defs>

        <rect width="680" height="380" rx="20" fill="#FFFFFF" stroke="#DEDED8" strokeWidth="1.5" />
        <rect width="680" height="380" rx="20" fill="url(#splitGrid)" />

        {/* Input Claim Stream (Left) */}
        <g transform="translate(30, 110)">
          <rect width="160" height="150" rx="12" fill="#F5F5F2" stroke="#C9C9C1" strokeWidth="1.5" />
          <text x="14" y="26" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18" fontWeight="600">
            INGESTED DRAFT
          </text>
          <line x1="14" y1="36" x2="146" y2="36" stroke="#DEDED8" strokeWidth="1" />
          
          <g transform="translate(14, 48)">
            <rect width="132" height="22" rx="3" fill="#FFFFFF" stroke="#DEDED8" />
            <text x="8" y="15" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">Numbers &amp; Pricing</text>
          </g>
          <g transform="translate(14, 76)">
            <rect width="132" height="22" rx="3" fill="#FFFFFF" stroke="#DEDED8" />
            <text x="8" y="15" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">Dates &amp; Limits</text>
          </g>
          <g transform="translate(14, 104)">
            <rect width="132" height="22" rx="3" fill="#FFFFFF" stroke="#DEDED8" />
            <text x="8" y="15" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">Subjective Copy</text>
          </g>
        </g>

        {/* Splitting Conduits */}
        {/* Top Branch (78% Deterministic) */}
        <path d="M 190 150 C 230 150, 240 80, 280 80" stroke="#1F5C43" strokeWidth="2.5" />
        {/* Bottom Branch (22% Model) */}
        <path d="M 190 220 C 230 220, 240 280, 280 280" stroke="#3B4A45" strokeWidth="2" strokeDasharray="4 4" />

        {/* --- TOP NODE: 78% DETERMINISTIC ENGINE --- */}
        <g transform="translate(280, 40)">
          <rect width="360" height="110" rx="12" fill="#DDEBE0" stroke="#1F5C43" strokeWidth="1.5" />
          <rect x="16" y="14" width="220" height="22" rx="4" fill="#1F5C43" />
          <text x="24" y="29" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="700">
            DETERMINISTIC RULES · 78%
          </text>
          <text x="250" y="30" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1F5C43" fontWeight="700">
            0ms · $0.00 COST
          </text>

          <text x="16" y="58" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#1A1A18" fontWeight="500">
            Pure TypeScript rules resolve regex schemas, currency conversions,
          </text>
          <text x="16" y="74" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#1A1A18" fontWeight="500">
            date windows, tier seat caps, and disclaimers.
          </text>
          <text x="16" y="96" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1F5C43" fontWeight="600">
            PASSES ZERO CALLS TO EXTERNAL LLMs
          </text>
        </g>

        {/* --- BOTTOM NODE: 22% SEMANTIC MODEL GATE --- */}
        <g transform="translate(280, 220)">
          <rect width="360" height="110" rx="12" fill="#F5F5F2" stroke="#3B4A45" strokeWidth="1.5" />
          <rect x="16" y="14" width="220" height="22" rx="4" fill="#3B4A45" />
          <text x="24" y="29" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="700">
            SEMANTIC GATEWAY · 22%
          </text>
          <text x="250" y="30" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A">
            SINGLE PASS ONLY
          </text>

          <text x="16" y="58" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#1A1A18" fontWeight="500">
            Only consulted for paraphrased or ambiguous factual assertions.
          </text>
          <text x="16" y="74" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#1A1A18" fontWeight="500">
            Returns fact IDs only — never hallucinated citations, spans, or dates.
          </text>
          <text x="16" y="96" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#6E1F26" fontWeight="600">
            BOUNDED TO MAXIMUM 5 CANDIDATE FACTS
          </text>
        </g>
      </svg>
    </div>
  );
}
