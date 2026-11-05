"use client";

import { useEffect, useState, useRef } from "react";
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

interface CommandItem {
  id: string;
  label: string;
  sublabel: string;
  icon: typeof Search;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  function handleSelect(item: CommandItem) {
    setOpen(false);
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
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 text-xs text-muted transition-colors hover:border-slate hover:text-foreground"
        aria-label="Open command palette"
        data-testid="command-palette-trigger"
      >
        <Search size={12} aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="rounded border border-line bg-paper px-1 py-0.5 font-mono text-[10px] text-muted">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[15vh] backdrop-blur-xs"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div
            className="w-full max-w-lg rounded-[6px] border border-line-strong bg-paper shadow-none"
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

            <div className="max-h-72 overflow-y-auto p-1.5">
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
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center gap-3 rounded-[4px] px-3 py-2 text-left transition-colors ${
                        active ? "bg-panel text-foreground" : "text-ink-soft hover:bg-panel"
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
