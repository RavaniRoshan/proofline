"use client";

import * as React from "react";
import { ArrowRight, ChevronsUpDown, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetBadge } from "./asset-badge";

type Asset = {
  asset: string;
  balance: string;
  value: string;
  color: string;
};

type AssetTableCardProps = {
  title: string;
  assets: Asset[];
  action: string;
  valueLabel: string;
  external?: boolean;
};

export function AssetTableCard({
  title,
  assets,
  action,
  valueLabel,
  external,
}: AssetTableCardProps) {
  const [sortField, setSortField] = React.useState<"balance" | "value" | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const handleSort = (field: "balance" | "value") => {
    if (sortField === field) {
      if (sortDir === "desc") {
        setSortDir("asc");
      } else {
        setSortField(null);
        setSortDir("desc");
      }
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedAssets = React.useMemo(() => {
    if (!sortField) return assets;

    return [...assets].sort((a, b) => {
      const parseValue = (val: string) => {
        return parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0;
      };

      const valA = parseValue(a[sortField]);
      const valB = parseValue(b[sortField]);

      if (sortDir === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });
  }, [assets, sortField, sortDir]);

  return (
    <Card className="rounded-2xl bg-card shadow-xs py-4 p-2 gap-2 border border-border">
      <CardHeader className="flex flex-row items-center justify-between px-2 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Button variant="ghost" size="icon" aria-label={`${title} menu`} className="h-8 w-8">
          <MoreVertical className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-3 p-2 rounded-lg bg-muted/40 dark:bg-card/40">
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="hover:bg-muted">
                <TableHead className="h-9 text-xs font-semibold">Entity</TableHead>
                <TableHead
                  className="h-9 text-xs font-semibold cursor-pointer select-none transition-colors hover:text-foreground"
                  onClick={() => handleSort("balance")}
                >
                  <span className="inline-flex items-center gap-1 font-mono">
                    Telemetry
                    <ChevronsUpDown className={`size-3.5 ${sortField === "balance" ? "text-foreground" : "text-muted-foreground"}`} />
                  </span>
                </TableHead>
                <TableHead
                  className="h-9 text-xs font-semibold cursor-pointer select-none transition-colors hover:text-foreground"
                  onClick={() => handleSort("value")}
                >
                  <span className="inline-flex items-center gap-1 font-mono">
                    {valueLabel}
                    <ChevronsUpDown className={`size-3.5 ${sortField === "value" ? "text-foreground" : "text-muted-foreground"}`} />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssets.map((asset) => (
                <TableRow key={asset.asset} className="border-border/70 border-y hover:bg-muted/40">
                  <TableCell className="h-11">
                    <span className="inline-flex items-center gap-2.5 font-medium text-xs">
                      <AssetBadge symbol={asset.asset} color={asset.color} size="sm" />
                      <span className="truncate max-w-[180px]">{asset.asset}</span>
                    </span>
                  </TableCell>
                  <TableCell className="h-11 font-mono text-xs text-muted-foreground">{asset.balance}</TableCell>
                  <TableCell className="h-11 font-mono text-xs font-semibold">{asset.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button variant="outline" className="mt-3 h-8 w-full font-mono text-xs">
          {action}
          {external ? <ArrowRight className="size-3.5 ml-1.5" /> : <Plus className="size-3.5 ml-1.5" />}
        </Button>
      </CardContent>
    </Card>
  );
}
