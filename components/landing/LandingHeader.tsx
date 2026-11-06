"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Terminal,
  Code2,
  Cpu,
  Building2,
  ShieldCheck,
  Zap,
  Gauge,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  GitBranch,
  History,
  LayoutDashboard,
} from "lucide-react";

type ThemeMode = "dark" | "light";
type MegaTab = "products" | "solutions" | "resources" | null;

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<MegaTab>("products");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [activeMega, setActiveMega] = useState<MegaTab>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;

    const evaluateTheme = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 36);
      if (Math.abs(scrollY - lastY) > 12) {
        setActiveMega(null);
      }
      lastY = scrollY;

      const checkY = 56;
      const sections = document.querySelectorAll("section, footer");
      let currentTheme: ThemeMode = "dark";

      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= checkY && rect.bottom >= checkY) {
          if (el.classList.contains("dark-scope")) {
            currentTheme = "dark";
            break;
          }
          const bg = window.getComputedStyle(el).backgroundColor;
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (match) {
            if (match[4] !== undefined && Number(match[4]) < 0.1) continue;
            const r = Number(match[1]);
            const g = Number(match[2]);
            const b = Number(match[3]);
            const luminance = (299 * r + 587 * g + 114 * b) / 1000;
            currentTheme = luminance < 128 ? "dark" : "light";
            break;
          }
        }
      }
      setTheme(currentTheme);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(evaluateTheme);
        ticking = true;
      }
    };

    evaluateTheme();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = (tab: MegaTab) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMega(tab);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 140);
  };

  const isDark = theme === "dark" || mobileOpen;

  // Compute morphing popover width & horizontal offset exactly like Composio
  const getMegaDimensions = () => {
    if (activeMega === "products") {
      return { widthClass: "w-[866px]", translateClass: "-translate-x-1/2" };
    }
    if (activeMega === "solutions") {
      return { widthClass: "w-[780px]", translateClass: "-translate-x-[46%]" };
    }
    return { widthClass: "w-[320px]", translateClass: "-translate-x-[15%]" };
  };

  const { widthClass, translateClass } = getMegaDimensions();

  return (
    <header
      className={`fixed left-0 z-50 flex w-full flex-col items-center overflow-visible border-b px-3 py-2 transition-[background-color,border-color,color,top] duration-300 md:left-1/2 md:w-[calc(100%-2rem)] md:max-w-[1240px] md:-translate-x-1/2 md:border md:px-2 md:py-[8px] rounded-none ${
        scrolled ? "top-0 md:top-4" : "top-[36px] md:top-[52px]"
      } ${
        isDark
          ? "border-white/15 bg-[#1A1A18] text-white"
          : "border-ink/10 bg-paper text-ink shadow-[0_8px_28px_-12px_rgba(26,26,24,0.08)]"
      }`}
      onMouseLeave={handleMouseLeave}
    >
      <nav
        aria-label="Primary navigation"
        className="flex w-full items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]"
      >
        {/* Zone 1: Brand Lockup (Composio geometric mark + wordmark) */}
        <Link
          href="/"
          className="flex items-center gap-2 pl-2 shrink-0 whitespace-nowrap"
          aria-label="Proofline — Home"
        >
          <span
            aria-hidden="true"
            className={`inline-flex items-center justify-center font-mono text-[16px] font-bold tracking-tighter transition-colors duration-300 ${
              isDark ? "text-accent-readable" : "text-accent"
            }`}
          >
            [ ]
          </span>
          <span className="font-sans text-[18px] font-semibold tracking-tight">
            Proofline
          </span>
        </Link>

        {/* Zone 2: Center Uppercase Monospace Triggers (Exact Composio pattern) */}
        <ul className="hidden items-center gap-1 lg:flex">
          <li onMouseEnter={() => handleMouseEnter("products")}>
            <button
              type="button"
              aria-expanded={activeMega === "products"}
              aria-haspopup="true"
              onClick={() => setActiveMega(activeMega === "products" ? null : "products")}
              className={`flex cursor-pointer items-center gap-1 px-4 py-1.5 font-mono text-sm uppercase leading-normal tracking-normal transition-colors duration-200 whitespace-nowrap ${
                activeMega === "products"
                  ? isDark
                    ? "text-white"
                    : "text-ink"
                  : isDark
                    ? "text-white/80 hover:text-white"
                    : "text-ink-soft hover:text-ink"
              }`}
            >
              <span>PIPELINE</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeMega === "products" ? "rotate-180" : ""
                }`}
              />
            </button>
          </li>

          <li onMouseEnter={() => handleMouseEnter("solutions")}>
            <button
              type="button"
              aria-expanded={activeMega === "solutions"}
              aria-haspopup="true"
              onClick={() => setActiveMega(activeMega === "solutions" ? null : "solutions")}
              className={`flex cursor-pointer items-center gap-1 px-4 py-1.5 font-mono text-sm uppercase leading-normal tracking-normal transition-colors duration-200 whitespace-nowrap ${
                activeMega === "solutions"
                  ? isDark
                    ? "text-white"
                    : "text-ink"
                  : isDark
                    ? "text-white/80 hover:text-white"
                    : "text-ink-soft hover:text-ink"
              }`}
            >
              <span>VERDICTS</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeMega === "solutions" ? "rotate-180" : ""
                }`}
              />
            </button>
          </li>

          <li onMouseEnter={() => handleMouseEnter("resources")}>
            <button
              type="button"
              aria-expanded={activeMega === "resources"}
              aria-haspopup="true"
              onClick={() => setActiveMega(activeMega === "resources" ? null : "resources")}
              className={`flex cursor-pointer items-center gap-1 px-4 py-1.5 font-mono text-sm uppercase leading-normal tracking-normal transition-colors duration-200 whitespace-nowrap ${
                activeMega === "resources"
                  ? isDark
                    ? "text-white"
                    : "text-ink"
                  : isDark
                    ? "text-white/80 hover:text-white"
                    : "text-ink-soft hover:text-ink"
              }`}
            >
              <span>GOVERNANCE</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  activeMega === "resources" ? "rotate-180" : ""
                }`}
              />
            </button>
          </li>

          <li onMouseEnter={() => setActiveMega(null)}>
            <Link
              href="/about"
              className={`block px-4 py-1.5 font-mono text-sm uppercase leading-normal tracking-normal transition-colors duration-200 whitespace-nowrap ${
                isDark
                  ? "text-white/80 hover:text-white"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              SPEC
            </Link>
          </li>
        </ul>

        {/* Zone 3: Sharp 0px Right Actions (Exact Composio LOG IN + GET STARTED - FREE) */}
        <div className="flex shrink-0 items-center justify-end gap-2">
          <Link
            href="/facts"
            className={`hidden lg:flex items-center justify-center whitespace-nowrap border px-2.5 py-1.5 font-mono text-sm uppercase leading-normal transition-colors duration-300 rounded-none ${
              isDark
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-ink/20 text-ink hover:bg-ink/5"
            }`}
          >
            42 FACTS
          </Link>

          <Link
            href="/check"
            className={`hidden sm:flex items-center justify-center whitespace-nowrap border px-2.5 py-1.5 font-mono text-sm uppercase leading-normal transition-colors duration-300 rounded-none ${
              isDark
                ? "border-paper bg-paper text-ink hover:bg-paper/90"
                : "border-ink bg-ink text-paper hover:bg-ink/85"
            }`}
          >
            CHECK DRAFT – FREE
          </Link>

          {/* Mobile 3-bar Hamburger Button */}
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-[5px] p-2 lg:hidden cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-current transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* =========================================================================
          MORPHING SHARP-CORNER MEGA-MENU POPUP (01-megamenu-products.png)
          ========================================================================= */}
      {activeMega && (
        <div
          className={`absolute top-full left-1/2 z-50 mt-2 hidden lg:block max-w-[calc(100vw-2rem)] overflow-hidden border rounded-none transition-[width,transform,background-color,border-color] duration-300 ease-out ${widthClass} ${translateClass} ${
            isDark
              ? "border-white/15 bg-[#1F1F1C] text-white shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
              : "border-ink/15 bg-paper text-ink shadow-[0_24px_48px_rgba(26,26,24,0.12)]"
          }`}
          onMouseEnter={() => handleMouseEnter(activeMega)}
          onMouseLeave={handleMouseLeave}
        >
          {/* TAB 1: PIPELINE (3 Columns with internal border-l dividers, exact 01-megamenu-products.png) */}
          {activeMega === "products" && (
            <div className="grid grid-cols-3">
              {/* Col 1: USE */}
              <div className="flex flex-col p-5">
                <span
                  className={`mb-2 font-mono text-[11px] uppercase tracking-wider ${
                    isDark ? "text-white/45" : "text-ink-faint"
                  }`}
                >
                  USE
                </span>
                <div
                  className={`flex flex-col divide-y ${
                    isDark ? "divide-white/10" : "divide-ink/10"
                  }`}
                >
                  <Link
                    href="/check"
                    onClick={() => setActiveMega(null)}
                    className={`group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0 transition-colors ${
                      isDark ? "hover:bg-white/[0.03]" : "hover:bg-ink/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm uppercase tracking-wider">
                        PROOFLINE
                      </span>
                      <span
                        className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none ${
                          isDark
                            ? "border-accent-readable text-accent-readable bg-accent/20"
                            : "border-accent text-accent bg-accent/10"
                        }`}
                      >
                        FOR YOU
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      Verify any marketing draft against 42 approved Flowdesk facts in under 2 seconds
                    </p>
                  </Link>

                  <a
                    href="#build"
                    onClick={() => setActiveMega(null)}
                    className={`group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0 transition-colors ${
                      isDark ? "hover:bg-white/[0.03]" : "hover:bg-ink/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Terminal
                        size={14}
                        className={isDark ? "text-white/50" : "text-ink-faint"}
                      />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        CLI &amp; SMOKE SUITE
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      One command (`npm run smoke`) to run 24 eval cases and 51 unit assertions
                    </p>
                  </a>
                </div>
              </div>

              {/* Col 2: BUILD */}
              <div
                className={`flex flex-col border-l p-5 ${
                  isDark ? "border-white/10" : "border-ink/10"
                }`}
              >
                <span
                  className={`mb-2 font-mono text-[11px] uppercase tracking-wider ${
                    isDark ? "text-white/45" : "text-ink-faint"
                  }`}
                >
                  BUILD
                </span>
                <div
                  className={`flex flex-col divide-y ${
                    isDark ? "divide-white/10" : "divide-ink/10"
                  }`}
                >
                  <a
                    href="#build"
                    onClick={() => setActiveMega(null)}
                    className="group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Code2
                        size={14}
                        className={isDark ? "text-white/50" : "text-ink-faint"}
                      />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        REST API ENDPOINT
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      Stateless `POST /api/verify` JSON endpoint for CI/CD gates and editorial bots
                    </p>
                  </a>

                  <a
                    href="#pipeline"
                    onClick={() => setActiveMega(null)}
                    className="group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Cpu
                        size={14}
                        className={isDark ? "text-white/50" : "text-ink-faint"}
                      />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        ARCHIFY TOPOLOGY
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      Interactive module dependency graph across all 8 `lib/*.ts` verification stages
                    </p>
                  </a>

                  <a
                    href="#enterprise"
                    onClick={() => setActiveMega(null)}
                    className="group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Building2
                        size={14}
                        className={isDark ? "text-white/50" : "text-ink-faint"}
                      />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        ENTERPRISE PRIVACY
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      Zero server draft retention, incognito-ready workspace, and append-only audit log
                    </p>
                  </a>
                </div>
              </div>

              {/* Col 3: FEATURES */}
              <div
                className={`flex flex-col border-l p-5 ${
                  isDark ? "border-white/10" : "border-ink/10"
                }`}
              >
                <span
                  className={`mb-2 font-mono text-[11px] uppercase tracking-wider ${
                    isDark ? "text-white/45" : "text-ink-faint"
                  }`}
                >
                  FEATURES
                </span>
                <div
                  className={`flex flex-col divide-y ${
                    isDark ? "divide-white/10" : "divide-ink/10"
                  }`}
                >
                  <a
                    href="#how-it-works"
                    onClick={() => setActiveMega(null)}
                    className="group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Zap
                        size={14}
                        className={isDark ? "text-white/50" : "text-ink-faint"}
                      />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        STAGE 1 RULES
                      </span>
                      <span
                        className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none ${
                          isDark
                            ? "border-accent-readable text-accent-readable bg-accent/20"
                            : "border-accent text-accent bg-accent/10"
                        }`}
                      >
                        78% 0ms
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      Resolves numbers, currencies, dates, and disclaimers in TypeScript with zero LLM cost
                    </p>
                  </a>

                  <a
                    href="#trust"
                    onClick={() => setActiveMega(null)}
                    className="group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        size={14}
                        className={isDark ? "text-white/50" : "text-ink-faint"}
                      />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        EVIDENCE GATE
                      </span>
                      <span
                        className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none ${
                          isDark
                            ? "border-accent-readable text-accent-readable bg-accent/20"
                            : "border-accent text-accent bg-accent/10"
                        }`}
                      >
                        NEW
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      Blocks unbacked contradictions unless all 6 citation and validity fields resolve
                    </p>
                  </a>

                  <a
                    href="#pipeline"
                    onClick={() => setActiveMega(null)}
                    className="group flex flex-col gap-1.5 py-4 first:pt-2 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Gauge
                        size={14}
                        className={isDark ? "text-white/50" : "text-ink-faint"}
                      />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        TOP-5 RETRIEVAL
                      </span>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-white/60" : "text-ink-soft"
                      }`}
                    >
                      Lexical token overlap sends ≤5 active facts to the model; zero hallucinated spans
                    </p>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERDICTS (2 Columns with internal border-l divider) */}
          {activeMega === "solutions" && (
            <div className="grid grid-cols-2">
              <div className="flex flex-col p-5">
                <span
                  className={`mb-2 font-mono text-[11px] uppercase tracking-wider ${
                    isDark ? "text-white/45" : "text-ink-faint"
                  }`}
                >
                  AFFIRMATIVE &amp; NEGATIVE
                </span>
                <div
                  className={`flex flex-col divide-y ${
                    isDark ? "divide-white/10" : "divide-ink/10"
                  }`}
                >
                  <a
                    href="#verdicts"
                    onClick={() => setActiveMega(null)}
                    className="flex flex-col gap-1.5 py-3.5 first:pt-2"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-v-supported-fg" />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        SUPPORTED
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-ink-soft"}`}>
                      Approved fact entails the claim within active `valid_from` and `valid_until` dates
                    </p>
                  </a>

                  <a
                    href="#verdicts"
                    onClick={() => setActiveMega(null)}
                    className="flex flex-col gap-1.5 py-3.5"
                  >
                    <div className="flex items-center gap-2">
                      <XCircle size={14} className="text-v-contradicted-fg" />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        CONTRADICTED
                      </span>
                      <span
                        className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none ${
                          isDark
                            ? "border-accent-readable text-accent-readable bg-accent/20"
                            : "border-accent text-accent bg-accent/10"
                        }`}
                      >
                        GATED
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-ink-soft"}`}>
                      Active approved fact contradicts the claim; requires 6-field Evidence Gate proof
                    </p>
                  </a>

                  <a
                    href="#verdicts"
                    onClick={() => setActiveMega(null)}
                    className="flex flex-col gap-1.5 py-3.5 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm uppercase tracking-wider">
                        UNVERIFIED &amp; NOT_CHECKABLE
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-ink-soft"}`}>
                      Missing register coverage or subjective puffery separated cleanly from factual errors
                    </p>
                  </a>
                </div>
              </div>

              <div
                className={`flex flex-col border-l p-5 ${
                  isDark ? "border-white/10" : "border-ink/10"
                }`}
              >
                <span
                  className={`mb-2 font-mono text-[11px] uppercase tracking-wider ${
                    isDark ? "text-white/45" : "text-ink-faint"
                  }`}
                >
                  TEMPORAL &amp; LINEAGE STATES
                </span>
                <div
                  className={`flex flex-col divide-y ${
                    isDark ? "divide-white/10" : "divide-ink/10"
                  }`}
                >
                  <a
                    href="#verdicts"
                    onClick={() => setActiveMega(null)}
                    className="flex flex-col gap-1.5 py-3.5 first:pt-2"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-v-stale-fg" />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        STALE
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-ink-soft"}`}>
                      Matched fact’s `valid_until` expired prior to `review_date` (e.g., Legacy v3 rate)
                    </p>
                  </a>

                  <a
                    href="#verdicts"
                    onClick={() => setActiveMega(null)}
                    className="flex flex-col gap-1.5 py-3.5 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-v-conflicting-fg" />
                      <span className="font-mono text-sm uppercase tracking-wider">
                        CONFLICTING
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-ink-soft"}`}>
                      Two active approved records assert different values for the same product attribute
                    </p>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOVERNANCE (1 Column compact menu) */}
          {activeMega === "resources" && (
            <div className="flex flex-col p-5">
              <span
                className={`mb-2 font-mono text-[11px] uppercase tracking-wider ${
                  isDark ? "text-white/45" : "text-ink-faint"
                }`}
              >
                WORKSPACE &amp; DOCS
              </span>
              <div
                className={`flex flex-col divide-y ${
                  isDark ? "divide-white/10" : "divide-ink/10"
                }`}
              >
                <Link
                  href="/facts"
                  onClick={() => setActiveMega(null)}
                  className="flex items-center gap-2.5 py-3 first:pt-2 font-mono text-sm uppercase tracking-wider hover:text-accent-readable"
                >
                  <FileText size={14} className="opacity-60" />
                  <span>FACT REGISTER (42)</span>
                </Link>
                <Link
                  href="/audit"
                  onClick={() => setActiveMega(null)}
                  className="flex items-center gap-2.5 py-3 font-mono text-sm uppercase tracking-wider hover:text-accent-readable"
                >
                  <History size={14} className="opacity-60" />
                  <span>AUDIT LEDGER</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setActiveMega(null)}
                  className="flex items-center gap-2.5 py-3 font-mono text-sm uppercase tracking-wider hover:text-accent-readable"
                >
                  <LayoutDashboard size={14} className="opacity-60" />
                  <span>REGISTER DASHBOARD</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setActiveMega(null)}
                  className="flex items-center gap-2.5 py-3 last:pb-0 font-mono text-sm uppercase tracking-wider hover:text-accent-readable"
                >
                  <GitBranch size={14} className="opacity-60" />
                  <span>ROUND 1 → 2 SPEC</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MOBILE FULL-WIDTH ACCORDION DRAWER (01-navbar-mobile-accordion-open.png)
          ========================================================================= */}
      <div
        className={`grid w-full transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col border-t border-white/10 pt-3 pb-4 text-white">
            {/* Accordion 1: PIPELINE */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === "products" ? null : "products")
                }
                className="flex w-full items-center justify-between py-3 font-mono text-sm uppercase"
              >
                <span>PIPELINE</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    mobileAccordion === "products" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ${
                  mobileAccordion === "products" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-2 pb-3 pl-3 text-xs text-white/75 font-mono">
                    <Link href="/check" onClick={() => setMobileOpen(false)} className="py-1">
                      PROOFLINE CHECKER [FOR YOU]
                    </Link>
                    <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="py-1">
                      STAGE 1 DETERMINISTIC RULES (78%)
                    </a>
                    <a href="#pipeline" onClick={() => setMobileOpen(false)} className="py-1">
                      ARCHIFY SYSTEM TOPOLOGY
                    </a>
                    <a href="#build" onClick={() => setMobileOpen(false)} className="py-1">
                      POST /API/VERIFY ENDPOINT
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion 2: VERDICTS */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() =>
                  setMobileAccordion(mobileAccordion === "solutions" ? null : "solutions")
                }
                className="flex w-full items-center justify-between py-3 font-mono text-sm uppercase"
              >
                <span>VERDICTS</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    mobileAccordion === "solutions" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ${
                  mobileAccordion === "solutions" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-2 pb-3 pl-3 text-xs text-white/75 font-mono">
                    <a href="#verdicts" onClick={() => setMobileOpen(false)} className="py-1">
                      SUPPORTED &amp; CONTRADICTED
                    </a>
                    <a href="#verdicts" onClick={() => setMobileOpen(false)} className="py-1">
                      STALE &amp; CONFLICTING
                    </a>
                    <a href="#verdicts" onClick={() => setMobileOpen(false)} className="py-1">
                      UNVERIFIED &amp; NOT_CHECKABLE
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Links */}
            <Link
              href="/facts"
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/10 py-3 font-mono text-sm uppercase"
            >
              FACT REGISTER (42)
            </Link>
            <Link
              href="/audit"
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/10 py-3 font-mono text-sm uppercase"
            >
              AUDIT LOG
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/10 py-3 font-mono text-sm uppercase"
            >
              SPEC &amp; ROUND 1 PDF
            </Link>

            {/* Bottom Sharp Action Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/facts"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center border border-white/30 px-2 py-2.5 font-mono text-sm uppercase text-white rounded-none"
              >
                42 FACTS
              </Link>
              <Link
                href="/check"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center border border-paper bg-paper px-2 py-2.5 font-mono text-sm uppercase text-ink rounded-none"
              >
                CHECK DRAFT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
