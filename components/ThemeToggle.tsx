"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center justify-center size-9 sm:size-10 rounded-full border border-line bg-muted opacity-50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center justify-center size-9 sm:size-10 rounded-full border transition-all duration-200 cursor-pointer ${
        isDark
          ? "border-line bg-panel text-zinc-300 hover:text-white hover:bg-panel-elevated hover:border-line-strong"
          : "border-line bg-paper text-zinc-700 hover:text-black hover:bg-panel hover:border-line-strong"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45 text-amber-300" />
      ) : (
        <Moon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-12 text-zinc-800" />
      )}
    </button>
  );
}
