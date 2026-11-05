"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Layers,
  Sparkles,
} from "lucide-react";

type ThemeMode = "dark" | "light";
type MegaTab = "verdicts" | "pipeline" | "governance" | null;

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [activeMega, setActiveMega] = useState<MegaTab>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active scroll listener detecting underlying section background luminance
  useEffect(() => {
    let ticking = false;

    const evaluateTheme = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 24);

      // Probe position: center of the floating pill header (topbar ~36px + 24px)
      const checkY = 64;
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
            // Ignore transparent wrapper elements
            if (match[4] !== undefined && Number(match[4]) < 0.1) continue;
            const r = Number(match[1]);
            const g = Number(match[2]);
            const b = Number(match[3]);
            // ITU-R BT.601 perceptual luminance formula
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
    }, 150);
  };

  const isDark = theme === "dark" || mobileOpen;

  return (
    <header
      className={`fixed left-0 z-50 flex w-full flex-col items-center px-4 transition-[top] duration-300 md:left-1/2 md:-translate-x-1/2 md:max-w-[1240px] md:px-2 ${
        scrolled ? "top-3 md:top-3.5" : "top-0 md:top-12"
      }`}
    >
      {/* 100% Solid Opaque Navbar Pill — Zero Transparency */}
      <div
        className={`w-full rounded-2xl md:rounded-full border px-4 py-2.5 transition-[background-color,border-color,color,box-shadow] duration-300 relative ${
          isDark
            ? "border-white/15 bg-[#141412] text-white shadow-[0_16px_36px_-10px_rgba(0,0,0,0.65)]"
            : "border-neutral-300 bg-white text-ink shadow-[0_16px_36px_-10px_rgba(0,0,0,0.08)]"
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="flex w-full items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* Left: Brand Identity */}
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Proofline — Home">
              <span
                aria-hidden="true"
                className={`flex items-center gap-[2px] font-serif text-[18px] font-semibold transition-colors duration-300 ${
                  isDark ? "text-accent-readable" : "text-accent"
                }`}
              >
                <span>[</span>
                <span>]</span>
              </span>
              <span className="font-serif text-[17px] font-semibold tracking-tight transition-colors duration-300">
                Proofline
              </span>
            </Link>
            <span
              className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider border font-medium ${
                isDark
                  ? "border-white/20 bg-white/5 text-white/80"
                  : "border-neutral-200 bg-neutral-100 text-neutral-700"
              }`}
            >
              PREFLIGHT GOVERNANCE
            </span>
          </div>

          {/* Center: Desktop Nav triggers with Mega Menus */}
          <ul className="hidden lg:flex items-center justify-center gap-1 font-mono text-[13px] tracking-tight">
            {/* Tab 1: Verdicts */}
            <li onMouseEnter={() => handleMouseEnter("verdicts")}>
              <a
                href="#verdicts"
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                  activeMega === "verdicts"
                    ? isDark
                      ? "bg-white/15 text-white font-semibold"
                      : "bg-neutral-100 text-ink font-semibold"
                    : isDark
                      ? "text-white/80 hover:text-white"
                      : "text-neutral-600 hover:text-ink"
                }`}
              >
                VERDICTS
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    activeMega === "verdicts" ? "rotate-180" : ""
                  }`}
                />
              </a>
            </li>

            {/* Tab 2: Pipeline */}
            <li onMouseEnter={() => handleMouseEnter("pipeline")}>
              <a
                href="#pipeline"
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                  activeMega === "pipeline"
                    ? isDark
                      ? "bg-white/15 text-white font-semibold"
                      : "bg-neutral-100 text-ink font-semibold"
                    : isDark
                      ? "text-white/80 hover:text-white"
                      : "text-neutral-600 hover:text-ink"
                }`}
              >
                PIPELINE
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    activeMega === "pipeline" ? "rotate-180" : ""
                  }`}
                />
              </a>
            </li>

            {/* Tab 3: Governance / Architecture */}
            <li onMouseEnter={() => handleMouseEnter("governance")}>
              <a
                href="#enterprise"
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                  activeMega === "governance"
                    ? isDark
                      ? "bg-white/15 text-white font-semibold"
                      : "bg-neutral-100 text-ink font-semibold"
                    : isDark
                      ? "text-white/80 hover:text-white"
                      : "text-neutral-600 hover:text-ink"
                }`}
              >
                GOVERNANCE
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    activeMega === "governance" ? "rotate-180" : ""
                  }`}
                />
              </a>
            </li>

            {/* Direct link */}
            <li>
              <a
                href="#faq"
                className={`px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                  isDark ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
              >
                FAQ
              </a>
            </li>
          </ul>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center justify-end gap-3">
            <Link
              href="/about"
              className={`hidden md:inline-flex items-center px-3 py-1.5 text-[13px] font-mono transition-colors duration-200 ${
                isDark ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-ink"
              }`}
            >
              SPEC
            </Link>
            <Link
              href="/check"
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-mono text-[12px] font-semibold tracking-wider transition-all duration-200 ${
                isDark
                  ? "bg-white text-ink hover:bg-neutral-100 shadow-md"
                  : "bg-ink text-paper hover:bg-slate-deep shadow-md"
              }`}
            >
              <span>CHECK DRAFT</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* =========================================================================
            DESKTOP MEGA-MENU POPUP (100% Solid Opaque — Zero Transparency)
            ========================================================================= */}
        {activeMega && (
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-3.5 w-full max-w-[920px] rounded-[28px] border p-7 shadow-2xl transition-all duration-200 hidden lg:block ${
              isDark
                ? "border-white/15 bg-[#141412] text-white shadow-[0_24px_60px_rgba(0,0,0,0.9)]"
                : "border-neutral-200 bg-white text-ink shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
            }`}
            onMouseEnter={() => handleMouseEnter(activeMega)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Panel 1: Verdicts Mega Panel */}
            {activeMega === "verdicts" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="p-1">
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    AFFIRMATIVE &amp; NEGATIVE
                  </p>
                  <div className="space-y-1">
                    <a
                      href="#verdicts"
                      className={`p-2.5 rounded-2xl transition-all duration-150 block group ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-emerald-400 dark:text-emerald-400">
                        <CheckCircle2 size={15} />
                        <span>SUPPORTED</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Approved fact entails the marketing claim with valid dates.
                      </p>
                    </a>
                    <a
                      href="#verdicts"
                      className={`p-2.5 rounded-2xl transition-all duration-150 block group ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-rose-400 dark:text-rose-400">
                        <XCircle size={15} />
                        <span>CONTRADICTED</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Fact contradicts claim; cites exact document and character span.
                      </p>
                    </a>
                  </div>
                </div>

                <div className={`p-1 border-l ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    TIME &amp; AMBIGUITY
                  </p>
                  <div className="space-y-1">
                    <a
                      href="#verdicts"
                      className={`p-2.5 rounded-2xl transition-all duration-150 block group ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-amber-300 dark:text-amber-300">
                        <Clock size={15} />
                        <span>STALE</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Validity window expired past review date; requires update.
                      </p>
                    </a>
                    <a
                      href="#verdicts"
                      className={`p-2.5 rounded-2xl transition-all duration-150 block group ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-purple-300 dark:text-purple-300">
                        <AlertTriangle size={15} />
                        <span>CONFLICTING</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Two approved rows state different values for the same attribute.
                      </p>
                    </a>
                  </div>
                </div>

                <div className={`p-1 border-l ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <div
                    className={`p-5 rounded-[22px] border flex flex-col justify-between h-full ${
                      isDark ? "bg-white/[0.05] border-white/10" : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-readable font-bold mb-2">
                        EVIDENCE GATE
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        No claim can be contradicted without an exact fact ID, version, source doc, and character span.
                      </p>
                    </div>
                    <Link
                      href="/facts"
                      className={`inline-flex items-center gap-1.5 mt-4 font-mono text-[12px] font-semibold ${
                        isDark ? "text-accent-readable hover:text-white" : "text-accent hover:text-ink"
                      }`}
                    >
                      <span>View 42 Seed Facts</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 2: Pipeline Mega Panel */}
            {activeMega === "pipeline" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="p-1">
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    DETERMINISTIC LAYER
                  </p>
                  <div className="space-y-1">
                    <div
                      className={`p-2.5 rounded-2xl transition-all duration-150 flex items-start gap-3 ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <Layers size={18} className="text-accent-readable shrink-0 mt-0.5" />
                      <div>
                        <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                          78% Rule Resolution
                        </p>
                        <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                          Numbers, dates, currencies solved in code with zero LLM inference cost.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-1 border-l ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    SEMANTIC GATEWAY
                  </p>
                  <div className="space-y-1">
                    <div
                      className={`p-2.5 rounded-2xl transition-all duration-150 flex items-start gap-3 ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <Sparkles size={18} className="text-accent-readable shrink-0 mt-0.5" />
                      <div>
                        <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                          Bounded Search
                        </p>
                        <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                          Single LLM pass with at most 5 candidates; returns registered fact IDs only.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-1 border-l ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <div
                    className={`p-5 rounded-[22px] border flex flex-col justify-between h-full ${
                      isDark ? "bg-white/[0.05] border-white/10" : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-readable font-bold mb-2">
                        HEADLESS CI/CD
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Run Proofline in GitHub Actions or editorial pipelines using standard curl or JSON payloads.
                      </p>
                    </div>
                    <a
                      href="#build"
                      className={`inline-flex items-center gap-1.5 mt-4 font-mono text-[12px] font-semibold ${
                        isDark ? "text-accent-readable hover:text-white" : "text-accent hover:text-ink"
                      }`}
                    >
                      <span>Explore REST API</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Panel 3: Governance Mega Panel */}
            {activeMega === "governance" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="p-1">
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    BRAND SOURCE OF TRUTH
                  </p>
                  <div className="space-y-1">
                    <div
                      className={`p-2.5 rounded-2xl transition-all duration-150 ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                        Versioned Register
                      </p>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Marketing facts signed off by product owners with cryptographic timestamps.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-1 border-l ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    AUDIT LEDGER
                  </p>
                  <div className="space-y-1">
                    <div
                      className={`p-2.5 rounded-2xl transition-all duration-150 ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                        Append-Only Records
                      </p>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Every decision recorded locally with SHA-256 seal and reviewer reasoning.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-1 border-l ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <div
                    className={`p-5 rounded-[22px] border flex flex-col justify-between h-full ${
                      isDark ? "bg-white/[0.05] border-white/10" : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-readable font-bold mb-2">
                        ZERO AUTH SPEC
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        No sign-in required. Evaluates instantly in private incognito tabs.
                      </p>
                    </div>
                    <Link
                      href="/about"
                      className={`inline-flex items-center gap-1.5 mt-4 font-mono text-[12px] font-semibold ${
                        isDark ? "text-accent-readable hover:text-white" : "text-accent hover:text-ink"
                      }`}
                    >
                      <span>Read the Architecture Spec</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            MOBILE ACCORDION DRAWER (100% Solid)
            ========================================================================= */}
        {mobileOpen && (
          <div
            className={`mt-4 border-t pt-4 pb-2 lg:hidden space-y-4 font-mono text-[13px] ${
              isDark ? "border-white/10 text-white" : "border-neutral-200 text-ink"
            }`}
          >
            <div className="flex flex-col space-y-2">
              <a
                href="#verdicts"
                className={`py-1.5 transition-colors ${
                  isDark ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                VERDICTS &amp; EVIDENCE
              </a>
              <a
                href="#pipeline"
                className={`py-1.5 transition-colors ${
                  isDark ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                PREFLIGHT PIPELINE
              </a>
              <a
                href="#enterprise"
                className={`py-1.5 transition-colors ${
                  isDark ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                ENTERPRISE GOVERNANCE
              </a>
              <a
                href="#faq"
                className={`py-1.5 transition-colors ${
                  isDark ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                FAQ
              </a>
              <Link
                href="/about"
                className={`py-1.5 transition-colors ${
                  isDark ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                ARCHITECTURE SPEC
              </Link>
            </div>
            <div className={`pt-3 border-t flex flex-col gap-2 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
              <Link
                href="/check"
                className="btn-primary-landing w-full text-center"
                onClick={() => setMobileOpen(false)}
              >
                OPEN THE CHECKER
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
