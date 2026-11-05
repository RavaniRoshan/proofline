"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { resetDemo } from "@/lib/local";

export function ResetDemo() {
  const [done, setDone] = useState(false);
  const router = useRouter();
  return (
    <button
      type="button"
      data-testid="reset-demo"
      onClick={() => {
        resetDemo();
        setDone(true);
        router.push("/");
      }}
      className="inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-v-contradicted-fg/40 hover:text-v-contradicted-fg"
      title="Clear this browser's decisions and audit log, then reload the seeded demo"
    >
      <RotateCcw size={13} aria-hidden="true" />
      {done ? "Resetting…" : "Reset demo"}
    </button>
  );
}
