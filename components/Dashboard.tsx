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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { RegisterStats } from "@/lib/register";
import { DECISION_LABEL, type DecisionValue } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
import type { Verdict } from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";
import { VERDICT_MAP } from "@/lib/verdicts";

export function Dashboard({
  stats,
  reviewDate,
  deterministic,
  model,
}: {
  stats: RegisterStats;
  reviewDate: string;
  deterministic: number;
  model: number;
}) {
  const totalClaims = deterministic + model;
  const rulesPct = totalClaims > 0 ? Math.round((deterministic / totalClaims) * 100) : 100;
  const modelPct = totalClaims > 0 ? 100 - rulesPct : 0;
  const state = useProoflineState();

  const byVerdict = new Map<Verdict, number>();
  const byDecision = new Map<DecisionValue, number>();
  for (const entry of state.audit) {
    if (entry.verdict) byVerdict.set(entry.verdict, (byVerdict.get(entry.verdict) ?? 0) + 1);
    byDecision.set(entry.decision, (byDecision.get(entry.decision) ?? 0) + 1);
  }

  const totalDecisions = state.audit.length;

  return (
    <div className="mt-6 space-y-6">
      <p className="text-sm text-muted">
        {rulesPct}% of claims resolved by rules at zero cost · {modelPct}% escalated to the model
      </p>
      {/* 2 Primary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Stat 1: Active facts in register */}
        <div className="rounded-[6px] border border-line-strong bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Active facts in register
            </span>
            <BadgeCheck size={18} className="text-v-supported-fg" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
              {stats.approvedCurrent}
            </span>
            <span className="text-xs text-muted">of {stats.rows} total versions</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Approved and strictly inside their validity window as of{" "}
            <span className="font-mono">{reviewDate}</span>.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-line-strong pt-2 text-[11px] text-muted">
            <span>
              {stats.factIds} fact IDs · {stats.products.join(", ")}
            </span>
            <Link
              href="/facts"
              className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
            >
              Browse register <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Stat 2: Decisions logged */}
        <div className="rounded-[6px] border border-line-strong bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Decisions logged
            </span>
            <ShieldCheck size={18} className="text-slate" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
              {totalDecisions}
            </span>
            <span className="text-xs text-muted">in this browser session</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {totalDecisions > 0
              ? `${byDecision.get("approve") ?? 0} approved · ${byDecision.get("reject") ?? 0} rejected · ${byDecision.get("needs_edit") ?? 0} edit requested`
              : "No decisions recorded yet. Check a draft to log findings."}
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-line-strong pt-2 text-[11px] text-muted">
            <span>Append-only local storage</span>
            {totalDecisions > 0 ? (
              <Link
                href="/audit"
                className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
              >
                View audit log <ArrowRight size={11} />
              </Link>
            ) : (
              <Link
                href="/check"
                className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
              >
                Go to checker <ArrowRight size={11} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Register Health & Review Log */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Register health — from seed */}
        <section aria-labelledby="register-health" className="lg:col-span-3">
          <h2 id="register-health" className="text-sm font-semibold text-foreground">
            Register health <span className="font-normal text-muted">· as of {reviewDate}</span>
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-[6px] border border-line-strong bg-card p-4">
              <Database size={16} aria-hidden="true" className="text-slate" />
              <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {stats.rows}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">
                Fact rows carried by register (all versions)
              </p>
            </div>
            <div className="rounded-[6px] border border-line-strong bg-card p-4">
              <CheckCircle2 size={16} aria-hidden="true" className="text-v-supported-fg" />
              <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {stats.approvedCurrent}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">
                Approved facts inside current validity window
              </p>
            </div>
            <div className="rounded-[6px] border border-line-strong bg-card p-4">
              <AlertTriangle
                size={16}
                aria-hidden="true"
                className={stats.stale > 0 ? "text-v-stale-fg" : "text-slate"}
              />
              <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {stats.stale}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">
                Rows outside validity window or superseded
              </p>
            </div>
            <div className="rounded-[6px] border border-line-strong bg-card p-4">
              <GitCompareArrows
                size={16}
                aria-hidden="true"
                className={stats.conflictingGroups > 0 ? "text-v-contradicted-fg" : "text-slate"}
              />
              <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {stats.conflictingGroups}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">
                Attribute conflicts (disagreeing approved rows)
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            {stats.factIds} fact ids · {stats.products.join(", ")} ·{" "}
            <Link href="/facts" className="font-medium text-accent underline-offset-2 hover:underline">
              browse the register
            </Link>
          </p>
        </section>

        {/* Review Log & Verdict Distribution Bars */}
        <section aria-labelledby="review-log" className="lg:col-span-2">
          <h2 id="review-log" className="text-sm font-semibold text-foreground">
            Your review log <span className="font-normal text-muted">· this browser</span>
          </h2>
          {totalDecisions === 0 ? (
            <div className="mt-3 rounded-[6px] border border-dashed border-line-strong bg-panel/40 p-6 text-center">
              <Inbox size={26} aria-hidden="true" className="mx-auto text-slate" />
              <p className="mt-2 font-semibold text-foreground">No decisions recorded yet.</p>
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
            <div className="mt-3 rounded-[6px] border border-line-strong bg-card p-4 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Decisions by verdict ({totalDecisions} total)
                </p>

                {/* Proportional CSS segmented bar */}
                <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-[2px] bg-panel border border-line">
                  {ALL_VERDICTS.map((v) => {
                    const count = byVerdict.get(v) ?? 0;
                    if (count === 0) return null;
                    const pct = (count / totalDecisions) * 100;
                    return (
                      <div
                        key={v}
                        className="bar-fill"
                        style={{ width: `${pct}%`, backgroundColor: VERDICT_MAP[v].fgColor }}
                        title={`${v}: ${count} (${pct.toFixed(0)}%)`}
                      />
                    );
                  })}
                </div>

                {/* Verdict-by-verdict CSS bar list */}
                <div className="mt-3 space-y-1.5">
                  {ALL_VERDICTS.map((v) => {
                    const count = byVerdict.get(v) ?? 0;
                    const pct = totalDecisions > 0 ? (count / totalDecisions) * 100 : 0;
                    if (count === 0) return null;
                    return (
                      <div key={v} className="flex items-center gap-2 text-[12px]">
                        <span className="w-24 truncate font-mono text-[11px] text-muted">
                          {v.replace("_", " ")}
                        </span>
                        <div className="flex-1 h-1.5 rounded-[2px] bg-panel overflow-hidden border border-line/60">
                          <div
                            style={{ width: `${pct}%`, backgroundColor: VERDICT_MAP[v].fgColor }}
                            className="bar-fill h-full"
                          />
                        </div>
                        <span className="w-6 text-right font-semibold tabular-nums text-foreground">
                          {count}
                        </span>
                        <span className="w-8 text-right font-mono text-[10px] text-muted tabular-nums">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action summary */}
              <div className="border-t border-line pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  What you decided
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["approve", "reject", "needs_edit"] as const).map((d) => {
                    const Icon = d === "approve" ? ThumbsUp : d === "reject" ? ThumbsDown : PencilLine;
                    return (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 py-1 text-[12px] font-medium text-foreground"
                      >
                        <Icon size={12} aria-hidden="true" />
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
    </div>
  );
}
