import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, Mail } from "lucide-react";
import { DocBlocks } from "@/components/docs/DocBlocks";
import { DocsToc } from "@/components/docs/DocsToc";
import { InlineMd } from "@/components/docs/InlineMd";
import { JsonLd } from "@/components/JsonLd";
import { loadDoc } from "@/lib/docs/content";
import { docHref, docsProducts, flatPages, getDocsProduct, sectionHref } from "@/lib/docs/products";
import { absUrl, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(docsProducts).flatMap((p) => flatPages(p).map((page) => ({ product: p.slug, slug: page.slug.split("/") })));
}

async function resolve(params: PageProps<"/docs/[product]/docs/[...slug]">["params"]) {
  const { product: productSlug, slug } = await params;
  const product = getDocsProduct(productSlug);
  if (!product) return null;
  const key = slug.join("/");
  const pages = flatPages(product);
  const idx = pages.findIndex((p) => p.slug === key);
  if (idx < 0) return null;
  const doc = loadDoc(product.slug, key);
  if (!doc) return null;
  return { product, page: pages[idx], doc, prev: pages[idx - 1], next: pages[idx + 1] };
}

export async function generateMetadata({ params }: PageProps<"/docs/[product]/docs/[...slug]">): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const url = docHref(r.product.slug, r.page.slug);
  const title = `${r.doc.title} – ${r.product.name} Docs`;
  return {
    title,
    description: r.doc.description,
    alternates: { canonical: url },
    openGraph: { url, title, description: r.doc.description, type: "article" },
  };
}

export default async function DocPage({ params }: PageProps<"/docs/[product]/docs/[...slug]">) {
  const r = await resolve(params);
  if (!r) notFound();
  const { product, page, doc, prev, next } = r;

  // Breadcrumb: Home › Section › (Group) › Page  – single-page sections show only Home › Page
  const crumbs: { label: string; href?: string }[] = [];
  const sectionPages = flatPages(product).filter((p) => p.section.key === page.section.key);
  if (sectionPages.length > 1) crumbs.push({ label: page.section.title, href: sectionHref(product, page.section) });
  page.trail.forEach((t) => crumbs.push({ label: t }));

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: doc.title,
        description: doc.description,
        url: absUrl(docHref(product.slug, page.slug)),
        isPartOf: { "@type": "CreativeWork", name: `${product.name} Documentation`, url: absUrl(`/docs/${product.slug}`) },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `${product.name} Docs`, item: absUrl(`/docs/${product.slug}`) },
          ...crumbs
            .filter((c) => c.href)
            .map((c, i) => ({ "@type": "ListItem", position: i + 2, name: c.label, item: absUrl(c.href!) })),
          { "@type": "ListItem", position: crumbs.filter((c) => c.href).length + 2, name: doc.title, item: absUrl(docHref(product.slug, page.slug)) },
        ],
      },
    ],
  };

  return (
    <div className="xl:flex xl:gap-10">
      <article className="min-w-0 flex-1 xl:max-w-[820px]">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <li>
              <Link href={`/docs/${product.slug}`} className="inline-flex items-center hover:text-ink" aria-label={`${product.name} documentation home`}>
                <Home aria-hidden="true" className="size-4" />
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="inline-flex items-center gap-1.5">
                <ChevronRight aria-hidden="true" className="size-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </li>
            ))}
            <li className="inline-flex items-center gap-1.5">
              <ChevronRight aria-hidden="true" className="size-3.5" />
              <span aria-current="page" className="font-medium text-ink">
                {page.title}
              </span>
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{doc.title}</h1>
          {doc.description && (
            <p className="mt-3 text-lg leading-7 text-muted">
              <InlineMd text={doc.description} product={product.slug} />
            </p>
          )}
        </header>

        <div className="doc-body">
          <DocBlocks blocks={doc.blocks} product={product.slug} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-gray-50 px-5 py-4 text-sm text-muted">
          <span>
            Something unclear or out of date?{" "}
            <Link href={`/contact-us?product=${product.slug}&docs=${encodeURIComponent(page.slug)}`} className="font-medium text-[var(--doc-accent-ink)] underline">
              Tell us
            </Link>
            .
          </span>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 hover:text-ink">
            <Mail aria-hidden="true" className="size-4" /> {site.email}
          </a>
        </div>

        <nav aria-label="Previous and next page" className="mt-6 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link href={docHref(product.slug, prev.slug)} className="group rounded-xl border border-line p-4 hover:border-[var(--doc-accent)]">
              <span className="flex items-center gap-1 text-xs text-muted">
                <ChevronLeft aria-hidden="true" className="size-3.5" /> Previous
              </span>
              <span className="mt-1 block font-semibold text-ink group-hover:text-[var(--doc-accent-ink)]">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={docHref(product.slug, next.slug)} className="group rounded-xl border border-line p-4 text-right hover:border-[var(--doc-accent)] sm:col-start-2">
              <span className="flex items-center justify-end gap-1 text-xs text-muted">
                Next <ChevronRight aria-hidden="true" className="size-3.5" />
              </span>
              <span className="mt-1 block font-semibold text-ink group-hover:text-[var(--doc-accent-ink)]">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>

      <aside className="sticky top-[144px] hidden max-h-[calc(100dvh-160px)] w-56 shrink-0 overflow-y-auto pb-10 xl:block">
        <DocsToc items={doc.toc} />
      </aside>
      <JsonLd data={ld} />
    </div>
  );
}
