import Link from "next/link";
import { Header } from "@/components/ui/vercel-navbar";
import { NavLinks } from "@/components/NavLinks";
import { ResetDemo } from "@/components/ResetDemo";
import { BreadcrumbDropdown } from "@/components/ui/breadcrumb-dropdown";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Universal Vercel-Style Master Header */}
      <Header />

      {/* Synchronized App Workspace Navigation Bar */}
      <div className="sticky top-16 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="overflow-x-auto py-1 scrollbar-none">
            <NavLinks />
          </div>
          <div className="flex items-center gap-2.5 shrink-0 pl-3">
            <ResetDemo />
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4">
          <BreadcrumbDropdown />
        </div>
        {children}
      </main>

      {/* Editorial App Footer */}
      <footer className="border-t border-border/60 bg-panel/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-accent-brand dark:text-accent-readable font-semibold">[ ] Proofline</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>Deterministic Claim Governance Engine</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>Simulated Fictional Data (Flowdesk)</span>
            <span aria-hidden="true" className="text-border">·</span>
            <span>Zero server storage / 100% incognito-safe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="font-medium text-accent-brand dark:text-accent-readable hover:underline underline-offset-2">
              Architecture &amp; Thesis
            </Link>
            <a
              href="https://github.com/RavaniRoshan/proofline"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
