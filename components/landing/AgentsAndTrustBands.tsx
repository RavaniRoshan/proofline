"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  HelpCircle,
  Terminal,
  Cpu,
  Copy,
  Check,
  Hand,
  Ban,
  ShieldAlert,
} from "lucide-react";
import { MeshCardBackdrop } from "@/components/landing/HeroTunnelCanvas";

interface GridItem {
  id: string;
  title: string;
  badgeColor: string;
  actionType: "link" | "copy";
  actionLabel: string;
  href?: string;
  copyPayload?: string;
}

const EIGHT_GRID_ITEMS: GridItem[] = [
  {
    id: "supported",
    title: "SUPPORTED",
    badgeColor: "text-v-supported-fg bg-v-supported-bg",
    actionType: "link",
    actionLabel: "Inspect Verdict",
    href: "/check",
  },
  {
    id: "contradicted",
    title: "CONTRADICTED",
    badgeColor: "text-v-contradicted-fg bg-v-contradicted-bg",
    actionType: "link",
    actionLabel: "Inspect Verdict",
    href: "/check",
  },
  {
    id: "stale",
    title: "STALE",
    badgeColor: "text-v-stale-fg bg-v-stale-bg",
    actionType: "link",
    actionLabel: "Inspect Verdict",
    href: "/facts",
  },
  {
    id: "conflicting",
    title: "CONFLICTING",
    badgeColor: "text-v-conflicting-fg bg-v-conflicting-bg",
    actionType: "link",
    actionLabel: "Inspect Verdict",
    href: "/facts",
  },
  {
    id: "unverified",
    title: "UNVERIFIED",
    badgeColor: "text-v-unverified-fg bg-v-unverified-bg",
    actionType: "link",
    actionLabel: "Inspect Verdict",
    href: "/check",
  },
  {
    id: "not_checkable",
    title: "NOT_CHECKABLE",
    badgeColor: "text-v-notcheckable-fg bg-v-notcheckable-bg",
    actionType: "copy",
    actionLabel: "Copy Rule",
    copyPayload:
      '{"verdict":"NOT_CHECKABLE","reason":"Subjective marketing puffery with no checkable predicate"}',
  },
  {
    id: "rest_api",
    title: "POST /api/verify",
    badgeColor: "text-accent bg-accent/12",
    actionType: "copy",
    actionLabel: "Copy cURL",
    copyPayload: `curl -X POST http://localhost:3000/api/verify -H "Content-Type: application/json" -d '{"draft":"Flowdesk starts at ₹4,999/mo."}'`,
  },
  {
    id: "mcp",
    title: "Any MCP Client",
    badgeColor: "text-ink bg-panel",
    actionType: "copy",
    actionLabel: "Copy MCP URL",
    copyPayload: "http://localhost:3000/api/verify",
  },
];

export function EightSurfaceGrid() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const renderIcon = (id: string) => {
    switch (id) {
      case "supported":
        return <CheckCircle2 size={18} className="text-v-supported-fg" />;
      case "contradicted":
        return <XCircle size={18} className="text-v-contradicted-fg" />;
      case "stale":
        return <Clock size={18} className="text-v-stale-fg" />;
      case "conflicting":
        return <AlertTriangle size={18} className="text-v-conflicting-fg" />;
      case "unverified":
        return <HelpCircle size={18} className="text-v-unverified-fg" />;
      case "not_checkable":
        return <HelpCircle size={18} className="text-v-notcheckable-fg" />;
      case "rest_api":
        return <Terminal size={18} className="text-accent" />;
      default:
        return <Cpu size={18} className="text-ink" />;
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-[1158px] grid-cols-2 gap-3 md:grid-cols-4">
      {EIGHT_GRID_ITEMS.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-ink/10 bg-ink/[0.025] p-3 pt-6 transition-transform duration-200 hover:scale-[1.015]"
        >
          <div className="flex items-center justify-center gap-2.5 px-2">
            <span
              className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg ${item.badgeColor}`}
            >
              {renderIcon(item.id)}
            </span>
            <h3 className="text-center font-mono text-[13.5px] font-medium text-ink leading-tight">
              {item.title}
            </h3>
          </div>

          {item.actionType === "link" && item.href ? (
            <Link
              href={item.href}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-paper px-4 py-2.5 text-[13px] font-medium text-ink shadow-2xs transition-colors hover:border-ink/25 hover:bg-panel"
            >
              <span>{item.actionLabel}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleCopy(item.id, item.copyPayload || "")}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-ink/10 bg-paper px-4 py-2.5 text-[13px] font-medium text-ink shadow-2xs transition-colors hover:border-ink/25 hover:bg-panel"
            >
              <span>{copiedId === item.id ? "Copied!" : item.actionLabel}</span>
              {copiedId === item.id ? (
                <Check size={13} className="text-v-supported-fg" />
              ) : (
                <Copy size={13} className="text-ink-faint" />
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Replicates Composio Band 6 (07-band6-trust-security.png) 1:1:
 * 3 Cards where the visual illustration is at the top and the title + description are at the bottom.
 */
export function TrustSecurityCards() {
  const [ruleModes, setRuleModes] = useState<("allow" | "review" | "block")[]>([
    "allow",
    "review",
    "block",
  ]);

  const setRowMode = (rowIdx: number, mode: "allow" | "review" | "block") => {
    setRuleModes((prev) => prev.map((m, i) => (i === rowIdx ? mode : m)));
  };

  return (
    <div className="mx-auto grid w-full max-w-[1158px] grid-cols-1 gap-4 md:grid-cols-3">
      {/* =====================================================================
          CARD 1: "Your register, your rules" (07-band6-trust-security.png left)
          ===================================================================== */}
      <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-paper">
        {/* Top Visual Area */}
        <div className="flex flex-col border-b border-ink/8">
          {/* Silk Mesh Header with Floating Pill */}
          <div className="relative flex h-[126px] items-center justify-center overflow-hidden border-b border-ink/8 px-4">
            <MeshCardBackdrop />
            <div className="relative z-10 inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-paper px-5 py-2.5 text-[13.5px] font-medium text-ink shadow-md">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-accent/15 font-mono text-[11px] font-bold text-accent">
                P
              </span>
              <span>Connect Fact Register v4</span>
            </div>
          </div>

          {/* 3 Interactive Permission Rows */}
          <div className="divide-y divide-ink/8 px-5">
            {[
              { label: "Verify numeric & price claims", badge: "F" },
              { label: "Flag expired validity windows", badge: "F" },
              { label: "Emit unbacked contradictions", badge: "F" },
            ].map((row, idx) => {
              const mode = ruleModes[idx];
              return (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-3 text-[13px]"
                >
                  <div className="flex items-center gap-2.5 text-ink">
                    <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-accent/15 font-mono text-[10px] font-bold text-accent">
                      {row.badge}
                    </span>
                    <span className="truncate">{row.label}</span>
                  </div>

                  {/* 3-State Segmented Control (Allow / Review / Block) */}
                  <div className="flex items-center gap-0.5 rounded-lg border border-ink/10 bg-panel/60 p-0.5">
                    <button
                      type="button"
                      aria-label={`Allow ${row.label}`}
                      onClick={() => setRowMode(idx, "allow")}
                      className={`inline-flex size-6 items-center justify-center rounded-md transition-colors cursor-pointer ${
                        mode === "allow"
                          ? "bg-paper text-v-supported-fg shadow-2xs"
                          : "text-ink-faint hover:text-ink"
                      }`}
                    >
                      <CheckCircle2 size={13} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Review ${row.label}`}
                      onClick={() => setRowMode(idx, "review")}
                      className={`inline-flex size-6 items-center justify-center rounded-md transition-colors cursor-pointer ${
                        mode === "review"
                          ? "bg-paper text-v-stale-fg shadow-2xs"
                          : "text-ink-faint hover:text-ink"
                      }`}
                    >
                      <Hand size={13} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Block ${row.label}`}
                      onClick={() => setRowMode(idx, "block")}
                      className={`inline-flex size-6 items-center justify-center rounded-md transition-colors cursor-pointer ${
                        mode === "block"
                          ? "bg-paper text-v-contradicted-fg shadow-2xs"
                          : "text-ink-faint hover:text-ink"
                      }`}
                    >
                      <Ban size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Copy Area */}
        <div className="p-6">
          <h3 className="text-[18px] font-medium text-ink">
            Your register, your rules
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft text-pretty">
            Proofline never crawls unverified web pages. You choose which approved facts and
            validity windows govern every check.
          </p>
        </div>
      </article>

      {/* =====================================================================
          CARD 2: "Hallucinated citations get blocked" (07-band6-trust-security.png center)
          ===================================================================== */}
      <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-paper">
        {/* Top Visual Area: Skeleton Lines + Red Blocked Callout */}
        <div className="flex flex-1 flex-col justify-center border-b border-ink/8 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-accent/15 font-mono text-[10px] font-bold text-accent">
              M
            </span>
            <div className="h-2.5 w-24 rounded-full bg-ink/10" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-2.5 w-full rounded-full bg-ink/8" />
            <div className="h-2.5 w-4/5 rounded-full bg-ink/8" />
          </div>

          {/* Red-Bordered Blocked Injection / Citation Box */}
          <div className="rounded-2xl border border-v-contradicted-fg/30 bg-v-contradicted-bg/35 p-4 shadow-2xs">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-v-contradicted-bg px-2.5 py-0.5 font-mono text-[11px] font-semibold text-v-contradicted-fg">
              <ShieldAlert size={12} />
              <span>Blocked</span>
            </div>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-v-contradicted-fg line-through decoration-v-contradicted-fg/70">
              Emit CONTRADICTED against F-021 without resolving source_span or valid_until window.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-2.5 w-3/4 rounded-full bg-ink/8" />
            <div className="h-2.5 w-1/2 rounded-full bg-ink/8" />
          </div>
        </div>

        {/* Bottom Copy Area */}
        <div className="p-6">
          <h3 className="text-[18px] font-medium text-ink">
            Unbacked accusations get blocked
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft text-pretty">
            The runtime Evidence Gate intercepts any contradiction missing a document ID, byte
            span, or date window before a reviewer ever sees it.
          </p>
        </div>
      </article>

      {/* =====================================================================
          CARD 3: "Every decision on record" (07-band6-trust-security.png right)
          ===================================================================== */}
      <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-paper">
        {/* Top Visual Area: 4-Node Horizontal Timeline + Approved Action Card */}
        <div className="flex flex-1 flex-col justify-center border-b border-ink/8 p-6">
          <div className="relative flex items-center justify-between px-2">
            {/* Horizontal connecting line */}
            <div
              aria-hidden="true"
              className="absolute top-5 right-6 left-6 h-px bg-ink/15"
            />
            {[
              { icon: "S", time: "9:41", active: false, bg: "bg-panel text-ink" },
              {
                icon: "F",
                time: "9:41",
                active: false,
                bg: "bg-v-contradicted-bg text-v-contradicted-fg",
              },
              { icon: "P", time: "9:42", active: false, bg: "bg-ink text-paper" },
              {
                icon: "✓",
                time: "9:44",
                active: true,
                bg: "bg-v-supported-bg text-v-supported-fg",
              },
            ].map((node, idx) => (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-full border bg-paper shadow-2xs ${
                    node.active
                      ? "border-2 border-v-stale-fg/60 ring-4 ring-v-stale-bg/60"
                      : "border-ink/12"
                  }`}
                >
                  <span
                    className={`inline-flex size-5 items-center justify-center rounded-[4px] font-mono text-[10px] font-bold ${node.bg}`}
                  >
                    {node.icon}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-ink-faint tabular-nums">
                  {node.time}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Timeline Event Card */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-ink/10 bg-paper px-4 py-3.5 shadow-sm">
            <span className="text-[13.5px] font-medium text-ink">
              Updated starter price to ₹6,499
            </span>
            <span className="rounded-full bg-v-stale-bg px-2.5 py-0.5 font-mono text-[11px] font-semibold text-v-stale-fg">
              Approved
            </span>
          </div>
        </div>

        {/* Bottom Copy Area */}
        <div className="p-6">
          <h3 className="text-[18px] font-medium text-ink">
            Every decision on record
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft text-pretty">
            See every claim Proofline checked, which source document backed it, and every human
            sign-off in the append-only audit log.
          </p>
        </div>
      </article>
    </div>
  );
}
