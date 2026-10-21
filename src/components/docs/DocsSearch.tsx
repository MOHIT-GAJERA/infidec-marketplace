"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, FileText, Hash, Search, X } from "lucide-react";

type Entry = { href: string; title: string; section: string; heading?: string; text: string };

/** Search dialog (Ctrl/⌘ + K). The index is a static JSON file loaded on first open. */
export function DocsSearch({ product }: { product: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [sel, setSel] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const show = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setTimeout(() => input.current?.focus(), 0);
    } else if (!open && d.open) d.close();
    if (open && !index && !failed) {
      fetch(`/docs/${product}/search-index.json`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((d: Entry[]) => setIndex(d))
        .catch(() => setFailed(true));
    }
  }, [open, index, failed, product]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length || !index) return [];
    const scored: { e: Entry; s: number }[] = [];
    for (const e of index) {
      const title = e.title.toLowerCase();
      const head = (e.heading ?? "").toLowerCase();
      const hay = `${title} ${head} ${e.section.toLowerCase()} ${e.text.toLowerCase()}`;
      if (!terms.every((t) => hay.includes(t))) continue;
      let s = 0;
      for (const t of terms) {
        if (title.includes(t)) s += e.heading ? 3 : 6;
        if (head.includes(t)) s += 5;
        if (title.startsWith(t) || head.startsWith(t)) s += 2;
      }
      scored.push({ e, s });
    }
    return scored.sort((a, b) => b.s - a.s).slice(0, 12).map((x) => x.e);
  }, [q, index]);

  const go = (e: Entry) => {
    setOpen(false);
    setQ("");
    router.push(e.href);
  };

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (ev.key === "Enter" && results[sel]) {
      ev.preventDefault();
      go(results[sel]);
    }
  };

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-gray-50 px-3 text-sm text-muted hover:border-gray-300 hover:bg-white sm:w-56"
        aria-label="Search documentation"
      >
        <Search aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">Search docs…</span>
        <kbd className="ml-auto hidden rounded border border-line bg-white px-1.5 font-mono text-[11px] text-muted sm:inline">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && setOpen(false)}
        className="m-auto mt-[10vh] w-[min(640px,calc(100%-24px))] rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/40"
        aria-label="Search documentation"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden="true" className="size-5 text-muted" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search the documentation…"
            className="h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-gray-400"
            aria-label="Search query"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="docs-search-results"
            aria-activedescendant={results[sel] ? `docs-hit-${sel}` : undefined}
          />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close search" className="rounded-lg p-1.5 text-muted hover:bg-gray-100">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {failed ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Search is unavailable right now. Please use the menu.</p>
          ) : !index && q ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Loading…</p>
          ) : !q ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Type to search pages and sections, e.g. “razorpay”, “package name”, “SHA”.</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">No results for “{q}”.</p>
          ) : (
            <ul ref={list} id="docs-search-results" role="listbox" className="space-y-1">
              {results.map((r, i) => (
                <li key={r.href} id={`docs-hit-${i}`} role="option" aria-selected={i === sel} data-i={i}>
                  <button
                    type="button"
                    onMouseEnter={() => setSel(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ${i === sel ? "bg-[var(--doc-accent-soft)]" : "hover:bg-gray-50"}`}
                  >
                    {r.heading ? <Hash aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" /> : <FileText aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{r.heading ?? r.title}</span>
                      <span className="block truncate text-xs text-muted">
                        {r.section} › {r.title}
                        {r.text ? ` — ${r.text}` : ""}
                      </span>
                    </span>
                    {i === sel && <CornerDownLeft aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
