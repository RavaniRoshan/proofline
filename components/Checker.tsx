"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Wand2,
  RotateCcw,
  ChevronDown,
  ClipboardPaste,
  Zap,
  Lock,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { VerifyResult, Verdict, Finding } from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";
import { FindingCard } from "@/components/FindingCard";
import { MarkedDraft } from "@/components/MarkedDraft";
import { FaArrowRight } from "react-icons/fa6";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { useProoflineState } from "@/lib/use-proofline";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetBadge } from "@/components/ui/proofline-badge/asset-badge";

const COLLAPSED_VERDICTS: Verdict[] = ["SUPPORTED", "NOT_CHECKABLE"];

function getVerdictAssetBadge(verdict: Verdict) {
  switch (verdict) {
    case "CONTRADICTED":
      return { symbol: "C", verdictBg: "bg-v-contradicted-bg", verdictFg: "text-v-contradicted-fg" };
    case "STALE":
      return { symbol: "S", verdictBg: "bg-v-stale-bg", verdictFg: "text-v-stale-fg" };
    case "CONFLICTING":
      return { symbol: "X", verdictBg: "bg-v-conflicting-bg", verdictFg: "text-v-conflicting-fg" };
    case "UNVERIFIED":
      return { symbol: "U", verdictBg: "bg-v-unverified-bg", verdictFg: "text-v-unverified-fg" };
    case "SUPPORTED":
      return { symbol: "V", verdictBg: "bg-v-supported-bg", verdictFg: "text-v-supported-fg" };
    case "NOT_CHECKABLE":
      return { symbol: "N", verdictBg: "bg-v-notcheckable-bg", verdictFg: "text-v-notcheckable-fg" };
  }
}

export function Checker({ sampleDraft }: { sampleDraft: string }) {
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [selected, setSelected] = useState(0);
  const [drawerFinding, setDrawerFinding] = useState<Finding | null>(null);
  const [mobileTab, setMobileTab] = useState<"findings" | "draft">("findings");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stored = useProoflineState();
  const searchParams = useSearchParams();
  const findingParam = searchParams?.get("finding");

  const reviewDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const selectFinding = useCallback((index: number, findingsList?: Finding[]) => {
    setSelected(index);
    const list = findingsList ?? result?.findings;
    if (list && list[index]) {
      const f = list[index];
      const url = new URL(window.location.href);
      url.searchParams.set("finding", f.id);
      window.history.replaceState(null, "", url.toString());
    }
  }, [result]);

  const check = useCallback(async () => {
    const text = draft.trim();
    if (text.length < 3) {
      setError("Write or load a draft first, there is nothing to check.");
      setStatus("error");
      return;
    }
    setStatus("checking");
    setError(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          draft: text,
          review_date: reviewDate,
          register_overrides: stored.fact_overrides,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `The check failed (HTTP ${res.status}).`);
      }
      const data = (await res.json()) as VerifyResult;
      setResult(data);
      setSelected(0);
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }, [draft, reviewDate, stored.fact_overrides]);

  // Sync selected finding with deep-linked ?finding=<id> parameter
  useEffect(() => {
    if (!findingParam || !result?.findings.length) return;
    const targetIdx = result.findings.findIndex(
      (f) =>
        f.id.toLowerCase() === findingParam.toLowerCase() ||
        f.evidence?.fact_id.toLowerCase() === findingParam.toLowerCase(),
    );
    if (targetIdx !== -1) {
      setTimeout(() => setSelected(targetIdx), 0);
    }
  }, [findingParam, result]);

  // Cmd/Ctrl+Enter runs a check; j/k move between findings.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        void check();
        return;
      }
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      const n = result?.findings.length ?? 0;
      if (n === 0) return;
      if (e.key === "j") {
        setSelected((s) => {
          const next = Math.min(n - 1, s + 1);
          selectFinding(next);
          return next;
        });
      } else if (e.key === "k") {
        setSelected((s) => {
          const prev = Math.max(0, s - 1);
          selectFinding(prev);
          return prev;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [check, result, selectFinding]);

  // Keep the selected card in view.
  useEffect(() => {
    document
      .querySelector(`[data-testid="finding"][data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  const findings = result?.findings ?? [];
  const actionable = findings.filter((f) => !COLLAPSED_VERDICTS.includes(f.verdict));
  const collapsed = findings.filter((f) => COLLAPSED_VERDICTS.includes(f.verdict));

  const decidedCount = Object.keys(stored.decisions).length;

  return (
    <div className="space-y-5">
      {/* =========================================================================
          1. TOP ENTERPRISE STATUS RIBBON
          ========================================================================= */}
      <Card className="p-3.5 sm:p-4 shadow-xs border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1F5C43] animate-pulse" />
              <span className="font-semibold text-foreground">Preflight Engine:</span>
              <span className="rounded-full bg-v-supported-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-v-supported-fg border border-v-supported-border">
                Ready · Stage 1–4 Pipeline
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-muted-foreground">Ruleset:</span>
              <span className="font-medium text-foreground">78% Fast-Path Deterministic</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-muted-foreground">Active Window:</span>
              <span className="font-mono text-foreground">{reviewDate} → Active</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Boundary:</span>
              <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                Zero DB Writes
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDraft(sampleDraft)}
              className="h-8 gap-1.5 rounded-full px-4 font-mono text-xs text-foreground hover:border-foreground/40 transition-colors"
            >
              <Wand2 size={12} />
              <span>Load Sample Draft</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          2. PREFLIGHT TELEMETRY STAT CARDS (4 Tone-Badged High-Density Cards)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fast-Path Rule Latency */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rule Resolution
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#8B1E27]/10 text-[#8B1E27] dark:text-[#D4847A]">
              <Zap size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              0.4ms
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Stage 1 Pure TS
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Exact lookup for pricing, dates &amp; quotas at $0 LLM cost
          </p>
        </Card>

        {/* Card 2: Deterministic Fast-Path Ratio */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Deterministic Ratio
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#1F5C43]/10 text-[#1F5C43]">
              <Layers size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              78%
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Fast-path target
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Only qualitative marketing claims route to bounded model
          </p>
        </Card>

        {/* Card 3: Bounded Context Budget */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bounded Budget
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              ≤ 5
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Candidate facts
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Lexical top-5 retrieval eliminates model hallucination space
          </p>
        </Card>

        {/* Card 4: Evidence Gate Guarantee */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Evidence Gate
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              6-Field
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Invariant Law
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            No CONTRADICTED ships without document span and fact version
          </p>
        </Card>
      </section>

      {/* =========================================================================
          3. DRAFT INPUT CARD (Web3-inspired Container)
          ========================================================================= */}
      <Card className="shadow-xs border border-border bg-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
          <div>
            <CardTitle className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Candidate Draft Copy
            </CardTitle>
            <CardDescription className="text-[11px] mt-0.5">
              Paste marketing briefs, pricing announcements, SLA terms, or release notes
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[11px]">
              {draft.trim() ? `${draft.trim().split(/\s+/).length} words` : "Empty buffer"}
            </Badge>
            {draft && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraft("");
                  setResult(null);
                  setStatus("idle");
                  textareaRef.current?.focus();
                }}
                className="h-7 px-2 text-xs font-mono text-muted-foreground hover:text-foreground"
                aria-label="Clear the draft"
              >
                <RotateCcw size={12} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <textarea
            id="draft"
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            maxLength={4000}
            placeholder="Paste candidate copy here: e.g. Flowdesk pricing starts at $4,999/mo with 99.99% uptime…"
            className="h-44 w-full resize-y rounded-lg border border-border bg-background p-4 font-sans text-sm leading-relaxed placeholder:text-muted-foreground focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent transition-colors sm:h-52"
            data-testid="draft-input"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => void check()}
                disabled={status === "checking"}
                data-testid="check-button"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#8B1E27] py-2 pr-2.5 pl-5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-colors transition-transform duration-200 hover:bg-[#8B1E27]/90 active:scale-[0.98] cursor-pointer"
              >
                {status === "checking" ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" aria-hidden="true" />
                    <span>Executing Pipeline…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} className="text-white" aria-hidden="true" />
                    <span>Run Preflight Check</span>
                    <span className="flex size-6 items-center justify-center rounded-full bg-black/20 text-white">
                      <FaArrowRight className="size-2.5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </>
                )}
              </Button>

              <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-muted/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                ⌘↵ to check · j / k to navigate
              </kbd>
            </div>

            <p className="font-mono text-[11px] text-muted-foreground">
              Checked against register as of <span className="font-semibold text-foreground">{reviewDate}</span>. Zero server retention.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          4. ERROR STATE
          ========================================================================= */}
      {status === "error" && error && (
        <Card className="border-v-contradicted-border bg-v-contradicted-bg p-4 text-xs text-v-contradicted-fg">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold font-mono text-sm">The check could not complete</p>
              <p className="mt-0.5">{error}</p>
              <p className="mt-1 font-mono text-[11px] opacity-90">
                Nothing was changed in your register. Adjust your draft and press Run Preflight Check again.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* =========================================================================
          5. IDLE STATE GUIDANCE CARDS
          ========================================================================= */}
      {status === "idle" && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Draft Ingestion",
              body: "Paste candidate copy or load the Flowdesk sample draft seeded with pricing and SLA contradictions.",
              icon: ClipboardPaste,
            },
            {
              step: "02",
              title: "Deterministic Execution",
              body: "Stage 1 TypeScript rules evaluate numbers and dates with <1ms latency. Bounded model handles nuances.",
              icon: ShieldCheck,
            },
            {
              step: "03",
              title: "Append-Only Audit Journal",
              body: "Approve, reject or request an edit on each finding. Every human judgment is signed with SHA-256.",
              icon: Wand2,
            },
          ].map(({ step, title, body, icon: Icon }) => (
            <Card key={step} className="p-4 sm:p-5 border-dashed border-border/80 bg-card/60">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#8B1E27] dark:text-[#D4847A]">
                  STAGE {step}
                </span>
                <Icon size={16} aria-hidden="true" className="text-muted-foreground/80" />
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </Card>
          ))}
        </div>
      )}

      {/* =========================================================================
          6. PIPELINE RESULTS VIEW
          ========================================================================= */}
      {status === "done" && result && (
        <section className="space-y-4" aria-live="polite">
          {/* Results Summary Bar */}
          <Card className="p-3.5 sm:p-4 shadow-xs border border-border">
            <div
              className="flex flex-wrap items-center justify-between gap-3 text-xs"
              data-testid="summary"
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-foreground">
                  {result.summary.total} Findings Evaluated
                </span>
                <span className="text-border" aria-hidden="true">·</span>

                {ALL_VERDICTS.map((v) => {
                  const count = result.summary.by_verdict[v];
                  if (!count) return null;
                  const asset = getVerdictAssetBadge(v);
                  return (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-medium text-foreground"
                    >
                      <AssetBadge symbol={asset.symbol} verdictBg={asset.verdictBg} verdictFg={asset.verdictFg} size="sm" />
                      <span>{count} {v.replace("_", " ")}</span>
                    </span>
                  );
                })}
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full bg-[#1F5C43] animate-pulse" />
                <span>
                  {result.summary.model === 0
                    ? "100% Deterministic Fast-Path"
                    : `${result.summary.deterministic} rules (${Math.round((result.summary.deterministic / (result.summary.deterministic + result.summary.model)) * 100)}%) · ${result.summary.model} bounded model`}
                </span>
              </div>
            </div>
          </Card>

          {/* Desktop & Mobile Responsive Split Stage */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Desktop Left: Sticky Marked Draft */}
            <div className="hidden lg:block lg:col-span-5 sticky top-20">
              <MarkedDraft
                draft={draft}
                findings={result.findings}
                selectedFindingId={
                  selected < actionable.length
                    ? actionable[selected]?.id ?? null
                    : collapsed[selected - actionable.length]?.id ?? null
                }
                onSelectFinding={(f) => {
                  const actIdx = actionable.findIndex((x) => x.id === f.id);
                  if (actIdx !== -1) {
                    selectFinding(actIdx);
                  } else {
                    const colIdx = collapsed.findIndex((x) => x.id === f.id);
                    if (colIdx !== -1) selectFinding(actionable.length + colIdx);
                  }
                }}
              />
            </div>

            {/* Mobile View Switcher */}
            <div className="lg:hidden w-full">
              <div className="mb-3 flex border-b border-border">
                <button
                  type="button"
                  onClick={() => setMobileTab("findings")}
                  className={cn(
                    "pb-2 px-3 font-mono text-xs font-semibold transition-colors cursor-pointer",
                    mobileTab === "findings"
                      ? "border-b-2 border-[#8B1E27] text-foreground dark:border-[#D4847A]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Findings ({result.summary.total})
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("draft")}
                  className={cn(
                    "pb-2 px-3 font-mono text-xs font-semibold transition-colors cursor-pointer",
                    mobileTab === "draft"
                      ? "border-b-2 border-[#8B1E27] text-foreground dark:border-[#D4847A]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Marked Draft
                </button>
              </div>

              {mobileTab === "draft" && (
                <div className="mb-4">
                  <MarkedDraft
                    draft={draft}
                    findings={result.findings}
                    selectedFindingId={
                      selected < actionable.length
                        ? actionable[selected]?.id ?? null
                        : collapsed[selected - actionable.length]?.id ?? null
                    }
                    onSelectFinding={(f) => {
                      const actIdx = actionable.findIndex((x) => x.id === f.id);
                      if (actIdx !== -1) {
                        selectFinding(actIdx);
                      } else {
                        const colIdx = collapsed.findIndex((x) => x.id === f.id);
                        if (colIdx !== -1) selectFinding(actionable.length + colIdx);
                      }
                      setMobileTab("findings");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Right: Findings List */}
            <div
              className={cn("flex flex-col gap-3 lg:col-span-7", mobileTab === "draft" && "hidden lg:flex")}
              data-testid="findings-list"
            >
              {actionable.length === 0 ? (
                <Card className="border-v-supported-border bg-v-supported-bg p-5 text-sm text-v-supported-fg">
                  <p className="font-semibold font-mono">Zero Contradictions Detected</p>
                  <p className="mt-1 opacity-90 text-xs">
                    Every checkable claim in this draft matches what the register approves. Review the verified items below before release.
                  </p>
                </Card>
              ) : (
                actionable.map((f, i) => (
                  <FindingCard
                    key={f.id}
                    finding={f}
                    index={i}
                    selected={i === selected}
                    decision={stored.decisions[f.id] ?? null}
                    onViewEvidence={(finding) => setDrawerFinding(finding)}
                    onSelect={(idx) => selectFinding(idx)}
                  />
                ))
              )}

              {collapsed.length > 0 && (
                <details className="mt-3 rounded-xl border border-border bg-card">
                  <summary className="flex cursor-pointer items-center gap-2 rounded-t-xl px-4 py-3 font-mono text-xs font-medium text-muted-foreground hover:text-foreground">
                    <ChevronDown size={15} aria-hidden="true" className="transition-transform" />
                    <span>Supported and Not Checkable ({collapsed.length})</span>
                    <span className="ml-auto text-[11px] font-normal text-muted-foreground/80">
                      verified assertions passed
                    </span>
                  </summary>
                  <div className="flex flex-col gap-3 border-t border-border/60 p-4">
                    {collapsed.map((f, i) => (
                      <FindingCard
                        key={f.id}
                        finding={f}
                        index={actionable.length + i}
                        selected={actionable.length + i === selected}
                        decision={stored.decisions[f.id] ?? null}
                        onViewEvidence={(finding) => setDrawerFinding(finding)}
                        onSelect={(idx) => selectFinding(idx)}
                      />
                    ))}
                  </div>
                </details>
              )}

              {decidedCount > 0 && (
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
                  <span className="font-mono">
                    {decidedCount} human decision{decidedCount === 1 ? "" : "s"} logged in this session.
                  </span>
                  <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-mono text-accent-brand dark:text-accent-readable">
                    <Link href="/audit">
                      <span>Inspect Audit Journal</span>
                      <ArrowRight size={12} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Drawer */}
          <EvidenceDrawer
            finding={drawerFinding}
            open={!!drawerFinding}
            onClose={() => setDrawerFinding(null)}
          />
        </section>
      )}
    </div>
  );
}
