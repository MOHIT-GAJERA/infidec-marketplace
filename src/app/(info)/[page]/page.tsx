import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { infoPages, type InfoSlug, type PageDef } from "@/data/pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(infoPages).map((page) => ({ page }));
}

const get = (slug: string): PageDef | undefined => (slug in infoPages ? infoPages[slug as InfoSlug] : undefined);

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
  const { page } = await params;
  const def = get(page);
  if (!def) return {};
  return {
    title: def.metaTitle,
    description: def.description,
    alternates: { canonical: `/${page}` },
    openGraph: { url: `/${page}`, title: def.metaTitle, description: def.description },
  };
}

export default async function InfoPage({ params }: PageProps<"/[page]">) {
  const { page } = await params;
  const def = get(page);
  if (!def) notFound();
  return (
    <ContentPage
      path={`/${page}`}
      label={def.label}
      title={def.title}
      description={def.description}
      blocks={def.blocks}
      updated={def.updated}
    />
  );
}
