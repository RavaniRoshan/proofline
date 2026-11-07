"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  Database,
  ScrollText,
  BarChart3,
  Info,
  RotateCcw,
  Home,
  ArrowRight,
} from "lucide-react";
import { resetDemo } from "@/lib/local";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface CommandItem {
  id: string;
  label: string;
  sublabel: string;
  icon: typeof Search;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prefersReduced = usePrefersReducedMotion();

  const items: CommandItem[] = [
    {
      id: "check",
      label: "Check a draft",
      sublabel: "Run claim governance checker against approved facts",
      icon: ShieldCheck,
      action: () => router.push("/check"),
    },
    {
      id: "facts",
      label: "Fact register",
      sublabel: "Browse versioned brand facts and validity windows",
      icon: Database,
      action: () => router.push("/facts"),
    },
    {
      id: "audit",
      label: "Audit log",
      sublabel: "View append-only record of review decisions",
      icon: ScrollText,
      action: () => router.push("/audit"),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      sublabel: "Register health and review log metrics",
      icon: BarChart3,
      action: () => router.push("/dashboard"),
    },
    {
      id: "about",
      label: "About Proofline",
      sublabel: "System architecture, invariants, and Round 1 PDF",
      icon: Info,
      action: () => router.push("/about"),
    },
    {
      id: "home",
      label: "Home / Overview",
      sublabel: "Proofline landing page",
      icon: Home,
      action: () => router.push("/"),
    },
    {
      id: "reset",
      label: "Reset demo",
      sublabel: "Clear local storage decisions and restore fresh state",
      icon: RotateCcw,
      action: () => {
        resetDemo();
        router.push("/");
      },
    },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.sublabel.toLowerCase().includes(query.toLowerCase()),
  );

  const handleOpen = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setClosing(false);
    setMounted(true);
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);

    if (prefersReduced) {
      setMounted(false);
      setClosing(false);
      triggerRef.current?.focus();
      return;
    }

    setClosing(true);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    // 180ms matches --motion-duration-fast departure transition
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      setClosing(false);
      triggerRef.current?.focus();
    }, 180);
  }, [prefersReduced]);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        handleClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose, handleOpen]);

  // Auto-focus input on mount
  useEffect(() => {
    if (mounted && !closing) {
      const frame = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [mounted, closing]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Scroll active item into view when navigating via keyboard
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(`[data-cmd-item="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  function handleSelect(item: CommandItem) {
    handleClose();
    item.action();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 text-xs text-muted transition-colors hover:border-slate hover:text-foreground active:scale-[0.98]"
        aria-label="Open command palette"
        data-testid="command-palette-trigger"
      >
        <Search size={12} aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="rounded border border-line bg-paper px-1 py-0.5 font-mono text-[10px] text-muted">
          ⌘K
        </kbd>
      </button>

      {mounted && (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[15vh] backdrop-blur-xs ${
            closing ? "cmd-backdrop-exit" : "cmd-backdrop-enter"
          }`}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div
            className={`w-full max-w-lg rounded-[6px] border border-line-strong bg-paper shadow-none ${
              closing ? "cmd-modal-exit" : "cmd-modal-enter"
            }`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-2 border-b border-line-strong px-3 py-2.5">
              <Search size={15} className="text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
              />
              <span className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[10px] text-muted">
                ESC
              </span>
            </div>

            <div ref={listRef} className="max-h-72 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted">No commands found.</div>
              ) : (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-cmd-item={index}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center gap-3 rounded-[4px] px-3 py-2 text-left ${
                        active
                          ? "bg-panel text-foreground transition-none"
                          : "text-ink-soft hover:bg-panel transition-colors duration-120"
                      }`}
                    >
                      <Icon
                        size={15}
                        className={active ? "text-slate" : "text-muted"}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{item.label}</p>
                        <p className="truncate text-[11px] text-muted">{item.sublabel}</p>
                      </div>
                      {active && <ArrowRight size={13} className="text-slate" aria-hidden="true" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-3 py-1.5 text-[10px] text-muted">
              <span>Navigate with ↑↓ and Enter</span>
              <span>Proofline</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
