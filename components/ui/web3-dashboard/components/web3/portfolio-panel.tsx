"use client";

import { GoTriangleUp } from "react-icons/go";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioChart } from "./charts";
import { portfolioDataRanges } from "../../data";

const ranges = ["1D", "7D", "1M", "All"];

export function PortfolioPanel() {
  return (
    <Card className="rounded-2xl ring-0 shadow-xs bg-card p-2 xl:col-span-3 gap-2 border border-border">
      <Tabs defaultValue="All" className="w-full flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between p-2">
          <CardTitle className="text-base font-semibold px-1 truncate">
            Verification Volume &amp; Decision Throughput
          </CardTitle>
          <TabsList className="bg-muted/60 p-0.5 rounded-lg gap-1">
            {ranges.map((range) => (
              <TabsTrigger
                key={range}
                value={range}
                className="h-7 px-2.5 text-xs font-mono rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                {range}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        <CardContent className="p-3 bg-muted/20 dark:bg-card/40 rounded-xl flex-1 overflow-hidden">
          <div className="px-2">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              284,520 <span className="text-xs font-normal text-muted-foreground font-sans">assertions</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              <GoTriangleUp className="size-3.5 fill-current" />
              <span>+18.4% compared to v3 baseline</span>
            </div>
          </div>
          <div className="h-72 pt-3 relative">
            {ranges.map((range) => (
              <TabsContent key={range} value={range} className="absolute inset-0 mt-0 pt-3 data-[state=inactive]:hidden">
                <PortfolioChart data={portfolioDataRanges[range as keyof typeof portfolioDataRanges]} />
              </TabsContent>
            ))}
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
}
