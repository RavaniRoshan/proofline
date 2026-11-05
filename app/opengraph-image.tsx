import { ImageResponse } from "next/og";

export const alt = "Proofline — Claim-Evidence Governance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          padding: 60,
          fontFamily: "sans-serif",
          border: "16px solid #F5F5F2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 36, color: "#6E1F26", fontWeight: "bold" }}>[ ]</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#1A1A18", letterSpacing: -0.5 }}>
            Proofline
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 16,
              color: "#3B4A45",
              border: "1px solid #DEDED8",
              padding: "6px 14px",
              borderRadius: 4,
            }}
          >
            Round 2 Build
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 50,
              fontWeight: 800,
              color: "#1A1A18",
              lineHeight: 1.15,
              maxWidth: 950,
            }}
          >
            Check marketing claims against owner-approved product facts.
          </div>
          <div style={{ fontSize: 24, color: "#4A4A45", maxWidth: 900 }}>
            Every finding cites the exact source document, version, and validity dates behind it —
            or refuses to judge.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderTop: "1px solid #DEDED8",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#1F5C43",
              backgroundColor: "#DDEBE0",
              padding: "6px 12px",
              borderRadius: 4,
            }}
          >
            SUPPORTED
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#A8261C",
              backgroundColor: "#F7E3E0",
              padding: "6px 12px",
              borderRadius: 4,
            }}
          >
            CONTRADICTED
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#7E4A10",
              backgroundColor: "#F8EEDA",
              padding: "6px 12px",
              borderRadius: 4,
            }}
          >
            STALE
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#5A3461",
              backgroundColor: "#EDE5EF",
              padding: "6px 12px",
              borderRadius: 4,
            }}
          >
            CONFLICTING
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#4A4A45",
              backgroundColor: "#E8E6DF",
              padding: "6px 12px",
              borderRadius: 4,
            }}
          >
            UNVERIFIED
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#5F5F58",
              backgroundColor: "#ECEAE3",
              padding: "6px 12px",
              borderRadius: 4,
            }}
          >
            NOT CHECKABLE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
