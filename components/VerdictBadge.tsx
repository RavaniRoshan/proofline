import type { Verdict } from "@/lib/types";
import {
  CheckCircle2,
  XOctagon,
  Clock,
  HelpCircle,
  GitCompareArrows,
  MinusCircle,
  type LucideIcon,
} from "lucide-react";

export const VERDICT_META: Record<Verdict, { icon: LucideIcon; classes: string }> = {
  SUPPORTED: {
    icon: CheckCircle2,
    classes: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
  CONTRADICTED: {
    icon: XOctagon,
    classes: "bg-red-50 text-red-900 border-red-200",
  },
  STALE: {
    icon: Clock,
    classes: "bg-amber-50 text-amber-900 border-amber-200",
  },
  UNVERIFIED: {
    icon: HelpCircle,
    classes: "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
  CONFLICTING: {
    icon: GitCompareArrows,
    classes: "bg-orange-50 text-orange-900 border-orange-200",
  },
  NOT_CHECKABLE: {
    icon: MinusCircle,
    classes: "bg-slate-50 text-slate-600 border-slate-200",
  },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const meta = VERDICT_META[verdict];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${meta.classes}`}
    >
      <Icon size={12} strokeWidth={2.5} aria-hidden="true" />
      {verdict.replace("_", " ")}
    </span>
  );
}
