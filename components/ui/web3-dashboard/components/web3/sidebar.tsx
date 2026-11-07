"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { navSections, utilityItems } from "../../data";
import { cn } from "@/lib/utils";
import LogoIcon from "./logo-icons";

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon" className="overflow-hidden border-r border-border bg-card">
      <SidebarHeader className="p-3 border-b border-border/60">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              size="lg"
              className="h-10 px-2 group-data-[collapsible=icon]:hidden"
            >
              <Link href="/" className="flex items-center gap-2">
                <LogoIcon />
                <span className="font-mono text-base font-bold tracking-tight text-foreground">Proofline</span>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="ml-auto" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-4 p-3">
        {navSections.map((section) => (
          <SidebarGroup key={section.title} className="p-0">
            <SidebarGroupLabel className="h-7 px-1 text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      tooltip={item.label}
                      className={cn(
                        'h-9 gap-3 rounded-lg px-2.5 text-xs font-mono font-medium transition-colors',
                        item.active
                          ? 'bg-muted text-foreground font-semibold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Link href={item.label.includes("Checker") ? "/check" : item.label.includes("Facts") ? "/facts" : item.label.includes("Audit") ? "/audit" : "/dashboard"}>
                        <item.icon
                          className={cn(
                            'size-4 shrink-0',
                            item.active ? 'text-[#8B1E27] dark:text-[#D4847A]' : '',
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarSeparator />

      <SidebarFooter className="gap-3 px-3 pb-3 border-t border-border/60">
        <SidebarMenu className="gap-1">
          {utilityItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                className="text-muted-foreground hover:text-foreground h-8 gap-3 rounded-lg px-2.5 text-xs font-mono"
              >
                <Link href={item.label.includes("Docs") ? "/about" : "#"}>
                  <item.icon className="size-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className="flex items-center justify-between gap-1 pt-1 border-t border-border/40">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Local Reviewer Session"
                  className="flex h-9 items-center gap-2 rounded-md px-1"
                >
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className="bg-[#8B1E27] text-white text-[10px] font-mono font-bold">
                      PL
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 overflow-hidden text-left text-xs font-mono font-semibold truncate group-data-[collapsible=icon]:hidden">
                    Reviewer (Local)
                  </span>
                  <ChevronDown className="text-muted-foreground size-3.5 shrink-0 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 font-mono text-xs" align="end" side="right" sideOffset={16}>
                <DropdownMenuLabel>Reviewer Session</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/audit">Decision Ledger</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/facts">Fact Versioning</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/check">Preflight Checker</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="group-data-[collapsible=icon]:hidden">
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
