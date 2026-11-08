import { cn } from "@/lib/utils";

type AssetBadgeProps = {
  /** Solid fills like "bg-accent", the badge supplies white text. */
  color?: string;
  /** Verdict token pair, renders on the verdict surface with matched fg. */
  verdictBg?: string;
  verdictFg?: string;
  symbol: string;
  size?: "sm" | "md";
};

export function AssetBadge({ symbol, color, verdictBg, verdictFg, size = "md" }: AssetBadgeProps) {
  const text = symbol.startsWith("F-") ? symbol.slice(2, 5) : symbol.slice(0, 2);
  const paired = !!(verdictBg && verdictFg);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-mono font-bold",
        paired
          ? cn(verdictBg, verdictFg)
          : cn("text-white shadow-[inset_0_1px_2px_1px_rgba(255,255,255,0.2),inset_0px_-1px_2px_1px_rgba(0,0,0,0.08)]", color),
        size === "sm" ? "size-6 text-[11px]" : "size-9 text-xs"
      )}
    >
      {text}
    </span>
  );
}
