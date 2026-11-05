import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", disabled, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-accent text-white hover:bg-accent-hover focus-visible:outline-accent",
      secondary: "bg-slate text-white hover:bg-slate-deep focus-visible:outline-slate",
      outline:
        "border border-line-strong bg-panel text-foreground hover:border-slate hover:text-foreground focus-visible:outline-slate",
      ghost: "text-ink hover:bg-panel hover:text-foreground focus-visible:outline-slate",
      destructive:
        "border border-v-contradicted-fg/30 bg-v-contradicted-bg text-v-contradicted-fg hover:bg-v-contradicted-bg/80 focus-visible:outline-v-contradicted-fg",
      link: "text-accent underline-offset-2 hover:underline p-0 h-auto font-medium focus-visible:outline-accent",
    }[variant];

    const sizeClasses = {
      default: "h-9 px-4 text-[13px]",
      sm: "h-7 px-2.5 text-xs",
      lg: "h-11 px-5 text-[15px]",
      icon: "size-8 p-1.5",
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variantClasses,
          variant !== "link" && sizeClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
