import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Bike, BookOpen, CircleHelp, Code, Globe, History, LayoutDashboard, LifeBuoy, Mail, Smartphone } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { docHref, getDocsProduct, sectionHref, type DocsSection } from "@/lib/docs/products";
import { absUrl, site } from "@/lib/site";

const ICONS: Record<DocsSection["icon"], typeof BookOpen> = { LayoutDashboard, Smartphone, Bike, Globe, LifeBuoy, CircleHelp, BookOpen, History, Code };

export async function generateMetadata({ params }: PageProps<"/docs/[product]">): Promise<Metadata> {
  const product = getDocsProduct((await params).product);
  if (!product) return {};
  const url = `/docs/${product.slug}`;
  return {
    title: `${product.name} Documentation`,
    description: product.description,
    alternates: { canonical: url },
    openGraph: { url, title: `${product.name} Documentation`, description: product.description },
  };
}

export default async function DocsLanding({ params }: PageProps<"/docs/[product]">) {
  const product = getDocsProduct((await params).product);
  if (!product) notFound();
  const intro = docHref(product.slug, "intro");
  const cards = product.sections.filter((s) => !["intro", "changelog"].includes(s.key));

  // Per-product quick start (DocsProduct.quickStart); the default matches the QwikMart docs.
  const quickStart = (
    product.quickStart ?? [
      { title: "Create Firebase & deploy the backend", text: "Create your Firebase project on the Blaze plan, then deploy Cloud Functions, rules and indexes.", slug: "installation/firebase-project" },
      { title: "Install the Admin Panel & website", text: "Configure the environment, create your Super Admin and host both on Firebase App Hosting.", slug: "installation/admin-panel" },
      { title: "Brand & publish the apps", text: "Change package name, logo and colours, connect Firebase and upload to Google Play.", slug: "app-customer/prerequisites" },
    ]
  ).map((s) => ({ title: s.title, text: s.text, href: docHref(product.slug, s.slug) }));

  const ld = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${product.name} Documentation`,
    description: product.description,
    url: absUrl(`/docs/${product.slug}`),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    dateModified: product.updated,
  };

  return (
    <>
      <section className="relative isolate overflow-hidden" style={{ background: `linear-gradient(135deg, ${product.colors.ink}, ${product.colors.accent})` }}>
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="container-x py-16 text-center sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">
            Version {product.version} · Updated {product.updated}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{product.name} Documentation</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{product.tagline}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={intro} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[var(--doc-accent-ink)] shadow-lg hover:bg-gray-50">
              Get Started <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link href={docHref(product.slug, product.installSlug ?? "installation/requirements")} className="inline-flex items-center gap-2 rounded-xl border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Installation Guide
            </Link>
            {product.productUrl && (
              <Link href={product.productUrl} className="inline-flex items-center gap-2 rounded-xl border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white/10">
                View Product
              </Link>
            )}
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full text-white sm:h-12">
          <path fill="currentColor" d="M0 40c240 20 480 20 720 0s480-40 720-20v40H0z" />
        </svg>
      </section>

      <section className="container-x py-14 sm:py-20" aria-labelledby="sections-title">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-[var(--doc-accent-ink)] uppercase">Documentation</p>
        <h2 id="sections-title" className="mt-2 text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Everything in one place
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
          Step-by-step guides for every part of {product.name} — from creating your Firebase project to publishing the apps on Google Play.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <Link
                key={s.key}
                href={sectionHref(product, s)}
                className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-[var(--doc-accent)] hover:shadow-float"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[var(--doc-accent-soft)] text-[var(--doc-accent-ink)]">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-6 text-muted">{s.description}</p>
                <span className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                  <span className="inline-flex items-center gap-1 font-semibold text-[var(--doc-accent-ink)]">
                    Explore <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                  {s.badge && <span className="text-xs font-medium text-muted">{s.badge}</span>}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-soft py-14 sm:py-20" aria-labelledby="quick-title">
        <div className="container-x">
          <h2 id="quick-title" className="text-center text-3xl font-bold tracking-tight text-ink">
            Quick start
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">Three stages take you from the downloaded package to a live store.</p>
          <ol className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {quickStart.map((q, i) => (
              <li key={q.title} className="rounded-2xl border border-line bg-white p-6">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--doc-accent)] font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 font-semibold text-ink">{q.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{q.text}</p>
                <Link href={q.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--doc-accent-ink)] hover:underline">
                  Read the guide <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-12">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Need a hand with the setup?</h2>
          <p className="max-w-2xl text-muted">
            Read the <Link href={docHref(product.slug, "faqs")} className="font-medium text-[var(--doc-accent-ink)] underline">FAQs</Link> first — most questions are
            answered there. Still stuck? Our team replies within 1–2 business days ({site.hours}), or we can install everything for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={docHref(product.slug, "support")} className="btn-primary !bg-[var(--doc-accent)] hover:!bg-[var(--doc-accent-ink)]">
              <LifeBuoy aria-hidden="true" className="size-4" /> Get support
            </Link>
            <Link href="/installation" className="btn-outline">
              Installation service
            </Link>
            <a href={`mailto:${site.email}`} className="btn-outline">
              <Mail aria-hidden="true" className="size-4" /> {site.email}
            </a>
          </div>
        </div>
      </section>
      <JsonLd data={ld} />
    </>
  );
}
