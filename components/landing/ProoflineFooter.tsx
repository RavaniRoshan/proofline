"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GLOW_PLATE_SRC =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4a917d4c-123f-4b68-8125-b201961b7791.jpg";
const GLOW_VIDEO_SRC =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/a8f60da5-538f-403a-a812-6be0f098e319.mp4";

export function ProoflineFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  const [videoReady, setVideoReady] = useState(false);
  const [inView, setInView] = useState(false);

  // Trigger entrance animation when footer enters viewport
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const id = window.requestAnimationFrame(() => setInView(true));
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Dual-video 4s crossfade loop (last 1s crossfades into first 1s without jump)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    let rafId = 0;
    let active: "A" | "B" = "A";
    const CROSSFADE_SEC = 1.0;

    const tick = () => {
      const primary = active === "A" ? vA : vB;
      const secondary = active === "A" ? vB : vA;
      const dur = primary.duration || 4;
      const cur = primary.currentTime;

      if (dur > CROSSFADE_SEC && cur >= dur - CROSSFADE_SEC) {
        const progress = Math.min(1, (cur - (dur - CROSSFADE_SEC)) / CROSSFADE_SEC);
        if (secondary.paused) {
          secondary.currentTime = 0;
          secondary.play().catch(() => {});
        }
        secondary.style.opacity = String(progress);
        primary.style.opacity = String(1 - progress);

        if (progress >= 0.98) {
          primary.pause();
          primary.currentTime = 0;
          primary.style.opacity = "0";
          secondary.style.opacity = "1";
          active = active === "A" ? "B" : "A";
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    vA.style.opacity = "1";
    vB.style.opacity = "0";
    vA.play().catch(() => {});
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      data-inview={inView ? "true" : "false"}
      aria-label="Proofline footer"
      className="plf-root"
    >
      <style>{`
        .plf-root {
          --u: min(calc(100vw / 1326), 1.05px);
          --c-bg: #110C0D;
          --c-text: #FFFFFF;
          --c-link: #D8C7C4;
          --c-copy: #C9B5B1;
          --c-accent: #D4847A;
          --c-accent-bright: #F2A79F;
          --c-oxide: #6E1F26;
          --c-rule: rgba(212, 132, 122, 0.36);

          position: relative;
          width: 100%;
          background:
            linear-gradient(90deg, #571820 0%, #3E1217 28%, #6E1F26 58%, #B85D56 85%, #D4847A 100%)
            top / 100% calc(var(--u) * 60) no-repeat,
            var(--c-bg);
          color: var(--c-text);
          font-family: var(--font-sans), 'Figtree', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
          user-select: none;
          -webkit-font-smoothing: antialiased;
        }

        /* Top Glow Plate + Seamless Crossfade Video Band */
        .plf-glow-stage {
          position: relative;
          width: 100%;
          height: calc(var(--u) * 558);
          overflow: hidden;
          pointer-events: none;
        }

        .plf-glow-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          /* Mask bottom 18% into deep Proofline ink (#110C0D) */
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 76%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 76%, transparent 100%);
        }

        .plf-plate {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          /* Re-grade cobalt/cyan plate into Proofline oxblood / coral / espresso */
          filter: hue-rotate(142deg) saturate(0.76) brightness(0.76) contrast(1.12);
        }

        .plf-video-wrap {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.9s ease;
        }

        .plf-video-wrap.is-ready {
          opacity: 1;
        }

        .plf-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: hue-rotate(142deg) saturate(0.8) brightness(0.82) contrast(1.12);
          mix-blend-mode: screen;
        }

        /* Warm Proofline atmospheric tint over the aurora */
        .plf-glow-tint {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(95% 80% at 58% 35%, rgba(212, 132, 122, 0.22) 0%, rgba(110, 31, 38, 0.35) 52%, rgba(17, 12, 13, 0.92) 100%);
        }

        /* Sweeping Arc + Glowing Glass Ring SVG */
        .plf-arc-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        /* Main Desktop Reference Frame (1326u centered) */
        .plf-frame {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 1240px;
          margin: calc(var(--u) * -120) auto 0;
          padding: 0 clamp(20px, 3.5vw, 48px) calc(var(--u) * 48);
        }

        .plf-main-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1.25fr 240px 1.35fr;
          align-items: stretch;
          min-height: calc(var(--u) * 395);
        }

        /* Hairline vertical dividers framing the vertical wordmark */
        .plf-col-center {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: calc(var(--u) * 16) 0 calc(var(--u) * 28);
        }

        .plf-col-center::before,
        .plf-col-center::after {
          content: "";
          position: absolute;
          top: calc(var(--u) * -90);
          bottom: 0;
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(212, 132, 122, 0.48) 28%,
            rgba(212, 132, 122, 0.42) 100%
          );
        }

        .plf-col-center::before {
          left: 0;
        }

        .plf-col-center::after {
          right: 0;
        }

        /* Vertical Wordmark ("Proofline" reading bottom-to-top) */
        .plf-wordmark-clip {
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .plf-wordmark-svg {
          width: calc(var(--u) * 96);
          height: calc(var(--u) * 410);
          display: block;
        }

        .plf-wordmark-mobile {
          display: none;
        }

        /* Left Column: Headline + Ring CTA */
        .plf-col-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: calc(var(--u) * 24) calc(var(--u) * 36) calc(var(--u) * 36) 0;
        }

        .plf-headline-clip {
          overflow: hidden;
        }

        .plf-headline {
          margin: 0;
          font-family: var(--font-sans);
          font-size: clamp(22px, calc(var(--u) * 29), 30px);
          font-weight: 500;
          font-variation-settings: "wght" 510;
          line-height: 1.24;
          letter-spacing: -0.03em;
          color: #FFFFFF;
        }

        /* CTA Ring + "Check a draft" */
        .plf-cta {
          margin-top: calc(var(--u) * 42);
          display: inline-flex;
          align-items: center;
          gap: calc(var(--u) * 20);
          text-decoration: none;
          width: fit-content;
        }

        .plf-cta-ring {
          width: clamp(58px, calc(var(--u) * 76), 76px);
          height: clamp(58px, calc(var(--u) * 76), 76px);
          border-radius: 9999px;
          border: 1.6px solid var(--c-accent);
          background: rgba(212, 132, 122, 0.04);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--c-accent-bright);
          transition: background-color 0.28s ease, transform 0.28s ease, border-color 0.28s ease;
        }

        .plf-cta-arrow {
          width: 24px;
          height: 24px;
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .plf-cta-label {
          position: relative;
          font-family: var(--font-sans);
          font-size: clamp(21px, calc(var(--u) * 30), 30px);
          font-weight: 470;
          font-variation-settings: "wght" 470;
          letter-spacing: -0.03em;
          color: var(--c-accent-bright);
          padding-bottom: 4px;
        }

        .plf-cta-label::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1.6px;
          background: var(--c-accent-bright);
          transform-origin: right center;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .plf-cta:hover .plf-cta-ring {
          background: rgba(212, 132, 122, 0.18);
          border-color: var(--c-accent-bright);
        }

        .plf-cta:hover .plf-cta-arrow {
          transform: rotate(45deg);
        }

        .plf-cta:hover .plf-cta-label::after {
          transform: scaleX(0);
        }

        /* Right Column: Two Link Columns ("Important" / "Legal" pattern) */
        .plf-col-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: calc(var(--u) * 36);
          padding: calc(var(--u) * 24) 0 calc(var(--u) * 36) calc(var(--u) * 52);
        }

        .plf-nav-heading {
          margin: 0 0 calc(var(--u) * 20);
          font-family: var(--font-sans);
          font-size: clamp(20px, calc(var(--u) * 27), 27px);
          font-weight: 500;
          font-variation-settings: "wght" 520;
          letter-spacing: -0.025em;
          color: #FFFFFF;
        }

        .plf-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: calc(var(--u) * 16);
        }

        .plf-nav-link {
          font-family: var(--font-sans);
          font-size: clamp(16px, calc(var(--u) * 21), 21px);
          font-weight: 380;
          font-variation-settings: "wght" 380;
          letter-spacing: -0.015em;
          color: var(--c-link);
          text-decoration: none;
          transition: color 0.18s ease;
        }

        .plf-nav-link:hover {
          color: var(--c-accent-bright);
        }

        /* Full-Bleed Dashed Rule */
        .plf-dashed-rule {
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          height: 1px;
          background-image: linear-gradient(
            to right,
            var(--c-rule) 55%,
            transparent 45%
          );
          background-size: 12px 1px;
          background-repeat: repeat-x;
        }

        /* Bottom Social & Copyright Row */
        .plf-bottom-row {
          padding-top: calc(var(--u) * 38);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .plf-social-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .plf-follow-label {
          font-family: var(--font-sans);
          font-size: clamp(18px, calc(var(--u) * 24), 24px);
          font-weight: 500;
          font-variation-settings: "wght" 510;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }

        .plf-socials {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .plf-social-btn {
          width: 45px;
          height: 45px;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 30% 25%,
            rgba(110, 31, 38, 0.42) 0%,
            rgba(26, 18, 19, 0.88) 100%
          );
          border: 1px solid rgba(212, 132, 122, 0.36);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--c-accent-bright);
          text-decoration: none;
          transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s ease, background-color 0.22s ease;
        }

        .plf-social-btn:hover {
          transform: translateY(-3px);
          border-color: var(--c-accent-bright);
          background: rgba(110, 31, 38, 0.55);
        }

        .plf-copyright {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 380;
          font-variation-settings: "wght" 380;
          color: var(--c-copy);
          text-align: right;
          align-self: flex-end;
        }

        /* Entrance Choreography (1.6s sequence) */
        @keyframes plf-wipe-up {
          from { clip-path: inset(100% 0 0 0); transform: translateY(24px); }
          to   { clip-path: inset(0 0 0 0); transform: translateY(0); }
        }

        @keyframes plf-rise {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes plf-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .plf-root[data-inview="true"] .plf-wordmark-svg,
        .plf-root[data-inview="true"] .plf-wordmark-mobile {
          animation: plf-wipe-up 1.05s cubic-bezier(0.22, 1, 0.36, 1) 0.08s backwards;
        }

        .plf-root[data-inview="true"] .plf-headline {
          animation: plf-wipe-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.22s backwards;
        }

        .plf-root[data-inview="true"] .plf-cta {
          animation: plf-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.42s backwards;
        }

        .plf-root[data-inview="true"] .plf-col-right > div:first-child {
          animation: plf-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.52s backwards;
        }

        .plf-root[data-inview="true"] .plf-col-right > div:last-child {
          animation: plf-rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.64s backwards;
        }

        .plf-root[data-inview="true"] .plf-bottom-row {
          animation: plf-fade 0.85s ease 0.78s backwards;
        }

        /* Tablet & Phone (< 960px): Horizontal full-width wordmark rising out of glow */
        @media (max-width: 959.98px) {
          .plf-glow-stage {
            height: 280px;
          }

          .plf-frame {
            margin-top: -70px;
            padding-bottom: 40px;
          }

          .plf-wordmark-mobile {
            display: block;
            width: 100%;
            height: auto;
            padding-bottom: 18px;
            margin-bottom: 28px;
            border-bottom: 1px solid var(--c-rule);
          }

          .plf-main-grid {
            display: flex;
            flex-direction: column;
            gap: 36px;
            min-height: 0;
          }

          .plf-col-center {
            display: none;
          }

          .plf-col-left {
            padding: 0;
          }

          .plf-cta {
            margin-top: 24px;
          }

          .plf-col-right {
            padding: 0 0 32px;
            gap: 24px;
          }

          .plf-bottom-row {
            padding-top: 28px;
            flex-direction: column;
            align-items: flex-start;
          }

          .plf-copyright {
            text-align: left;
            align-self: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .plf-root *, .plf-root *::before, .plf-root *::after {
            animation: none !important;
            transition: none !important;
          }
          .plf-video-wrap {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. Full-Bleed Aurora Glow Stage + Sweeping Arc + Glowing Glass Ring */}
      <div className="plf-glow-stage" aria-hidden="true">
        <div className="plf-glow-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GLOW_PLATE_SRC}
            alt=""
            className="plf-plate"
          />

          <div className={`plf-video-wrap${videoReady ? " is-ready" : ""}`}>
            <video
              ref={videoARef}
              src={GLOW_VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
              className="plf-video"
            />
            <video
              ref={videoBRef}
              src={GLOW_VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              className="plf-video"
            />
          </div>

          <div className="plf-glow-tint" />
        </div>

        {/* Sweeping Arc from (0, 143) -> (816, 386) -> (1326, 334) and Glass Ring r=78 at (780.7, 351.5) */}
        <svg
          className="plf-arc-svg"
          viewBox="0 0 1326 558"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="plfArcGrad" x1="0" y1="143" x2="1326" y2="334" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6E1F26" stopOpacity="0.55" />
              <stop offset="58%" stopColor="#D4847A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#F2A79F" stopOpacity="0.75" />
            </linearGradient>

            <radialGradient id="plfDiscFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1A1012" stopOpacity="0.82" />
              <stop offset="72%" stopColor="#2B1418" stopOpacity="0.64" />
              <stop offset="100%" stopColor="#6E1F26" stopOpacity="0.32" />
            </radialGradient>

            <linearGradient id="plfRimGrad" x1="702" y1="429" x2="859" y2="273" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6E1F26" />
              <stop offset="50%" stopColor="#D4847A" />
              <stop offset="100%" stopColor="#FFE1DC" />
            </linearGradient>

            <filter id="plfRimBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          {/* Thin Sweeping Arc */}
          <path
            d="M 0 143 Q 660 430 816 386 T 1326 334"
            stroke="url(#plfArcGrad)"
            strokeWidth="1.6"
            fill="none"
          />

          {/* Glowing Glass Ring at (780.7, 351.5), r = 78 */}
          <g transform="translate(780.7, 351.5)">
            <circle
              r="78"
              fill="url(#plfDiscFill)"
            />
            <circle
              r="78"
              stroke="url(#plfRimGrad)"
              strokeWidth="2.4"
              filter="url(#plfRimBlur)"
              opacity="0.85"
            />
            <circle
              r="78"
              stroke="url(#plfRimGrad)"
              strokeWidth="2.4"
            />
          </g>
        </svg>
      </div>

      {/* 2. Centered Architectural Footer Frame */}
      <div className="plf-frame">
        {/* Horizontal Full-Width Wordmark on Tablet & Mobile (< 960px) */}
        <svg
          className="plf-wordmark-mobile"
          viewBox="0 0 820 120"
          fill="none"
          aria-label="Proofline"
        >
          <defs>
            <linearGradient id="plfWordmarkGradH" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8525B" />
              <stop offset="55%" stopColor="#F2A79F" />
              <stop offset="100%" stopColor="#D4847A" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="96"
            fill="url(#plfWordmarkGradH)"
            fontFamily="var(--font-sans), 'Figtree', sans-serif"
            fontSize="112"
            fontWeight="780"
            letterSpacing="-0.045em"
          >
            Proofline
          </text>
        </svg>

        <div className="plf-main-grid">
          {/* LEFT: Headline + Ring CTA */}
          <div className="plf-col-left">
            <div className="plf-headline-clip">
              <h2 className="plf-headline">
                Verify every claim with
                <br />
                us and ship copy with
                <br />
                deterministic proof.
              </h2>
            </div>

            <Link href="/check" className="plf-cta">
              <span className="plf-cta-ring" aria-hidden="true">
                <svg
                  className="plf-cta-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
              <span className="plf-cta-label">Check a draft</span>
            </Link>
          </div>

          {/* CENTER: Vertical "Proofline" Wordmark between two hairlines */}
          <div className="plf-col-center" aria-hidden="true">
            <div className="plf-wordmark-clip">
              <svg
                className="plf-wordmark-svg"
                viewBox="0 0 110 470"
                fill="none"
              >
                <defs>
                  <linearGradient id="plfWordmarkGradV" x1="0" y1="470" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#B8525B" />
                    <stop offset="50%" stopColor="#F2A79F" />
                    <stop offset="100%" stopColor="#D4847A" />
                  </linearGradient>
                </defs>
                <text
                  x="88"
                  y="462"
                  transform="rotate(-90 88 462)"
                  fill="url(#plfWordmarkGradV)"
                  fontFamily="var(--font-sans), 'Figtree', sans-serif"
                  fontSize="98"
                  fontWeight="780"
                  letterSpacing="-0.045em"
                >
                  Proofline
                </text>
              </svg>
            </div>
          </div>

          {/* RIGHT: Two Link Columns ("Important" + "Legal" structure) */}
          <div className="plf-col-right">
            <div>
              <h3 className="plf-nav-heading">Important</h3>
              <ul className="plf-nav-list">
                <li>
                  <Link href="/check" className="plf-nav-link">
                    Draft Checker
                  </Link>
                </li>
                <li>
                  <Link href="/facts" className="plf-nav-link">
                    Fact Register
                  </Link>
                </li>
                <li>
                  <Link href="/audit" className="plf-nav-link">
                    Audit Ledger
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="plf-nav-link">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/audit" className="plf-nav-link">
                    Six Verdicts
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="plf-nav-heading">Governance</h3>
              <ul className="plf-nav-list">
                <li>
                  <Link href="/about" className="plf-nav-link">
                    Architecture Spec
                  </Link>
                </li>
                <li>
                  <a href="#trust" className="plf-nav-link">
                    Evidence Gate
                  </a>
                </li>
                <li>
                  <a
                    href="https://drive.google.com/file/d/1f2UiggPpvjTz1mhgyASbu8RWp1csY9q4/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="plf-nav-link"
                  >
                    Round 1 PDF
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/RavaniRoshan/proofline"
                    target="_blank"
                    rel="noreferrer"
                    className="plf-nav-link"
                  >
                    GitHub Repo
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Full-Width Dashed Rule */}
        <div className="plf-dashed-rule" aria-hidden="true" />

        {/* Bottom Row: Follow Us + 5 Social Icons + Copyright */}
        <div className="plf-bottom-row">
          <div className="plf-social-group">
            <span className="plf-follow-label">Follow us</span>
            <div className="plf-socials">
              {/* GitHub */}
              <a
                href="https://github.com/RavaniRoshan/proofline"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="plf-social-btn"
                title="GitHub Repository"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* Documentation */}
              <a
                href="https://github.com/RavaniRoshan/proofline#readme"
                target="_blank"
                rel="noreferrer"
                aria-label="Documentation"
                className="plf-social-btn"
                title="Documentation & RFC"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
              </a>

              {/* X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="plf-social-btn"
                title="X (Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="plf-social-btn"
                title="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="plf-copyright">
            Copyright &copy; 2026 Proofline &mdash; All rights reserved &middot; Zero Server Storage
          </div>
        </div>
      </div>
    </footer>
  );
}
