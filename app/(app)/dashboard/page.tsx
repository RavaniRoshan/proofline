import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { registerStats } from "@/lib/register";
import { verifyDraft } from "@/lib/verify";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const reviewDate = new Date().toISOString().slice(0, 10);
  const stats = registerStats(reviewDate);
  const sampleDraft = readFileSync(join(process.cwd(), "seed/sample_draft.md"), "utf8");
  const result = await verifyDraft(sampleDraft, { reviewDate });
  return (
    <div>
      <div className="mb-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
            [04] OPERATIONAL TELEMETRY
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            Register Health &amp; Decision Distribution
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-balance text-foreground">
          The register, at a glance.
        </h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          Live register health as of <span className="font-mono font-medium text-foreground">{reviewDate}</span>, tracking deterministic rule efficacy ratios and reviewer consensus in this browser session.
        </p>
      </div>
      <Dashboard
        stats={stats}
        reviewDate={reviewDate}
        deterministic={result.summary.deterministic}
        model={result.summary.model}
      />
    </div>
  );
}
