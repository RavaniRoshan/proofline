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
} from "lucide-react";

const WORKSPACE_MODULES = [
  { href: "/dashboard", label: "Operational Telemetry", icon: BarChart3, badge: "04" },
  { href: "/check", label: "Preflight Claim Governance", icon: ShieldCheck, badge: "01" },
  { href: "/facts", label: "Ground Truth Register", icon: Database, badge: "02" },
  { href: "/audit", label: "Compliance Journal", icon: ScrollText, badge: "03" },
  { href: "/about", label: "Architecture Specification", icon: Info, badge: "05" },
];

export interface BreadcrumbDropdownProps {
  homeLabel?: string;
  homeHref?: string;
  sectionLabel?: string;
  pageLabel?: string;
}

//  ------------------------------ | BREADCRUMB - DROPDOWN | ------------------------------  //

export function BreadcrumbDropdown({
  homeLabel = "Proofline",
  homeHref = "/",
  sectionLabel,
  pageLabel,
}: BreadcrumbDropdownProps = {}) {
  const pathname = usePathname();
  const activeModule = WORKSPACE_MODULES.find((m) => m.href === pathname);

  const displaySection = sectionLabel ?? "Workspace";
  const displayPage = pageLabel ?? activeModule?.label ?? "Operational Telemetry";

  return (
    <Breadcrumb className="py-0.5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={homeHref} />}>
            <span className="font-mono text-xs font-semibold text-muted-foreground hover:text-foreground">
              [ ] {homeLabel}
            </span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <DotIcon className="size-4 text-muted-foreground/60" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex h-auto items-center gap-1 p-0 hover:bg-transparent aria-expanded:bg-transparent aria-expanded:text-inherit dark:hover:bg-transparent font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                />
              }
            >
              <span>{displaySection}</span>
              <ChevronDownIcon data-icon="inline-end" className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 font-mono text-xs">
              <DropdownMenuGroup>
                {WORKSPACE_MODULES.map(({ href, label, icon: Icon, badge }) => (
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
        <BreadcrumbSeparator>
          <DotIcon className="size-4 text-muted-foreground/60" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-mono text-xs text-foreground font-semibold">
            {displayPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbDropdown;
