"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductFeatureMosaicBand() {
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const el = stageWrapRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      el.classList.remove("motion-pending", "entrance-run");
      return;
    }

    el.classList.add("motion-pending");
    let endTimer: number | undefined;

    const failSafeTimer = window.setTimeout(() => {
      el.classList.remove("motion-pending", "entrance-run");
    }, 2400);

    const startEntrance = () => {
      window.clearTimeout(failSafeTimer);
      const fontsReady =
        typeof document !== "undefined" && "fonts" in document
          ? Promise.race([
              document.fonts.ready,
              new Promise((r) => setTimeout(r, 700)),
            ])
          : Promise.resolve();

      fontsReady.then(() => {
        el.classList.remove("motion-pending");
        el.classList.add("entrance-run");
        endTimer = window.setTimeout(() => {
          el.classList.remove("entrance-run");
        }, 1850);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startEntrance();
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(failSafeTimer);
      if (endTimer) window.clearTimeout(endTimer);
    };
  }, []);

  // Proofline 7-dimension deterministic coverage progression (ascending heights matching 43.2 -> 265u spec)
  const bars = [
    { day: "SPAN", label: "6/6", h: 43.2, isHighlight: false },
    { day: "DATE", label: "100%", h: 80.9, isHighlight: false },
    { day: "SEAT", label: "14%", h: 131.7, isHighlight: false },
    { day: "SLA", label: "29%", h: 165.5, isHighlight: false },
    { day: "TIER", label: "48%", h: 203.2, isHighlight: false },
    { day: "INR", label: "64%", h: 235.2, isHighlight: false },
    { day: "RULE", label: "78%", h: 265, isHighlight: true },
  ];

  return (
    <div ref={stageWrapRef} className="pfm-root">
      <style>{`
        /* =====================================================================
           PROPORTIONAL SCALING SYSTEM (1374×666 Desktop, 1025×918 Tablet, 375 Mobile)
           ===================================================================== */
        .pfm-root {
          container-type: inline-size;
          --u: min(calc(100cqw / 1374), calc((100vw - 48px) / 1374), calc((100vh - 48px) / 666), 1.05px);
          font-family: var(--font-sans), 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1A1A18;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pfm-root * {
          box-sizing: border-box;
        }

        /* DESKTOP STAGE GRID: 1374 × 666 reference units */
        .pfm-stage {
          width: calc(1374 * var(--u));
          height: calc(666 * var(--u));
          display: grid;
          grid-template-columns: calc(339 * var(--u)) calc(627 * var(--u)) calc(388 * var(--u));
          grid-template-rows: calc(149 * var(--u)) calc(343 * var(--u)) calc(156 * var(--u));
          column-gap: calc(10 * var(--u));
          row-gap: calc(9 * var(--u));
        }

        /* Shared .pfm-card chrome */
        .pfm-card {
          border-radius: calc(22 * var(--u));
          border: calc(1.6 * var(--u)) solid rgba(255, 255, 255, 0.92);
          overflow: hidden;
          box-shadow: 0 calc(2 * var(--u)) calc(16 * var(--u)) rgba(26, 26, 24, 0.05);
          position: relative;
        }

        /* Card 1: Evidence Gate Notification (.notif) — Proofline warm coral/blush tint */
        .pfm-card.notif {
          grid-column: 1;
          grid-row: 1;
          background:
            radial-gradient(120% 140% at 92% 100%, rgba(255, 242, 240, 0.95) 0%, rgba(255, 242, 240, 0) 62%),
            linear-gradient(135deg, #f6dcd9 0%, #f9e3e0 55%, #fbeae7 100%);
          padding: calc(37 * var(--u)) calc(12 * var(--u)) 0 calc(11 * var(--u));
        }

        /* Card 2: Verify Across Every Surface (.connect) — Warm stone/alabaster surface */
        .pfm-card.connect {
          grid-column: 1;
          grid-row: 2 / span 2;
          background: linear-gradient(180deg, #fcfcfa 0%, #f5f4f0 32%, #ebe9e2 68%, #dedad0 100%);
          padding: calc(32 * var(--u)) 0 0 calc(20 * var(--u));
        }

        /* Card 3: Verify Every Claim (.automate) — Proofline sage/parchment verification stage */
        .pfm-card.automate {
          grid-column: 2;
          grid-row: 1 / span 2;
          background:
            radial-gradient(90% 70% at 6% 0%, rgba(234, 243, 238, 0.92) 0%, rgba(234, 243, 238, 0) 70%),
            linear-gradient(168deg, #e5efe8 0%, #ebf2e6 48%, #f1f4de 78%, #f5f5d6 100%);
        }

        /* Card 4: Deterministic Coverage (.insights) — Warm editorial parchment */
        .pfm-card.insights {
          grid-column: 3;
          grid-row: 1 / span 2;
          background:
            radial-gradient(115% 70% at 22% 0%, #fdf5eb 0%, rgba(253, 245, 235, 0) 68%),
            linear-gradient(180deg, #f9f2e8 0%, #f6ede2 100%);
          padding: calc(29 * var(--u)) calc(25 * var(--u)) calc(23 * var(--u)) calc(21 * var(--u));
          display: flex;
          flex-direction: column;
        }

        /* Card 5: Instant Fact Register Search (.search) — Warm oxblood-stone tint */
        .pfm-card.search {
          grid-column: 2 / span 2;
          grid-row: 3;
          background: linear-gradient(103deg, #f2edee 0%, #ebe2e4 36%, #dfd0d3 74%, #d4bfc3 100%);
          display: flex;
          align-items: center;
          padding-left: calc(46 * var(--u));
          padding-right: calc(25 * var(--u));
        }

        /* =====================================================================
           CARD 1 — EVIDENCE GATE NOTIFICATION (.notif)
           ===================================================================== */
        .pfm-root .toast-wrap {
          position: relative;
          height: calc(70 * var(--u));
        }

        .pfm-root .toast-ledge {
          position: absolute;
          left: calc(24 * var(--u));
          right: calc(20 * var(--u));
          top: calc(55 * var(--u));
          height: calc(23 * var(--u));
          border-radius: calc(14 * var(--u));
          background: linear-gradient(100deg, #e8e3e2 0%, #e6dedd 42%, #e4d2d1 74%, #e0c5c4 100%);
          box-shadow: 0 calc(3 * var(--u)) calc(9 * var(--u)) rgba(110, 31, 38, 0.09);
        }

        .pfm-root .toast {
          position: absolute;
          inset: 0;
          height: calc(70 * var(--u));
          border-radius: calc(16 * var(--u));
          background: linear-gradient(105deg, #ffffff 34%, #fdf1ed 78%, #fbe8e2 100%);
          box-shadow: 0 calc(3 * var(--u)) calc(10 * var(--u)) rgba(110, 31, 38, 0.1);
          display: flex;
          align-items: center;
          padding: 0 calc(12 * var(--u)) 0 calc(13 * var(--u));
          gap: calc(11 * var(--u));
        }

        .pfm-root .toast-icon {
          width: calc(27 * var(--u));
          height: calc(27 * var(--u));
          flex-shrink: 0;
        }

        .pfm-root .toast-body {
          flex: 1;
          min-width: 0;
        }

        .pfm-root .toast-title {
          margin: 0;
          font-size: calc(11.2 * var(--u));
          font-weight: 800;
          font-variation-settings: "wght" 780;
          letter-spacing: -0.012em;
          line-height: 1.1;
          color: #1A1A18;
        }

        .pfm-root .toast-sub {
          margin: calc(3.6 * var(--u)) 0 0;
          font-size: calc(10 * var(--u));
          font-weight: 400;
          line-height: 1.28;
          letter-spacing: -0.005em;
          color: #4A4A45;
          max-width: calc(174 * var(--u));
        }

        .pfm-root .toast-time {
          font-family: var(--font-mono), monospace;
          font-size: calc(7.4 * var(--u));
          font-weight: 600;
          color: #6E1F26;
          align-self: flex-start;
          margin-top: calc(12 * var(--u));
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        /* =====================================================================
           CARD 2 — VERIFY ACROSS EVERY SURFACE (.connect)
           ===================================================================== */
        .pfm-root .connect h3 {
          margin: 0;
          font-size: calc(28 * var(--u));
          font-weight: 800;
          font-variation-settings: "wght" 780;
          line-height: 1.1;
          letter-spacing: -0.028em;
          color: #1A1A18;
        }

        .pfm-root .connect .sub {
          margin: calc(14 * var(--u)) 0 0;
          font-size: calc(16.5 * var(--u));
          font-weight: 400;
          line-height: 1.3;
          letter-spacing: -0.013em;
          color: #4A4A45;
        }

        .pfm-root .chips-wrap {
          position: absolute;
          left: calc(11 * var(--u));
          right: calc(16 * var(--u));
          bottom: calc(13 * var(--u));
          display: flex;
          flex-direction: column;
          gap: calc(8 * var(--u));
          z-index: 2;
        }

        .pfm-root .chip-row {
          display: flex;
          align-items: center;
          gap: calc(12 * var(--u));
        }

        .pfm-root .chip-row.r2 {
          padding-left: calc(8 * var(--u));
        }

        .pfm-root .chip {
          height: calc(42 * var(--u));
          display: inline-flex;
          align-items: center;
          gap: calc(9 * var(--u));
          padding: 0 calc(15 * var(--u));
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255, 255, 254, 0.97) 0%, rgba(248, 247, 244, 0.94) 100%);
          box-shadow: 0 0 0 calc(3 * var(--u)) rgba(26, 26, 24, 0.05);
          backdrop-filter: blur(calc(7 * var(--u)));
          font-size: calc(16.5 * var(--u));
          font-weight: 500;
          letter-spacing: -0.018em;
          color: #1A1A18;
          white-space: nowrap;
        }

        .pfm-root .chip svg {
          width: calc(20 * var(--u));
          height: calc(20 * var(--u));
          flex-shrink: 0;
        }

        .pfm-root .chip-slack {
          position: absolute;
          right: calc(8 * var(--u));
          bottom: calc(134 * var(--u));
          transform: rotate(-20deg);
          z-index: 3;
          box-shadow: 0 0 0 calc(3.2 * var(--u)) rgba(110, 31, 38, 0.08);
        }

        /* =====================================================================
           CARD 3 — VERIFY EVERY CLAIM. SHIP WITH PROOF. (.automate)
           ===================================================================== */
        .pfm-root .automate-copy {
          position: relative;
          z-index: 3;
          padding: calc(37 * var(--u)) 0 0 calc(45 * var(--u));
        }

        .pfm-root .automate h3 {
          margin: 0;
          font-size: calc(35 * var(--u));
          font-weight: 800;
          font-variation-settings: "wght" 780;
          line-height: 1.25;
          letter-spacing: -0.03em;
          color: #1A1A18;
        }

        .pfm-root .automate h3 .g {
          color: #6E1F26;
        }

        .pfm-root .automate .sub {
          margin: calc(13 * var(--u)) 0 0;
          font-size: calc(17 * var(--u));
          font-weight: 400;
          line-height: 1.3;
          letter-spacing: -0.014em;
          color: #2c352d;
        }

        .pfm-root .illo {
          position: absolute;
          inset: 0;
          width: calc(627 * var(--u));
          height: calc(501 * var(--u));
          z-index: 2;
          pointer-events: none;
        }

        .pfm-root .win {
          position: absolute;
          border-radius: calc(11 * var(--u));
          border: calc(3 * var(--u)) solid #ffffff;
          overflow: hidden;
          box-shadow: 0 calc(12 * var(--u)) calc(28 * var(--u)) rgba(40, 52, 42, 0.16);
          display: flex;
          flex-direction: column;
        }

        .pfm-root .win-bar {
          height: calc(13.4 * var(--u));
          background: #1A1A18;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: calc(4.6 * var(--u));
          padding-left: calc(4.9 * var(--u));
          flex-shrink: 0;
        }

        .pfm-root .win-dot {
          width: calc(6 * var(--u));
          height: calc(6 * var(--u));
          border-radius: 999px;
          background: linear-gradient(150deg, #fff 0%, #f6f6f6 50%, #dcdcdc 100%);
        }

        .pfm-root .win-body {
          flex: 1;
          display: flex;
        }

        .pfm-root .win-back {
          left: calc(121.2 * var(--u));
          top: calc(245.2 * var(--u));
          width: calc(324 * var(--u));
          height: calc(250 * var(--u));
          transform: rotate(-7.02deg);
        }

        .pfm-root .win-back .win-body {
          background: #eaefe4;
        }

        .pfm-root .win-back .win-strip {
          width: 23.7%;
          height: 100%;
          background: #c2d6c8;
        }

        .pfm-root .win-front {
          left: calc(180.4 * var(--u));
          top: calc(283.3 * var(--u));
          width: calc(322 * var(--u));
          height: calc(250 * var(--u));
          transform: rotate(4.23deg);
          border-bottom: 0;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          box-shadow: 0 calc(14 * var(--u)) calc(32 * var(--u)) rgba(40, 52, 42, 0.18);
        }

        .pfm-root .win-front .win-body {
          background: #fbf1ef;
        }

        .pfm-root .win-front .win-strip {
          width: 16%;
          height: 100%;
          background: #ebd5d3;
        }

        .pfm-root .pill-wf {
          position: absolute;
          left: calc(385 * var(--u));
          top: calc(349 * var(--u));
          height: calc(30 * var(--u));
          display: flex;
          align-items: center;
          gap: calc(7 * var(--u));
          padding: 0 calc(14 * var(--u)) 0 calc(6 * var(--u));
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 0 0 calc(2.8 * var(--u)) rgba(26, 26, 24, 0.05);
          transform: rotate(-1.2deg);
          font-size: calc(11.2 * var(--u));
          font-weight: 600;
          color: #1A1A18;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .pfm-root .pill-wf-check {
          width: calc(19 * var(--u));
          height: calc(19 * var(--u));
          border-radius: 999px;
          background: #EAF3EE;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pfm-root .pill-ai {
          position: absolute;
          left: calc(58 * var(--u));
          top: calc(396 * var(--u));
          width: calc(122 * var(--u));
          height: calc(49 * var(--u));
          border-radius: calc(12 * var(--u));
          background: #ffffff;
          box-shadow: 0 0 0 calc(2.8 * var(--u)) rgba(26, 26, 24, 0.05);
          transform: rotate(-1.2deg);
          display: flex;
          align-items: center;
          padding: 0 calc(14 * var(--u));
          gap: calc(10 * var(--u));
        }

        .pfm-root .pill-ai svg {
          width: calc(24 * var(--u));
          height: calc(24 * var(--u));
          flex-shrink: 0;
        }

        .pfm-root .pill-ai-lines {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: calc(6 * var(--u));
        }

        .pfm-root .pill-ai-line {
          height: calc(5 * var(--u));
          border-radius: 999px;
          background: #d8d6d0;
          width: 100%;
        }

        .pfm-root .pill-ai-line.short {
          width: 68%;
        }

        .pfm-root .cursor {
          position: absolute;
          left: calc(476 * var(--u));
          top: calc(444 * var(--u));
          width: calc(23 * var(--u));
          height: calc(27 * var(--u));
          filter: drop-shadow(0 calc(2 * var(--u)) calc(3 * var(--u)) rgba(0, 0, 0, 0.18));
        }

        /* =====================================================================
           CARD 4 — DETERMINISTIC COVERAGE (.insights)
           ===================================================================== */
        .pfm-root .insights .tag {
          align-self: flex-start;
          height: calc(31 * var(--u));
          padding: 0 calc(16 * var(--u));
          border-radius: 999px;
          background: linear-gradient(180deg, #fffaf4 0%, #f9efe4 100%);
          border: calc(1.2 * var(--u)) solid #ffffff;
          box-shadow: 0 calc(2 * var(--u)) calc(6 * var(--u)) rgba(110, 31, 38, 0.06);
          display: inline-flex;
          align-items: center;
          font-size: calc(11.3 * var(--u));
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #6E1F26;
        }

        .pfm-root .insights h3 {
          margin: calc(20 * var(--u)) 0 0 calc(2 * var(--u));
          font-size: calc(35.5 * var(--u));
          font-weight: 800;
          font-variation-settings: "wght" 790;
          line-height: 1.04;
          letter-spacing: -0.032em;
          color: #1A1A18;
        }

        .pfm-root .insights .sub {
          margin: calc(10 * var(--u)) 0 0 calc(2 * var(--u));
          font-size: calc(14 * var(--u));
          font-weight: 400;
          letter-spacing: -0.01em;
          color: #4A4A45;
        }

        .pfm-root .chart {
          margin-top: auto;
          display: grid;
          grid-template-columns: repeat(7, calc(33 * var(--u)));
          column-gap: calc(19 * var(--u));
          align-items: end;
          padding-left: calc(1 * var(--u));
        }

        .pfm-root .bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pfm-root .qbar {
          width: calc(33 * var(--u));
          border-radius: calc(7 * var(--u));
          background: linear-gradient(180deg, #e8e1d7 0%, #ded6ca 100%);
          display: flex;
          justify-content: center;
          padding-top: calc(10 * var(--u));
          font-size: calc(11.2 * var(--u));
          font-weight: 500;
          color: #6b645b;
          letter-spacing: -0.01em;
        }

        .pfm-root .qbar.is-sun {
          background: linear-gradient(180deg, #d4847a 0%, #9e3b42 48%, #6E1F26 100%);
          color: #ffffff;
          font-weight: 700;
        }

        .pfm-root .day-lbl {
          margin-top: calc(9 * var(--u));
          font-family: var(--font-mono), monospace;
          font-size: calc(9.2 * var(--u));
          font-weight: 500;
          letter-spacing: 0.04em;
          color: #7A7A72;
        }

        /* =====================================================================
           CARD 5 — INSTANT FACT REGISTER SEARCH (.search)
           ===================================================================== */
        .pfm-root .search h3 {
          margin: 0;
          font-size: calc(20.5 * var(--u));
          font-weight: 800;
          font-variation-settings: "wght" 760;
          line-height: 1.24;
          letter-spacing: -0.025em;
          color: #1A1A18;
          flex-shrink: 0;
        }

        .pfm-root .bar-search {
          margin-left: auto;
          width: calc(680 * var(--u));
          height: calc(66 * var(--u));
          border-radius: 999px;
          background: #ffffff;
          box-shadow:
            0 0 0 calc(4 * var(--u)) rgba(110, 31, 38, 0.07),
            0 calc(6 * var(--u)) calc(20 * var(--u)) rgba(60, 28, 32, 0.08);
          display: flex;
          align-items: center;
          padding: 0 calc(24 * var(--u)) 0 calc(13 * var(--u));
          gap: calc(14 * var(--u));
        }

        .pfm-root .mag-circle {
          width: calc(41 * var(--u));
          height: calc(41 * var(--u));
          border-radius: 999px;
          background: #f5f3f0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pfm-root .mag-circle svg {
          width: calc(20 * var(--u));
          height: calc(20 * var(--u));
        }

        .pfm-root .search-input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          font-family: inherit;
          font-size: calc(15 * var(--u));
          font-weight: 400;
          color: #1A1A18;
          letter-spacing: -0.01em;
        }

        .pfm-root .search-input::placeholder {
          color: #7A7A72;
        }

        .pfm-root .mic-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #6E1F26;
          transition: transform 0.15s ease;
        }

        .pfm-root .mic-link:hover {
          transform: translateX(2px);
        }

        /* =====================================================================
           RESPONSIVE: TABLET (701px - 1040px) — 1025 × 918 design units
           ===================================================================== */
        @media (min-width: 701px) and (max-width: 1040px) {
          .pfm-root {
            --u: min(calc(100cqw / 1025), calc((100vw - 40px) / 1025), calc((100vh - 40px) / 918), 0.96px);
          }

          .pfm-stage {
            width: calc(1025 * var(--u));
            height: calc(918 * var(--u));
            grid-template-columns: calc(627 * var(--u)) calc(388 * var(--u));
            grid-template-rows: calc(505 * var(--u)) calc(194 * var(--u)) calc(201 * var(--u));
          }

          .pfm-card.automate {
            grid-column: 1;
            grid-row: 1;
            height: calc(501 * var(--u));
          }

          .pfm-card.notif {
            grid-column: 1;
            grid-row: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }

          .pfm-root .toast-wrap {
            width: calc(380 * var(--u));
            max-width: calc(100% - 24px);
          }

          .pfm-card.search {
            grid-column: 1;
            grid-row: 3;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding: calc(20 * var(--u)) calc(28 * var(--u));
          }

          .pfm-root .bar-search {
            width: 100%;
            margin-left: 0;
            margin-top: calc(16 * var(--u));
          }

          .pfm-card.insights {
            grid-column: 2;
            grid-row: 1;
          }

          .pfm-card.connect {
            grid-column: 2;
            grid-row: 2 / span 2;
          }
        }

        /* =====================================================================
           RESPONSIVE: MOBILE (<= 700px) — 375 design units width
           ===================================================================== */
        @media (max-width: 700px) {
          .pfm-root {
            --u: min(calc(100cqw / 375), calc((min(100vw, 560px) - 28px) / 375));
            align-items: flex-start;
          }

          .pfm-stage {
            width: calc(375 * var(--u));
            height: auto;
            display: flex;
            flex-direction: column;
            row-gap: calc(13 * var(--u));
          }

          .pfm-card.notif {
            height: calc(149 * var(--u));
            padding: calc(37 * var(--u)) calc(14 * var(--u)) 0;
          }

          .pfm-card.automate {
            height: calc(298 * var(--u));
          }

          .pfm-root .automate-copy {
            padding: calc(24 * var(--u)) calc(20 * var(--u)) 0;
          }

          .pfm-root .automate h3 {
            font-size: calc(24 * var(--u));
          }

          .pfm-root .automate .sub {
            font-size: calc(13.5 * var(--u));
            margin-top: calc(8 * var(--u));
          }

          .pfm-root .illo {
            transform: scale(0.5981);
            transform-origin: 0 0;
          }

          .pfm-card.connect {
            height: calc(508 * var(--u));
          }

          .pfm-card.insights {
            height: calc(500 * var(--u));
          }

          .pfm-card.search {
            flex-direction: column;
            align-items: flex-start;
            padding: calc(24 * var(--u)) calc(20 * var(--u));
            gap: calc(16 * var(--u));
          }

          .pfm-root .bar-search {
            width: 100%;
            height: calc(58 * var(--u));
            margin-left: 0;
          }
        }

        /* =====================================================================
           ENTRANCE ANIMATION SYSTEM (exact keyframes & timing table)
           ===================================================================== */
        .pfm-root.motion-pending .pfm-card {
          opacity: 0;
          visibility: hidden;
        }

        @media (max-width: 700px) {
          .pfm-root.motion-pending .pfm-card.insights,
          .pfm-root.motion-pending .pfm-card.search {
            opacity: 1;
            visibility: visible;
          }
        }

        @keyframes pfm-panel-settle {
          0% {
            opacity: 0;
            transform: translateY(calc(12 * var(--u))) scale(0.988);
            clip-path: inset(3% round calc(22 * var(--u)));
          }
          62% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: none;
            clip-path: inset(0% round calc(22 * var(--u)));
          }
        }

        @keyframes pfm-type-unmask {
          from {
            opacity: 0;
            transform: translateY(calc(16 * var(--u)));
            clip-path: inset(0 0 96% 0);
          }
          to {
            opacity: 1;
            transform: none;
            clip-path: inset(0 0 0% 0);
          }
        }

        @keyframes pfm-content-rise {
          from {
            opacity: 0;
            transform: translateY(calc(9 * var(--u)));
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes pfm-interface-settle {
          from {
            opacity: 0;
            translate: 0 calc(16 * var(--u));
            scale: 0.975;
          }
          to {
            opacity: 1;
            translate: 0 0;
            scale: 1;
          }
        }

        @keyframes pfm-detail-settle {
          from {
            opacity: 0;
            translate: 0 calc(8 * var(--u));
            scale: 0.97;
          }
          to {
            opacity: 1;
            translate: 0 0;
            scale: 1;
          }
        }

        @keyframes pfm-toast-arrive {
          from {
            opacity: 0;
            transform: translateY(calc(10 * var(--u))) scale(0.982);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes pfm-chip-row-arrive {
          from {
            opacity: 0;
            transform: translateY(calc(11 * var(--u)));
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes pfm-chart-unmask {
          from {
            opacity: 0;
            transform: translateY(calc(10 * var(--u)));
            clip-path: inset(100% 0 0 0);
          }
          to {
            opacity: 1;
            transform: none;
            clip-path: inset(0% 0 0 0);
          }
        }

        @keyframes pfm-search-resolve {
          from {
            opacity: 0;
            transform: translateX(calc(12 * var(--u))) scale(0.975, 1);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .pfm-root.entrance-run .pfm-card {
          will-change: opacity, transform, clip-path;
        }

        .pfm-root.entrance-run .pfm-card.automate {
          animation: pfm-panel-settle 0.82s cubic-bezier(0.16, 1, 0.3, 1) 0.04s backwards;
        }
        .pfm-root.entrance-run .pfm-card.notif {
          animation: pfm-panel-settle 0.66s cubic-bezier(0.16, 1, 0.3, 1) 0.10s backwards;
        }
        .pfm-root.entrance-run .pfm-card.insights {
          animation: pfm-panel-settle 0.74s cubic-bezier(0.16, 1, 0.3, 1) 0.14s backwards;
        }
        .pfm-root.entrance-run .pfm-card.connect {
          animation: pfm-panel-settle 0.74s cubic-bezier(0.16, 1, 0.3, 1) 0.20s backwards;
        }
        .pfm-root.entrance-run .pfm-card.search {
          animation: pfm-panel-settle 0.68s cubic-bezier(0.16, 1, 0.3, 1) 0.28s backwards;
        }

        .pfm-root.entrance-run .automate h3 {
          animation: pfm-type-unmask 0.78s cubic-bezier(0.22, 1, 0.36, 1) 0.20s backwards;
        }
        .pfm-root.entrance-run .automate .sub {
          animation: pfm-content-rise 0.54s cubic-bezier(0.16, 1, 0.3, 1) 0.48s backwards;
        }
        .pfm-root.entrance-run .win-back {
          animation: pfm-interface-settle 0.84s cubic-bezier(0.16, 1, 0.3, 1) 0.42s backwards;
        }
        .pfm-root.entrance-run .win-front {
          animation: pfm-interface-settle 0.94s cubic-bezier(0.16, 1, 0.3, 1) 0.50s backwards;
        }
        .pfm-root.entrance-run .pill-ai {
          animation: pfm-detail-settle 0.60s cubic-bezier(0.16, 1, 0.3, 1) 0.72s backwards;
        }
        .pfm-root.entrance-run .pill-wf {
          animation: pfm-detail-settle 0.58s cubic-bezier(0.16, 1, 0.3, 1) 0.78s backwards;
        }
        .pfm-root.entrance-run .cursor {
          animation: pfm-detail-settle 0.54s cubic-bezier(0.16, 1, 0.3, 1) 0.96s backwards;
        }
        .pfm-root.entrance-run .toast-wrap {
          animation: pfm-toast-arrive 0.62s cubic-bezier(0.16, 1, 0.3, 1) 0.38s backwards;
        }
        .pfm-root.entrance-run .connect h3 {
          animation: pfm-type-unmask 0.64s cubic-bezier(0.22, 1, 0.36, 1) 0.54s backwards;
        }
        .pfm-root.entrance-run .connect .sub {
          animation: pfm-content-rise 0.48s cubic-bezier(0.16, 1, 0.3, 1) 0.73s backwards;
        }
        .pfm-root.entrance-run .chip-row.r1 {
          animation: pfm-chip-row-arrive 0.62s cubic-bezier(0.16, 1, 0.3, 1) 0.86s backwards;
        }
        .pfm-root.entrance-run .chip-row.r2 {
          animation: pfm-chip-row-arrive 0.62s cubic-bezier(0.16, 1, 0.3, 1) 0.91s backwards;
        }
        .pfm-root.entrance-run .chip-row.r3 {
          animation: pfm-chip-row-arrive 0.62s cubic-bezier(0.16, 1, 0.3, 1) 0.96s backwards;
        }
        .pfm-root.entrance-run .chip-slack {
          animation: pfm-detail-settle 0.58s cubic-bezier(0.16, 1, 0.3, 1) 1.02s backwards;
        }
        .pfm-root.entrance-run .insights .tag {
          animation: pfm-content-rise 0.46s cubic-bezier(0.16, 1, 0.3, 1) 0.44s backwards;
        }
        .pfm-root.entrance-run .insights h3 {
          animation: pfm-type-unmask 0.62s cubic-bezier(0.22, 1, 0.36, 1) 0.56s backwards;
        }
        .pfm-root.entrance-run .insights .sub {
          animation: pfm-content-rise 0.44s cubic-bezier(0.16, 1, 0.3, 1) 0.75s backwards;
        }
        .pfm-root.entrance-run .chart {
          animation: pfm-chart-unmask 0.86s cubic-bezier(0.16, 1, 0.3, 1) 0.72s backwards;
        }
        .pfm-root.entrance-run .search h3 {
          animation: pfm-type-unmask 0.56s cubic-bezier(0.22, 1, 0.36, 1) 0.72s backwards;
        }
        .pfm-root.entrance-run .bar-search {
          transform-origin: right center;
          animation: pfm-search-resolve 0.70s cubic-bezier(0.16, 1, 0.3, 1) 0.88s backwards;
        }
      `}</style>

      <div className="pfm-stage" role="region" aria-label="Proofline verification architecture mosaic">
        {/* =================================================================
            CARD 1 — EVIDENCE GATE NOTIFICATION (.notif)
            ================================================================= */}
        <article className="pfm-card notif" aria-label="Evidence Gate notification">
          <div className="toast-wrap">
            <div className="toast-ledge" aria-hidden="true" />
            <div className="toast">
              {/* Proofline Evidence Gate disc icon 27×27, viewBox 0 0 24 24 */}
              <svg
                className="toast-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <mask id="pfmSparkleMask">
                    <rect width="24" height="24" fill="#fff" />
                    <path
                      d="M12 4.5 C12.8 9.2 14.8 11.2 19.5 12 C14.8 12.8 12.8 14.8 12 19.5 C11.2 14.8 9.2 12.8 4.5 12 C9.2 11.2 11.2 9.2 12 4.5 Z"
                      fill="#000"
                    />
                  </mask>
                </defs>
                <circle cx="12" cy="12" r="12" fill="#6E1F26" mask="url(#pfmSparkleMask)" />
                <path
                  d="M12 7.2 C12.45 10.1 13.9 11.55 16.8 12 C13.9 12.45 12.45 13.9 12 16.8 C11.55 13.9 10.1 12.45 7.2 12 C10.1 11.55 11.55 10.1 12 7.2 Z"
                  fill="#6E1F26"
                />
              </svg>

              <div className="toast-body">
                <p className="toast-title">Evidence Gate passed!</p>
                <p className="toast-sub">12 Flowdesk Q2 claims verified in 0ms</p>
              </div>

              <span className="toast-time">STAGE 1</span>
            </div>
          </div>
        </article>

        {/* =================================================================
            CARD 2 — VERIFY ACROSS EVERY SURFACE (.connect)
            ================================================================= */}
        <article className="pfm-card connect" aria-label="Proofline verification surfaces">
          <h3>
            Verify across
            <br />
            Every Surface.
          </h3>
          <p className="sub">42 seeded facts · 6 canonical verdicts</p>

          {/* Floating tilted REST API endpoint chip */}
          <div className="chip chip-slack">
            <span>/api/verify</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="20" height="18" rx="4" fill="#6E1F26" />
              <path
                d="M7 9L10.5 12L7 15M12.5 15H17"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 3 Rows of Proofline Surfaces & Pipeline Integrations */}
          <div className="chips-wrap">
            {/* Row 1: Pricing Sheet v4 */}
            <div className="chip-row r1">
              <div className="chip">
                <span>Pricing Sheet v4</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="2.5" width="18" height="19" rx="3.5" fill="#6E1F26" />
                  <path
                    d="M8.5 8H15.5M8.5 11.2H14.5M10.5 8C12.2 8 13.2 8.9 13.2 10.3C13.2 11.8 12 12.7 10.2 12.7H8.8L13.8 17"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Row 2: TypeScript Rules + GitHub Actions */}
            <div className="chip-row r2">
              <div className="chip">
                <span>TypeScript</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect
                    x="2.5"
                    y="2.5"
                    width="19"
                    height="19"
                    rx="3.5"
                    fill="#1A1A18"
                  />
                  <path
                    d="M6.5 10.2H11.5M9 10.2V16.8M17.5 11.2C16.9 10.5 16 10.2 15.1 10.2C13.9 10.2 13.2 10.8 13.2 11.7C13.2 12.6 14 13 15.3 13.4C16.7 13.8 17.6 14.3 17.6 15.4C17.6 16.5 16.6 17.1 15.1 17.1C13.9 17.1 13.1 16.7 12.6 16"
                    stroke="#ffffff"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="chip">
                <span>GitHub CI</span>
                <svg viewBox="0 0 24 24" fill="#1A1A18" aria-hidden="true">
                  <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2.16 2.16 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.84 0 4.31-2.58 5.23-5.06 5.5.45.37.82.92.82 2.02v3.03c0 .27.18.64.73.55A11 11 0 0012 1.27" />
                </svg>
              </div>
            </div>

            {/* Row 3: Source Spans + MCP Agent */}
            <div className="chip-row r3">
              <div className="chip">
                <span>Source Spans</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="#EAF3EE" stroke="#1F5E3B" strokeWidth="1.6" />
                  <path
                    d="M9.5 7.5H7.2V16.5H9.5M14.5 7.5H16.8V16.5H14.5"
                    stroke="#1F5E3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="chip">
                <span>MCP Tool</span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.5" fill="#FDF6E8" stroke="#8A5A14" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3" fill="#8A5A14" />
                  <path
                    d="M12 5.5V9M12 15V18.5M5.5 12H9M15 12H18.5"
                    stroke="#8A5A14"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </article>

        {/* =================================================================
            CARD 3 — VERIFY EVERY CLAIM. SHIP WITH PROOF. (.automate)
            ================================================================= */}
        <article className="pfm-card automate" aria-label="Deterministic claim verification workflow">
          <div className="automate-copy">
            <h3>
              <span className="g">Verify</span> every claim.
              <br />
              Ship with proof.
            </h3>
            <p className="sub">78% resolved by 0ms TypeScript rules before any model call.</p>
          </div>

          {/* Splayed windows & floating badges (.illo) */}
          <div className="illo" aria-hidden="true">
            {/* Back window (.win-back): Register source document */}
            <div className="win win-back">
              <div className="win-bar">
                <span className="win-dot" />
                <span className="win-dot" />
                <span className="win-dot" />
              </div>
              <div className="win-body">
                <div className="win-strip" />
              </div>
            </div>

            {/* Front window (.win-front): Draft checker stage */}
            <div className="win win-front">
              <div className="win-bar">
                <span className="win-dot" />
                <span className="win-dot" />
                <span className="win-dot" />
              </div>
              <div className="win-body">
                <div className="win-strip" />
              </div>
            </div>

            {/* Floating "Evidence Gate: 6/6 Fields" pill (.pill-wf) */}
            <div className="pill-wf">
              <span className="pill-wf-check">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2L5 8.6L9.6 3.6"
                    stroke="#1F5E3B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>SUPPORTED · F-021 (v4)</span>
            </div>

            {/* Floating rule-match sparkle card (.pill-ai) */}
            <div className="pill-ai">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 2.5C7.4 4.7 8.3 5.6 10.5 6C8.3 6.4 7.4 7.3 7 9.5C6.6 7.3 5.7 6.4 3.5 6C5.7 5.6 6.6 4.7 7 2.5Z"
                  fill="#FBEAE8"
                  stroke="#6E1F26"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 8.5C15.7 12.1 17.4 13.8 21 14.5C17.4 15.2 15.7 16.9 15 20.5C14.3 16.9 12.6 15.2 9 14.5C12.6 13.8 14.3 12.1 15 8.5Z"
                  fill="#FBEAE8"
                  stroke="#6E1F26"
                  strokeWidth="2.25"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="pill-ai-lines">
                <div className="pill-ai-line" />
                <div className="pill-ai-line short" />
              </div>
            </div>

            {/* Classic pointer cursor (.cursor) */}
            <svg
              className="cursor"
              viewBox="0 0 24 28"
              fill="none"
            >
              <path
                d="M3 2.5L20.5 14.2L12.2 15.8L16.2 24.4L12.8 26L8.8 17.3L3 22.2V2.5Z"
                fill="#ffffff"
                stroke="#1A1A18"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </article>

        {/* =================================================================
            CARD 4 — DETERMINISTIC COVERAGE (.insights)
            ================================================================= */}
        <article className="pfm-card insights" aria-label="Deterministic rule coverage insights">
          <div className="tag">Deterministic Coverage</div>
          <h3>78% in 0ms</h3>
          <p className="sub">resolved in Stage 1 code!</p>

          <div
            className="chart"
            aria-label="Deterministic verification coverage across claim dimensions: Span 6/6, Date 100%, Seat 14%, SLA 29%, Tier 48%, INR 64%, Rule Total 78%"
          >
            {bars.map((b) => (
              <div key={b.day} className="bar-col">
                <div
                  className={`qbar${b.isHighlight ? " is-sun" : ""}`}
                  style={{ height: `calc(${b.h} * var(--u))` }}
                >
                  <span>{b.label}</span>
                </div>
                <span className="day-lbl">{b.day}</span>
              </div>
            ))}
          </div>
        </article>

        {/* =================================================================
            CARD 5 — INSTANT FACT REGISTER SEARCH (.search)
            ================================================================= */}
        <article className="pfm-card search" aria-label="Search the Proofline Fact Register">
          <h3>
            Search 42 facts
            <br />
            instantly
          </h3>

          <form
            className="bar-search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/facts");
            }}
          >
            <span className="mag-circle" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="11"
                  cy="11"
                  r="7.1"
                  stroke="#1A1A18"
                  strokeWidth="2.2"
                />
                <line
                  x1="16.4"
                  y1="16.4"
                  x2="21"
                  y2="21"
                  stroke="#1A1A18"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search F-021, ₹6,499 Starter price, DOC-003..."
              aria-label="Search approved facts, source documents, and byte spans"
              className="search-input"
            />

            <Link
              href="/facts"
              aria-label="Open Fact Register"
              className="mic-link"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="#6E1F26"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </form>
        </article>
      </div>
    </div>
  );
}
