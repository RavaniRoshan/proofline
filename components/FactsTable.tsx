"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { registerRows, type FactRow } from "@/lib/register";
import { mergeLocalFacts } from "@/lib/seed";
import { useProoflineState } from "@/lib/use-proofline";
import { ApproveFactVersion } from "@/components/ApproveFactVersion";
import {
  AlertTriangle,
  GitCompareArrows,
  LayoutGrid,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Calendar,
  UserCheck,
  Download,
  Layers,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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

type Filter = "all" | "stale" | "conflicting";

const FILTERS: Array<{ id: Filter; label: string; icon: typeof LayoutGrid }> = [
  { id: "all", label: "All facts", icon: LayoutGrid },
  { id: "stale", label: "Stale", icon: AlertTriangle },
  { id: "conflicting", label: "Conflicting", icon: GitCompareArrows },
];

function humanize(attribute: string): string {
  return attribute.replace(/_/g, " ");
}

function getPlanColor(productName: string): string {
  const n = productName.toLowerCase();
  if (n.includes("starter")) return "bg-v-contradicted-bg text-v-contradicted-fg";
  if (n.includes("growth")) return "bg-v-supported-bg text-v-supported-fg";
  if (n.includes("enterprise")) return "bg-v-conflicting-bg text-v-conflicting-fg";
  return "bg-v-stale-bg text-v-stale-fg";
}

export function FactsTable({ reviewDate }: { reviewDate: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const state = useProoflineState();

  // Seed register with locally approved overrides applied (proofline.v1).
  const rows = useMemo(
    () => registerRows(reviewDate, mergeLocalFacts(state.fact_overrides)),
    [reviewDate, state.fact_overrides],
  );
  const staleCount = rows.filter((r) => r.stale).length;
  const conflictCount = rows.filter((r) => r.conflict).length;

  const counts: Record<Filter, number> = {
    all: rows.length,
    stale: staleCount,
    conflicting: conflictCount,
  };

  const filtered = useMemo(() => {
    let result = rows;
    if (filter === "stale") {
      result = result.filter((r) => r.stale);
    } else if (filter === "conflicting") {
      result = result.filter((r) => r.conflict);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.fact_id.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.attribute.toLowerCase().includes(q) ||
          String(r.value).toLowerCase().includes(q) ||
          (r.display_value && r.display_value.toLowerCase().includes(q)) ||
          r.approved_by.toLowerCase().includes(q),
      );
    }
    return result;
  }, [rows, filter, query]);

  function toggleRow(key: string) {
    setExpandedKey((prev) => (prev === key ? null : key));
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proofline-register-${reviewDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

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
              <span className="font-semibold text-foreground">Register Status:</span>
              <span className="rounded-full bg-v-supported-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-v-supported-fg border border-v-supported-border">
                {rows.length} Active Truth Anchors
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-muted-foreground">Scope:</span>
              <span className="font-medium text-foreground">
                Starter, Growth, Enterprise
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-muted-foreground">Temporal Window:</span>
              <span className="font-mono text-foreground">{reviewDate} → Active</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Health:</span>
              <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                {conflictCount === 0 && staleCount === 0
                  ? "Zero Drift"
                  : `${staleCount} Stale · ${conflictCount} Conflicts`}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadJSON}
              className="h-8 gap-1.5 rounded-full px-3.5 font-mono text-xs text-foreground hover:border-foreground/40 transition-colors"
            >
              <Download size={13} />
              <span>Export JSON</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          2. REGISTER TELEMETRY STAT CARDS (4 Tone-Badged High-Density Cards)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Facts */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Approved Facts
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#1F5C43]/10 text-[#1F5C43]">
              <Layers size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {rows.length}
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              100% Ingested
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Set(rows.map((r) => r.fact_id)).size} unique IDs across Flowdesk v1–v4
          </p>
        </Card>

        {/* Card 2: Deterministic Rules Ratio */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Deterministic Rules
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#8B1E27]/10 text-[#8B1E27] dark:text-[#D4847A]">
              <Zap size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              78%
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              33 / 42 rules
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Prices, quotas &amp; dates resolve in pure TypeScript at 0ms LLM cost
          </p>
        </Card>

        {/* Card 3: Temporal Validity */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Temporal Validity
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {staleCount === 0 ? "100%" : `${Math.round(((rows.length - staleCount) / rows.length) * 100)}%`}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {staleCount === 0 ? "All in-window" : `${staleCount} stale`}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Strict start &amp; expiration calendar windows enforced at runtime
          </p>
        </Card>

        {/* Card 4: Specification Drift */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Specification Drift
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {conflictCount === 0 ? "0" : conflictCount}
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {conflictCount === 0 ? "Single Truth" : "Disagreement"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Cross-product attribute consistency checked against register invariant
          </p>
        </Card>
      </section>

      {/* =========================================================================
          3. CONTROLS TOPBAR (Search + Filter Tabs)
          ========================================================================= */}
      <Card className="p-3 sm:p-4 shadow-xs border border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, attribute, value, or plan..."
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent transition-colors"
              aria-label="Search register facts"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter facts">
            {FILTERS.map(({ id, label, icon: Icon }) => {
              const active = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(id)}
                  data-testid={`filter-${id}`}
                  className={`btn-proofline-tactile inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "border-[#8B1E27] bg-[#8B1E27] text-white dark:border-[#D4847A] dark:bg-[#D4847A] dark:text-slate-950 font-semibold shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <Icon size={13} aria-hidden="true" />
                  <span>{label}</span>
                  <span
                    className={`ml-1 font-mono text-[11px] rounded-full px-1.5 py-0.5 ${
                      active
                        ? "bg-white/20 text-white dark:bg-black/20 dark:text-slate-950"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {counts[id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2.5">
          <span className="font-mono">
            Showing {filtered.length} of {rows.length} registered facts
            {query && ` matching "${query}"`}
          </span>
          <span className="hidden sm:inline font-mono">
            Amber = outside validity window · Plum = two approved facts disagree
          </span>
        </div>
      </Card>

      {/* =========================================================================
          4. FACTS TABLE CARD (Web3-inspired AssetTableCard Primitive)
          ========================================================================= */}
      {filtered.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-border/80">
          <p className="font-semibold text-foreground text-sm">
            {query
              ? "No matching facts found."
              : filter === "stale"
                ? "No stale facts."
                : "No conflicting facts."}
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            {query
              ? "Try adjusting your search query or clear the filter."
              : filter === "stale"
                ? "Every approved fact is inside its validity window right now. That is what a maintained register looks like."
                : "No two approved facts currently disagree on the same attribute. That is what a maintained register looks like."}
          </p>
          {query && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setQuery("")}
              className="mt-3 font-mono text-xs"
            >
              Clear search
            </Button>
          )}
        </Card>
      ) : (
        <Card className="shadow-xs border border-border overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <div>
              <CardTitle className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ground Truth Register Ledger
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                Versioned claims enforced by Stage 1 deterministic rules and Stage 2 lexical retriever
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[11px]">
              {filtered.length} Facts Ready
            </Badge>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full min-w-200 border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="w-8 px-2 py-3 text-center"></th>
                  <th className="px-3 py-3 font-semibold">Fact ID</th>
                  <th className="px-3 py-3 font-semibold">Plan Scope</th>
                  <th className="px-3 py-3 font-semibold">Attribute</th>
                  <th className="px-3 py-3 font-semibold">Approved Value</th>
                  <th className="px-3 py-3 font-semibold">Validity Window</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((f) => {
                  const rowKey = `${f.fact_id}-v${f.version}`;
                  const isExpanded = expandedKey === rowKey;
                  const planColor = getPlanColor(f.productName);

                  return (
                    <tr
                      key={rowKey}
                      className={`group align-top transition-colors hover:bg-muted/30 ${
                        f.conflict
                          ? "bg-v-conflicting-bg/40"
                          : f.stale
                            ? "bg-v-stale-bg/40"
                            : ""
                      }`}
                    >
                      {/* Expand Button */}
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleRow(rowKey)}
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                          aria-label={isExpanded ? "Collapse row details" : "Expand row details"}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      </td>

                      {/* Fact ID with AssetBadge */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <AssetBadge
                            symbol={f.fact_id.replace("F-", "")}
                            color={planColor}
                            size="sm"
                          />
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleRow(rowKey)}
                              className="text-left font-mono font-semibold text-foreground hover:underline cursor-pointer"
                            >
                              {f.fact_id}
                            </button>
                            <span className="font-mono text-[11px] text-muted-foreground block">
                              v{f.version}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-medium text-foreground">
                          {f.productName}
                        </span>
                      </td>

                      {/* Attribute */}
                      <td className="px-3 py-3 font-medium text-foreground">
                        {humanize(f.attribute)}
                      </td>

                      {/* Approved Value */}
                      <td className="max-w-72 px-3 py-3">
                        <span className="rounded bg-muted/40 px-2 py-0.5 font-mono text-xs font-semibold text-foreground border border-border/50">
                          {f.display_value || String(f.value)}
                        </span>
                      </td>

                      {/* Validity */}
                      <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} className="text-muted-foreground/70" />
                          <span>{f.valid_from} → {f.valid_until}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide ${
                            f.status === "approved"
                              ? "border-v-supported-border bg-v-supported-bg text-v-supported-fg"
                              : f.status === "superseded"
                                ? "border-v-stale-border bg-v-stale-bg text-v-stale-fg"
                                : "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {f.status === "approved" ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          <span>{f.status}</span>
                        </span>
                      </td>

                      {/* Approved By */}
                      <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                        {f.approved_by}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* =========================================================================
          5. EXPANDED DETAIL DRAWER (Web3-Styled Row Inspector)
          ========================================================================= */}
      {expandedKey && (
        (() => {
          const activeFact = rows.find((r) => `${r.fact_id}-v${r.version}` === expandedKey);
          if (!activeFact) return null;
          const planColor = getPlanColor(activeFact.productName);

          return (
            <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AssetBadge
                    symbol={activeFact.fact_id.replace("F-", "")}
                    color={planColor}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-foreground">
                        {activeFact.fact_id}
                      </span>
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                        version {activeFact.version}
                      </span>
                      <span className="rounded-full bg-muted/60 px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                        {activeFact.productName}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Attribute: <span className="font-semibold text-foreground">{humanize(activeFact.attribute)}</span>
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedKey(null)}
                  className="h-7 text-xs font-mono"
                >
                  Close
                </Button>
              </div>

              <div className="mt-4 rounded-lg border border-border/80 bg-muted/30 p-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Approved Ground Truth Value
                </span>
                <p className="font-mono text-sm font-bold text-foreground">
                  {activeFact.display_value || String(activeFact.value)}
                  {activeFact.unit && activeFact.unit !== "raw" && (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">({activeFact.unit})</span>
                  )}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-border/60 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <FileText size={16} className="text-[#8B1E27] dark:text-[#D4847A] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Source Document
                    </p>
                    <p className="font-mono font-medium text-foreground mt-0.5">
                      {activeFact.source_document_id}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      Span: [{activeFact.source_span[0]}, {activeFact.source_span[1]}]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Validity Window
                    </p>
                    <p className="font-mono font-medium text-foreground mt-0.5">
                      {activeFact.valid_from} → {activeFact.valid_until}
                    </p>
                    {activeFact.stale && (
                      <p className="text-[11px] font-semibold text-v-stale-fg">
                        Outside validity window (stale)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <UserCheck size={16} className="text-[#1F5C43] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Approval Authority
                    </p>
                    <p className="font-mono font-medium text-foreground mt-0.5">
                      {activeFact.approved_by}
                    </p>
                    <p className="text-[11px] text-muted-foreground capitalize">
                      Status: {activeFact.status}
                    </p>
                    {activeFact.conflict && (
                      <p className="text-[11px] font-semibold text-v-conflicting-fg">
                        Contradicted by another approved row
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {activeFact.status === "approved" && (
                <div className="mt-4 border-t border-border/60 pt-3">
                  <ApproveFactVersion
                    row={activeFact}
                    reviewDate={reviewDate}
                    onApproved={(newRowKey) => setExpandedKey(newRowKey)}
                  />
                </div>
              )}
            </Card>
          );
        })()
      )}
    </div>
  );
}
