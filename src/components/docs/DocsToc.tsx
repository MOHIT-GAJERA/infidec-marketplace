"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: 2 | 3 };

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*`]/g, "");

/** "On this page" list with scroll-spy (highlights the section currently in view). */
export function DocsToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-150px 0px -65% 0px", threshold: 0 },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items]);

  if (items.length < 2) return null;
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-semibold tracking-wider text-ink uppercase">On this page</p>
      <ul className="space-y-1 border-l border-line">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`-ml-px block border-l-2 py-1 leading-5 transition-colors ${i.level === 3 ? "pl-6" : "pl-3"} ${
                active === i.id ? "border-[var(--doc-accent)] font-medium text-[var(--doc-accent-ink)]" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {plain(i.text)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
