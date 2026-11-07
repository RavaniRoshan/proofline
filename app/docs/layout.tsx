import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { docsTree } from "@/lib/docs/page-tree";
import Link from "next/link";
import "fumadocs-ui/style.css";

export const metadata = {
  title: "Proofline Documentation — Deterministic Claim Governance Engine",
  description:
    "Official documentation for Proofline: architecture, 3-stage deterministic verification pipeline, 6-field Evidence Gate invariants, REST API, and TypeScript SDK.",
};

export default function RootDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="proofline-docs min-h-screen bg-background text-foreground">
      <RootProvider
        theme={{
          enabled: true,
          defaultTheme: "dark",
        }}
      >
        <DocsLayout
          tree={docsTree}
          nav={{
            title: (
              <div className="flex items-center gap-2 font-mono font-bold tracking-tight">
                <span className="text-primary font-bold text-lg select-none">[ ]</span>
                <span className="text-foreground tracking-wide font-sans font-semibold text-base">
                  Proofline Docs
                </span>
              </div>
            ),
            url: "/docs",
          }}
          githubUrl="https://github.com/RavaniRoshan/proofline"
          links={[
            {
              text: "Checker",
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
