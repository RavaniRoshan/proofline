"use client";

import { useState } from "react";
import { Check, ArrowRight, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        role="status"
        className="flex items-center gap-2.5 py-3 px-4 rounded-[6px] bg-v-supported-bg text-v-supported-fg font-mono text-[12px] border border-v-supported-fg/25"
      >
        <Check size={15} aria-hidden="true" />
        <span>Registered {email} for Proofline specification &amp; governance releases.</span>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid work or personal email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-[460px]">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full p-1.5 pl-3.5 rounded-[6px] border border-line-strong bg-card focus-within:border-ink transition-all items-center gap-2"
      >
        <label htmlFor="governance-email" className="sr-only">
          Email address
        </label>
        <input
          id="governance-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          className="flex-1 bg-transparent text-[14px] font-sans text-ink placeholder:text-ink-soft/60 focus:outline-none px-1"
          placeholder="you@company.com"
        />
        <button
          type="submit"
          className="h-9 px-4 bg-ink text-paper font-mono text-[12px] font-semibold uppercase tracking-wider rounded-[4px] hover:bg-slate-deep transition-all duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
        >
          <span>Subscribe</span>
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[12px] font-mono text-v-contradicted-fg">
          <AlertCircle size={13} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
