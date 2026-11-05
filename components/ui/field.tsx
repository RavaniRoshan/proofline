import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  id?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Field({ id, label, description, error, className, children }: FieldProps) {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const descId = description ? `${fieldId}-desc` : undefined;
  const errorId = error ? `${fieldId}-err` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={fieldId} className="text-[13px] font-semibold text-foreground">
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p id={descId} className="text-[11px] text-muted leading-tight">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[11px] font-medium text-v-contradicted-fg leading-tight">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "h-9 w-full rounded-[4px] border border-line-strong bg-background px-3 text-[13px] text-foreground placeholder:text-muted transition-colors focus:border-slate focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-[4px] border border-line-strong bg-background p-3 text-[14px] leading-relaxed text-foreground placeholder:text-muted transition-colors focus:border-slate focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
