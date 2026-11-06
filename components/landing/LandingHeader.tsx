"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
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

  useEffect(() => {
    let ticking = false;

    const evaluateTheme = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 24);

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
    }, 150);
  };

  const isDark = theme === "dark" || mobileOpen;

  return (
    <header
      className={`fixed left-0 z-50 flex w-full flex-col items-center px-3 sm:px-4 transition-[top] duration-300 md:left-1/2 md:-translate-x-1/2 md:max-w-[1240px] md:px-6 ${
        scrolled ? "top-2.5 md:top-3.5" : "top-10 md:top-11"
      }`}
    >
      <div
        className={`w-full rounded-xl md:rounded-full border px-5 py-2.5 transition-[background-color,border-color,color,box-shadow] duration-300 relative ${
          isDark
            ? "border-white/15 bg-[#141412] text-white shadow-[0_16px_36px_-10px_rgba(0,0,0,0.65)]"
            : "border-neutral-300 bg-white text-ink shadow-[0_16px_36px_-10px_rgba(0,0,0,0.08)]"
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Strict 3-Zone Top Bar Contract */}
        <nav className="flex w-full items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 whitespace-nowrap"
            aria-label="Proofline — Home"
          >
            <span
              aria-hidden="true"
              className={`flex items-center gap-[2px] font-serif text-[18px] font-semibold transition-colors duration-300 ${
                isDark ? "text-accent-readable" : "text-accent"
              }`}
            >
              <span>[</span>
              <span>]</span>
            </span>
            <span className="font-serif text-[17px] font-semibold tracking-tight">
              Proofline
            </span>
          </Link>

          {/* Zone 2: Concise single-line navigation links */}
          <ul className="hidden lg:flex items-center justify-center gap-6 font-mono text-[13px] tracking-tight">
            <li onMouseEnter={() => handleMouseEnter("verdicts")}>
              <a
                href="#verdicts"
                className={`inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  activeMega === "verdicts"
                    ? isDark
                      ? "text-white font-semibold underline underline-offset-4"
                      : "text-ink font-semibold underline underline-offset-4"
                    : isDark
                      ? "text-white/75 hover:text-white"
                      : "text-neutral-600 hover:text-ink"
                }`}
              >
                <span>Verdicts</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    activeMega === "verdicts" ? "rotate-180" : ""
                  }`}
                />
              </a>
            </li>

            <li onMouseEnter={() => handleMouseEnter("pipeline")}>
              <a
                href="#pipeline"
                className={`inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  activeMega === "pipeline"
                    ? isDark
                      ? "text-white font-semibold underline underline-offset-4"
                      : "text-ink font-semibold underline underline-offset-4"
                    : isDark
                      ? "text-white/75 hover:text-white"
                      : "text-neutral-600 hover:text-ink"
                }`}
              >
                <span>Pipeline</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    activeMega === "pipeline" ? "rotate-180" : ""
                  }`}
                />
              </a>
            </li>

            <li onMouseEnter={() => handleMouseEnter("governance")}>
              <a
                href="#register"
                className={`inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  activeMega === "governance"
                    ? isDark
                      ? "text-white font-semibold underline underline-offset-4"
                      : "text-ink font-semibold underline underline-offset-4"
                    : isDark
                      ? "text-white/75 hover:text-white"
                      : "text-neutral-600 hover:text-ink"
                }`}
              >
                <span>Register</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    activeMega === "governance" ? "rotate-180" : ""
                  }`}
                />
              </a>
            </li>

            <li>
              <Link
                href="/facts"
                className={`py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:underline underline-offset-4 ${
                  isDark ? "text-white/75 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
              >
                42 Facts
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className={`py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:underline underline-offset-4 ${
                  isDark ? "text-white/75 hover:text-white" : "text-neutral-600 hover:text-ink"
                }`}
              >
                Spec
              </Link>
            </li>
          </ul>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex shrink-0 items-center justify-end gap-3">
            <Link
              href="/check"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-[12px] font-semibold tracking-wider transition-all duration-150 whitespace-nowrap shrink-0 ${
                isDark
                  ? "bg-white text-ink hover:bg-neutral-200"
                  : "bg-ink text-paper hover:bg-slate-deep"
              }`}
            >
              <span>Check a Draft</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>

            <button
              type="button"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>

        {/* Desktop Mega-Menu Popup */}
        {activeMega && (
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-full max-w-[920px] rounded-[20px] border p-6 shadow-2xl transition-all duration-150 hidden lg:block ${
              isDark
                ? "border-white/15 bg-[#141412] text-white shadow-[0_24px_60px_rgba(0,0,0,0.9)]"
                : "border-neutral-200 bg-white text-ink shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
            }`}
            onMouseEnter={() => handleMouseEnter(activeMega)}
            onMouseLeave={handleMouseLeave}
          >
            {activeMega === "verdicts" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="p-1">
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    Affirmative &amp; Negative
                  </p>
                  <div className="space-y-1">
                    <a
                      href="#verdicts"
                      onClick={() => setActiveMega(null)}
                      className={`p-2.5 rounded-xl transition-all duration-150 block ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-emerald-400">
                        <CheckCircle2 size={15} />
                        <span>SUPPORTED</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Approved fact entails the marketing claim with active validity dates.
                      </p>
                    </a>
                    <a
                      href="#verdicts"
                      onClick={() => setActiveMega(null)}
                      className={`p-2.5 rounded-xl transition-all duration-150 block ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-rose-400">
                        <XCircle size={15} />
                        <span>CONTRADICTED</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Fact contradicts claim; cites exact document and character span.
                      </p>
                    </a>
                  </div>
                </div>

                <div className={`p-1 border-l pl-5 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    Time &amp; Ambiguity
                  </p>
                  <div className="space-y-1">
                    <a
                      href="#verdicts"
                      onClick={() => setActiveMega(null)}
                      className={`p-2.5 rounded-xl transition-all duration-150 block ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-amber-300">
                        <Clock size={15} />
                        <span>STALE</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Validity window expired past review date; requires recertification.
                      </p>
                    </a>
                    <a
                      href="#verdicts"
                      onClick={() => setActiveMega(null)}
                      className={`p-2.5 rounded-xl transition-all duration-150 block ${
                        isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-purple-300">
                        <AlertTriangle size={15} />
                        <span>CONFLICTING</span>
                      </div>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Two approved rows state different values for the same attribute.
                      </p>
                    </a>
                  </div>
                </div>

                <div className={`p-1 border-l pl-5 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <div
                    className={`p-5 rounded-xl border flex flex-col justify-between h-full ${
                      isDark ? "bg-white/[0.04] border-white/10" : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-readable font-bold mb-2">
                        The Evidence Gate
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        No claim can be marked CONTRADICTED without an exact fact ID, version, source document, and character span.
                      </p>
                    </div>
                    <Link
                      href="/facts"
                      className={`inline-flex items-center gap-1.5 mt-4 font-mono text-[12px] font-semibold ${
                        isDark ? "text-accent-readable hover:text-white" : "text-accent hover:text-ink"
                      }`}
                    >
                      <span>Browse 42 Seed Facts</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeMega === "pipeline" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="p-1">
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    Stage 1 · Deterministic
                  </p>
                  <div
                    className={`p-2.5 rounded-xl flex items-start gap-3 ${
                      isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                    }`}
                  >
                    <Layers size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                        78% Zero-LLM Resolution
                      </p>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Numbers, dates, currencies, and disclaimers resolved in TypeScript with 0ms latency.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-1 border-l pl-5 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    Stage 3 · Bounded Model
                  </p>
                  <div
                    className={`p-2.5 rounded-xl flex items-start gap-3 ${
                      isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                    }`}
                  >
                    <Sparkles size={18} className="text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                        Top-5 Lexical Retrieval
                      </p>
                      <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Model receives ≤5 candidate facts and returns fact IDs only—never citations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-1 border-l pl-5 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <div
                    className={`p-5 rounded-xl border flex flex-col justify-between h-full ${
                      isDark ? "bg-white/[0.04] border-white/10" : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-readable font-bold mb-2">
                        Headless REST API
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Integrate `POST /api/verify` into CI/CD preflight checks or editorial assistants.
                      </p>
                    </div>
                    <a
                      href="#build"
                      onClick={() => setActiveMega(null)}
                      className={`inline-flex items-center gap-1.5 mt-4 font-mono text-[12px] font-semibold ${
                        isDark ? "text-accent-readable hover:text-white" : "text-accent hover:text-ink"
                      }`}
                    >
                      <span>Test Live API Playground</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeMega === "governance" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="p-1">
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    Source of Truth
                  </p>
                  <Link
                    href="/facts"
                    className={`block p-2.5 rounded-xl ${
                      isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                    }`}
                  >
                    <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                      Versioned Fact Register
                    </p>
                    <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                      42 seeded Flowdesk records with validity windows, stale flags, and conflict pairs.
                    </p>
                  </Link>
                </div>

                <div className={`p-1 border-l pl-5 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider font-semibold mb-3 px-2.5 ${
                      isDark ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    Compliance Trail
                  </p>
                  <Link
                    href="/audit"
                    className={`block p-2.5 rounded-xl ${
                      isDark ? "hover:bg-white/[0.08]" : "hover:bg-neutral-100"
                    }`}
                  >
                    <p className={`font-mono text-[13px] font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                      Append-Only Audit Log
                    </p>
                    <p className={`text-[12px] leading-relaxed mt-1 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                      Every human review decision recorded locally with timestamp and rationale.
                    </p>
                  </Link>
                </div>

                <div className={`p-1 border-l pl-5 ${isDark ? "border-white/10" : "border-neutral-200"}`}>
                  <div
                    className={`p-5 rounded-xl border flex flex-col justify-between h-full ${
                      isDark ? "bg-white/[0.04] border-white/10" : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent-readable font-bold mb-2">
                        Register Health
                      </p>
                      <p className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"}`}>
                        Inspect register health metrics, deterministic vs model split, and active alerts.
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className={`inline-flex items-center gap-1.5 mt-4 font-mono text-[12px] font-semibold ${
                        isDark ? "text-accent-readable hover:text-white" : "text-accent hover:text-ink"
                      }`}
                    >
                      <span>Open Dashboard</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className={`mt-3 border-t pt-3 pb-2 lg:hidden space-y-3 font-mono text-[13px] ${
              isDark ? "border-white/10 text-white" : "border-neutral-200 text-ink"
            }`}
          >
            <div className="flex flex-col space-y-1.5">
              <a
                href="#verdicts"
                className="py-1.5 text-white/80 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Verdicts &amp; Evidence
              </a>
              <a
                href="#pipeline"
                className="py-1.5 text-white/80 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                4-Stage Pipeline
              </a>
              <a
                href="#register"
                className="py-1.5 text-white/80 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Fact Register
              </a>
              <Link
                href="/facts"
                className="py-1.5 text-white/80 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Browse 42 Facts
              </Link>
              <Link
                href="/dashboard"
                className="py-1.5 text-white/80 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/about"
                className="py-1.5 text-white/80 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Architecture Spec
              </Link>
            </div>
            <div className="pt-2 border-t border-white/10">
              <Link
                href="/check"
                className="btn-primary-landing w-full text-center"
                onClick={() => setMobileOpen(false)}
              >
                Check a Draft
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
