"use client";

import { AssetTableCard } from './components/web3/asset-table-card';
import { borrowedAssets, netWorthAssets } from './data';
import { DashboardTopbar } from './components/web3/topbar';
import { MarketsPanel } from './components/web3/markets-panel';
import { PortfolioPanel } from './components/web3/portfolio-panel';
import { StatGrid } from './components/web3/stat-card';

export default function DashboardView() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto space-y-5">
      <DashboardTopbar />
      <div className="grid gap-4">
        <StatGrid />
        <section className="grid gap-4 xl:grid-cols-4">
          <PortfolioPanel />
          <MarketsPanel />
        </section>
        <section className="grid gap-4 xl:grid-cols-2">
          <AssetTableCard
            title="Ground Truth Fact Attributes"
            assets={netWorthAssets}
            action="Inspect Register"
            valueLabel="True Value"
          />
          <AssetTableCard
            title="Active Contradiction Log"
            assets={borrowedAssets}
            action="Verify in Checker"
            valueLabel="Severity"
            external
          />
        </section>
      </div>
    </main>
  );
}
