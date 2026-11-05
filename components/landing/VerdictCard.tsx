import { CheckCircle2, XCircle, Clock, AlertTriangle, HelpCircle, MinusCircle } from "lucide-react";

export type VerdictType =
  | "SUPPORTED"
  | "CONTRADICTED"
  | "STALE"
  | "CONFLICTING"
  | "UNVERIFIED"
  | "NOT_CHECKABLE";

interface VerdictMeta {
  label: string;
  badgeClass: string;
  borderClass: string;
  icon: typeof CheckCircle2;
  summary: string;
  sampleClaim: string;
  sampleEvidence: string;
  codeAction: string;
}

export const VERDICT_CONFIG: Record<VerdictType, VerdictMeta> = {
  SUPPORTED: {
    label: "SUPPORTED",
    badgeClass: "bg-v-supported-bg text-v-supported-fg border-v-supported-fg/20",
    borderClass: "hover:border-v-supported-fg/40",
    icon: CheckCircle2,
    summary: "Active approved fact entails the claim.",
    sampleClaim: "“The Starter plan includes 5 seats.”",
    sampleEvidence: "F-001 · Pricing sheet v4 · Valid through 2027",
    codeAction: "Evidence verified · confidence ≥ 0.75",
  },
  CONTRADICTED: {
    label: "CONTRADICTED",
    badgeClass: "bg-v-contradicted-bg text-v-contradicted-fg border-v-contradicted-fg/20",
    borderClass: "hover:border-v-contradicted-fg/40",
    icon: XCircle,
    summary: "Active approved fact directly contradicts claim.",
    sampleClaim: "“Flowdesk starts at ₹4,999 per\u00A0month.”",
    sampleEvidence: "F-021 · Active rate is ₹6,499/mo (superseded on\u00A02026-03-31)",
    codeAction: "Evidence gate passed · human review required",
  },
  STALE: {
    label: "STALE",
    badgeClass: "bg-v-stale-bg text-v-stale-fg border-v-stale-fg/20",
    borderClass: "hover:border-v-stale-fg/40",
    icon: Clock,
    summary: "Fact matched, but review date is past validity\u00A0window.",
    sampleClaim: "“The Legacy plan starts at ₹2,999 per\u00A0month.”",
    sampleEvidence: "F-010 · Valid 2025-01-01 → 2026-03-31 (expired)",
    codeAction: "Validity window expired · needs recertification",
  },
  CONFLICTING: {
    label: "CONFLICTING",
    badgeClass: "bg-v-conflicting-bg text-v-conflicting-fg border-v-conflicting-fg/20",
    borderClass: "hover:border-v-conflicting-fg/40",
    icon: AlertTriangle,
    summary: "Multiple active approved facts state different\u00A0values.",
    sampleClaim: "“The Growth plan includes 25\u00A0seats.”",
    sampleEvidence: "F-013 (25 seats) vs F-014 (50 seats) both marked active",
    codeAction: "Flagged for brand owner resolution",
  },
  UNVERIFIED: {
    label: "UNVERIFIED",
    badgeClass: "bg-v-unverified-bg text-v-unverified-fg border-v-unverified-fg/20",
    borderClass: "hover:border-v-unverified-fg/40",
    icon: HelpCircle,
    summary: "No approved fact exists in register for this claim.",
    sampleClaim: "“Flowdesk is SOC 2 Type II certified.”",
    sampleEvidence: "No matching document or fact in approved register",
    codeAction: "Honest refusal to judge · never hallucinated",
  },
  NOT_CHECKABLE: {
    label: "NOT_CHECKABLE",
    badgeClass: "bg-v-notcheckable-bg text-v-notcheckable-fg border-v-notcheckable-fg/20",
    borderClass: "hover:border-v-notcheckable-fg/40",
    icon: MinusCircle,
    summary: "Puffery, opinion, or qualitative assertion without factual predicate.",
    sampleClaim: "“The best onboarding platform in the\u00A0market.”",
    sampleEvidence: "Subjective marketing claim · excluded from fact audit",
    codeAction: "Bypasses model · zero verification cost",
  },
};

export function VerdictCard({ type }: { type: VerdictType }) {
  const meta = VERDICT_CONFIG[type];
  const Icon = meta.icon;

  return (
    <div
      className={`rounded-[28px] border border-line-strong bg-card p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${meta.borderClass}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold tracking-wider ${meta.badgeClass}`}
          >
            <Icon size={13} aria-hidden="true" />
            {meta.label}
          </span>
          <span className="font-mono text-[11px] text-muted tracking-tight">CANONICAL STATE</span>
        </div>

        <p className="text-[14px] leading-relaxed text-ink mb-4 font-sans font-medium text-pretty">
          {meta.summary}
        </p>

        <div className="border-l-2 border-line/80 pl-3.5 py-1 space-y-2.5 my-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
              Asserted Claim
            </p>
            <p className="font-mono text-[12px] text-ink font-medium mt-0.5 text-pretty">{meta.sampleClaim}</p>
          </div>
          <div className="pt-2 border-t border-line/50">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted font-semibold">
              Registered Evidence
            </p>
            <p className="text-[12px] text-ink-soft leading-snug mt-0.5 text-pretty">{meta.sampleEvidence}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[12px] font-mono text-muted">
        <span className="truncate">{meta.codeAction}</span>
      </div>
    </div>
  );
}
