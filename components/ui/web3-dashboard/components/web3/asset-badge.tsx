import { cn } from "@/lib/utils";

type AssetBadgeProps = {
  symbol: string;
  color: string;
  size?: "sm" | "md";
};

export function AssetBadge({ symbol, color, size = "md" }: AssetBadgeProps) {
  const text = symbol.startsWith("F-") ? symbol.slice(2, 5) : symbol.slice(0, 2);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-xs text-white font-mono font-bold shadow-[inset_0_1px_2px_1px_rgba(255,255,255,0.2),inset_0px_-1px_2px_1px_rgba(0,0,0,0.08)]",
        size === "sm" ? "size-6 text-[10px]" : "size-9 text-xs",
        color
      )}
    >
      {text}
    </span>
  );
}
