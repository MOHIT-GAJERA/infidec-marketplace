"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { DocsSearch } from "./DocsSearch";

export type TopTab = { key: string; title: string; href: string; prefixes: string[] };

/** Sticky documentation bar under the marketplace header: product home, section tabs, search. */
export function DocsTopBar({ product, name, version, tabs }: { product: string; name: string; version: string; tabs: TopTab[] }) {
  const path = usePathname();
  const base = `/docs/${product}/docs/`;
  const rel = path.startsWith(base) ? path.slice(base.length) : "";
  const activeKey = tabs.find((t) => t.prefixes.some((p) => rel === p || rel.startsWith(p + "/")))?.key;

  return (
    <div className="sticky top-[72px] z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:top-20">
      <div className="container-x flex h-14 items-center gap-3">
        <Link href={`/docs/${product}`} className="flex shrink-0 items-center gap-2 font-semibold text-ink">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[var(--doc-accent)] text-white">
            <BookOpen aria-hidden="true" className="size-4" />
          </span>
          <span className="hidden sm:inline">{name} Docs</span>
          <span className="rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">v{version}</span>
        </Link>
        <nav aria-label={`${name} documentation sections`} className="-mx-1 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 md:flex">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              aria-current={activeKey === t.key ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                activeKey === t.key ? "bg-[var(--doc-accent-soft)] text-[var(--doc-accent-ink)]" : "text-body hover:bg-gray-100 hover:text-ink"
              }`}
            >
              {t.title}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <DocsSearch product={product} />
        </div>
      </div>
      {/* Section tabs scroll horizontally on small screens */}
      <nav aria-label={`${name} documentation sections`} className="container-x -mt-1 flex gap-1 overflow-x-auto pb-2 md:hidden">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={activeKey === t.key ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-[13px] font-medium whitespace-nowrap ${
              activeKey === t.key ? "border-transparent bg-[var(--doc-accent)] text-white" : "border-line text-body"
            }`}
          >
            {t.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
