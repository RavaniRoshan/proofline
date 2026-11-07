"use client";

import { ArrowUpRight } from "lucide-react";
import { GoTriangleUp } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetBadge } from "./asset-badge";
import { markets } from "../../data";

export function MarketsPanel() {
  return (
    <Card className="rounded-2xl bg-card shadow-xs p-2 ring-0 gap-1 border border-border">
      <CardHeader className="flex flex-row items-center justify-between px-2 py-1">
        <CardTitle className="text-base font-semibold">Rule Efficacy Ledger</CardTitle>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs font-mono text-muted-foreground hover:text-foreground">
          <span>All Rules</span>
          <ArrowUpRight className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="px-3 bg-muted/20 dark:bg-card/40 rounded-xl h-full">
        <div className="divide-y divide-border/60">
          {markets.map((market) => (
            <div key={market.name} className="flex items-center gap-3 py-3.5">
              <AssetBadge symbol={market.name} color={market.color} size="sm" />
              <span className="flex-1 text-xs font-medium truncate">{market.name}</span>
              <span className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <GoTriangleUp className="size-3.5 fill-current" />
                {market.change}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
