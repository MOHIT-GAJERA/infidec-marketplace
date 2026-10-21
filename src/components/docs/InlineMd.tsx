import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Inline Markdown: **bold**, *italic*, `code`, [text](href), <kbd>key</kbd>.
 * Links: "doc:admin/overview#anchor" resolves to /docs/<product>/docs/admin/overview#anchor; "/…" are site links;
 * anything else opens in a new tab.
 */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|<kbd>[^<]+<\/kbd>|\*[^*\s][^*]*\*)/g;

export function resolveHref(href: string, product: string) {
  if (href.startsWith("doc:")) return `/docs/${product}/docs/${href.slice(4)}`;
  return href;
}

export function InlineMd({ text, product }: { text: string; product: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return <>{parts.map((p, i) => renderToken(p, i, product))}</>;
}

function renderToken(t: string, key: number, product: string): ReactNode {
  if (t.startsWith("**") && t.endsWith("**") && t.length > 4) return <strong key={key} className="font-semibold text-ink">{t.slice(2, -2)}</strong>;
  if (t.startsWith("`") && t.endsWith("`") && t.length > 2)
    return (
      <code key={key} className="rounded-md border border-line bg-gray-50 px-1.5 py-0.5 font-mono text-[0.85em] break-words text-ink">
        {t.slice(1, -1)}
      </code>
    );
  if (t.startsWith("<kbd>"))
    return (
      <kbd key={key} className="rounded border border-line border-b-2 bg-white px-1.5 py-0.5 font-mono text-[0.8em] text-ink">
        {t.slice(5, -6)}
      </kbd>
    );
  const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t);
  if (link) {
    const href = resolveHref(link[2], product);
    const cls = "font-medium text-[var(--doc-accent-ink)] underline decoration-1 underline-offset-2 hover:decoration-2";
    if (href.startsWith("/") || href.startsWith("#"))
      return (
        <Link key={key} href={href} className={cls}>
          <InlineMd text={link[1]} product={product} />
        </Link>
      );
    return (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <InlineMd text={link[1]} product={product} />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (t.startsWith("*") && t.endsWith("*") && t.length > 2) return <em key={key}>{t.slice(1, -1)}</em>;
  return t;
}
