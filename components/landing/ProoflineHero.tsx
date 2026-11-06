"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125119_4963ddd4-c287-4044-b014-b68943cdd8bd.mp4";
const VIDEO_POSTER =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125039_45a71f04-36dd-4620-99d8-7526316d439e.png";

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

export function ProoflineHero() {
  const viewportRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  // Entrance animation lifecycle
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      viewport.setAttribute("data-enter", "done");
      return;
    }

    viewport.setAttribute("data-enter", "run");
    const timer = window.setTimeout(() => {
      viewport.setAttribute("data-enter", "done");
    }, 1900);

    return () => window.clearTimeout(timer);
  }, []);

  // Close mobile/tablet menu on outside click, Escape, or desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 940) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const activeTab = BRIEF_TABS[activeTabIdx] ?? BRIEF_TABS[0];

  return (
    <section
      id="viewport"
      ref={viewportRef}
      aria-label="Proofline hero"
      className="bg-paper text-ink"
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
          --c-ink           : #1A1A18;
          --c-ink-soft      : #3A3A36;
          --c-muted         : #6E6E68;
          --c-on-dark       : #FFFFFF;
          --c-on-light      : #1A1A18;
          --c-surface-nav   : #1A1A18;
          --c-surface-card  : #F5F5F2;
          --c-surface-panel : #FFFFFF;
          --c-border-row    : #E6E6E0;
          --c-oxide         : #6E1F26;
          --c-coral         : #D4847A;
          --c-slate         : #3B4A45;

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

        /* Floating Pill Navbar */
        #viewport .pl-nav {
          position: relative;
          width: 100%;
          max-width: 880px;
          height: 54px;
          margin: 0 auto;
          padding: 0 10px 0 14px;
          background: var(--c-surface-nav);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 14px 34px -10px rgba(26, 26, 24, 0.28);
          z-index: 40;
        }

        #viewport .pl-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--c-on-dark);
          flex-shrink: 0;
        }

        #viewport .pl-logo {
          width: 26px;
          height: 25px;
          display: block;
          flex-shrink: 0;
        }

        #viewport .pl-wordmark {
          font-family: var(--hero-sans);
          font-size: 17.5px;
          font-weight: var(--fw-black);
          font-variation-settings: "wght" 783;
          letter-spacing: var(--tr-wordmark);
          color: var(--c-on-dark);
          white-space: nowrap;
        }

        #viewport .pl-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        #viewport .pl-nav-link {
          font-family: var(--hero-sans);
          font-size: 15px;
          font-weight: var(--fw-medium);
          font-variation-settings: "wght" 500;
          letter-spacing: var(--tr-ui);
          color: rgba(255, 255, 255, 0.86);
          text-decoration: none;
          transition: color 0.15s ease;
          white-space: nowrap;
        }

        #viewport .pl-nav-link:hover {
          color: #D4847A;
        }

        #viewport .pl-btn-nav {
          height: 36px;
          padding: 0 18px;
          border-radius: 9999px;
          background: #FFFFFF;
          color: #1A1A18;
          font-family: var(--hero-sans);
          font-size: 14.5px;
          font-weight: var(--fw-bold);
          font-variation-settings: "wght" 577;
          letter-spacing: var(--tr-cta);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }

        #viewport .pl-btn-nav:hover {
          background: #F5F5F2;
          transform: translateY(-1px);
        }

        /* Burger button (visible < 940px) */
        #viewport .pl-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 38px;
          height: 38px;
          padding: 0 9px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 9999px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        #viewport .pl-burger:hover {
          background: rgba(255, 255, 255, 0.14);
        }

        #viewport .pl-burger-bar {
          display: block;
          height: 2px;
          width: 18px;
          background: #FFFFFF;
          border-radius: 1px;
          transition: transform 0.22s ease, opacity 0.22s ease;
        }

        #viewport .pl-nav.is-open .pl-burger-bar:first-child {
          transform: translateY(3.5px) rotate(45deg);
        }

        #viewport .pl-nav.is-open .pl-burger-bar:last-child {
          transform: translateY(-3.5px) rotate(-45deg);
        }

        /* Dropdown menu for tablet & mobile */
        #viewport .pl-navmenu {
          display: none;
          flex-direction: column;
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: min(260px, calc(100vw - 32px));
          padding: 12px;
          background: #1A1A18;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 22px;
          box-shadow: 0 24px 48px rgba(26, 26, 24, 0.35);
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 60;
        }

        #viewport .pl-nav.is-open .pl-navmenu {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        #viewport .pl-navmenu-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 14px;
          border-radius: 12px;
          font-family: var(--hero-sans);
          font-size: 15px;
          font-weight: var(--fw-medium);
          font-variation-settings: "wght" 500;
          color: #FFFFFF;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        #viewport .pl-navmenu-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #D4847A;
        }

        #viewport .pl-navmenu-cta {
          margin-top: 8px;
          padding: 11px 14px;
          border-radius: 9999px;
          background: #FFFFFF;
          color: #1A1A18;
          font-family: var(--hero-sans);
          font-size: 14.5px;
          font-weight: var(--fw-bold);
          font-variation-settings: "wght" 577;
          text-align: center;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        #viewport .pl-navmenu-cta:hover {
          background: #D4847A;
          color: #1A1A18;
        }

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
          transition: background-color 0.18s ease, transform 0.18s ease;
        }

        #viewport .pl-btn-hero:hover {
          background: var(--c-oxide);
          transform: translateY(-1px);
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
          transition: background-color 0.18s ease, border-color 0.18s ease;
        }

        #viewport .pl-btn-secondary:hover {
          background: #F5F5F2;
          border-color: rgba(26, 26, 24, 0.32);
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
          background:
            radial-gradient(120% 95% at 50% 0%, #6E1F26 0%, #2B1719 52%, #1A1A18 100%);
          border: 1px solid rgba(26, 26, 24, 0.12);
          box-shadow: 0 24px 60px -18px rgba(26, 26, 24, 0.18);
        }

        /* Video re-graded from cyan (195deg) into Proofline warm oxblood/rose/amber (~345deg) */
        #viewport .pl-band-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: hue-rotate(155deg) saturate(0.72) brightness(0.78) contrast(1.12);
          opacity: 0.78;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 0;
        }

        /* Warm atmospheric vignette + smooth bottom integration */
        #viewport .pl-band-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(90% 75% at 50% 10%, rgba(212, 132, 122, 0.22) 0%, transparent 65%),
            linear-gradient(180deg, rgba(26, 26, 24, 0.12) 0%, rgba(26, 26, 24, 0.45) 100%);
          pointer-events: none;
          z-index: 1;
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
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
        }

        #viewport .pl-tab {
          position: relative;
          height: 34px;
          padding: 0 16px;
          border: 0;
          background: transparent;
          border-radius: 10px 10px 0 0;
          font-family: var(--hero-sans);
          font-size: 13px;
          font-weight: var(--fw-regular);
          font-variation-settings: "wght" 440;
          letter-spacing: var(--tr-tab);
          color: var(--c-muted);
          cursor: pointer;
          transition: color 0.15s ease, background-color 0.15s ease;
          white-space: nowrap;
        }

        #viewport .pl-tab:hover {
          color: var(--c-ink);
        }

        #viewport .pl-tab.is-active {
          background: #FFFFFF;
          color: var(--c-ink);
          font-weight: var(--fw-semibold);
          font-variation-settings: "wght" 540;
        }

        #viewport .pl-tab.is-active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 12px;
          right: 12px;
          height: 2px;
          background: var(--c-oxide);
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

        /* Entrance Animations */
        @keyframes pl-enter-drop {
          from { opacity: 0; translate: 0 -10px; }
          to   { opacity: 1; translate: 0 0; }
        }
        @keyframes pl-enter-rise {
          from { opacity: 0; translate: 0 16px; }
          to   { opacity: 1; translate: 0 0; }
        }

        #viewport[data-enter="run"] .pl-nav {
          animation: pl-enter-drop 0.55s var(--ease-settle) 0.04s both;
        }
        #viewport[data-enter="run"] .pl-hero-copy {
          animation: pl-enter-rise 0.65s var(--ease-reveal) 0.14s both;
        }
        #viewport[data-enter="run"] .pl-stage-wrap {
          animation: pl-enter-rise 0.75s var(--ease-settle) 0.26s both;
        }

        @media (prefers-reduced-motion: reduce) {
          #viewport *, #viewport *::before, #viewport *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Framed inside the continuous 1240px border-x page rails so the hero flows directly into Band 2 */}
      <div className="mx-auto w-full max-w-[1240px] border-x border-ink/10 px-4 pt-6 pb-10 sm:px-6 md:px-10 md:pt-9 md:pb-14">
        {/* 1. Floating Dark Pill Navbar */}
        <nav
          ref={navRef}
          className={`pl-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <Link href="/" className="pl-brand">
            <svg
              className="pl-logo"
              viewBox="0 0 26 25"
              fill="none"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.45 24.95 L7.07 24.09 L5.56 23.30 L3.33 21.03 L2.31 19.44 L0.74 16.05 L0.27 13.91 L0.29 11.25 L0.80 8.75 L1.95 6.20 L3.26 4.50 L5.15 2.67 L7.77 1.02 L9.91 0.18 L12.16 -0.20 L15.22 -0.16 L17.61 0.35 L19.30 1.06 L20.88 2.06 L22.23 3.37 L24.01 5.48 L24.76 6.58 L25.70 8.63 L26.00 10.35 L26.02 11.35 L25.54 12.12 L24.96 12.32 L22.35 12.36 L21.46 12.18 L20.78 11.85 L20.32 11.37 L19.45 9.56 L17.88 7.58 L16.59 6.60 L14.59 5.84 L13.24 5.69 L11.54 5.93 L10.47 6.44 L9.12 7.35 L7.92 8.50 L6.70 10.55 L6.26 12.65 L6.41 14.36 L7.14 15.86 L8.63 17.79 L12.57 20.70 L12.96 21.60 L13.13 22.82 L12.93 24.36 L12.65 24.86 L12.03 25.35 L11.27 25.42 L9.45 24.95 Z M24.55 25.53 L22.49 24.77 L19.56 23.18 L18.15 22.07 L16.63 20.48 L16.14 19.79 L15.63 18.71 L14.66 15.66 L14.59 14.50 L14.75 13.92 L15.12 13.45 L15.85 13.10 L16.91 12.88 L18.90 12.85 L19.49 13.04 L19.94 13.38 L20.25 13.88 L20.86 15.66 L21.97 17.30 L23.05 18.22 L25.00 19.43 L26.05 20.27 L26.34 20.66 L26.63 21.86 L26.51 23.68 L25.79 25.10 L25.35 25.42 L24.55 25.53 Z"
                fill="#D4847A"
              />
            </svg>
            <span className="pl-wordmark">Proofline</span>
          </Link>

          <div className="pl-nav-links">
            <a href="#how-it-works" className="pl-nav-link">
              Product
            </a>
            <a href="#verdicts" className="pl-nav-link">
              Verdicts
            </a>
            <a href="#register" className="pl-nav-link">
              Register
            </a>
            <a href="#faq" className="pl-nav-link">
              FAQ
            </a>
          </div>

          <Link href="/check" className="pl-btn-nav">
            Check a Draft
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className="pl-burger"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="pl-burger-bar" />
            <span className="pl-burger-bar" />
          </button>

          <div
            id="nav-menu"
            className="pl-navmenu"
            role="menu"
            aria-hidden={!menuOpen}
          >
            <a
              href="#how-it-works"
              role="menuitem"
              className="pl-navmenu-link"
              onClick={() => setMenuOpen(false)}
            >
              <span>Product</span>
              <span className="font-mono text-xs opacity-50">01</span>
            </a>
            <a
              href="#verdicts"
              role="menuitem"
              className="pl-navmenu-link"
              onClick={() => setMenuOpen(false)}
            >
              <span>Verdicts</span>
              <span className="font-mono text-xs opacity-50">02</span>
            </a>
            <a
              href="#register"
              role="menuitem"
              className="pl-navmenu-link"
              onClick={() => setMenuOpen(false)}
            >
              <span>Register</span>
              <span className="font-mono text-xs opacity-50">03</span>
            </a>
            <a
              href="#faq"
              role="menuitem"
              className="pl-navmenu-link"
              onClick={() => setMenuOpen(false)}
            >
              <span>FAQ</span>
              <span className="font-mono text-xs opacity-50">04</span>
            </a>
            <Link
              href="/check"
              role="menuitem"
              className="pl-navmenu-cta"
              onClick={() => setMenuOpen(false)}
            >
              Check a Draft →
            </Link>
          </div>
        </nav>

        {/* 2. Hero Headline, Subcopy & CTA */}
        <div className="pl-hero-copy">
          <div className="pl-eyebrow-pill">
            <span className="shrink-0 whitespace-nowrap">[ ]</span>
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
            <Link href="/check" className="pl-btn-hero">
              <span>Get Started</span>
              <span aria-hidden="true">→</span>
            </Link>
            <a href="#how-it-works" className="pl-btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        {/* 3. Harmonized Oxblood/Ink Video Band + Full Unclipped Interactive Product Card */}
        <div className="pl-stage-wrap">
          <div className="pl-band" role="presentation">
            <video
              className="pl-band-video"
              src={VIDEO_SRC}
              poster={VIDEO_POSTER}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="pl-band-overlay" aria-hidden="true" />

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

              {/* Interactive Tabs */}
              <div
                className="pl-tabs"
                role="tablist"
                aria-label="Verification brief sections"
              >
                {BRIEF_TABS.map((tab, idx) => {
                  const isSelected = idx === activeTabIdx;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveTabIdx(idx)}
                      className={`pl-tab${isSelected ? " is-active" : ""}`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Panel */}
              <div className="pl-panel" role="tabpanel">
                <div className="pl-panel-head">
                  <h3 className="pl-panel-heading">{activeTab.heading}</h3>
                  <Link
                    href="/check"
                    className="font-mono text-[11px] uppercase tracking-wider text-accent hover:underline"
                  >
                    Open in Checker →
                  </Link>
                </div>

                <div className="pl-rows">
                  {activeTab.rows.map((row) => (
                    <div key={row.title} className="pl-row">
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
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-ink/10 bg-panel/65 px-4 py-3.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft sm:grid-cols-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <span>78% 0ms TypeScript Rules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-v-supported-fg" />
              <span>42 Seeded Flowdesk Facts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-v-stale-fg" />
              <span>6-Field Evidence Gate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-ink" />
              <span>24/24 Smoke Eval Pass</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
