import type { Metadata } from "next";
import { AuditLog } from "@/components/AuditLog";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
            [03] COMPLIANCE JOURNAL
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            Append-Only Decision Ledger
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-balance text-foreground">
          Every decision, on the record.
        </h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          Append-only, stored in this browser. Every finding decision is stamped with evidence citation, reviewer judgment, and exact timestamp for audit export.
        </p>
      </div>
      <AuditLog />
    </div>
  );
}
