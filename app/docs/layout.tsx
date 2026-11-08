import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import "./docs.css";

export const metadata = {
  title: "Proofline Documentation, Deterministic Claim Governance Engine",
  description:
    "Official documentation for Proofline: architecture, 3-stage deterministic verification pipeline, 6-field Evidence Gate invariants, REST API, and TypeScript SDK.",
};

export default function RootDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="proofline-docs min-h-dvh bg-background text-foreground">
      <RootProvider
        theme={{
          enabled: false,
        }}
      >
        <DocsLayout
          tree={source.pageTree}
          nav={{
            title: (
              <div className="flex items-center gap-2.5 font-mono">
                <span className="font-bold text-[#8B1E27] dark:text-accent-readable select-none text-base">
                  [ ]
                </span>
                <span className="text-foreground tracking-tight font-sans font-semibold text-[15px]">
                  Proofline
                </span>
                <span className="text-[11px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-[#8B1E27]/10 dark:bg-[#8B1E27]/25 text-[#8B1E27] dark:text-accent-readable font-bold">
                  Docs
                </span>
              </div>
            ),
            url: "/docs",
            children: (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/check"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#8B1E27] py-1 pr-1.5 pl-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-colors transition-transform duration-200 hover:bg-[#8B1E27]/90 active:scale-[0.98]"
                >
                  <span>Check a Draft</span>
                  <span className="flex size-5 items-center justify-center rounded-full bg-black/20 text-white">
                    <FaArrowRight className="size-2.5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            ),
          }}
          githubUrl="https://github.com/RavaniRoshan/proofline"
          links={[
            {
              text: "Preflight Checker",
              url: "/check",
            },
            {
              text: "Fact Register",
              url: "/facts",
            },
            {
              text: "Audit Journal",
              url: "/audit",
            },
            {
              text: "Telemetry",
              url: "/dashboard",
            },
          ]}
        >
          {children}
        </DocsLayout>
      </RootProvider>
    </div>
  );
}
