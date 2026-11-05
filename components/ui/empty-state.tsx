import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[6px] border border-dashed border-line-strong bg-panel/40 p-8 text-center",
        className
      )}
    >
      {Icon && <Icon size={28} aria-hidden="true" className="mx-auto text-slate" />}
      <h3 className="mt-3 text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
