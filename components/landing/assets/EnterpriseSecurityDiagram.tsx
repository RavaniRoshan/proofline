import React from "react";

export function EnterpriseSecurityDiagram() {
  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <svg
        viewBox="0 0 680 360"
        className="w-full h-auto max-w-2xl select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Enterprise Local-First Privacy & Identity Architecture"
      >
        <rect width="680" height="360" rx="20" fill="#1A1A18" stroke="#3A3A36" strokeWidth="1.5" />

        {/* Top Title Bar */}
        <g transform="translate(30, 24)">
          <circle cx="10" cy="10" r="4" fill="#6E1F26" />
          <text x="24" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="600">
            ENTERPRISE BRAND GOVERNANCE · ZERO PAYLOAD RETENTION
          </text>
        </g>

        {/* 3 Pillar Cards */}
        {/* Pillar 1: Identity & SSO */}
        <g transform="translate(30, 60)">
          <rect width="190" height="260" rx="12" fill="#242422" stroke="#3A3A36" strokeWidth="1" />
          <rect x="16" y="16" width="100" height="22" rx="4" fill="#3B4A45" />
          <text x="22" y="31" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="600">
            IDENTITY / IAM
          </text>
          <text x="16" y="66" fontFamily="var(--font-plex-serif), Georgia, serif" fontSize="16" fill="#FFFFFF">
            SAML &amp; SCIM
          </text>
          <text x="16" y="90" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#A0A09A">
            Role-based register access with Okta, Azure AD, and Google Workspace integration.
          </text>
          
          <line x1="16" y1="130" x2="174" y2="130" stroke="#3A3A36" />
          
          <g transform="translate(16, 145)">
            <text x="0" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Automated SCIM sync</text>
            <text x="0" y="34" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Fact owner separation</text>
            <text x="0" y="54" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Dual sign-off workflow</text>
            <text x="0" y="74" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Zero-auth incognito mode</text>
          </g>
        </g>

        {/* Pillar 2: Local Isolation & Data Residency */}
        <g transform="translate(245, 60)">
          <rect width="190" height="260" rx="12" fill="#242422" stroke="#6E1F26" strokeWidth="1.5" />
          <rect x="16" y="16" width="118" height="22" rx="4" fill="#6E1F26" />
          <text x="22" y="31" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="600">
            LOCAL-FIRST DATA
          </text>
          <text x="16" y="66" fontFamily="var(--font-plex-serif), Georgia, serif" fontSize="16" fill="#FFFFFF">
            No Cloud Leak
          </text>
          <text x="16" y="90" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#A0A09A">
            Evaluations execute client-side or in private VPC containers. Draft text is never logged or indexed.
          </text>
          
          <line x1="16" y1="130" x2="174" y2="130" stroke="#3A3A36" />
          
          <g transform="translate(16, 145)">
            <text x="0" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ LocalStorage isolation</text>
            <text x="0" y="34" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Zero customer data stored</text>
            <text x="0" y="54" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ SOC 2 Type II controls</text>
            <text x="0" y="74" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ GDPR &amp; DPDP compliance</text>
          </g>
        </g>

        {/* Pillar 3: Append-Only Immutable Ledger */}
        <g transform="translate(460, 60)">
          <rect width="190" height="260" rx="12" fill="#242422" stroke="#3A3A36" strokeWidth="1" />
          <rect x="16" y="16" width="100" height="22" rx="4" fill="#3B4A45" />
          <text x="22" y="31" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#FFFFFF" fontWeight="600">
            AUDIT TRAIL
          </text>
          <text x="16" y="66" fontFamily="var(--font-plex-serif), Georgia, serif" fontSize="16" fill="#FFFFFF">
            Cryptographic Log
          </text>
          <text x="16" y="90" fontFamily="var(--font-plex-sans), sans-serif" fontSize="12" fill="#A0A09A">
            Every decision generates a verifiable SHA-256 seal citing fact IDs and approval timestamps.
          </text>
          
          <line x1="16" y1="130" x2="174" y2="130" stroke="#3A3A36" />
          
          <g transform="translate(16, 145)">
            <text x="0" y="14" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Append-only journal</text>
            <text x="0" y="34" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Complete span citation</text>
            <text x="0" y="54" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ CSV &amp; JSON exports</text>
            <text x="0" y="74" fontFamily="var(--font-plex-mono), monospace" fontSize="12" fill="#DEDED8">✓ Real-time audit search</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
