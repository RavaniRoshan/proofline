'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Plus, Search, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DashboardTopbar() {
  const [scope, setScope] = React.useState('flowdesk');

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 py-2 border-b border-border/60 mb-5">
      <div className="flex w-full max-w-sm items-center gap-2">
        <SidebarTrigger className="shrink-0 lg:hidden" />
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            aria-label="Search register facts and rules"
            className="border-border bg-muted/50 h-9 w-full rounded-lg pl-9 text-xs font-mono"
            placeholder="Search 42 facts, rules, contracts..."
          />
        </div>
      </div>

      <div className="hidden items-center gap-2.5 md:flex">
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger className="bg-muted/50 min-h-9 w-[220px] gap-2 text-xs font-mono">
            <SelectValue placeholder="Select Scope" />
          </SelectTrigger>
          <SelectContent className="text-xs font-mono">
            <SelectItem value="flowdesk">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="size-4 p-0 flex items-center justify-center font-mono text-[9px] text-[#8B1E27]">
                  F
                </Badge>
                B-flowdesk (Active)
              </div>
            </SelectItem>
            <SelectItem value="starter">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="size-4 p-0 flex items-center justify-center font-mono text-[9px] text-[#D4847A]">
                  S
                </Badge>
                Starter Tier (v4)
              </div>
            </SelectItem>
            <SelectItem value="enterprise">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="size-4 p-0 flex items-center justify-center font-mono text-[9px] text-emerald-600">
                  E
                </Badge>
                Enterprise SLA (99.9%)
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button asChild variant="outline" className="h-9 font-mono text-xs gap-1.5">
          <Link href="/facts">
            <span>Browse Facts</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
        <Button asChild className="h-9 px-4 font-mono text-xs gap-1.5 bg-[#8B1E27] hover:bg-[#8B1E27]/90 text-white">
          <Link href="/check">
            <span>Check a Draft</span>
            <Plus className="size-3.5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
