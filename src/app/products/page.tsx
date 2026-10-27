import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProductsExplorer } from "@/components/ProductsExplorer";
import { JsonLd } from "@/components/JsonLd";
import { products } from "@/data/products";
import { absUrl } from "@/lib/site";
import { thumbDataUri } from "@/lib/thumbs";

export const metadata: Metadata = {
  title: "Products – Health, Food & Wellness App Source Code and Product Kits",
  description:
    "Browse ready-made grocery delivery, diet planner, meal subscription, fitness, clinic and wellness app source code and product kits. Filter by category, price and rating.",
  alternates: { canonical: "/products" },
  openGraph: { url: "/products" },
};

export default function ProductsPage() {
  // Inline the first two thumbnails of the default (best selling) order so the LCP image needs no request.
  const inlineThumbs = Object.fromEntries(
    [...products]
      .sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0))
      .slice(0, 2)
      .map((p) => [p.slug, thumbDataUri(p.slug)]),
  );
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Infidec Marketplace Products",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/products/${p.slug}`),
      name: p.title,
    })),
  };

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/products", label: "Products" },
        ]}
        title="Launch Faster with Ready-Made Health & Food App Solutions"
        description="Find the perfect application stack. Filter by category, price, or reviews and get instant deploy access."
      />
      <div className="container-x py-10">
        <ProductsExplorer products={products} inlineThumbs={inlineThumbs} />
      </div>
      <JsonLd data={itemList} />
    </>
  );
}
