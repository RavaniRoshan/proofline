"use client";

import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        role="status"
        className="flex items-center gap-2.5 border border-v-supported-fg/25 bg-v-supported-bg px-4 py-3 font-mono text-[12px] text-v-supported-fg rounded-none"
      >
        <Check size={15} aria-hidden="true" />
        <span>
          Subscribed {email} to Proofline governance &amp; specification updates.
        </span>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full items-stretch gap-2"
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
          className="flex-1 border border-ink/15 bg-paper px-4 py-3 font-sans text-[14px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none rounded-none"
          placeholder="Email address"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 cursor-pointer items-center justify-center bg-ink px-5 py-3 font-mono text-[13px] uppercase text-paper transition-colors hover:bg-ink/85 rounded-none whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
      <p className="mt-2 font-sans text-[12px] text-ink-faint">
        Specification notes and benchmark updates. Unsubscribe anytime.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 font-mono text-[12px] text-v-contradicted-fg"
        >
          <AlertCircle size={13} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
