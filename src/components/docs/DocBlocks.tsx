import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Info, Lightbulb, OctagonAlert } from "lucide-react";
import type { CalloutTone, DocBlock } from "@/lib/docs/markdown";
import { InlineMd, resolveHref } from "./InlineMd";
import { CodeBlock } from "./CodeBlock";
import { HeadingAnchor } from "./HeadingAnchor";

const TONE: Record<CalloutTone, { label: string; box: string; icon: typeof Info; iconCls: string }> = {
  note: { label: "Note", box: "border-sky-200 bg-sky-50", icon: Info, iconCls: "text-sky-700" },
  tip: { label: "Tip", box: "border-emerald-200 bg-emerald-50", icon: Lightbulb, iconCls: "text-emerald-700" },
  warning: { label: "Warning", box: "border-amber-200 bg-amber-50", icon: CircleAlert, iconCls: "text-amber-700" },
  danger: { label: "Important", box: "border-red-200 bg-red-50", icon: OctagonAlert, iconCls: "text-red-700" },
};

/** Renders a parsed Markdown document (see lib/docs/markdown.ts). */
export function DocBlocks({ blocks, product }: { blocks: DocBlock[]; product: string }) {
  return (
    <>
      {blocks.map((b, i) => (
        <Block key={i} b={b} product={product} />
      ))}
    </>
  );
}

function Block({ b, product }: { b: DocBlock; product: string }) {
  const md = (t: string) => <InlineMd text={t} product={product} />;
  switch (b.type) {
    case "h2":
      return (
        <h2 id={b.id} className="group mt-12 mb-4 scroll-mt-44 lg:scroll-mt-40 border-b border-line pb-2 text-2xl font-bold tracking-tight text-ink first:mt-0 sm:text-[26px]">
          {md(b.text)}
          <HeadingAnchor id={b.id} />
        </h2>
      );
    case "h3":
      return (
        <h3 id={b.id} className="group mt-8 mb-3 scroll-mt-44 lg:scroll-mt-40 text-lg font-semibold text-ink">
          {md(b.text)}
          <HeadingAnchor id={b.id} />
        </h3>
      );
    case "p":
      return <p className="my-4 text-[15.5px] leading-7 text-body">{md(b.text)}</p>;
    case "list": {
      // "- [ ] item" / "- [x] item" → checklist
      if (!b.ordered && b.items.every((it) => /^\[[ xX]\]\s/.test(it))) {
        return (
          <ul className="my-4 space-y-2 text-[15.5px] leading-7 text-body">
            {b.items.map((it, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span aria-hidden="true" className="mt-1.5 inline-flex size-4 shrink-0 items-center justify-center rounded border border-[var(--doc-accent)] bg-[var(--doc-accent-soft)]">
                  <Check className="size-3 text-[var(--doc-accent-ink)]" strokeWidth={3} />
                </span>
                <span>{md(it.slice(4))}</span>
              </li>
            ))}
          </ul>
        );
      }
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className={`my-4 space-y-2 pl-6 text-[15.5px] leading-7 text-body ${b.ordered ? "list-decimal marker:font-semibold marker:text-ink" : "list-disc marker:text-[var(--doc-accent)]"}`}>
          {b.items.map((it, i) => (
            <li key={i} className="pl-1">
              {md(it)}
            </li>
          ))}
        </Tag>
      );
    }
    case "code":
      return <CodeBlock code={b.code} lang={b.lang} title={b.title} />;
    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-line px-4 py-3 font-semibold whitespace-nowrap text-ink">
                    {md(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-0 even:bg-gray-50/50">
                  {r.map((c, j) => (
                    <td key={j} className={`px-4 py-3 align-top leading-6 text-body ${j === 0 ? "font-medium text-ink" : ""}`}>
                      {md(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout": {
      const t = TONE[b.tone];
      const Icon = t.icon;
      return (
        <aside className={`my-6 rounded-xl border px-5 py-4 ${t.box}`} aria-label={b.title ?? t.label}>
          <p className={`flex items-center gap-2 text-sm font-semibold tracking-wide uppercase ${t.iconCls}`}>
            <Icon aria-hidden="true" className="size-4" />
            {b.title ?? t.label}
          </p>
          <div className="[&>*:first-child]:mt-2 [&>*:last-child]:mb-0 [&_p]:my-2 [&_p]:text-[15px]">
            <DocBlocks blocks={b.blocks} product={product} />
          </div>
        </aside>
      );
    }
    case "steps":
      return (
        <ol className="my-6 space-y-0">
          {b.steps.map((s, i) => (
            <li key={i} className="relative pb-6 pl-12 last:pb-0">
              {i < b.steps.length - 1 && <span aria-hidden="true" className="absolute top-9 bottom-0 left-[15px] w-px bg-line" />}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 inline-flex size-8 items-center justify-center rounded-full bg-[var(--doc-accent)] text-sm font-bold text-white"
              >
                {i + 1}
              </span>
              <h3 className="pt-1 text-base font-semibold text-ink">{md(s.title)}</h3>
              <div className="[&>*:first-child]:mt-2 [&>*:last-child]:mb-0">
                <DocBlocks blocks={s.blocks} product={product} />
              </div>
            </li>
          ))}
        </ol>
      );
    case "cards":
      return (
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          {b.cards.map((c) => (
            <Link
              key={c.href}
              href={resolveHref(c.href, product)}
              className="group rounded-xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--doc-accent)] hover:shadow-float"
            >
              <p className="flex items-center justify-between gap-2 font-semibold text-ink">
                {c.title}
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[var(--doc-accent-ink)] transition group-hover:translate-x-0.5" />
              </p>
              {c.text && <p className="mt-1.5 text-sm leading-6 text-muted">{md(c.text)}</p>}
            </Link>
          ))}
        </div>
      );
    case "images": {
      const phone = b.images.every((im) => /phone|app-|screen-/.test(im.src));
      return (
        <div className={`my-6 grid gap-4 ${b.images.length > 1 ? (phone ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2") : ""}`}>
          {b.images.map((im) => (
            <figure key={im.src} className={b.images.length === 1 && phone ? "mx-auto max-w-[300px]" : ""}>
              <a href={im.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-line bg-gray-50 shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element -- local screenshots of varying size; lazy-loaded below the fold */}
                <img src={im.src} alt={im.alt} loading="lazy" decoding="async" className="h-auto w-full" />
              </a>
              {(im.caption ?? im.alt) && <figcaption className="mt-2 text-center text-sm text-muted">{im.caption ?? im.alt}</figcaption>}
            </figure>
          ))}
        </div>
      );
    }
  }
}
