"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Database,
  ScrollText,
  BarChart3,
  Info,
  BookOpen,
  Terminal,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Lock,
  Layers,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { resetDemo } from "@/lib/local";
import { useRouter } from "next/navigation";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const WORKSPACE_ITEMS: SidebarItem[] = [
  {
    href: "/check",
    label: "Check",
    icon: ShieldCheck,
    badge: "Preflight",
    badgeColor: "bg-[#8B1E27]/10 text-[#8B1E27] dark:bg-accent-readable/15 dark:text-accent-readable",
  },
  {
    href: "/facts",
    label: "Facts",
    icon: Database,
    badge: "42",
    badgeColor: "bg-[#1F5C43]/10 text-[#1F5C43] dark:bg-[#4ADE80]/15 dark:text-[#4ADE80]",
  },
  {
    href: "/audit",
    label: "Audit",
    icon: ScrollText,
    badge: "Merkle",
    badgeColor: "bg-panel text-ink dark:bg-zinc-800 dark:text-zinc-200",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
    badge: "Live",
    badgeColor: "bg-[#1F5C43]/10 text-[#1F5C43] dark:bg-[#4ADE80]/15 dark:text-[#4ADE80]",
  },
  {
    href: "/about",
    label: "About",
    icon: Info,
  },
];

const PLATFORM_ITEMS: SidebarItem[] = [
  {
    href: "/docs",
    label: "Documentation",
    icon: BookOpen,
  },
  {
    href: "/docs/api-reference",
    label: "REST API",
    icon: Terminal,
    badge: "<1ms",
    badgeColor: "bg-ink/5 text-ink dark:bg-white/10 dark:text-white",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("proofline.sidebar_collapsed");
      if (stored !== null) {
        setCollapsed(stored === "true");
      }
    } catch {
      // Fallback to default expanded
    }
  }, []);

  // Keyboard shortcut: Cmd+B / Ctrl+B to toggle collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [collapsed]);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("proofline.sidebar_collapsed", String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  const handleResetDemo = () => {
    setResetting(true);
    resetDemo();
    setTimeout(() => {
      setResetting(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <TooltipProvider delay={100}>
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 68 : 240,
        }}
        transition={{
          duration: 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="sticky top-16 z-30 flex h-[calc(100vh-4rem)] shrink-0 flex-col justify-between border-r border-border/80 bg-background/95 backdrop-blur-md select-none overflow-x-hidden font-sans shadow-xs"
      >
        {/* ===================================================================
            TOP: Workspace Identity & Collapse Switch
            =================================================================== */}
        <div className="flex flex-col">
          <div className="flex h-14 items-center justify-between border-b border-border/60 px-3.5">
            {/* Expanded Brand View */}
            {!collapsed ? (
              <motion.div
                key="expanded-header"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5 min-w-0"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-ink text-paper dark:bg-white dark:text-zinc-950 font-mono text-xs font-bold shadow-xs">
                  [ ]
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="truncate text-xs font-semibold text-foreground tracking-tight">
                    Flowdesk Workspace
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-[#1F5C43] animate-pulse" />
                    v4.0 · 42 Facts
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="mx-auto flex size-7 items-center justify-center rounded-md bg-ink text-paper dark:bg-white dark:text-zinc-950 font-mono text-xs font-bold shadow-xs">
                [ ]
              </div>
            )}

            {/* Collapse / Expand Switch Button */}
            {!collapsed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleCollapse}
                    aria-label="Collapse sidebar"
                    className="inline-flex size-7 items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer active:scale-95"
                  >
                    <PanelLeftClose size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span className="font-mono text-xs">Collapse Sidebar (⌘B)</span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* ===================================================================
              NAV GROUP 1: Primary Workspace Views
              =================================================================== */}
          <div className="p-2.5 space-y-4">
            <div>
              {!collapsed && (
                <div className="px-2.5 pb-1.5 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Workspace
                </div>
              )}

              <nav className="space-y-1" aria-label="Workspace views">
                {WORKSPACE_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  const navLink = (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex h-9 items-center rounded-md px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? "bg-muted font-semibold text-foreground shadow-2xs"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      } ${collapsed ? "justify-center" : "justify-between"}`}
                    >
                      {/* Active Left Accent Line */}
                      {active && (
                        <motion.div
                          layoutId="active-nav-line"
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#8B1E27] dark:bg-[#E07A70]"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={15}
                          className={`shrink-0 transition-colors ${
                            active
                              ? "text-accent-brand dark:text-accent-readable"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {!collapsed && (
                          <span className="truncate text-[12.5px]">{item.label}</span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[9.5px] font-bold ${
                            item.badgeColor ||
                            "bg-muted/60 text-muted-foreground"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                        <TooltipContent side="right">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="ml-1.5 text-[11px] text-muted-foreground">
                              ({item.badge})
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <React.Fragment key={item.href}>{navLink}</React.Fragment>;
                })}
              </nav>
            </div>

            {/* ===================================================================
                NAV GROUP 2: Platform & Settings
                =================================================================== */}
            <div className="pt-2 border-t border-border/50">
              {!collapsed && (
                <div className="px-2.5 pb-1.5 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Platform
                </div>
              )}

              <nav className="space-y-1" aria-label="Platform views">
                {PLATFORM_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  const navLink = (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex h-9 items-center rounded-md px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? "bg-muted font-semibold text-foreground shadow-2xs"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      } ${collapsed ? "justify-center" : "justify-between"}`}
                    >
                      {active && (
                        <motion.div
                          layoutId="active-nav-line"
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#8B1E27] dark:bg-[#E07A70]"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={15}
                          className={`shrink-0 transition-colors ${
                            active
                              ? "text-accent-brand dark:text-accent-readable"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        {!collapsed && (
                          <span className="truncate text-[12.5px]">{item.label}</span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[9.5px] font-bold ${
                            item.badgeColor ||
                            "bg-muted/60 text-muted-foreground"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                        <TooltipContent side="right">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="ml-1.5 text-[11px] text-muted-foreground">
                              ({item.badge})
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <React.Fragment key={item.href}>{navLink}</React.Fragment>;
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* ===================================================================
            BOTTOM: Local Storage Badge, Reset Demo & Collapse Switch
            =================================================================== */}
        <div className="border-t border-border/60 p-2.5 space-y-2">
          {/* Privacy & Zero-Retention Status Pill */}
          {!collapsed && (
            <div className="flex items-center gap-2 rounded-md bg-panel/80 dark:bg-zinc-900/60 p-2 text-[10.5px] font-mono text-muted-foreground border border-border/40">
              <Lock size={12} className="text-[#1F5C43] shrink-0" />
              <div className="min-w-0 flex flex-col">
                <span className="truncate font-semibold text-foreground">
                  Zero Server Storage
                </span>
                <span className="truncate text-ink-faint dark:text-zinc-500">
                  proofline.v1 (Local)
                </span>
              </div>
            </div>
          )}

          {/* Reset Demo Button */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  disabled={resetting}
                  aria-label="Reset demo data"
                  className="flex size-9 w-full items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:border-[#8B1E27]/40 hover:text-[#8B1E27] transition-colors cursor-pointer active:scale-95"
                >
                  <RotateCcw size={14} className={resetting ? "animate-spin" : ""} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="font-mono text-xs">Reset Demo Session</span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={handleResetDemo}
              disabled={resetting}
              className="flex w-full items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs font-mono text-muted-foreground hover:border-[#8B1E27]/40 hover:text-[#8B1E27] transition-colors cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2">
                <RotateCcw size={13} className={resetting ? "animate-spin" : ""} />
                <span>{resetting ? "Resetting…" : "Reset Demo"}</span>
              </div>
              <span className="text-[11px] text-muted-foreground/60">1-click</span>
            </button>
          )}

          {/* Collapse / Expand Switch Bar */}
          <div className="pt-1">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleCollapse}
                    aria-label="Expand sidebar"
                    className="flex size-9 w-full items-center justify-center rounded-md bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer active:scale-95"
                  >
                    <PanelLeftOpen size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span className="font-mono text-xs">Expand Sidebar (⌘B)</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="button"
                onClick={toggleCollapse}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <PanelLeftClose size={13} />
                  <span>Collapse Sidebar</span>
                </div>
                <kbd className="rounded border border-border/80 bg-background px-1 text-[9px] font-sans">
                  ⌘B
                </kbd>
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
export default AppSidebar;
