"use client";

import { useState } from "react";
import type { FactRow } from "@/lib/register";
import { AlertTriangle, GitCompareArrows, LayoutGrid } from "lucide-react";

type Filter = "all" | "stale" | "conflicting";

const FILTERS: Array<{ id: Filter; label: string; icon: typeof LayoutGrid }> = [
  { id: "all", label: "All facts", icon: LayoutGrid },
  { id: "stale", label: "Stale", icon: AlertTriangle },
  { id: "conflicting", label: "Conflicting", icon: GitCompareArrows },
];

function humanize(attribute: string): string {
  return attribute.replace(/_/g, " ");
}

export function FactsTable({
  rows,
  staleCount,
  conflictCount,
}: {
  rows: FactRow[];
  staleCount: number;
  conflictCount: number;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const counts: Record<Filter, number> = {
    all: rows.length,
    stale: staleCount,
    conflicting: conflictCount,
  };
  const visible =
    filter === "all"
      ? rows
      : rows.filter((r) => (filter === "stale" ? r.stale : r.conflict));

  return (
    <section className="mt-5">
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
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-card text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              {label}
              <span className={active ? "text-white/80" : "text-muted"}>{counts[id]}</span>
            </button>
          );
        })}
        <p className="ml-auto text-[11px] text-muted">
          Amber = outside its validity window · Orange = two approved facts disagree
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-line bg-card/50 p-6 text-sm">
          <p className="font-semibold">
            {filter === "stale" ? "No stale facts." : "No conflicting facts."}
          </p>
          <p className="mt-1 text-muted">
            {filter === "stale"
              ? "Every approved fact is inside its validity window right now. That is what a maintained register looks like."
              : "No two approved facts currently disagree on the same attribute. That is what a maintained register looks like."}
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full min-w-200 border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-background text-[11px] uppercase tracking-wide text-muted">
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
              {visible.map((f) => (
                <tr
                  key={`${f.fact_id}-v${f.version}`}
                  className={`border-b border-line/60 align-top last:border-0 ${
                    f.conflict ? "bg-orange-50/60" : f.stale ? "bg-amber-50/60" : ""
                  }`}
                >
                  <td className="px-3 py-2.5 font-mono text-[12px]">
                    {f.fact_id}
                    <span className="text-muted"> v{f.version}</span>
                  </td>
                  <td className="px-3 py-2.5">{f.productName}</td>
                  <td className="px-3 py-2.5">{humanize(f.attribute)}</td>
                  <td className="max-w-72 px-3 py-2.5 text-foreground/90">{f.display_value || f.value}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-muted">
                    {f.valid_from} →<br />{f.valid_until}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        f.status === "approved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : f.status === "superseded"
                            ? "border-amber-200 bg-amber-50 text-amber-900"
                            : "border-zinc-200 bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-muted">{f.approved_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
