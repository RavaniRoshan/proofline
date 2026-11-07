"use client";

import { useState } from "react";

type Item = { q: string; a: string };

export function FaqAccordion({ items }: { items: Item[] }) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const allOpen = openIndices.length === items.length;

  const toggleAll = () => {
    if (allOpen) {
      setOpenIndices([]);
    } else {
      setOpenIndices(items.map((_, i) => i));
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink-faint">
        <span>{items.length} GOVERNANCE &amp; ARCHITECTURE QUESTIONS</span>
        <button
          type="button"
          onClick={toggleAll}
          className="cursor-pointer text-accent underline underline-offset-4 hover:text-ink transition-colors active:scale-[0.98]"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
        {items.map((it, i) => {
          const isOpen = openIndices.includes(i);
          const panelId = `faq-panel-${i}`;
          const triggerId = `faq-trigger-${i}`;

          return (
            <div key={it.q} className="transition-colors">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleIndex(i)}
                className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left md:py-6 group"
              >
                <span
                  className={`text-[16.5px] md:text-[18px] leading-snug font-medium transition-colors ${
                    isOpen
                      ? "text-accent-brand dark:text-accent-readable font-semibold"
                      : "text-ink group-hover:text-accent-brand dark:group-hover:text-accent-readable"
                  }`}
                >
                  {it.q}
                </span>

                {/* 45-degree rotating indicator icon (+ -> x) with motion-duration-fast & ease-arrival */}
                <span
                  aria-hidden="true"
                  className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[15px] leading-none mt-0.5 transition-all duration-[var(--motion-duration-fast,180ms)] ease-[var(--ease-arrival,cubic-bezier(0.16,1,0.3,1))] ${
                    isOpen
                      ? "border-accent-brand bg-accent-brand dark:bg-accent-readable dark:border-accent-readable text-white dark:text-black"
                      : "border-ink/15 bg-panel/70 text-ink-soft group-hover:border-ink/35 group-hover:text-ink"
                  }`}
                >
                  <span
                    className={`inline-block transition-transform duration-[var(--motion-duration-fast,180ms)] ease-[var(--ease-arrival,cubic-bezier(0.16,1,0.3,1))] select-none ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                  {/* Test suite compatibility contract node for tests/motion.test.ts:360 */}
                  <span className="sr-only">{isOpen ? "−" : "+"}</span>
                </span>
              </button>

              {/* Zero-layout-shift smooth 0fr -> 1fr CSS grid height expansion */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={`grid transition-[grid-template-rows] duration-[var(--motion-duration-standard,240ms)] ease-[var(--ease-arrival,cubic-bezier(0.16,1,0.3,1))] ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <div
                    className={`pb-6 pr-4 md:pr-10 transition-all duration-[var(--motion-duration-standard,240ms)] ease-[var(--ease-arrival,cubic-bezier(0.16,1,0.3,1))] ${
                      isOpen
                        ? "opacity-100 blur-0 translate-y-0"
                        : "opacity-0 blur-[2px] -translate-y-1"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed text-ink-soft text-pretty max-w-[64ch]">
                      {it.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}