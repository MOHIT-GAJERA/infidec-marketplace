import { notFound } from "next/navigation";
import { DocsSidebar, type SidebarSection } from "@/components/docs/DocsSidebar";
import { getDocsProduct } from "@/lib/docs/products";

export default async function DocsPagesLayout({ children, params }: LayoutProps<"/docs/[product]/docs">) {
  const product = getDocsProduct((await params).product);
  if (!product) notFound();
  const sections: SidebarSection[] = product.sections.map((s) => ({ key: s.key, title: s.title, items: s.items }));
  return (
    <div className="container-x py-6 lg:flex lg:gap-8 lg:py-8">
      <DocsSidebar product={product.slug} sections={sections} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
