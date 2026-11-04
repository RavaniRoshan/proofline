"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Check" },
  { href: "/facts", label: "Facts" },
  { href: "/audit", label: "Audit" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
] as const;

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Views" className="flex items-center gap-1 text-sm">
      {LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
              active ? "bg-accent/10 text-accent" : "text-muted hover:bg-background hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
