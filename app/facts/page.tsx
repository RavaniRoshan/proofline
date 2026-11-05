import type { Metadata } from "next";
import { registerRows } from "@/lib/register";
import { FactsTable } from "@/components/FactsTable";

export const metadata: Metadata = { title: "Fact register" };
export const dynamic = "force-dynamic";

export default function FactsPage() {
  const reviewDate = new Date().toISOString().slice(0, 10);
  const rows = registerRows(reviewDate);
  const staleCount = rows.filter((r) => r.stale).length;
  const conflictCount = rows.filter((r) => r.conflict).length;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        Fact register
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">What the brand has approved.</h1>
      <p className="mt-1.5 max-w-2xl text-[15px] text-muted">
        {rows.length} fact rows across {new Set(rows.map((r) => r.fact_id)).size} fact ids — every row
        versioned, with validity windows. Only <span className="font-semibold text-foreground">approved</span> facts
        are checkable. Reviewed as of <span className="font-mono">{reviewDate}</span>.
      </p>
      <FactsTable rows={rows} staleCount={staleCount} conflictCount={conflictCount} />
    </div>
  );
}
