"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

export type Testimonial = { name: string; topic: string; text: string };

export function Testimonials({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(3);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el || el.clientWidth <= 0) return;
    const total = Math.min(items.length, Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPages(total);
    setPage(Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, [items.length]);

  useEffect(() => {
    // Read layout in a frame callback to avoid a forced synchronous reflow during hydration.
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    schedule();
    const el = track.current;
    el?.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [measure]);

  const go = (p: number) => {
    const el = track.current;
    if (!el) return;
    const next = (p + pages) % pages;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => go(page - 1)}
          aria-label="Previous testimonials"
          className="hidden size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-brand-50 sm:inline-flex"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>

        <ul
          ref={track}
          aria-label="Customer testimonials"
          className="flex min-w-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((t) => (
            <li
              key={t.name}
              className="flex w-full shrink-0 snap-start flex-col rounded-xl border border-line bg-white p-6 md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
            >
              <p className="flex gap-1.5" role="img" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} aria-hidden="true" className="size-4 fill-rating text-rating" />
                ))}
              </p>
              <blockquote className="mt-5 line-clamp-4 flex-1 text-base leading-6 text-ink">{t.text}</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-6">
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-600"
                >
                  {t.name[0].toUpperCase()}
                </span>
                <p className="flex flex-col text-sm">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="text-muted">{t.topic}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => go(page + 1)}
          aria-label="Next testimonials"
          className="hidden size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-brand-50 sm:inline-flex"
        >
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </div>

      {/* Mobile: arrows + counter (dots would sit under the floating action buttons) */}
      <div className="mt-6 flex items-center justify-center gap-4 sm:hidden">
        <button
          type="button"
          onClick={() => go(page - 1)}
          aria-label="Previous testimonials"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-line bg-white text-ink"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <p className="min-w-12 text-center text-sm font-medium text-ink" aria-live="polite">
          {page + 1} / {pages}
        </p>
        <button
          type="button"
          onClick={() => go(page + 1)}
          aria-label="Next testimonials"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-line bg-white text-ink"
        >
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="mt-8 hidden justify-center gap-1 sm:flex">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show testimonials page ${i + 1}`}
            aria-current={i === page ? "true" : undefined}
            className="group inline-flex h-6 w-8 items-center justify-center"
          >
            <span
              className={`h-2 rounded-full transition-all ${i === page ? "w-6 bg-brand-600" : "w-6 bg-brand-200 group-hover:bg-brand-300"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
