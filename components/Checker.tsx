"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Wand2,
  RotateCcw,
  ChevronDown,
  ClipboardPaste,
} from "lucide-react";
import type { VerifyResult, Verdict, Finding } from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";
import { FindingCard } from "@/components/FindingCard";
import { MarkedDraft } from "@/components/MarkedDraft";
import { EvidenceDrawer } from "@/components/EvidenceDrawer";
import { useProoflineState } from "@/lib/use-proofline";
import { cn } from "@/lib/utils";

const COLLAPSED_VERDICTS: Verdict[] = ["SUPPORTED", "NOT_CHECKABLE"];

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
      setError("Write or load a draft first — there is nothing to check.");
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
    <div>
      {/* ---- input card ---- */}
      <section className="rounded-[6px] border border-line-strong bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="draft" className="text-sm font-semibold text-foreground">
            Your draft
          </label>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:inline">{draft.trim() ? `${draft.trim().split(/\s+/).length} words` : "empty"}</span>
            <button
              type="button"
              onClick={() => setDraft(sampleDraft)}
              data-testid="load-sample"
              className="btn-proofline-tactile inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 py-1.5 text-xs font-medium text-ink-soft active:scale-[0.97] transition-all duration-micro active:duration-press ease-arrival hover:border-slate"
            >
              <Wand2 size={13} aria-hidden="true" />
              Load sample draft
            </button>
            {draft && (
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setResult(null);
                  setStatus("idle");
                  textareaRef.current?.focus();
                }}
                className="btn-proofline-tactile inline-flex items-center gap-1 text-xs font-medium text-muted active:scale-[0.97] transition-all duration-micro active:duration-press ease-arrival hover:text-foreground"
                aria-label="Clear the draft"
              >
                <RotateCcw size={13} aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          id="draft"
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          placeholder="Paste your launch page, release note, pricing page…"
          className="mt-3 h-48 w-full resize-y rounded-[4px] border border-line-strong bg-background p-4 text-[15px] leading-relaxed placeholder:text-muted focus:border-slate focus:outline-none sm:h-56"
          data-testid="draft-input"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void check()}
            disabled={status === "checking"}
            data-testid="check-button"
            className="btn-proofline-tactile inline-flex h-11 min-w-36 items-center justify-center gap-2 rounded-[4px] bg-accent px-6 text-base font-semibold text-white active:scale-[0.97] transition-all duration-micro active:duration-press ease-arrival hover:bg-accent-hover disabled:opacity-60 disabled:active:scale-100"
          >
            {status === "checking" ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Checking…
              </>
            ) : (
              <>
                <ShieldCheck size={18} aria-hidden="true" />
                Check
              </>
            )}
          </button>
          <kbd className="hidden rounded-[4px] border border-line-strong bg-panel px-2 py-1 text-[11px] text-muted sm:inline">
            ⌘↵ to check · j / k to move
          </kbd>
          <p className="ml-auto text-[12px] text-muted">
            Checked against the register as of <span className="font-mono">{reviewDate}</span>. Nothing you type is stored.
          </p>
        </div>
      </section>

      {/* ---- error ---- */}
      {status === "error" && error && (
        <div role="alert" className="mt-4 flex items-start gap-3 rounded-[6px] border border-v-contradicted-fg/30 bg-v-contradicted-bg p-4 text-sm text-v-contradicted-fg">
          <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">The check could not complete.</p>
            <p className="mt-0.5">{error}</p>
            <p className="mt-1 text-xs opacity-90">Nothing was changed in your register. Press Check again to retry.</p>
          </div>
        </div>
      )}

      {/* ---- empty state ---- */}
      {status === "idle" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { step: "1", title: "Paste a draft", body: "Or load the sample — a launch page seeded with five kinds of problem.", icon: ClipboardPaste },
            { step: "2", title: "Press Check", body: "Rules decide numbers, dates, names and disclaimers. The model only reads what rules cannot.", icon: ShieldCheck },
            { step: "3", title: "Decide on each finding", body: "Approve, reject or request an edit — with a reason. Decisions land in the audit log.", icon: Wand2 },
          ].map(({ step, title, body, icon: Icon }) => (
            <div key={step} className="rounded-[6px] border border-dashed border-line-strong bg-panel/40 p-4">
              <Icon size={18} aria-hidden="true" className="text-slate" />
              <p className="mt-2 text-sm font-semibold">{step}. {title}</p>
              <p className="mt-1 text-[13px] leading-snug text-muted">{body}</p>
            </div>
          ))}
        </div>
      )}

      {/* ---- results ---- */}
      {status === "done" && result && (
        <section className="mt-6" aria-live="polite">
          <div
            className="flex flex-wrap items-center gap-2"
            data-testid="summary"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-semibold">{result.summary.total} findings</p>
            <span className="text-muted" aria-hidden="true">·</span>
            {ALL_VERDICTS.map((v) =>
              result.summary.by_verdict[v] > 0 ? (
                <span key={v} className="rounded-[4px] border border-line-strong bg-panel px-2 py-0.5 text-[11px] font-medium text-foreground">
                  {result.summary.by_verdict[v]} {v.replace("_", " ")}
                </span>
              ) : null,
            )}
            <span className="text-muted" aria-hidden="true">·</span>
            <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2 py-0.5 text-[11px] font-mono text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-v-supported-fg" />
              <span>
                {result.summary.model === 0
                  ? "Rules only (100% deterministic)"
                  : `${result.summary.deterministic} rules (${Math.round((result.summary.deterministic / (result.summary.deterministic + result.summary.model)) * 100)}%) · ${result.summary.model} model`}
              </span>
            </div>
          </div>

          {/* Desktop & Mobile Responsive Layout */}
          <div className="mt-4 grid gap-6 lg:grid-cols-12 items-start">
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
              <div className="mb-3 flex border-b border-line">
                <button
                  type="button"
                  onClick={() => setMobileTab("findings")}
                  className={cn(
                    "pb-2 px-3 text-xs font-semibold transition-colors",
                    mobileTab === "findings"
                      ? "border-b-2 border-slate text-foreground"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  Findings ({result.summary.total})
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("draft")}
                  className={cn(
                    "pb-2 px-3 text-xs font-semibold transition-colors",
                    mobileTab === "draft"
                      ? "border-b-2 border-slate text-foreground"
                      : "text-muted hover:text-foreground"
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
                <div className="rounded-[6px] border border-v-supported-fg/30 bg-v-supported-bg p-5 text-sm text-v-supported-fg">
                  <p className="font-semibold">Nothing blocking.</p>
                  <p className="mt-1 opacity-90">
                    Every checkable claim in this draft matches the register. Review the supported items below before you ship.
                  </p>
                </div>
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
                <details className="mt-4 rounded-[6px] border border-line-strong bg-card">
                  <summary className="flex cursor-pointer items-center gap-2 rounded-t-[6px] px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
                    <ChevronDown size={16} aria-hidden="true" className="transition-transform" />
                    Supported and not checkable ({collapsed.length})
                    <span className="ml-auto text-[11px] font-normal">shown so you can see what passed</span>
                  </summary>
                  <div className="flex flex-col gap-3 border-t border-line p-4">
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
                <p className="mt-4 text-xs text-muted">
                  {decidedCount} decision{decidedCount === 1 ? "" : "s"} recorded in this browser. See{" "}
                  <a className="font-medium text-accent underline underline-offset-2" href="/audit">
                    Audit
                  </a>
                  .
                </p>
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
