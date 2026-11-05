import type { Metadata } from "next";
import { AuditLog } from "@/components/AuditLog";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Every decision, on the record.</h1>
      <p className="mt-1.5 max-w-2xl text-[15px] text-muted">
        Append-only, stored in this browser. Clearing it is a deliberate act — use{" "}
        <span className="font-semibold text-foreground">Reset demo</span> in the header.
      </p>
      <AuditLog />
    </div>
  );
}
