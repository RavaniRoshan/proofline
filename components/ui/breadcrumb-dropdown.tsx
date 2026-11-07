"use client";

// next
import Link from "next/link";
import { usePathname } from "next/navigation";

// shadcn
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// assets
import {
  ChevronDownIcon,
  DotIcon,
  ShieldCheck,
  Database,
  ScrollText,
  BarChart3,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";

//  ------------------------------ | BREADCRUMB - DROPDOWN (PRIMITIVE) | ------------------------------  //

export function BreadcrumbDropdown() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex h-auto items-center gap-1 p-0 hover:bg-transparent aria-expanded:bg-transparent aria-expanded:text-inherit dark:hover:bg-transparent text-xs font-mono"
                />
              }
            >
              Components
              <ChevronDownIcon data-icon="inline-end" className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/check">Preflight Checker</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/facts">Fact Register</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/audit">Audit Journal</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

//  ------------------------------ | PROOFLINE APP CONTEXT BREADCRUMB | ------------------------------  //

const VIEWS = [
  { href: "/dashboard", label: "Operational Telemetry", icon: BarChart3, badge: "04" },
  { href: "/check", label: "Preflight Claim Governance", icon: ShieldCheck, badge: "01" },
  { href: "/facts", label: "Ground Truth Register", icon: Database, badge: "02" },
  { href: "/audit", label: "Compliance Journal", icon: ScrollText, badge: "03" },
  { href: "/about", label: "Architecture Specification", icon: Info, badge: "05" },
];

export function ProoflineBreadcrumb({
  currentPageTitle,
}: {
  currentPageTitle?: string;
}) {
  const pathname = usePathname();
  const currentView = VIEWS.find((v) => v.href === pathname) || VIEWS[0];

  return (
    <Breadcrumb className="py-1">
      <BreadcrumbList>
        {/* Brand Home Anchor */}
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link
                href="/"
                className="font-mono text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
              />
            }
          >
            <span>[ ] Proofline</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <DotIcon className="size-4 text-muted-foreground/60" />
        </BreadcrumbSeparator>

        {/* View Switcher Dropdown */}
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex h-auto items-center gap-1 p-0 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-transparent aria-expanded:text-foreground cursor-pointer"
                />
              }
            >
              <span className="font-semibold">{currentView.label}</span>
              <ChevronDownIcon data-icon="inline-end" className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 font-mono text-xs">
              <DropdownMenuGroup>
                {VIEWS.map(({ href, label, icon: Icon, badge }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link
                      href={href}
                      className="flex items-center justify-between cursor-pointer w-full py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-[#8B1E27] dark:text-[#D4847A]" />
                        <span>{label}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">[{badge}]</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        {/* Optional Sub-resource or Detail View */}
        {currentPageTitle && (
          <>
            <BreadcrumbSeparator>
              <DotIcon className="size-4 text-muted-foreground/60" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-mono text-xs text-foreground font-semibold">
                {currentPageTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
