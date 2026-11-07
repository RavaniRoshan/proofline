"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Database,
  ScrollText,
  BarChart3,
  Info,
  type LucideIcon,
} from "lucide-react";

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const LINKS: NavLinkItem[] = [
  { href: "/check", label: "Check", icon: ShieldCheck },
  { href: "/facts", label: "Facts", icon: Database, badge: "42" },
  { href: "/audit", label: "Audit", icon: ScrollText },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/about", label: "About", icon: Info },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Views" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
      {LINKS.map(({ href, label, icon: Icon, badge }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`btn-proofline-tactile group relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors duration-fast active:scale-[0.97] select-none ${
              active
                ? "bg-panel text-accent-brand dark:text-accent-readable font-semibold shadow-2xs border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-panel/50 border border-transparent"
            }`}
          >
            <Icon
              size={14}
              className={`shrink-0 transition-colors ${
                active
                  ? "text-accent-brand dark:text-accent-readable"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
              aria-hidden="true"
            />
            <span>{label}</span>
            {badge && (
              <span
                className={`ml-0.5 inline-flex h-4 items-center rounded px-1 font-mono text-[10px] font-bold ${
                  active
                    ? "bg-accent-brand/10 text-accent-brand dark:bg-accent-readable/15 dark:text-accent-readable"
                    : "bg-muted/30 text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
