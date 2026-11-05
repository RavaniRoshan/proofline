import React from "react";

export function RegisterLockupDiagram() {
  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <svg
        viewBox="0 0 680 400"
        className="w-full h-auto max-w-2xl select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Proofline Seed Register Versioned Record"
      >
        <defs>
          <linearGradient id="regGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F9F9F7" />
          </linearGradient>
          <pattern id="regGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#1A1A18" fillOpacity="0.08" />
          </pattern>
        </defs>

        {/* Outer Card Frame */}
        <rect width="680" height="400" rx="20" fill="url(#regGrad)" stroke="#C9C9C1" strokeWidth="1.5" />
        <rect width="680" height="400" rx="20" fill="url(#regGrid)" />

        {/* Top Header Strip */}
        <g transform="translate(32, 28)">
          <rect width="616" height="48" rx="8" fill="#1A1A18" />
          <circle cx="24" cy="24" r="6" fill="#6E1F26" />
          <text x="38" y="28" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="600">
            FACT REGISTER · B-FLOWDESK · F-021
          </text>
          <rect x="470" y="14" width="130" height="20" rx="4" fill="#3B4A45" />
          <text x="478" y="28" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF">
            IMMUTABLE LEDGER
          </text>
        </g>

        {/* Left Column: Version Lineage Card */}
        <g transform="translate(32, 94)">
          <rect width="260" height="276" rx="12" fill="#FFFFFF" stroke="#DEDED8" strokeWidth="1" />
          <text x="20" y="28" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A" fontWeight="600">
            VERSION LINEAGE
          </text>

          {/* v1 -> v2 -> v3 -> v4 tree */}
          {[
            { ver: "v1.0", date: "2024-06-01", val: "₹3,499 / mo", status: "ARCHIVED" },
            { ver: "v2.0", date: "2025-01-01", val: "₹4,999 / mo", status: "SUPERSEDED" },
            { ver: "v3.0", date: "2025-10-01", val: "₹4,999 / mo", status: "SUPERSEDED" },
            { ver: "v4.0", date: "2026-03-31", val: "₹6,499 / mo", status: "ACTIVE APPROVED" },
          ].map((row, i) => (
            <g key={i} transform={`translate(16, ${48 + i * 54})`}>
              <circle cx="10" cy="14" r="5" fill={row.status.includes("ACTIVE") ? "#6E1F26" : "#C9C9C1"} />
              {i < 3 && <line x1="10" y1="20" x2="10" y2="52" stroke="#DEDED8" strokeWidth="2" />}
              <text x="26" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18" fontWeight="600">
                {row.ver}
              </text>
              <text x="70" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A">
                {row.date}
              </text>
              <text x="26" y="30" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1A1A18">
                {row.val}
              </text>
              <rect x="140" y="4" width={row.status.includes("ACTIVE") ? "94" : "84"} height="18" rx="3" fill={row.status.includes("ACTIVE") ? "#DDEBE0" : "#F5F5F2"} />
              <text x="144" y="17" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill={row.status.includes("ACTIVE") ? "#1F5C43" : "#4F4F4A"} fontWeight="600">
                {row.status}
              </text>
            </g>
          ))}
        </g>

        {/* Right Column: Active Record Proof Sheet */}
        <g transform="translate(308, 94)">
          <rect width="340" height="276" rx="12" fill="#FFFFFF" stroke="#DEDED8" strokeWidth="1" />
          
          <text x="20" y="28" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A" fontWeight="600">
            ACTIVE RECORD SPECIFICATION
          </text>

          {/* Key Value Rows */}
          <g transform="translate(20, 44)">
            <text x="0" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A">Canonical Value:</text>
            <text x="0" y="32" fontFamily="var(--font-plex-serif), Georgia, serif" fontSize="18" fill="#1A1A18" fontWeight="600">
              ₹6,499 per month
            </text>

            <line x1="0" y1="46" x2="300" y2="46" stroke="#DEDED8" strokeWidth="1" />

            <text x="0" y="66" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A">Source Document:</text>
            <text x="0" y="82" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#2A3632" fontWeight="500">
              Pricing sheet v4 (Doc #3) · character span [412, 468]
            </text>

            <line x1="0" y1="96" x2="300" y2="96" stroke="#DEDED8" strokeWidth="1" />

            {/* Validity Timeline Visualizer */}
            <text x="0" y="116" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#4F4F4A">Validity Window:</text>
            <rect x="0" y="126" width="300" height="26" rx="4" fill="#F5F5F2" stroke="#DEDED8" strokeWidth="1" />
            <rect x="50" y="129" width="180" height="20" rx="3" fill="#3B4A45" />
            <text x="60" y="143" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="500">
              2026-03-31 → Active
            </text>
            <text x="8" y="143" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#7E4A10">
              stale
            </text>
            <text x="240" y="143" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#1F5C43">
              valid
            </text>

            <line x1="0" y1="166" x2="300" y2="166" stroke="#DEDED8" strokeWidth="1" />

            {/* Approval Stamp */}
            <g transform="translate(0, 180)">
              <rect width="300" height="40" rx="6" fill="#F8EEDA" stroke="#7E4A10" strokeWidth="1" strokeDasharray="3 3" />
              <text x="12" y="18" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#7E4A10" fontWeight="600">
                AUDITABLE SIGN-OFF
              </text>
              <text x="12" y="32" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#3A3A36">
                Approved by VP Marketing · SHA-256: 7f83b1c4...
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
