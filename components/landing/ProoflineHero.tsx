"use client";

import { SunsetOrb } from "@/components/ui/sunset-orb";
import { StageGridBackdrop } from "@/components/landing/StageGridBackdrop";
import { HeroTunnelCanvas } from "@/components/landing/HeroTunnelCanvas";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface BriefTab {
  id: string;
  label: string;
  heading: string;
  rows: {
    status: "supported" | "stale" | "contradicted";
    title: string;
    owner: string;
    badge: string;
  }[];
}

const BRIEF_TABS: BriefTab[] = [
  {
    id: "outcomes",
    label: "Outcomes",
    heading: "Key Outcomes",
    rows: [
      {
        status: "supported",
        title: "Verified 14-day trial & ₹6,499 Starter tier against approved facts",
        owner: "Owner: Product Lead · F-021 (v4)",
        badge: "SUPPORTED",
      },
      {
        status: "stale",
        title: "Flagged the 99.99% uptime SLA claim pending final approval",
        owner: "Owner: Marketing Manager · DOC-003",
        badge: "NEEDS REVIEW",
      },
    ],
  },
  {
    id: "decisions",
    label: "Decisions",
    heading: "Reviewer Decisions",
    rows: [
      {
        status: "contradicted",
        title: "Rejected ₹4,999/mo draft claim — superseded by v4 pricing sheet",
        owner: "Decision: Reject & Fix · Span [412..468]",
        badge: "CONTRADICTED",
      },
      {
        status: "supported",
        title: "Approved Mumbai AES-256 regional hosting claim for launch",
        owner: "Decision: Approved · F-031 (DOC-004)",
        badge: "APPROVED",
      },
    ],
  },
  {
    id: "actions",
    label: "Action Items",
    heading: "Required Edits",
    rows: [
      {
        status: "contradicted",
        title: "Update Starter monthly price from ₹4,999 to ₹6,499 before publish",
        owner: "Assigned: Copywriter · Priority High",
        badge: "EDIT REQUIRED",
      },
      {
        status: "stale",
        title: "Remove expired Legacy Growth Plan ($29/seat) from renewal sequence",
        owner: "Assigned: Lifecycle Lead · Expired 2026-03-31",
        badge: "STALE WINDOW",
      },
    ],
  },
  {
    id: "questions",
    label: "Open Questions",
    heading: "Unverified Claims",
    rows: [
      {
        status: "stale",
        title: "Confirm whether SOC 2 Type II attestation letter is in register",
        owner: "Status: Unverified · 0 matching facts in B-flowdesk",
        badge: "UNVERIFIED",
      },
      {
        status: "supported",
        title: "Evidence Gate verified all 6 citation fields on active contradictions",
        owner: "Gate: 100% Pass · Zero hallucinated spans",
        badge: "GATE LOCKED",
      },
    ],
  },
];

interface MetricPill {
  id: string;
  dotColorClass: string;
  number: string;
  label: string;
}

const HERO_METRICS: MetricPill[] = [
  {
    id: "rules",
    dotColorClass: "bg-accent",
    number: "78%",
    label: "<1ms Deterministic Rules",
  },
  {
    id: "facts",
    dotColorClass: "bg-v-supported-fg",
    number: "42",
    label: "Seeded Flowdesk Facts",
  },
  {
    id: "gate",
    dotColorClass: "bg-v-stale-fg",
    number: "6-Field",
    label: "Evidence Gate",
  },
  {
    id: "smoke",
    dotColorClass: "bg-ink dark:bg-zinc-200",
    number: "24/24",
    label: "Smoke Eval Pass",
  },
];

export function ProoflineHero() {
  const viewportRef = useRef<HTMLElement>(null);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  // Tab list container and tab button refs for sliding pill indicator
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  // Update sliding pill coordinates on active tab change and window resize
  useEffect(() => {
    const updatePill = () => {
      const activeEl = tabRefs.current[activeTabIdx];
      const containerEl = tabListRef.current;
      if (activeEl && containerEl) {
        setPillStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          ready: true,
        });
      }
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activeTabIdx]);

  // WAI-ARIA arrow key navigation with zero animation delay
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % BRIEF_TABS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + BRIEF_TABS.length) % BRIEF_TABS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = BRIEF_TABS.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveTabIdx(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  // Entrance animation lifecycle
  // Standardized hook wrapping window.matchMedia("(prefers-reduced-motion: reduce)").matches
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;






    if (prefersReduced) {
      viewport.setAttribute("data-enter", "done");
      return;
    }

    viewport.setAttribute("data-enter", "run");
    const timer = window.setTimeout(() => {
      viewport.setAttribute("data-enter", "done");
    }, 850);

    return () => window.clearTimeout(timer);
  }, [prefersReduced]);

  const activeTab = BRIEF_TABS[activeTabIdx] ?? BRIEF_TABS[0];

  return (
    <section
      id="viewport"
      ref={viewportRef}
      aria-label="Proofline hero"
      className="relative bg-paper text-ink overflow-hidden"
    >
      <style>{`
        #viewport {
          --hero-sans: var(--font-figtree), 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

          /* Weights */
          --fw-light    : 388;
          --fw-regular  : 470;
          --fw-medium   : 500;
          --fw-semibold : 511;
          --fw-bold     : 577;
          --fw-black    : 783;

          /* Tracking */
          --tr-display : -0.052em;
          --tr-title   : -0.045em;
          --tr-heading : -0.020em;
          --tr-body    : -0.032em;
          --tr-eyebrow : -0.025em;
          --tr-ui      : -0.008em;
          --tr-cta     : -0.020em;
          --tr-meta    : -0.030em;
          --tr-item    : -0.022em;
          --tr-caption : -0.020em;
          --tr-tab     : -0.025em;
          --tr-wordmark: -0.015em;

          /* Proofline harmonized palette */
          --c-ink           : var(--ink);
          --c-ink-soft      : var(--ink-soft);
          --c-muted         : var(--ink-faint);
          --c-on-dark       : #FFFFFF;
          --c-on-light      : #1A1A18;
          --c-surface-nav   : var(--ink);
          --c-surface-card  : var(--panel);
          --c-surface-panel : var(--panel-elevated);
          --c-border-row    : var(--line);
          --c-oxide         : var(--oxide);
          --c-coral         : #D4847A;
          --c-slate         : var(--slate);

          /* Motion tokens */
          --ease-reveal : cubic-bezier(.22, 1, .36, 1);
          --ease-settle : cubic-bezier(.16, 1, .30, 1);

          position: relative;
          width: 100%;
          font-family: var(--hero-sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: geometricPrecision;
        }

        /* Floating Pill Navbar — Composio Precision with Dual Theme Support */
        /* Hero Copy Block */
        #viewport .pl-hero-copy {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: clamp(44px, 6vw, 72px);
          padding: 0 16px;
        }

        #viewport .pl-eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          margin-bottom: 18px;
          border-radius: 9999px;
          border: 1px solid rgba(110, 31, 38, 0.22);
          background: rgba(110, 31, 38, 0.05);
          font-family: var(--font-plex-mono), monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--c-oxide);
        }

        #viewport .pl-hero-h1 {
          margin: 0;
          max-width: 19ch;
          font-family: var(--hero-sans);
          font-size: clamp(34px, 4.5vw, 56px);
          font-weight: var(--fw-regular);
          font-variation-settings: "wght" 470;
          letter-spacing: var(--tr-display);
          line-height: 1.08;
          color: var(--c-ink);
          text-wrap: balance;
        }

        #viewport .pl-hero-sub {
          margin: 18px 0 0;
          max-width: 52ch;
          font-family: var(--hero-sans);
          font-size: clamp(15px, 1.3vw, 17px);
          font-weight: var(--fw-regular);
          font-variation-settings: "wght" 470;
          letter-spacing: var(--tr-body);
          line-height: 1.45;
          color: var(--c-ink-soft);
          text-wrap: balance;
        }

        #viewport .pl-hero-actions {
          margin-top: 26px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        #viewport .pl-btn-hero {
          height: 40px;
          padding: 0 24px;
          border-radius: 9999px;
          background: var(--c-ink);
          color: #FFFFFF;
          font-family: var(--hero-sans);
          font-size: 15px;
          font-weight: var(--fw-medium);
          font-variation-settings: "wght" 500;
          letter-spacing: var(--tr-cta);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: background-color var(--motion-duration-fast, 180ms) ease-out, transform var(--motion-duration-fast, 180ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)), box-shadow var(--motion-duration-fast, 180ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1));
          user-select: none;
          will-change: transform;
        }

        #viewport .pl-btn-hero:hover {
          background: var(--c-oxide);
          transform: translateY(-1px);
        }

        #viewport .pl-btn-hero:active {
          transform: scale(0.97);
          transition-duration: var(--motion-duration-press, 80ms);
        }

        #viewport .pl-btn-secondary {
          height: 40px;
          padding: 0 20px;
          border-radius: 9999px;
          border: 1px solid rgba(26, 26, 24, 0.16);
          background: #FFFFFF;
          color: var(--c-ink);
          font-family: var(--hero-sans);
          font-size: 14.5px;
          font-weight: var(--fw-medium);
          font-variation-settings: "wght" 500;
          letter-spacing: var(--tr-cta);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background-color var(--motion-duration-fast, 180ms) ease-out, border-color var(--motion-duration-fast, 180ms) ease-out, transform var(--motion-duration-fast, 180ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1));
          user-select: none;
          will-change: transform;
        }

        #viewport .pl-btn-secondary:hover {
          background: #F5F5F2;
          border-color: rgba(26, 26, 24, 0.32);
          transform: translateY(-1px);
        }

        #viewport .pl-btn-secondary:active {
          transform: scale(0.97);
          transition-duration: var(--motion-duration-press, 80ms);
        }

        /* Stage Band + Mockup Card Container — Seamless Transition into Band 2 */
        #viewport .pl-stage-wrap {
          position: relative;
          margin-top: clamp(36px, 4.5vw, 52px);
          width: 100%;
        }

                #viewport .pl-band {
          position: relative;
          width: 100%;
          border-radius: 28px;
          overflow: hidden;
          padding: clamp(28px, 4.5vw, 52px) clamp(16px, 3vw, 40px) clamp(32px, 4.5vw, 52px);
          background: var(--c-surface-card);
          border: 1px solid var(--c-border-row);
          box-shadow: 0 12px 36px -10px rgba(26, 26, 24, 0.06);
        }

        /* Product Mockup Card (Unclipped, Responsive, Interactive) */
        #viewport .pl-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 660px;
          margin: 0 auto;
          background: var(--c-surface-card);
          border-radius: 20px;
          padding: clamp(18px, 2.8vw, 24px);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.65),
            0 0 14px 3px rgba(212, 132, 122, 0.22),
            0 24px 64px rgba(15, 12, 12, 0.42);
        }

        #viewport .pl-card-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        #viewport .pl-eyebrow {
          font-family: var(--hero-sans);
          font-size: 14.5px;
          font-weight: var(--fw-light);
          font-variation-settings: "wght" 388;
          letter-spacing: var(--tr-eyebrow);
          color: var(--c-ink-soft);
        }

        #viewport .pl-cardtitle {
          margin: 4px 0 0;
          font-family: var(--hero-sans);
          font-size: clamp(20px, 2.4vw, 24px);
          font-weight: var(--fw-light);
          font-variation-settings: "wght" 420;
          letter-spacing: var(--tr-title);
          line-height: 1.1;
          color: var(--c-ink);
        }

        #viewport .pl-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: #DDEBE0;
          color: #1F5C43;
          font-family: var(--font-plex-mono), monospace;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        #viewport .pl-meta {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        #viewport .pl-avatars {
          display: inline-flex;
          align-items: center;
        }

        #viewport .pl-av {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          background-size: cover;
          background-position: center;
        }

        #viewport .pl-av + .pl-av {
          margin-left: -9px;
        }

        #viewport .pl-av1 {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%236E1F26'/><circle cx='20' cy='15' r='9' fill='%23e8c4a0'/><ellipse cx='20' cy='38' rx='14' ry='13' fill='%232A3632'/></svg>");
        }
        #viewport .pl-av2 {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%233B4A45'/><circle cx='20' cy='16' r='9' fill='%23d9a882'/><ellipse cx='20' cy='38' rx='14' ry='13' fill='%231A1A18'/></svg>");
        }
        #viewport .pl-av3 {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%238d6a52'/><circle cx='20' cy='15' r='9' fill='%23dda882'/><ellipse cx='20' cy='38' rx='14' ry='13' fill='%23571820'/></svg>");
        }

        #viewport .pl-metatext {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-family: var(--hero-sans);
          font-size: 13.5px;
          font-weight: var(--fw-light);
          font-variation-settings: "wght" 400;
          letter-spacing: var(--tr-meta);
          color: var(--c-muted);
        }

        /* Interactive Card Tabs */
        #viewport .pl-tabs {
          position: relative;
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
        }

        /* Sliding active tab indicator pill */
        #viewport .pl-tab-pill {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          background: #FFFFFF;
          border-radius: 10px 10px 0 0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          pointer-events: none;
          z-index: 1;
          transition:
            transform var(--motion-duration-standard, 240ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)),
            width var(--motion-duration-standard, 240ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)),
            opacity var(--motion-duration-micro, 120ms) ease;
          will-change: transform, width;
        }

        #viewport .pl-tab-pill::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 12px;
          right: 12px;
          height: 2px;
          background: var(--c-oxide);
          border-radius: 9999px;
        }

        #viewport .pl-tab {
          position: relative;
          z-index: 2;
          height: 34px;
          padding: 0 16px;
          border: 0;
          background: transparent !important;
          border-radius: 10px 10px 0 0;
          font-family: var(--hero-sans);
          font-size: 13px;
          font-weight: var(--fw-regular);
          font-variation-settings: "wght" 440;
          letter-spacing: var(--tr-tab);
          color: var(--c-muted);
          cursor: pointer;
          user-select: none;
          outline: none;
          transition:
            color 150ms ease,
            transform var(--motion-duration-micro, 120ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1));
          will-change: transform;
          white-space: nowrap;
        }

        #viewport .pl-tab:hover {
          color: var(--c-ink);
        }

        #viewport .pl-tab:active {
          transform: scale(0.97);
          transition-duration: var(--motion-duration-press, 80ms);
        }

        #viewport .pl-tab:focus-visible {
          outline: 2px solid var(--c-oxide);
          outline-offset: -2px;
          transition-delay: 0ms !important;
        }

        #viewport .pl-tab.is-active {

          color: var(--c-ink);
          font-weight: var(--fw-semibold);
          font-variation-settings: "wght" 540;
        }

        /* Jakub Krehel Row Materialize Enter Animation */
        @keyframes pl-row-materialize {
          0% {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        #viewport .pl-row-enter {
          animation: pl-row-materialize var(--motion-duration-fast, 180ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) backwards;
          animation-delay: min(calc(var(--row-idx, 0) * 35ms), 80ms);
          will-change: transform, opacity, filter;
        }

        /* Heading crossfade */
        @keyframes pl-heading-crossfade {
          0% {
            opacity: 0;
            transform: translateX(-4px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        #viewport .pl-heading-crossfade {
          animation: pl-heading-crossfade var(--motion-duration-fast, 180ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) backwards;
        }

        /* Architectural Transition Strip (Band 1 -> Band 2 Bridge) */
        #viewport .pl-strip {
          position: relative;
          background: rgba(245, 245, 242, 0.65);
          border: 1px solid rgba(26, 26, 24, 0.10);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: border-color var(--motion-duration-fast, 180ms) var(--ease-mechanical);
        }

        #viewport .pl-stat-pill {
          position: relative;
          border: 1px solid transparent;
          cursor: default;
          will-change: transform, box-shadow;
          transition:
            transform var(--motion-duration-micro, 120ms) var(--ease-mechanical),
            background-color var(--motion-duration-micro, 120ms) var(--ease-mechanical),
            border-color var(--motion-duration-micro, 120ms) var(--ease-mechanical),
            box-shadow var(--motion-duration-micro, 120ms) var(--ease-mechanical);
        }

        #viewport .pl-stat-pill:hover {
          transform: translateY(-1px);
          background: #FFFFFF;
          border-color: rgba(26, 26, 24, 0.08);
          box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.06);
        }

        #viewport .pl-stat-num {
          font-weight: 600;
          color: var(--c-ink);
          letter-spacing: -0.01em;
        }

        #viewport .pl-stat-label {
          color: var(--c-muted);
        }

        /* Stagger Entrance for Metric Pills (Beat 3: Find) */
        @keyframes pl-stat-enter {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #viewport[data-enter="run"] .pl-stat-pill {
          animation: pl-stat-enter var(--motion-duration-fast, 180ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) backwards;
          animation-delay: calc(320ms + var(--stat-idx, 0) * 45ms);
        }









        /* White Inner Panel */
        #viewport .pl-panel {
          background: var(--c-surface-panel);
          border-radius: 0 12px 12px 12px;
          padding: 16px;
          border: 1px solid rgba(26, 26, 24, 0.06);
        }

        #viewport .pl-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 12px;
        }

        #viewport .pl-panel-heading {
          margin: 0;
          font-family: var(--hero-sans);
          font-size: 16.5px;
          font-weight: var(--fw-semibold);
          font-variation-settings: "wght" 530;
          letter-spacing: var(--tr-heading);
          color: var(--c-ink);
        }

        #viewport .pl-rows {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        #viewport .pl-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 13px;
          background: #FFFFFF;
          border: 1px solid var(--c-border-row);
          border-radius: 10px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        #viewport .pl-row-left {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: 0;
        }

        #viewport .pl-dot {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        #viewport .pl-rowtitle {
          font-family: var(--hero-sans);
          font-size: 13.5px;
          font-weight: var(--fw-medium);
          font-variation-settings: "wght" 500;
          letter-spacing: var(--tr-item);
          line-height: 1.35;
          color: var(--c-ink);
        }

        #viewport .pl-rowowner {
          margin-top: 3px;
          font-family: var(--hero-sans);
          font-size: 12px;
          font-weight: var(--fw-light);
          font-variation-settings: "wght" 400;
          letter-spacing: var(--tr-caption);
          color: var(--c-muted);
        }

        #viewport .pl-row-badge {
          flex-shrink: 0;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: var(--font-plex-mono), monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        /* Responsive Breakpoint for Navbar (< 940px) */
        @media (max-width: 939.98px) {
          #viewport .pl-nav-links,
          #viewport .pl-btn-nav {
            display: none;
          }
          #viewport .pl-burger,
          #viewport .pl-navmenu {
            display: flex;
          }
        }

        @media (max-width: 639.98px) {
          #viewport .pl-eyebrow-pill {
            font-size: 10.5px;
            padding: 4px 11px;
            gap: 6px;
          }
          #viewport .pl-band {
            border-radius: 20px;
            padding: 18px 12px 22px;
          }
          #viewport .pl-card {
            border-radius: 16px;
            padding: 14px;
          }
          #viewport .pl-tabs {
            flex-wrap: nowrap;
            gap: 2px;
          }
          #viewport .pl-tab {
            padding: 0 8px;
            font-size: 11.5px;
            height: 31px;
            flex: 1 1 auto;
            text-align: center;
            justify-content: center;
          }

          #viewport .pl-tab-pill::after {
            left: 6px;
            right: 6px;
          }
          #viewport .pl-panel {
            border-radius: 8px 8px 12px 12px;
            padding: 13px;
          }
          #viewport .pl-panel-heading {
            font-size: 15px;
            white-space: nowrap;
          }
          #viewport .pl-row-badge {
            display: none;
          }
        }

        /* ===== Satori Graphics Temporal Flow & Jakub Krehel Optical Blur-Rise ===== */
        @keyframes pl-enter-rise {
          0% {
            opacity: 0;
            transform: translateY(12px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }









        /* Beat 1 (Notice): Eyebrow Pill with Kinetic Bracket Lockup & Display H1 */
        #viewport[data-enter="run"] .pl-eyebrow-pill {
          animation: pl-enter-rise var(--motion-duration-hero, 420ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) 0ms backwards;
          will-change: transform, opacity, filter;
        }

        #viewport[data-enter="run"] .pl-hero-h1 {
          animation: pl-enter-rise var(--motion-duration-hero, 420ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) 60ms backwards;
          will-change: transform, opacity, filter;
        }

        /* Beat 2 (Understand): Subtitle Copy & Verification Brief Stage Mockup */
        #viewport[data-enter="run"] .pl-hero-sub {
          animation: pl-enter-rise var(--motion-duration-hero, 420ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) 160ms backwards;
          will-change: transform, opacity, filter;
        }

        #viewport[data-enter="run"] .pl-stage-wrap .pl-band {
          animation: pl-enter-rise var(--motion-duration-hero, 420ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) 220ms backwards;
          will-change: transform, opacity, filter;
        }

        /* Beat 3 (Find afterwards): CTAs & Architectural Transition Strip */
        #viewport[data-enter="run"] .pl-hero-actions {
          animation: pl-enter-rise var(--motion-duration-hero, 420ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) 300ms backwards;
          will-change: transform, opacity, filter;
        }

        #viewport[data-enter="run"] .pl-transition-strip {
          animation: pl-enter-rise var(--motion-duration-hero, 420ms) var(--ease-arrival, cubic-bezier(0.16, 1, 0.3, 1)) 360ms backwards;
          will-change: transform, opacity, filter;
        }









        
        /* High-Contrast Dark Mode Overrides — Guarantees 100% Text & CTA Visibility */
        :where(.dark, html.dark) #viewport {
          background-color: var(--paper) !important;
          color: var(--ink) !important;
        }

        :where(.dark, html.dark) #viewport .pl-hero-h1 {
          color: #F4F4F5 !important;
        }

        :where(.dark, html.dark) #viewport .pl-hero-sub {
          color: #A1A1AA !important;
        }

        :where(.dark, html.dark) #viewport .pl-btn-hero {
          background: #FFFFFF !important;
          color: #09090B !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.16) !important;
        }

        :where(.dark, html.dark) #viewport .pl-btn-hero:hover {
          background: #F4F4F5 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.24) !important;
        }

        :where(.dark, html.dark) #viewport .pl-btn-hero:active {
          transform: scale(0.97) !important;
          transition-duration: var(--motion-duration-press, 80ms) !important;
        }

        :where(.dark, html.dark) #viewport .pl-btn-secondary {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #FFFFFF !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        :where(.dark, html.dark) #viewport .pl-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.14) !important;
          border-color: rgba(255, 255, 255, 0.35) !important;
          transform: translateY(-1px) !important;
        }

        :where(.dark, html.dark) #viewport .pl-btn-secondary:active {
          transform: scale(0.97) !important;
          transition-duration: var(--motion-duration-press, 80ms) !important;
        }

        :where(.dark, html.dark) #viewport .pl-eyebrow-pill {
          background: rgba(212, 132, 122, 0.14) !important;
          border: 1px solid rgba(212, 132, 122, 0.35) !important;
          color: #F2A79F !important;
        }

        :where(.dark, html.dark) #viewport .pl-card {
          background: #141418 !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.6) !important;
        }

        :where(.dark, html.dark) #viewport .pl-band {
          background: #0E0E12 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5) !important;
        }

        :where(.dark, html.dark) #viewport .pl-row {
          background: #14141A !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        :where(.dark, html.dark) #viewport .pl-metatext {
          color: #A1A1AA !important;
        }

        :where(.dark, html.dark) #viewport .pl-live-badge {
          background: rgba(34, 197, 94, 0.16) !important;
          color: #4ADE80 !important;
        }

        :where(.dark, html.dark) #viewport .pl-av {
          border-color: #141418 !important;
        }

        :where(.dark, html.dark) #viewport .pl-cardtitle {
          color: #FFFFFF !important;
        }

        :where(.dark, html.dark) #viewport .pl-eyebrow {
          color: #A1A1AA !important;
        }

        :where(.dark, html.dark) #viewport .pl-panel {
          background: #1A1A20 !important;
        }

        :where(.dark, html.dark) #viewport .pl-panel-heading {
          color: #FFFFFF !important;
        }

        :where(.dark, html.dark) #viewport .pl-rowtitle {
          color: #E4E4E7 !important;
        }

        :where(.dark, html.dark) #viewport .pl-rowowner {
          color: #A1A1AA !important;
        }

        :where(.dark, html.dark) #viewport .pl-tabs {
          background: #1A1A20 !important;
        }

        :where(.dark, html.dark) #viewport .pl-tab {
          color: #A1A1AA !important;
        }

        :where(.dark, html.dark) #viewport .pl-tab:hover {
          color: #F4F4F5 !important;
        }

        :where(.dark, html.dark) #viewport .pl-tab-pill {
          background: #272732 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4) !important;
        }

        :where(.dark, html.dark) #viewport .pl-tab.is-active {

          color: #FFFFFF !important;
        }

        :where(.dark, html.dark) #viewport .pl-strip {
          background: #141418 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        :where(.dark, html.dark) #viewport .pl-stat-num {
          color: #FFFFFF !important;
        }

        :where(.dark, html.dark) #viewport .pl-stat-label {
          color: #A1A1AA !important;
        }







      `}</style>

      {/* 21st.dev Sunset Orb Background Shader */}
      <SunsetOrb
        className="absolute inset-0 h-full w-full pointer-events-none"
        intensity="medium"
        animated={true}
        grain={true}
      />

      {/* Framed inside the continuous 1240px border-x page rails so the hero flows directly into Band 2 */}
      <div className="relative z-10 mx-auto w-full max-w-[1240px] border-x border-ink/10 px-4 pt-6 pb-10 sm:px-6 md:px-10 md:pt-9 md:pb-14">
        {/* 2. Hero Headline, Subcopy & CTA */}
        <div className="pl-hero-copy">
          <div className="pl-eyebrow-pill group cursor-default" tabIndex={0} role="status">
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-[2px] font-mono text-[13px] font-bold leading-none tracking-tight text-accent-brand dark:text-accent-readable logomark-lock"
            >
              <span className="logomark-bracket-left"><span>[</span></span>
              <span className="size-1 rounded-full bg-current opacity-70 group-hover:opacity-100 transition-opacity duration-fast" />
              <span className="logomark-bracket-right"><span>]</span></span>
            </span>
            <span className="whitespace-nowrap">DETERMINISTIC CLAIM-EVIDENCE CHECKER</span>
          </div>

          <h1 className="pl-hero-h1">
            Convert marketing drafts into clear, verified claims
          </h1>

          <p className="pl-hero-sub">
            From draft copy to auditable fact verdicts, powered by Proofline’s
            owner-approved register and runtime Evidence Gate. Skip the manual review.
          </p>

          <div className="pl-hero-actions">
            <Link href="/check" className="pl-btn-hero group">
              <span>Get Started</span>
              <span aria-hidden="true" className="inline-block transition-transform duration-micro ease-arrival group-hover:translate-x-0.5">→</span>
            </Link>
            <a href="#how-it-works" className="pl-btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        {/* 3. Harmonized Oxblood/Ink Video Band + Full Unclipped Interactive Product Card */}
        <div className="pl-stage-wrap">
          <div className="pl-band" role="presentation">
            <HeroTunnelCanvas />
            <StageGridBackdrop />

            <div className="pl-card">
              <div className="pl-card-header">
                <div>
                  <div className="pl-eyebrow">
                    # Flowdesk Launch 1742m / Strategy Sync
                  </div>
                  <h2 className="pl-cardtitle">Verification Brief</h2>
                </div>
                <span className="pl-live-badge">
                  <span className="size-1.5 rounded-full bg-[#1F5C43]" />
                  <span>Aligned · 42 Facts</span>
                </span>
              </div>

              <div className="pl-meta">
                <div className="pl-avatars" aria-hidden="true">
                  <span className="pl-av pl-av1" />
                  <span className="pl-av pl-av2" />
                  <span className="pl-av pl-av3" />
                </div>

                <div className="pl-metatext">
                  <span>Today at 10:30 a.m.</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>42 approved facts</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>78% Stage 1 rules</span>
                </div>
              </div>

              {/* Interactive Tabs with Animated Sliding Pill */}
              <div
                ref={tabListRef}
                className="pl-tabs"
                role="tablist"
                aria-label="Verification brief sections"
              >
                {/* Hardware-accelerated sliding active tab indicator pill */}
                <div
                  className="pl-tab-pill"
                  aria-hidden="true"
                  style={{
                    transform: `translate3d(${pillStyle.left}px, 0, 0)`,
                    width: `${pillStyle.width}px`,
                    opacity: pillStyle.ready ? 1 : 0,
                  }}
                />
                {BRIEF_TABS.map((tab, idx) => {
                  const isSelected = idx === activeTabIdx;
                  return (
                    <button
                      key={tab.id}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      id={`hero-tab-${tab.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-controls={`hero-panel-${tab.id}`}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setActiveTabIdx(idx)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={`pl-tab${isSelected ? " is-active" : ""}`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Panel */}
              <div
                id={`hero-panel-${activeTab.id}`}
                className="pl-panel"
                role="tabpanel"
                aria-labelledby={`hero-tab-${activeTab.id}`}
              >
                <div className="pl-panel-head">
                  <h3 key={activeTab.id} className="pl-panel-heading pl-heading-crossfade">
                    {activeTab.heading}
                  </h3>
                  <Link
                    href="/check"
                    className="font-mono text-[11px] uppercase tracking-wider text-accent hover:underline"
                  >
                    Open in Checker →
                  </Link>
                </div>

                <div key={activeTab.id} className="pl-rows">
                  {activeTab.rows.map((row, rowIdx) => (
                    <div
                      key={row.title}
                      className="pl-row pl-row-enter"
                      style={{ "--row-idx": rowIdx } as React.CSSProperties}
                    >
                      <div className="pl-row-left">
                        {row.status === "supported" && (
                          <svg
                            className="pl-dot"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle cx="7" cy="7" r="7" fill="#1F5C43" />
                            <path
                              d="M4.1 7.15 6.05 9.05 9.9 5.2"
                              stroke="#fff"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {row.status === "stale" && (
                          <svg
                            className="pl-dot"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle cx="7" cy="7" r="7" fill="#7E4A10" />
                            <path
                              d="M5.6 5.25C5.6 4.45 6.22 3.9 7.02 3.9C7.82 3.9 8.42 4.45 8.42 5.2C8.42 5.78 8.05 6.18 7.52 6.5C7.14 6.73 6.97 7.02 6.97 7.55V7.85"
                              stroke="#fff"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                            />
                            <circle cx="6.97" cy="10.05" r="0.78" fill="#fff" />
                          </svg>
                        )}
                        {row.status === "contradicted" && (
                          <svg
                            className="pl-dot"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle cx="7" cy="7" r="7" fill="#A8261C" />
                            <path
                              d="M4.6 4.6 9.4 9.4M9.4 4.6 4.6 9.4"
                              stroke="#fff"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        <div>
                          <div className="pl-rowtitle">{row.title}</div>
                          <div className="pl-rowowner">{row.owner}</div>
                        </div>
                      </div>

                      <span
                        className={`pl-row-badge ${
                          row.status === "supported"
                            ? "bg-v-supported-bg text-v-supported-fg"
                            : row.status === "contradicted"
                              ? "bg-v-contradicted-bg text-v-contradicted-fg"
                              : "bg-v-stale-bg text-v-stale-fg"
                        }`}
                      >
                        {row.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Transition Strip connecting Hero Band smoothly into Band 2 */}
          <div
            className="pl-transition-strip pl-strip mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-ink/10 bg-panel/65 p-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft sm:grid-cols-4 sm:p-2.5"
            role="region"
            aria-label="Proofline platform architecture metrics"
          >
            {HERO_METRICS.map((metric, idx) => (
              <div
                key={metric.id}
                className="pl-stat-pill group flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-micro ease-mechanical hover:-translate-y-px hover:bg-paper hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] dark:hover:bg-panel-elevated dark:hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]"
                style={{ "--stat-idx": idx } as React.CSSProperties}
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${metric.dotColorClass} transition-transform duration-micro ease-mechanical group-hover:scale-125`}
                  aria-hidden="true"
                />
                <div className="flex items-baseline gap-1.5 truncate">
                  <span className="pl-stat-num font-semibold text-ink dark:text-white">
                    {metric.number}
                  </span>
                  <span className="pl-stat-label text-ink-soft dark:text-zinc-400">
                    {metric.label}
                  </span>
                </div>
              </div>
            ))}
















          </div>
        </div>
      </div>
    </section>
  );
}
