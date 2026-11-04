"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { resetDemo } from "@/lib/local";

export function ResetDemo() {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      data-testid="reset-demo"
      onClick={() => {
        resetDemo();
        setDone(true);
        window.location.assign("/");
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-background px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-300 hover:text-red-800"
      title="Clear this browser's decisions and audit log, then reload the seeded demo"
    >
      <RotateCcw size={13} aria-hidden="true" />
      {done ? "Resetting…" : "Reset demo"}
    </button>
  );
}
