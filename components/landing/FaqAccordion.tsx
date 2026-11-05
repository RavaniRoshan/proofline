"use client";

import { useState } from "react";

type Item = { q: string; a: string };

export function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {items.map((it, i) => (
        <div key={it.q} className="faq__item">
          <button
            className="faq__trigger"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="faq__q">{it.q}</span>
            <span className="faq__icon">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="faq__panel">
              <p className="faq__a text-pretty max-w-[58ch]">{it.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}