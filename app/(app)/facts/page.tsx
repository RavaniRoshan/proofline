import type { Metadata } from "next";
import { FactsTable } from "@/components/FactsTable";

export const metadata: Metadata = { title: "Fact register" };
export const dynamic = "force-dynamic";

export default function FactsPage() {
  const reviewDate = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">What the brand has approved.</h1>
      <FactsTable reviewDate={reviewDate} />
    </div>
  );
}
