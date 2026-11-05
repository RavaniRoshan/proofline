import type { Metadata } from "next";
import { AuditLog } from "@/components/AuditLog";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        Audit log
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">Every decision, on the record.</h1>
      <p className="mt-1.5 max-w-2xl text-[15px] text-muted">
        Append-only, stored in this browser. Clearing it is a deliberate act — use{" "}
        <span className="font-semibold text-foreground">Reset demo</span> in the header.
      </p>
      <AuditLog />
    </div>
  );
}
