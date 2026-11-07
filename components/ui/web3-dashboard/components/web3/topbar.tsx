'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar as CalendarIcon, ChevronDown, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar3 } from '@/components/ui/calendar-03';

export interface DashboardTopbarProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function DashboardTopbar({
  dateRange: controlledDateRange,
  onDateRangeChange,
}: DashboardTopbarProps = {}) {
  const [scope, setScope] = React.useState('flowdesk');
  const [internalDateRange, setInternalDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 3, 1),
    to: new Date(2026, 10, 7),
  });

  const dateRange = controlledDateRange !== undefined ? controlledDateRange : internalDateRange;
  const setDateRange = (range: DateRange | undefined) => {
    setInternalDateRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2 border-b border-border/60 mb-5">
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

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Scope Selector */}
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger className="bg-muted/50 min-h-9 w-[190px] gap-2 text-xs font-mono">
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

        {/* Calendar-03 Date Range Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 font-mono text-xs gap-2 border-border bg-muted/40 hover:bg-muted text-foreground"
            >
              <CalendarIcon className="size-3.5 text-[#8B1E27] dark:text-[#D4847A]" />
              <span className="hidden sm:inline">
                {dateRange?.from
                  ? dateRange.to
                    ? `${format(dateRange.from, 'LLL d, yyyy')} – ${format(dateRange.to, 'LLL d, yyyy')}`
                    : format(dateRange.from, 'LLL d, yyyy')
                  : 'Temporal Window'}
              </span>
              <span className="sm:hidden">
                {dateRange?.from ? format(dateRange.from, 'LLL d') : 'Window'}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3.5" align="end">
            <div className="mb-2 px-1 flex items-center justify-between border-b border-border/60 pb-2">
              <div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Temporal Validity Filter
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Select start &amp; end dates for verification telemetry
                </span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                Active Range
              </Badge>
            </div>
            <Calendar3
              value={dateRange}
              onChange={setDateRange}
              caption="Filter assertions and rule efficacy within this date range"
            />
          </PopoverContent>
        </Popover>

        {/* Navigation Quick Actions */}
        <Button asChild variant="outline" className="h-9 font-mono text-xs gap-1.5 hidden md:inline-flex">
          <Link href="/facts">
            <span>Browse Facts</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
        <Button asChild className="h-9 px-3.5 font-mono text-xs gap-1.5 bg-[#8B1E27] hover:bg-[#8B1E27]/90 text-white">
          <Link href="/check">
            <span>Check Draft</span>
            <Plus className="size-3.5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
