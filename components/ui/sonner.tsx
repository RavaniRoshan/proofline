"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircle2, Info, AlertTriangle, XOctagon, Loader2 } from "lucide-react";

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group font-sans text-[13px]"
      icons={{
        success: <CheckCircle2 className="size-4 text-v-supported-fg" />,
        info: <Info className="size-4 text-slate" />,
        warning: <AlertTriangle className="size-4 text-v-stale-fg" />,
        error: <XOctagon className="size-4 text-v-contradicted-fg" />,
        loading: <Loader2 className="size-4 animate-spin text-slate" />,
      }}
      style={
        {
          "--normal-bg": "var(--paper)",
          "--normal-text": "var(--ink)",
          "--normal-border": "var(--line-strong)",
          "--border-radius": "6px",
        } as React.CSSProperties
      }
      toastOptions={{
        className: "border border-line-strong bg-card text-foreground rounded-[6px] shadow-none",
      }}
      {...props}
    />
  );
}
