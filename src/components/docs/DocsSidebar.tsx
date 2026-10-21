"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, PanelLeftOpen, X } from "lucide-react";
import type { NavItem } from "@/lib/docs/products";

export type SidebarSection = { key: string; title: string; items: NavItem[] };

const contains = (it: NavItem, path: string, base: string): boolean =>
  (!!it.slug && path === `${base}/${it.slug}`) || (it.children ?? []).some((c) => contains(c, path, base));

function Item({ it, base, path, depth }: { it: NavItem; base: string; path: string; depth: number }) {
  const active = !!it.slug && path === `${base}/${it.slug}`;
  const inside = contains(it, path, base);
  const [open, setOpen] = useState(inside);
  // Re-open the group that holds the current page after client-side navigation.
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    if (inside) setOpen(true);
  }

  const pad = depth === 0 ? "pl-3" : depth === 1 ? "pl-4" : "pl-6";
  if (it.children?.length) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`flex w-full items-center justify-between gap-2 rounded-lg py-2 pr-2 ${pad} text-left text-[13px] font-semibold tracking-wide text-ink uppercase hover:bg-gray-100`}
        >
          {it.title}
          <ChevronDown aria-hidden="true" className={`size-4 shrink-0 text-muted transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open && (
          <ul className="mt-0.5 ml-3 space-y-0.5 border-l border-line pl-1">
            {it.children.map((c) => (
              <Item key={c.title} it={c} base={base} path={path} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  }
  return (
    <li>
      <Link
        href={`${base}/${it.slug}`}
        aria-current={active ? "page" : undefined}
        className={`block rounded-lg py-1.5 pr-2 ${pad} text-[14.5px] leading-6 transition-colors ${
          active ? "bg-[var(--doc-accent-soft)] font-semibold text-[var(--doc-accent-ink)]" : "text-body hover:bg-gray-100 hover:text-ink"
        }`}
      >
        {it.title}
      </Link>
    </li>
  );
}

function Tree({ sections, base, path }: { sections: SidebarSection[]; base: string; path: string }) {
  return (
    <nav aria-label="Documentation">
      <ul className="space-y-1">
        {sections.map((s) =>
          s.items.length === 1 && !s.items[0].children ? (
            <Item key={s.key} it={{ ...s.items[0], title: s.title }} base={base} path={path} depth={0} />
          ) : (
            <Item key={s.key} it={{ title: s.title, children: s.items }} base={base} path={path} depth={0} />
          ),
        )}
      </ul>
    </nav>
  );
}

/** Left navigation: sticky column on desktop, slide-in drawer on mobile. */
export function DocsSidebar({ product, sections }: { product: string; sections: SidebarSection[] }) {
  const path = usePathname().replace(/\/$/, "");
  const base = `/docs/${product}/docs`;
  const [drawer, setDrawer] = useState(false);
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setDrawer(false);
  }
  useEffect(() => {
    if (!drawer) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawer(true)}
        className="mb-4 inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink shadow-card lg:hidden"
      >
        <PanelLeftOpen aria-hidden="true" className="size-4" />
        Menu
      </button>

      <aside className="sticky top-[136px] hidden max-h-[calc(100dvh-152px)] w-[272px] shrink-0 overflow-y-auto overscroll-contain pr-3 pb-10 lg:top-[144px] lg:block">
        <Tree sections={sections} base={base} path={path} />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Documentation menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-semibold text-ink">Documentation</span>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-gray-100">
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <Tree sections={sections} base={base} path={path} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
