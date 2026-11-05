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
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-balance max-w-2xl">
          Check your draft against what your register approves.
        </h1>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-snug text-muted">
          Every finding cites the approved fact, version and validity window behind it — or says honestly that it cannot judge.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 rounded-[6px] border border-line-strong bg-panel/30 animate-pulse" />}>
        <Checker sampleDraft={sampleDraft} />
      </Suspense>
    </>
  );
}
