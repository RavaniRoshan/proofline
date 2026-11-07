import type { Metadata } from "next";
import { FactsTable } from "@/components/FactsTable";

export const metadata: Metadata = { title: "Fact register" };
export const dynamic = "force-dynamic";

export default function FactsPage() {
  const reviewDate = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <div className="mb-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
            [02] REGISTER GROUND TRUTH
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            42 Registered Facts · Flowdesk Seed
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-balance text-foreground">
          What the brand has approved.
        </h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          Owner-approved product claims, versioned with strict temporal validity windows and character-exact spans. Filter by stale or conflicting claims to test resolution pathways.
        </p>
      </div>
      <FactsTable reviewDate={reviewDate} />
    </div>
  );
}
