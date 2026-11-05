import * as React from "react";
import { cn } from "@/lib/utils";
import type { Verdict } from "@/lib/types";
import { VERDICT_MAP } from "@/lib/verdicts";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "slate";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-panel text-ink border-line-strong",
    secondary: "bg-panel text-ink-soft border-line",
    outline: "bg-transparent text-foreground border-line-strong",
    slate: "bg-slate-deep text-white border-transparent",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] border px-2 py-0.5 text-[11px] font-medium tracking-wide",
        variantClasses,
        className
      )}
      {...props}
    />
  );
}

export function VerdictBadge({
  verdict,
  className,
  showIcon = true,
}: {
  verdict: Verdict;
  className?: string;
  showIcon?: boolean;
}) {
  const config = VERDICT_MAP[verdict];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-colors",
        config.badgeClasses,
        className
      )}
    >
      {showIcon && <Icon size={12} strokeWidth={2.5} aria-hidden="true" />}
      {verdict.replace("_", " ")}
    </span>
  );
}
