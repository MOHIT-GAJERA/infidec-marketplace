import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { blocksToText, parseMarkdown, type DocBlock } from "./markdown";
import { flatPages, type DocsProduct } from "./products";

const ROOT = path.join(process.cwd(), "src", "content", "docs");

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  blocks: DocBlock[];
  toc: { id: string; text: string; level: 2 | 3 }[];
};

/** Reads and parses src/content/docs/<product>/<slug>.md (cached per request / build). */
export const loadDoc = cache((product: string, slug: string): DocPage | null => {
  if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(slug)) return null;
  let src: string;
  try {
    src = readFileSync(path.join(ROOT, product, `${slug}.md`), "utf8");
  } catch {
    return null;
  }
  const { meta, blocks } = parseMarkdown(src);
  const toc = blocks.flatMap((b) => (b.type === "h2" || b.type === "h3" ? [{ id: b.id, text: b.text, level: b.type === "h2" ? 2 : 3 } as const] : []));
  const firstP = blocks.find((b) => b.type === "p");
  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? (firstP && firstP.type === "p" ? blocksToText([firstP]).slice(0, 160) : ""),
    blocks,
    toc,
  };
});

export type SearchEntry = { href: string; title: string; section: string; heading?: string; text: string };

/** Compact search index: one entry per page and per h2 heading (title + first words of the section). */
export const searchIndex = cache((product: DocsProduct): SearchEntry[] => {
  const out: SearchEntry[] = [];
  for (const p of flatPages(product)) {
    const doc = loadDoc(product.slug, p.slug);
    if (!doc) continue;
    const href = `/docs/${product.slug}/docs/${p.slug}`;
    out.push({ href, title: doc.title, section: p.section.title, text: doc.description.slice(0, 140) });
    let current: { id: string; text: string; blocks: DocBlock[] } | null = null;
    const push = () => {
      if (current) out.push({ href: `${href}#${current.id}`, title: doc.title, section: p.section.title, heading: current.text.replace(/[*`]/g, ""), text: blocksToText(current.blocks).slice(0, 120) });
    };
    for (const b of doc.blocks) {
      if (b.type === "h2") {
        push();
        current = { id: b.id, text: b.text, blocks: [] };
      } else current?.blocks.push(b);
    }
    push();
  }
  return out;
});
