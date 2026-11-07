import * as PageTree from "fumadocs-core/page-tree";

export const docsTree: PageTree.Root = {
  name: "Proofline Docs",
  children: [
    {
      type: "page",
      name: "Overview & Quickstart",
      url: "/docs",
    },
    {
      type: "separator",
      name: "Core Architecture",
    },
    {
      type: "page",
      name: "Deterministic Verification Engine",
      url: "/docs/architecture",
    },
    {
      type: "page",
      name: "6-Field Evidence Gate & Invariants",
      url: "/docs/evidence-gate",
    },
    {
      type: "page",
      name: "Fact Register & Lineage Schema",
      url: "/docs/fact-register",
    },
    {
      type: "separator",
      name: "Developer Integration",
    },
    {
      type: "page",
      name: "REST API Reference (POST /api/verify)",
      url: "/docs/api-reference",
    },
    {
      type: "page",
      name: "TypeScript SDK (verifyDraft)",
      url: "/docs/typescript-sdk",
    },
    {
      type: "separator",
      name: "Enterprise & Security",
    },
    {
      type: "page",
      name: "Local-First Privacy & Zero Retention",
      url: "/docs/security-compliance",
    },
  ],
};
