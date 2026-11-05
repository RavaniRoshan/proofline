"use client";

import Link from "next/link";
import {
  Database,
  BadgeCheck,
  AlertTriangle,
  GitCompareArrows,
  Inbox,
  ThumbsUp,
  ThumbsDown,
  PencilLine,
  ScrollText,
} from "lucide-react";
import type { RegisterStats } from "@/lib/register";
import { DECISION_LABEL, type DecisionValue } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
import type { Verdict } from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";

function Stat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Database;
  value: number;
  label: string;
  tone?: "default" | "warn" | "danger";
}) {
  const toneClasses =
    tone === "danger"
      ? "text-v-contradicted-fg"
      : tone === "warn"
        ? "text-v-stale-fg"
        : "text-slate";
  return (
    <div className="rounded-[6px] border border-line-strong bg-card p-4">
      <Icon size={18} aria-hidden="true" className={toneClasses} />
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-muted">{label}</p>
    </div>
  );
}

export function Dashboard({ stats, reviewDate }: { stats: RegisterStats; reviewDate: string }) {
  const state = useProoflineState();

  const byVerdict = new Map<Verdict, number>();
  const byDecision = new Map<DecisionValue, number>();
  for (const entry of state.audit) {
    byVerdict.set(entry.verdict, (byVerdict.get(entry.verdict) ?? 0) + 1);
    byDecision.set(entry.decision, (byDecision.get(entry.decision) ?? 0) + 1);
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-5">
      {/* register health — from the seed, always available */}
      <section aria-labelledby="register-health" className="lg:col-span-3">
        <h2 id="register-health" className="text-sm font-semibold text-foreground">
          Register health <span className="font-normal text-muted">· as of {reviewDate}</span>
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat icon={Database} value={stats.rows} label="fact rows carried by the register (all versions)" />
          <Stat icon={BadgeCheck} value={stats.approvedCurrent} label="approved facts currently inside their validity window" />
          <Stat
            icon={AlertTriangle}
            value={stats.stale}
            label="rows outside their validity window or superseded — due for refresh"
            tone={stats.stale > 0 ? "warn" : "default"}
          />
          <Stat
            icon={GitCompareArrows}
            value={stats.conflictingGroups}
            label="attribute conflicts — two approved facts disagreeing right now"
            tone={stats.conflictingGroups > 0 ? "danger" : "default"}
          />
        </div>
        <p className="mt-3 text-[13px] text-muted">
          {stats.factIds} fact ids · {stats.products.join(", ")} ·{" "}
          <Link href="/facts" className="font-medium text-accent underline-offset-2 hover:underline">
            browse the register
          </Link>
        </p>
      </section>

      {/* your review log — from localStorage */}
      <section aria-labelledby="review-log" className="lg:col-span-2">
        <h2 id="review-log" className="text-sm font-semibold text-foreground">
          Your review log <span className="font-normal text-muted">· this browser</span>
        </h2>
        {state.audit.length === 0 ? (
          <div className="mt-3 rounded-[6px] border border-dashed border-line-strong bg-panel/40 p-6 text-center">
            <Inbox size={26} aria-hidden="true" className="mx-auto text-slate" />
            <p className="mt-2 font-semibold">No decisions recorded yet.</p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] text-muted">
              Check a draft, decide on its findings, and this panel fills itself — verdict counts,
              decisions, everything.
            </p>
            <Link
              href="/check"
              className="mt-3 inline-flex h-9 items-center rounded-[4px] bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-hover"
            >
              Check a draft
            </Link>
          </div>
        ) : (
          <div className="mt-3 rounded-[6px] border border-line-strong bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Decisions by verdict
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {ALL_VERDICTS.filter((v) => (byVerdict.get(v) ?? 0) > 0).map((v) => (
                <li key={v} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="font-mono text-[11px] text-muted">{v.replace("_", " ")}</span>
                  <span className="tabular-nums font-semibold">{byVerdict.get(v)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-line pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                What you decided
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["approve", "reject", "needs_edit"] as const).map((d) => {
                  const Icon = d === "approve" ? ThumbsUp : d === "reject" ? ThumbsDown : PencilLine;
                  return (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-background px-2.5 py-1 text-[12px] font-medium"
                    >
                      <Icon size={13} aria-hidden="true" />
                      {DECISION_LABEL[d]}: {byDecision.get(d) ?? 0}
                    </span>
                  );
                })}
              </div>
              <Link
                href="/audit"
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent underline-offset-2 hover:underline"
              >
                <ScrollText size={13} aria-hidden="true" />
                Open the full audit log
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
