import { Suspense } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Checker } from "@/components/Checker";

export const metadata = {
  title: "Check a draft",
};

export default function CheckPage() {
  const sampleDraft = readFileSync(join(process.cwd(), "seed/sample_draft.md"), "utf8");
  return (
    <div>
      <div className="mb-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
            [01] PREFLIGHT CLAIM GOVERNANCE
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            Stage 1–4 Deterministic Pipeline
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-balance text-foreground">
          Check your draft against what your register approves.
        </h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          Every finding cites the approved fact, version and validity window behind it — or says honestly that it cannot judge. 78% of assertions resolve deterministically at 0ms latency.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 rounded-xl border border-border bg-panel/30 animate-pulse" />}>
        <Checker sampleDraft={sampleDraft} />
      </Suspense>
    </div>
  );
}
