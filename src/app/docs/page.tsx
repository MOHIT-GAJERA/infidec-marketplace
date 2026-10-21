import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { docsProducts } from "@/lib/docs/products";

export const metadata: Metadata = {
  title: "Product Documentation",
  description: "Installation, configuration and publishing guides for every Infidec Marketplace product.",
  alternates: { canonical: "/docs" },
};

export default function DocsHome() {
  const products = Object.values(docsProducts);
  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/docs", label: "Documentation" },
        ]}
        title="Product Documentation"
        description="Step-by-step guides to install, configure, brand and publish each product you buy from Infidec Marketplace."
      />
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/docs/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-float"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl text-white" style={{ background: p.colors.accent }}>
                <BookOpen aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-ink">{p.name} Documentation</h2>
              <p className="mt-2 flex-1 text-[15px] leading-6 text-muted">{p.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Open docs · v{p.version} <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
