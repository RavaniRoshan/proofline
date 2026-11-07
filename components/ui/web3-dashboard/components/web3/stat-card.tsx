"use client";

import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApySparkline } from "./charts";
import { stats } from "../../data";
import { cn } from "@/lib/utils";

export function StatGrid() {
  return (
    <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="min-h-28 rounded-2xl bg-card py-3.5 ring-0 shadow-xs border border-border"
        >
          <CardHeader className="flex flex-row items-center gap-2.5 px-4 pb-2">
            <div
              className={cn(
                "rounded-full p-2 flex items-center justify-center shrink-0",
                stat.tone
              )}
            >
              <stat.icon className="size-4" />
            </div>
            <CardTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex flex-col mt-auto pt-0">
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {stat.value}
            </div>
            <div>
              {stat.compactChart ? (
                <div className="mt-2 h-9">
                  <ApySparkline />
                </div>
              ) : (
                <div
                  className={cn("mt-1.5 flex items-center gap-1 font-mono text-xs font-semibold", {
                    "text-emerald-600 dark:text-emerald-400": stat.detail.startsWith("+"),
                    "text-[#8B1E27] dark:text-[#D4847A]": stat.detail.startsWith("-"),
                    "text-muted-foreground": !stat.detail.startsWith("+") && !stat.detail.startsWith("-"),
                  })}
                >
                  {stat.detail.startsWith("+") && <GoTriangleUp className="size-3.5 fill-current" />}
                  {stat.detail.startsWith("-") && <GoTriangleDown className="size-3.5 fill-current" />}
                  <span>{stat.detail}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
