import { notFound } from "next/navigation";
import { DocsTopBar, type TopTab } from "@/components/docs/DocsTopBar";
import { docsProducts, flatPages, getDocsProduct, sectionHref } from "@/lib/docs/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(docsProducts).map((product) => ({ product }));
}

export default async function DocsProductLayout({ children, params }: LayoutProps<"/docs/[product]">) {
  const { product: slug } = await params;
  const product = getDocsProduct(slug);
  if (!product) notFound();

  const pages = flatPages(product);
  const tabs: TopTab[] = product.sections
    .filter((s) => s.tab)
    .map((s) => ({
      key: s.key,
      title: s.title,
      href: sectionHref(product, s),
      // every slug prefix of the section ("admin", "installation", "app-customer"…) marks the tab active
      prefixes: [...new Set(pages.filter((p) => p.section.key === s.key).map((p) => p.slug.split("/")[0]))],
    }));

  return (
    <div
      style={
        {
          "--doc-accent": product.colors.accent,
          "--doc-accent-ink": product.colors.ink,
          "--doc-accent-soft": product.colors.soft,
        } as React.CSSProperties
      }
    >
      <DocsTopBar product={product.slug} name={product.name} version={product.version} tabs={tabs} />
      {children}
    </div>
  );
}
