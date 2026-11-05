import type { Metadata } from "next";
import { registerStats } from "@/lib/register";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const reviewDate = new Date().toISOString().slice(0, 10);
  const stats = registerStats(reviewDate);
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        Dashboard
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">The register, at a glance.</h1>
      <p className="mt-1.5 max-w-2xl text-[15px] text-muted">
        Register health as of <span className="font-mono">{reviewDate}</span>, plus what this browser
        has decided so far.
      </p>
      <Dashboard stats={stats} reviewDate={reviewDate} />
    </div>
  );
}
