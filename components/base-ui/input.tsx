import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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

export default Input;
