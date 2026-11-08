import { CheckCircle2, XCircle, Clock, AlertTriangle, HelpCircle, MinusCircle } from "lucide-react";

export type VerdictType =
  | "SUPPORTED"
  | "CONTRADICTED"
  | "STALE"
  | "CONFLICTING"
  | "UNVERIFIED"
  | "NOT_CHECKABLE";

interface VerdictMeta {
  index: string;
  label: string;
  badgeClass: string;
  borderClass: string;
  icon: typeof CheckCircle2;
  severityLabel: string;
  decidedBy: string;
  summary: string;
  sampleClaim: string;
  sampleEvidence: string;
  codeAction: string;
}

export const VERDICT_CONFIG: Record<VerdictType, VerdictMeta> = {
  SUPPORTED: {
    index: "01",
    label: "SUPPORTED",
    badgeClass: "bg-v-supported-bg text-v-supported-fg border-v-supported-fg/25",
    borderClass: "hover:border-v-supported-fg/45",
    icon: CheckCircle2,
    severityLabel: "Severity 0 · Ready",
    decidedBy: "Rule or Model ≥ 0.75",
    summary: "Active approved fact entails the claim within its validity window.",
    sampleClaim: "“The Starter plan includes 5 seats.”",
    sampleEvidence: "F-001 (v4) · Pricing sheet v4 · span [102..148] · valid through 2027",
    codeAction: "Entailment verified · nothing contradicts",
  },
  CONTRADICTED: {
    index: "02",
    label: "CONTRADICTED",
    badgeClass: "bg-v-contradicted-bg text-v-contradicted-fg border-v-contradicted-fg/25",
    borderClass: "hover:border-v-contradicted-fg/45",
    icon: XCircle,
    severityLabel: "Severity 3 · Blocker",
    decidedBy: "Code + Evidence Gate",
    summary: "Active approved fact directly disagrees with the normalized claim value.",
    sampleClaim: "“Flowdesk starts at ₹4,999 per\u00A0month.”",
    sampleEvidence: "F-021 (v4) · Active rate is ₹6,499/mo · span [412..468] · superseded 2026-03-31",
    codeAction: "5-field Evidence Gate passed · human decision required",
  },
  STALE: {
    index: "03",
    label: "STALE",
    badgeClass: "bg-v-stale-bg text-v-stale-fg border-v-stale-fg/25",
    borderClass: "hover:border-v-stale-fg/45",
    icon: Clock,
    severityLabel: "Severity 2 · Expired",
    decidedBy: "Deterministic Date Check",
    summary: "Fact matched in register, but review_date exceeds valid_until or is superseded.",
    sampleClaim: "“The Legacy plan starts at ₹2,999 per\u00A0month.”",
    sampleEvidence: "F-010 (v2) · Valid 2025-01-01 → 2026-03-31 · expired at review_date",
    codeAction: "Validity window expired · requires recertification",
  },
  CONFLICTING: {
    index: "04",
    label: "CONFLICTING",
    badgeClass: "bg-v-conflicting-bg text-v-conflicting-fg border-v-conflicting-fg/25",
    borderClass: "hover:border-v-conflicting-fg/45",
    icon: AlertTriangle,
    severityLabel: "Severity 2 · Ambiguous",
    decidedBy: "Deterministic Multi-Match",
    summary: "Two or more active approved facts state different values for the same attribute.",
    sampleClaim: "“The Growth plan includes 25\u00A0seats.”",
    sampleEvidence: "F-024 (25 seats) vs F-025 (50 seats) · both marked active at review_date",
    codeAction: "Halts automatic verdict · escalates to brand owner",
  },
  UNVERIFIED: {
    index: "05",
    label: "UNVERIFIED",
    badgeClass: "bg-v-unverified-bg text-v-unverified-fg border-v-unverified-fg/25",
    borderClass: "hover:border-v-unverified-fg/45",
    icon: HelpCircle,
    severityLabel: "Severity 1 · Unbacked",
    decidedBy: "Fallback / Downgrade Gate",
    summary: "No approved fact resolves in the register, or a required disclaimer is missing.",
    sampleClaim: "“Flowdesk is SOC 2 Type II certified.”",
    sampleEvidence: "0 matching facts in B-flowdesk register · refuses to guess",
    codeAction: "Honest refusal to judge · zero hallucinated backing",
  },
  NOT_CHECKABLE: {
    index: "06",
    label: "NOT_CHECKABLE",
    badgeClass: "bg-v-notcheckable-bg text-v-notcheckable-fg border-v-notcheckable-fg/25",
    borderClass: "hover:border-v-notcheckable-fg/45",
    icon: MinusCircle,
    severityLabel: "Severity 0 · Subjective",
    decidedBy: "Qualitative Filter",
    summary: "Marketing puffery, headline tone, or opinion without a checkable factual predicate.",
    sampleClaim: "“The calmest onboarding platform in the\u00A0market.”",
    sampleEvidence: "Subjective assertion · no product attribute predicate",
    codeAction: "Excluded from fact audit · zero reviewer noise",
  },
};

export function VerdictCard({ type }: { type: VerdictType }) {
  const meta = VERDICT_CONFIG[type];
  const Icon = meta.icon;

  return (
    <article
      className={`rounded-[16px] border border-line-strong bg-card p-6 flex flex-col justify-between transition-colors transition-transform duration-150 hover:shadow-sm ${meta.borderClass}`}
    >
      <div>
        {/* Top Row: Verdict Badge + Unboxed Tabular Metadata */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-line">
          <span
            data-verdict-badge
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border text-[11px] font-mono font-semibold tracking-wider ${meta.badgeClass}`}
          >
            <Icon size={13} aria-hidden="true" />
            {meta.label}
          </span>
          <span className="font-mono text-[11px] text-muted tabular-nums">
            {meta.index} · {meta.severityLabel}
          </span>
        </div>

        {/* Summary */}
        <p className="text-[15px] leading-snug text-ink mt-4 mb-4 font-sans font-medium text-pretty">
          {meta.summary}
        </p>

        {/* Specimen Box (No thick left border, clean archival table layout) */}
        <div className="rounded-[8px] bg-panel/70 border border-line p-3.5 space-y-2.5 my-2">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted">
              <span>ASSERTED CLAIM</span>
              <span>{meta.decidedBy}</span>
            </div>
            <p className="font-mono text-[12px] text-ink font-medium mt-1 text-pretty">
              {meta.sampleClaim}
            </p>
          </div>
          <div className="pt-2.5 border-t border-line">
            <p className="font-mono text-[11px] text-muted">
              EVIDENCE RECORD LOOKUP
            </p>
            <p className="font-mono text-[11px] text-ink-soft leading-relaxed mt-0.5 tabular-nums text-pretty">
              {meta.sampleEvidence}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Line */}
      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] font-mono text-muted">
        <span className="leading-snug">{meta.codeAction}</span>
      </div>
    </article>
  );
}
