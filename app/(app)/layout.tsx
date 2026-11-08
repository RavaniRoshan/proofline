import Link from "next/link";
import { Header } from "@/components/ui/vercel-navbar";
import { AppSidebar } from "@/components/AppSidebar";
import { BreadcrumbDropdown } from "@/components/ui/breadcrumb-dropdown";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-semibold focus:uppercase focus:tracking-wider focus:text-white"
      >
        Skip to main content
      </a>
      {/* Universal Vercel-Style Master Header */}
      <Header />

      {/* Workspace Split Layout: Vertical Collapsible Left Sidebar + Main Content Stage */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)] relative">
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
          {/* Main Content Stage */}
          <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-4">
              <BreadcrumbDropdown />
            </div>
            {children}
          </main>

          {/* Editorial App Footer */}
          <footer className="border-t border-ink/15 dark:border-white/12 bg-[#F5F2EC] dark:bg-[#0A0908] mt-auto transition-colors duration-200">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6 text-xs text-[#5C564E] dark:text-[#9A9489]">
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
      </div>
    </div>
  );
}
