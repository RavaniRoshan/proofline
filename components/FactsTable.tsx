"use client";

import { useState, useMemo } from "react";
import { registerRows } from "@/lib/register";
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
  Hash,
} from "lucide-react";

type Filter = "all" | "stale" | "conflicting";

const FILTERS: Array<{ id: Filter; label: string; icon: typeof LayoutGrid }> = [
  { id: "all", label: "All facts", icon: LayoutGrid },
  { id: "stale", label: "Stale", icon: AlertTriangle },
  { id: "conflicting", label: "Conflicting", icon: GitCompareArrows },
];

function humanize(attribute: string): string {
  return attribute.replace(/_/g, " ");
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

  return (
    <section className="mt-5 space-y-4">
      <p className="max-w-2xl text-[15px] text-muted">
        {rows.length} fact rows across {new Set(rows.map((r) => r.fact_id)).size} fact ids — every
        row versioned, with validity windows. Only{" "}
        <span className="font-semibold text-foreground">approved</span> facts are checkable.
        Reviewed as of <span className="font-mono">{reviewDate}</span>.
      </p>
      {/* Controls row: Search + Filter Pills */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, attribute, value..."
            className="h-9 w-full rounded-[4px] border border-line-strong bg-paper pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted focus:border-slate focus:outline-none"
            aria-label="Search register facts"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter facts">
          {FILTERS.map(({ id, label, icon: Icon }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(id)}
                data-testid={`filter-${id}`}
                className={`inline-flex h-9 items-center gap-1.5 rounded-[4px] border px-3 text-[13px] font-medium transition-colors ${
                  active
                    ? "border-slate bg-slate text-white"
                    : "border-line-strong bg-panel text-ink-soft hover:border-slate hover:text-foreground"
                }`}
              >
                <Icon size={13} aria-hidden="true" />
                {label}
                <span className={active ? "text-white/80" : "text-muted"}>{counts[id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted">
        <span>
          Showing {filtered.length} of {rows.length} rows
          {query && ` matching "${query}"`}
        </span>
        <span className="hidden sm:inline">
          Amber = outside validity window · Plum = two approved facts disagree
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-line-strong bg-panel/40 p-8 text-center text-sm">
          <p className="font-semibold text-foreground">
            {query
              ? "No matching facts found."
              : filter === "stale"
                ? "No stale facts."
                : "No conflicting facts."}
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted">
            {query
              ? "Try adjusting your search query or clear the filter."
              : filter === "stale"
                ? "Every approved fact is inside its validity window right now. That is what a maintained register looks like."
                : "No two approved facts currently disagree on the same attribute. That is what a maintained register looks like."}
          </p>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 inline-flex h-8 items-center rounded-[4px] border border-line-strong bg-paper px-3 text-xs font-medium text-foreground hover:border-slate"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[6px] border border-line-strong bg-card">
          <table className="w-full min-w-200 border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-line-strong bg-panel/70 text-[11px] uppercase tracking-wide text-muted">
                <th className="w-8 px-2 py-2.5"></th>
                <th className="px-3 py-2.5 font-semibold">Fact</th>
                <th className="px-3 py-2.5 font-semibold">Plan</th>
                <th className="px-3 py-2.5 font-semibold">Attribute</th>
                <th className="px-3 py-2.5 font-semibold">Approved value</th>
                <th className="px-3 py-2.5 font-semibold">Validity</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Approved by</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const rowKey = `${f.fact_id}-v${f.version}`;
                const isExpanded = expandedKey === rowKey;
                return (
                  <tr
                    key={rowKey}
                    className={`group border-b border-line/60 align-top transition-colors last:border-0 hover:bg-panel/40 ${
                      f.conflict
                        ? "bg-v-conflicting-bg/40"
                        : f.stale
                          ? "bg-v-stale-bg/40"
                          : ""
                    }`}
                  >
                    <td className="px-2 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleRow(rowKey)}
                        className="rounded-[4px] p-0.5 text-muted transition-colors hover:bg-panel hover:text-foreground"
                        aria-label={isExpanded ? "Collapse row details" : "Expand row details"}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[12px]">
                      <button
                        type="button"
                        onClick={() => toggleRow(rowKey)}
                        className="text-left font-semibold text-foreground hover:underline"
                      >
                        {f.fact_id}
                      </button>
                      <span className="text-muted"> v{f.version}</span>
                    </td>
                    <td className="px-3 py-2.5 text-foreground/90">{f.productName}</td>
                    <td className="px-3 py-2.5 font-medium">{humanize(f.attribute)}</td>
                    <td className="max-w-72 px-3 py-2.5 text-foreground/90">
                      {f.display_value || String(f.value)}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-muted">
                      {f.valid_from} →<br />
                      {f.valid_until}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex rounded-[4px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          f.status === "approved"
                            ? "border-v-supported-fg/30 bg-v-supported-bg text-v-supported-fg"
                            : f.status === "superseded"
                              ? "border-v-stale-fg/30 bg-v-stale-bg text-v-stale-fg"
                              : "border-line-strong bg-panel text-ink-soft"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted">{f.approved_by}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Expanded row detail sheet if a row is selected */}
      {expandedKey && (
        (() => {
          const activeFact = rows.find((r) => `${r.fact_id}-v${r.version}` === expandedKey);
          if (!activeFact) return null;
          return (
            <div className="rounded-[6px] border border-line-strong bg-panel/50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {activeFact.fact_id}
                    </span>
                    <span className="rounded-[4px] border border-line-strong bg-paper px-1.5 py-0.5 font-mono text-xs text-muted">
                      version {activeFact.version}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {activeFact.productName} · {humanize(activeFact.attribute)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground">
                    <span className="font-semibold text-muted">Approved value: </span>
                    <span className="font-medium text-foreground">
                      {activeFact.display_value || String(activeFact.value)}
                    </span>
                    {activeFact.unit && activeFact.unit !== "raw" && (
                      <span className="ml-1 text-xs text-muted">({activeFact.unit})</span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedKey(null)}
                  className="rounded-[4px] border border-line-strong bg-paper px-2 py-1 text-xs text-muted hover:border-slate hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-line-strong pt-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-slate" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Source Document</p>
                    <p className="font-mono text-foreground">{activeFact.source_document_id}</p>
                    <p className="text-[10px] text-muted">
                      Span: [{activeFact.source_span[0]}, {activeFact.source_span[1]}]
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Validity Window</p>
                    <p className="font-mono text-foreground">
                      {activeFact.valid_from} to {activeFact.valid_until}
                    </p>
                    {activeFact.stale && (
                      <p className="text-[10px] font-semibold text-v-stale-fg">
                        Outside validity window (stale)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UserCheck size={14} className="text-slate" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted">Approval Status</p>
                    <p className="font-medium text-foreground">
                      {activeFact.status} by {activeFact.approved_by}
                    </p>
                    {activeFact.conflict && (
                      <p className="text-[10px] font-semibold text-v-conflicting-fg">
                        Contradicted by another approved row
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {activeFact.status === "approved" && (
                <ApproveFactVersion
                  row={activeFact}
                  reviewDate={reviewDate}
                  onApproved={(newRowKey) => setExpandedKey(newRowKey)}
                />
              )}
            </div>
          );
        })()
      )}
    </section>
  );
}
