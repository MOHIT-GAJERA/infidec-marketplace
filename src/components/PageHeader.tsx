import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { absUrl } from "@/lib/site";
import heroImage from "../../public/images/marketplace-hero.webp";

export type Crumb = { href: string; label: string };

type Props = {
  crumbs: Crumb[];
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
};

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absUrl(c.href) })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-card">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.href} className="inline-flex min-w-0 items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="truncate text-ink">
                    {c.label}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className="text-brand-600 hover:underline">
                      {c.label}
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={ld} />
    </>
  );
}

/** Inner-page banner: the home hero photo under the same dark-blue bottom-to-top gradient, with white text. */
export function PageHeader({ crumbs, title, description, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-900">
      <Image src={heroImage} alt="" fill quality={60} sizes="100vw" placeholder="blur" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900 via-brand-900/85 to-brand-800/60" />
      <div className="container-x py-8 sm:py-12">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-6 text-2xl leading-tight font-semibold text-white sm:mt-10 sm:text-[30px]">{title}</h1>
        {description && <div className="mt-3 max-w-3xl text-base leading-7 text-white/85">{description}</div>}
        {children}
      </div>
    </section>
  );
}
