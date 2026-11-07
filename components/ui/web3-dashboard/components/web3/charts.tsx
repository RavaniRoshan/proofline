"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { apyData } from "../../data";

export function PortfolioChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B1E27" stopOpacity={0.45} />
            <stop offset="60%" stopColor="#D4847A" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#D4847A" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="currentColor" strokeOpacity={0.1} vertical />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11, fontFamily: "monospace" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={48}
          ticks={[0, 50000, 100000, 150000, 200000, 250000, 300000]}
          tickFormatter={(value) => `${Number(value) / 1000}K`}
          tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11, fontFamily: "monospace" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#8B1E27"
          strokeWidth={3}
          fill="url(#portfolioFill)"
          activeDot={{ r: 5, fill: "#8B1E27" }}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ApySparkline() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={apyData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="apyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4847A" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#D4847A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" hide />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#D4847A"
          strokeWidth={2}
          fill="url(#apyFill)"
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
