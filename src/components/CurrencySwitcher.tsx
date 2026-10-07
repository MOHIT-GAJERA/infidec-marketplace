"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronUp } from "lucide-react";
import { useStore } from "./store/StoreProvider";
import { currencies } from "@/lib/site";

/**
 * Currency picker. "dark" styles the trigger for dark backgrounds (e.g. the footer);
 * "down" opens the menu below the trigger (header), "up" above it (footer).
 * "compact" trims padding and the chevron to fit the mobile header.
 */
export function CurrencySwitcher({
  tone = "light",
  placement = "up",
  id = "currency-menu",
  compact = false,
}: {
  tone?: "light" | "dark";
  placement?: "up" | "down";
  id?: string;
  compact?: boolean;
}) {
  const { currency, setCurrency } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = currencies.find((c) => c.code === currency) ?? currencies[1];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Currency: ${active.label}. Change currency`}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex min-h-10 items-center rounded-lg py-2 text-sm font-semibold ${compact ? "gap-1 px-2" : "gap-2 px-2.5"} ${tone === "dark" ? "bg-white/10 text-white hover:bg-white/20" : "border border-line bg-white text-ink hover:border-brand-600"}`}
      >
        <span
          aria-hidden="true"
          className={`inline-flex items-center justify-center rounded-full font-bold ${compact ? "size-5 text-[11px]" : "size-6 text-[13px]"} ${tone === "dark" ? "bg-white text-brand-800" : "bg-brand-600 text-white"}`}
        >
          {active.symbol}
        </span>
        {active.code}
        {!compact && <ChevronUp aria-hidden="true" className={`size-4 transition-transform ${open ? "" : "rotate-180"}`} />}
      </button>
      <div
        id={id}
        hidden={!open}
        className={`absolute right-0 z-50 w-56 ${placement === "up" ? "bottom-full mb-2" : "top-full mt-2"} overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-float`}
      >
        {currencies.map((c) => {
          const selected = c.code === currency;
          return (
            <button
              key={c.code}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] text-ink hover:bg-brand-50"
            >
              <span aria-hidden="true" className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-700">
                {c.symbol}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{c.code}</span>
                <span className="block text-xs text-muted">{c.name}</span>
              </span>
              {selected && <Check aria-hidden="true" className="size-4 text-brand-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
