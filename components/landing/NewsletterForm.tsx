"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex items-center gap-2 h-12 px-6 rounded-full bg-v-supported-bg text-v-supported-fg font-mono text-[13px] border border-v-supported-fg/20 shadow-sm">
        <Check size={16} aria-hidden="true" />
        <span>Subscribed to Proofline governance updates</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex w-full max-w-[460px] p-1.5 pl-4 rounded-full border border-line-strong bg-card shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all items-center"
    >
      <input
        type="email"
        required
        className="flex-1 bg-transparent text-[14px] font-sans text-ink placeholder:text-ink-soft/70 focus:outline-none px-2"
        placeholder="you@company.com"
      />
      <button
        type="submit"
        className="h-10 px-6 bg-ink text-paper font-mono text-[12px] font-semibold uppercase tracking-wider rounded-full hover:bg-slate-deep transition-all duration-150 flex items-center gap-1.5 shrink-0 shadow-sm active:scale-[0.98]"
      >
        <span>Subscribe</span>
        <ArrowRight size={13} aria-hidden="true" />
      </button>
    </form>
  );
}
