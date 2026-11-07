"use client";

import * as React from "react";
import Link from "next/link";
import type { ReactElement } from "react";
import { useTheme } from "next-themes";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Bot,
  ChartNoAxesColumnIncreasing,
  Cpu,
  Globe,
  LayoutGrid,
  PenTool,
  ScanText,
  Shield,
  BookText,
  BriefcaseBusiness,
  Code,
  Component,
  Codepen,
  Network,
  ScreenShare,
  AppWindow,
  Layers,
  Monitor, 
  Moon, 
  Sun,
} from "@aliimam/icons";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/CommandPalette"; 
import { useState, useCallback, useEffect } from "react"; 

const cloud: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "Preflight Checker",
    href: "/check",
    icon: <ScanText strokeWidth={2} />,
    description: "Interactive draft copy verification workbench",
  },
  {
    title: "Fact Register",
    href: "/facts",
    icon: <BookText strokeWidth={2} />,
    description: "42 owner-approved, versioned ground truth facts",
  },
  {
    title: "Decision Journal",
    href: "/audit",
    icon: <Layers strokeWidth={2} />,
    description: "Append-only audit trail with cryptographic hashes",
  },
  {
    title: "Operational Telemetry",
    href: "/dashboard",
    icon: <ChartNoAxesColumnIncreasing strokeWidth={2} />,
    description: "Register health, rule ratios, and drift metrics",
  },
];

const core: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "Deterministic Engine",
    href: "/about#pipeline",
    icon: <Code strokeWidth={2} />,
    description: "0.4ms TypeScript regex and boundary rules",
  },
  {
    title: "Evidence Gate",
    href: "/about#pipeline",
    icon: <Shield strokeWidth={2} />,
    description: "Strict 6-field citation & byte span verification",
  },
  {
    title: "Scalar Normalizer",
    href: "/about#pipeline",
    icon: <Cpu strokeWidth={2} />,
    description: "Format-agnostic currency, quota & date resolution",
  },
  {
    title: "Decision Ledger",
    href: "/audit",
    icon: <Layers strokeWidth={2} />,
    description: "Immutable decision tracking with reviewer actions",
  },
];

const security: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "Zero Retention",
    href: "/about#architecture",
    icon: <Shield strokeWidth={2} />,
    description: "In-memory evaluation, zero training on customer prose",
  },
  {
    title: "Release Gates",
    href: "/about#pipeline",
    icon: <Bot strokeWidth={2} />,
    description: "Block deployment pipelines on contradicted claims",
  },
  {
    title: "Audit JSON Export",
    href: "/audit",
    icon: <BriefcaseBusiness strokeWidth={2} />,
    description: "Cryptographic SHA-256 evidence logs for compliance",
  },
  {
    title: "Local-First Execution",
    href: "/check",
    icon: <Globe strokeWidth={2} />,
    description: "Zero auth required, runs entirely in client runtime",
  },
];

const company: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "Architecture & Invariants",
    href: "/about",
    icon: <BriefcaseBusiness strokeWidth={2} />,
    description: "In-depth system design & correctness proofs",
  },
  {
    title: "Fact Register Catalog",
    href: "/facts",
    icon: <BookText strokeWidth={2} />,
    description: "42 approved ground truth facts & source docs",
  },
  {
    title: "Decision Audit Journal",
    href: "/audit",
    icon: <Layers strokeWidth={2} />,
    description: "History of reviewed claims & reviewer verdicts",
  },
  {
    title: "Telemetry Dashboard",
    href: "/dashboard",
    icon: <ChartNoAxesColumnIncreasing strokeWidth={2} />,
    description: "Register health and deterministic efficacy",
  },
  {
    title: "GitHub Repository",
    href: "https://github.com/RavaniRoshan/proofline",
    icon: <Code strokeWidth={2} />,
    description: "Open-source codebase, tests, and changelog",
  },
];

const open: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "TypeScript SDK",
    href: "https://github.com/RavaniRoshan/proofline",
    icon: <Code strokeWidth={2} />,
    description: "Headless verifyDraft() pure function library",
  },
  {
    title: "Headless REST API",
    href: "/api/verify",
    icon: <Network strokeWidth={2} />,
    description: "POST /api/verify direct JSON verification endpoint",
  },
  {
    title: "Zod Schema Gate",
    href: "https://github.com/RavaniRoshan/proofline",
    icon: <Component strokeWidth={2} />,
    description: "Strict runtime verification schemas & contracts",
  },
  {
    title: "24-Case Smoke Suite",
    href: "https://github.com/RavaniRoshan/proofline",
    icon: <Codepen strokeWidth={2} />,
    description: "npm run smoke test suite for pricing & SLA claims",
  },
];

const tools: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "Architecture RFC",
    href: "/about",
    icon: <Network strokeWidth={2} />,
    description: "Deterministic split pipeline documentation",
  },
  {
    title: "Verdict Taxonomy",
    href: "/audit",
    icon: <Component strokeWidth={2} />,
    description: "6 rigorous verdicts from Supported to Contradicted",
  },
  {
    title: "24 Smoke Tests",
    href: "https://github.com/RavaniRoshan/proofline",
    icon: <Codepen strokeWidth={2} />,
    description: "Automated ground-truth test cases and validation",
  },
  {
    title: "REST API Reference",
    href: "/api/verify",
    icon: <Code strokeWidth={2} />,
    description: "Typed request and response specifications",
  },
  {
    title: "GitHub Repository",
    href: "https://github.com/RavaniRoshan/proofline",
    icon: <PenTool strokeWidth={2} />,
    description: "Inspect commits, issues, and contributing guide",
  },
];

const cases: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "Marketing Release Gates",
    href: "/#how-it-works",
    icon: <LayoutGrid strokeWidth={2} />,
    description: "Block unverified claims before copy goes live",
  },
  {
    title: "Legal & Compliance Audit",
    href: "/audit",
    icon: <BriefcaseBusiness strokeWidth={2} />,
    description: "Instant citation trails for legal defense",
  },
  {
    title: "SaaS Pricing Precision",
    href: "/#how-it-works",
    icon: <ScreenShare strokeWidth={2} />,
    description: "Eliminate stale seat, tier, and pricing errors",
  },
  {
    title: "Continuous Verification",
    href: "/about#pipeline",
    icon: <AppWindow strokeWidth={2} />,
    description: "Deterministic CI/CD testing for product copy",
  },
];

const users: {
  title: string;
  icon: ReactElement;
  href: string;
  description: string;
}[] = [
  {
    title: "Product & Growth Marketers",
    href: "/check",
    icon: <Layers strokeWidth={2} />,
    description: "Verify landing page copy before publication",
  },
  {
    title: "Legal & General Counsel",
    href: "/audit",
    icon: <Shield strokeWidth={2} />,
    description: "Ensure zero liability from false claims",
  },
  {
    title: "Compliance Officers",
    href: "/dashboard",
    icon: <ChartNoAxesColumnIncreasing strokeWidth={2} />,
    description: "Track register freshness and drift across releases",
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`flex sticky px-4 z-50 top-0 w-full bg-background items-center h-16 justify-between transition-colors duration-200 ${
        scrolled ? "border-b border-border shadow-xs" : "border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
        <div className="flex h-14 items-center justify-center">
          {/* Authentic Proofline Logomark [ ] */}
          <Link
            href="/"
            className="flex items-center gap-2 select-none group pr-2 focus:outline-none"
            aria-label="Proofline — Home"
          >
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-[2px] font-mono text-[22px] font-bold leading-none tracking-tight text-accent-brand dark:text-accent-readable logomark-lock"
            >
              <span className="logomark-bracket-left"><span>[</span></span>
              <span className="logomark-bracket-right"><span>]</span></span>
            </span>
            <span className="font-sans text-[18px] font-bold tracking-tight text-foreground">
              Proofline
            </span>
          </Link>

          <NavigationMenu className="ml-6 hidden lg:flex" viewport={true}>
            <NavigationMenuList>
              {/* Product Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-8 font-normal text-muted-foreground hover:text-foreground"
                  )}
                >
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground border border-border shadow-xl rounded-xl">
                  <ul className="grid w-[400px] p-4 grid-cols-3 md:w-[820px] gap-2">
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        Engine
                      </span>
                      {cloud.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        Deterministic Rules
                      </span>
                      {core.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        Governance
                      </span>
                      {security.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Solutions Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-8 font-normal text-muted-foreground hover:text-foreground"
                  )}
                >
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground border border-border shadow-xl rounded-xl">
                  <ul className="grid w-[400px] p-4 grid-cols-2 md:w-[680px] gap-2">
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        Use Cases
                      </span>
                      {cases.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        Audiences & Teams
                      </span>
                      {users.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Resources Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-8 font-normal text-muted-foreground hover:text-foreground"
                  )}
                >
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground border border-border shadow-xl rounded-xl">
                  <ul className="grid w-[400px] p-4 grid-cols-3 md:w-[820px] gap-2">
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        Explore
                      </span>
                      {company.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        SDKs & CI/CD
                      </span>
                      {open.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                    <div>
                      <span className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground block">
                        Documentation
                      </span>
                      {tools.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          icon={component.icon}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Direct links */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-8 font-normal text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Link href="https://github.com/RavaniRoshan/proofline#readme" target="_blank" rel="noopener noreferrer">
                    Docs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-8 font-normal text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Link href="/audit">
                    Audit Log
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          <ThemeSwitcher className="hidden sm:flex" />

          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex text-muted-foreground hover:text-foreground">
            <Link href="/facts">Fact Register</Link>
          </Button>

          <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-medium text-xs px-3.5 h-8">
            <Link href="/check">Check a Draft →</Link>
          </Button>

          {/* User / Workspace Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="User menu"
              >
                <Avatar className="size-8 border border-border cursor-pointer">
                  <AvatarFallback className="font-mono text-xs font-semibold bg-secondary text-foreground">
                    PL
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-3 rounded-xl border-border shadow-xl bg-popover text-popover-foreground" align="end">
              <div className="p-2">
                <h2 className="font-semibold text-sm">Proofline Reviewer</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  governance@proofline.app
                </p>
              </div>
              <DropdownMenuSeparator className="-mx-3" />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="py-2 text-sm cursor-pointer">
                  <Link href="/check" className="w-full">Preflight Checker</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2 text-sm cursor-pointer">
                  <Link href="/facts" className="w-full">Fact Register</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2 text-sm cursor-pointer">
                  <Link href="/audit" className="w-full">Decision Journal</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="-mx-3" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="py-2 justify-between text-sm sm:hidden">
                  <span>Theme</span>
                  <ThemeSwitcher />
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2 text-sm cursor-pointer">
                  <Link href="https://github.com/RavaniRoshan/proofline" target="_blank" rel="noopener noreferrer" className="w-full">
                    GitHub Repository
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function ListItem({
  title,
  icon,
  children,
  href,
  ...props
}: {
  title: string;
  icon?: ReactElement;
  children?: React.ReactNode;
  href: string;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none rounded-lg p-2.5 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground group"
          {...props}
        >
          <div className="flex gap-3 items-center">
            {icon && (
              <div className="border border-border rounded-md p-1.5 icon-container bg-background/50 text-foreground transition-all duration-200 group-hover:bg-foreground group-hover:text-background group-hover:scale-105 shrink-0">
                {icon}
              </div>
            )}
            <div className="text-container">
              <div className="text-sm font-medium leading-none text-foreground transition-colors">
                {title}
              </div>
              <p className="text-muted-foreground line-clamp-2 pt-1 text-xs leading-snug">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

export type ThemeSwitcherProps = {
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  defaultValue?: "light" | "dark" | "system";
  className?: string;
};

const ThemeSwitcher = ({ 
  className,
}: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark" | "system") => {
      setTheme(themeKey);
    },
    [setTheme]
  );

  if (!mounted) {
    return (
      <div className={cn("h-7 w-20 rounded-full bg-muted/40 animate-pulse", className)} />
    );
  }

  return (
    <div
      className={cn(
        "relative isolate flex h-7 items-center rounded-full bg-secondary/80 p-0.5 ring-1 ring-border",
        className
      )}
      role="radiogroup"
      aria-label="Color theme"
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            aria-checked={isActive}
            role="radio"
            className="relative h-6 w-6 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors"
            key={key}
            onClick={() => handleThemeClick(key as "light" | "dark" | "system")}
            type="button"
          >
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-background shadow-xs border border-border" />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto h-3 w-3 transition-colors",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
