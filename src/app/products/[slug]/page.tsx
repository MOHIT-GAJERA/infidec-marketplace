import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CircleCheck,
  CircleX,
  Eye,
  ExternalLink,
  FolderOpen,
  GalleryHorizontalEnd,
  Headset,
  Info,
  Lightbulb,
  MessageSquare,
  Rocket,
  Smartphone,
  Sparkles,
  Star,
  HelpCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/PageHeader";
import { PurchaseBox } from "@/components/PurchaseBox";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { categoryLabel, getProduct, products } from "@/data/products";
import { licenseRows, productContent } from "@/data/product-content";
import { testimonials } from "@/data/content";
import { absUrl, inr, site } from "@/lib/site";
import { thumbDataUri } from "@/lib/thumbs";
import { extendedPriceOf } from "@/lib/pricing";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = p.title.length > 60 ? `${p.name} – ${p.tagline}` : p.title;
  const description = `${p.summary} Price ${inr(p.price)}. Lifetime updates & support.`.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      type: "website",
      url: `/products/${p.slug}`,
      title,
      description,
      ...(p.image ? { images: [{ url: p.image, width: 1280, height: 723, alt: `${p.name} – ${p.tagline}` }] } : {}),
    },
    twitter: { title, description, ...(p.image ? { images: [p.image] } : {}) },
  };
}

const ecoColors = ["border-l-blue-600", "border-l-pink-500", "border-l-brand-500", "border-l-accent-400", "border-l-fuchsia-700", "border-l-slate-700"];

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const c = productContent(p);
  const extendedPrice = extendedPriceOf(p);
  const related = products.filter((x) => x.slug !== p.slug && x.type === p.type).slice(0, 3);
  const reviews = testimonials.slice(0, 3);
  const url = absUrl(`/products/${p.slug}`);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.summary,
    sku: p.slug,
    image: [absUrl(p.image ?? `/thumbs/${p.slug}.svg`), absUrl("/og-image.png")],
    category: categoryLabel(p.category),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: p.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${site.url}/#organization` },
    },
    ...(p.rating && p.sales
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, bestRating: 5, ratingCount: p.sales } }
      : {}),
  };

  const tabs = [
    { href: "#overview", label: "Overview", Icon: Info },
    { href: "#features", label: "Features", Icon: Sparkles },
    { href: "#license", label: "License", Icon: BadgeCheck },
    { href: "#faqs", label: "FAQs", Icon: HelpCircle },
    { href: "#reviews", label: "Reviews", Icon: MessageSquare },
    { href: "#support", label: "Support", Icon: Headset },
  ];

  return (
    <>
      {/* Title strip */}
      <section className="border-b border-line bg-white">
        <div className="container-x py-8 sm:py-10">
          <Breadcrumbs
            crumbs={[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { href: `/products/${p.slug}`, label: p.title },
            ]}
          />
          <h1 className="mt-6 max-w-3xl text-2xl leading-tight font-semibold text-ink sm:mt-8 sm:text-[30px]">{p.title}</h1>
          <ul className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink">
            {p.rating && (
              <li className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                <Star aria-hidden="true" className="size-4 fill-rating text-rating" />
                {p.rating.toFixed(1)} Rating
              </li>
            )}
            {p.sales && (
              <li>
                <strong className="font-semibold">{p.sales}</strong> Sales
              </li>
            )}
            <li>
              Category: <strong className="font-semibold">{categoryLabel(p.category)}</strong>
            </li>
          </ul>
        </div>
      </section>

      <div className="bg-soft">
        <div className="container-x grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:py-10">
            <div className="min-w-0 rounded-2xl border border-line bg-white p-3 sm:p-4 lg:col-start-1 lg:row-start-1">
              {p.image ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                  <Image
                    src={p.image}
                    alt={`${p.name} – ${p.tagline}`}
                    fill
                    quality={60}
                    preload
                    fetchPriority="high"
                    sizes="(min-width: 1480px) 1000px, (min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                  />
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                  <p aria-hidden="true" className="absolute right-4 bottom-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-white px-3 py-1.5 text-base font-bold text-brand-800 sm:text-lg">{p.name}</span>
                    {p.chips.slice(0, 4).map((c) => (
                      <span key={c} className="hidden rounded-md bg-white/90 px-2.5 py-1 text-[13px] font-medium text-ink sm:inline">
                        {c}
                      </span>
                    ))}
                  </p>
                </div>
              ) : (
                <Image
                  src={thumbDataUri(p.slug)}
                  alt={`${p.name} product preview showing the ${p.chips.join(", ")}`}
                  width={680}
                  height={340}
                  preload
                  fetchPriority="high"
                  decoding="sync"
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="h-auto w-full rounded-xl"
                />
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {[
                  { href: "#overview", label: "Preview", Icon: Eye },
                  { href: "#features", label: "Screenshots", Icon: GalleryHorizontalEnd },
                  { href: "/documentation", label: "Documentation", Icon: BookOpen },
                ].map(({ href, label, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-ink hover:bg-brand-50"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

          {/* Sidebar – directly after the preview on mobile, right column on desktop */}
          <aside aria-label="Purchase options" className="space-y-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <PurchaseBox slug={p.slug} name={p.name} title={p.title} image={p.image} price={p.price} oldPrice={p.oldPrice} extendedPrice={extendedPrice} />
            <section aria-labelledby="info-title" className="rounded-2xl border border-line bg-white">
              <h2 id="info-title" className="border-b border-line px-5 py-4 text-base font-semibold text-ink">
                Product Information
              </h2>
              <dl className="space-y-4 p-5 text-sm">
                {[
                  ["Current Version", p.version],
                  ["Release Date", p.releaseDate],
                  ["Software Version", p.platform],
                  ["Last Update", p.lastUpdate],
                  ["Category", categoryLabel(p.category)],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-3">
                    <dt className="relative pr-3 text-ink after:absolute after:right-0 after:content-[':']">{k}</dt>
                    <dd className="text-right text-ink">{v}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <dt className="relative pr-3 text-ink after:absolute after:right-0 after:content-[':']">Change Logs</dt>
                  <dd className="text-right">
                    <Link href="/documentation" className="rounded bg-brand-50 px-2 py-1 text-brand-700 hover:underline">
                      View Change Log
                    </Link>
                  </dd>
                </div>
              </dl>
            </section>
          </aside>

            <div className="min-w-0 rounded-2xl border border-line bg-white lg:col-start-1 lg:row-start-2">
              <nav aria-label="Product sections" className="overflow-x-auto border-b border-line">
                <ul className="flex min-w-max gap-1 px-3">
                  {tabs.map(({ href, label, Icon }, i) => (
                    <li key={href}>
                      <a
                        href={href}
                        className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-3.5 text-sm font-medium ${
                          i === 0 ? "border-brand-600 text-brand-600" : "border-transparent text-body hover:text-brand-600"
                        }`}
                      >
                        <Icon aria-hidden="true" className="size-4" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-12 p-4 sm:p-6">
                {/* Overview */}
                <section id="overview" aria-labelledby="overview-title" className="scroll-mt-24 rounded-xl border border-line bg-gray-50 p-5 sm:p-7">
                  <h2 id="overview-title" className="text-xl font-semibold text-ink">
                    {p.name} - {p.tagline}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15px] leading-7 text-body">
                    {c.overview.map((t) => (
                      <p key={t.slice(0, 24)}>{t}</p>
                    ))}
                  </div>
                </section>

                {c.demos.length > 0 && (
                  <section aria-labelledby="demo-title">
                    <h2 id="demo-title" className="text-2xl font-semibold text-ink">
                      Try the Demo Apps
                    </h2>
                    <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {c.demos.map((d, i) => (
                        <li key={i} className="flex flex-col items-center rounded-xl border border-line bg-gray-50 p-4 text-center">
                          <span className="inline-flex size-20 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card">
                            <Smartphone aria-hidden="true" className="size-10" strokeWidth={1.5} />
                          </span>
                          <span className="mt-3 text-lg font-bold text-ink">{d.label}</span>
                          <span className="text-sm font-medium text-muted">{d.sub}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {["Website", "Admin Panel"].map((l) => (
                        <Link
                          key={l}
                          href={`/contact-us?product=${p.slug}&demo=${encodeURIComponent(l)}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-gray-50 py-3 text-sm font-medium text-ink hover:bg-brand-50"
                        >
                          Request {l} Demo <ExternalLink aria-hidden="true" className="size-4" />
                        </Link>
                      ))}
                    </div>

                    <h3 className="mt-8 text-lg font-medium text-ink">Demo Credentials</h3>
                    <p className="mt-1 text-sm text-muted italic">Create your own user account for a better user experience.</p>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                      {c.credentials.map((cr, i) => (
                        <li
                          key={cr.panel}
                          className={`rounded-xl border p-4 text-sm ${i === 0 ? "border-brand-900 bg-brand-900 text-white" : "border-line bg-gray-50 text-ink"}`}
                        >
                          <p className={`font-medium ${i === 0 ? "text-accent-400" : ""}`}>{cr.panel}</p>
                          <dl className="mt-3 space-y-2">
                            <div>
                              <dt className={i === 0 ? "text-gray-300" : "text-muted"}>Email</dt>
                              <dd>{cr.email}</dd>
                            </div>
                            <div>
                              <dt className={i === 0 ? "text-gray-300" : "text-muted"}>Password</dt>
                              <dd>{cr.password}</dd>
                            </div>
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Tech stack */}
                <section aria-labelledby="tech-title">
                  <h2 id="tech-title" className="border-b border-line pb-2 text-xl font-medium text-ink">
                    Tech Stack Behind {p.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-body">
                    {p.name} is powered by modern technologies to deliver a secure, scalable and high-performance experience
                    for businesses of every size.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      { t: "Tech Stack", items: p.techStack },
                      { t: "Built-in Integrations", items: p.integrations },
                    ].map((g) => (
                      <div key={g.t} className="rounded-xl border border-line bg-gray-50 p-4">
                        <h3 className="border-b border-line pb-2 text-xs font-semibold tracking-widest text-body uppercase">{g.t}</h3>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {g.items.map((it) => (
                            <li key={it} className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Why choose */}
                <section id="features" aria-labelledby="why-p-title" className="scroll-mt-24">
                  <h2 id="why-p-title" className="border-b border-line pb-2 text-xl font-medium text-ink">
                    Why Choose {p.name}?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-body">
                    Discover why businesses choose {p.name} to launch a modern product, streamline operations and scale with
                    confidence.
                  </p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {c.why.map((w) => (
                      <li key={w.title} className="rounded-xl border border-line p-5">
                        <h3 className="text-base font-semibold text-ink">{w.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-body">{w.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Brand banner */}
                <section
                  aria-labelledby="banner-title"
                  className={`relative isolate overflow-hidden rounded-3xl ${p.image ? "p-4 sm:p-10" : "p-3"}`}
                  style={{ background: `linear-gradient(135deg, ${p.theme.ink === "light" ? p.theme.from : "#1556e0"}, ${p.theme.ink === "light" ? p.theme.to : "#7b2ff7"})` }}
                >
                  {p.image && (
                    <Image src={p.image} alt="" fill quality={60} sizes="(min-width: 1024px) 900px, 100vw" className="-z-10 object-cover" />
                  )}
                  <div className="rounded-2xl bg-white/95 px-5 py-8 text-center shadow-float sm:px-10">
                    <p className="text-3xl font-bold text-ink">{p.name}</p>
                    <h2 id="banner-title" className="mt-4 text-2xl leading-tight font-semibold text-ink sm:text-[28px]">
                      Launch, Manage, and Scale Your Business with One Complete Platform
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-body">{p.summary}</p>
                  </div>
                </section>

                {/* Problem / solution */}
                {c.problems.length > 0 && (
                  <section aria-labelledby="solve-title">
                    <h2 id="solve-title" className="text-center text-2xl font-semibold text-ink sm:text-3xl">
                      What {p.name} Solves
                    </h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6">
                      <p className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-red-400 py-3 text-base font-semibold text-ink sm:text-lg">
                        <AlertTriangle aria-hidden="true" className="size-5 text-sale" /> Problem
                      </p>
                      <p className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-500 py-3 text-center text-base font-semibold text-ink sm:text-lg">
                        <Lightbulb aria-hidden="true" className="size-5 text-brand-600" /> Solution
                      </p>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {c.problems.map((x) => (
                        <li key={x.problem} className="grid grid-cols-2 gap-3 sm:gap-6">
                          <p className="flex items-start gap-2 rounded-xl bg-gradient-to-b from-white to-red-50 p-4 text-sm font-medium text-ink sm:text-base">
                            <CircleX aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sale" />
                            {x.problem}
                          </p>
                          <p className="flex items-start gap-2 rounded-xl bg-gradient-to-b from-white to-brand-50 p-4 text-sm font-medium text-ink sm:text-base">
                            <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand-600" />
                            {x.solution}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Ecosystem */}
                {c.ecosystem.length > 0 && (
                  <section aria-labelledby="eco-title">
                    <h2 id="eco-title" className="text-center text-2xl font-semibold text-ink sm:text-3xl">
                      Product Ecosystem
                    </h2>
                    <ul className="mt-6 grid gap-3 rounded-2xl bg-gray-100 p-3 sm:grid-cols-2">
                      {c.ecosystem.map((e, i) => (
                        <li key={e.title} className={`rounded-lg border-l-4 bg-white p-4 ${ecoColors[i % ecoColors.length]}`}>
                          <h3 className="text-base font-bold text-ink">{e.title}</h3>
                          <p className="mt-1 text-sm text-body">{e.text}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm leading-6 text-body">
                      <Lightbulb aria-hidden="true" className="size-6 shrink-0 text-brand-600" />
                      Every app shares the same data in real time, eliminating duplicate work and keeping your entire business
                      perfectly synchronised.
                    </p>
                  </section>
                )}

                {/* Installation CTA */}
                <section id="support" aria-labelledby="help-title" className="scroll-mt-24 rounded-3xl bg-brand-50 p-4 sm:p-6">
                  <h2 id="help-title" className="text-center text-2xl font-semibold text-ink sm:text-3xl">
                    Need Help With Installation?
                  </h2>
                  <div className="mt-5 flex flex-col items-start gap-5 rounded-2xl bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-ink">We&apos;ll Set Up {p.name} for You</h3>
                      <p className="mt-2 text-base text-body">From installation to launch – we handle everything for you.</p>
                      <Link href="/installation" className="btn-primary mt-5 rounded-full">
                        Let&apos;s Set It Up <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </div>
                    <span aria-hidden="true" className="hidden size-28 items-center justify-center rounded-full bg-brand-600 text-white sm:inline-flex">
                      <Rocket className="size-14" strokeWidth={1.5} />
                    </span>
                  </div>
                </section>

                {/* Requirements */}
                <section aria-labelledby="req-title">
                  <h2 id="req-title" className="text-center text-2xl font-semibold text-ink sm:text-3xl">
                    Important Requirements
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {c.requirements.map((r, i) => (
                      <li
                        key={r.title}
                        className={`rounded-lg border-l-4 bg-white p-4 shadow-card ${["border-l-accent-400", "border-l-brand-500", "border-l-blue-600"][i % 3]}`}
                      >
                        <h3 className="text-base font-bold text-ink">{r.title}</h3>
                        <p className="mt-1 text-sm text-body">{r.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* What you get */}
                <section aria-labelledby="get-title">
                  <h2 id="get-title" className="text-center text-2xl font-semibold text-ink sm:text-3xl">
                    What Will You Get
                  </h2>
                  <div className="mt-6 flex flex-col items-center">
                    <FolderOpen aria-hidden="true" className="size-16 fill-sky-200 text-sky-500" strokeWidth={1.2} />
                    <p className="mt-1 rounded-md bg-gray-100 px-3 py-1 text-base font-semibold text-ink">{p.name}</p>
                  </div>
                  <ul className="mt-5 flex flex-wrap justify-center gap-3 rounded-2xl bg-brand-50 p-5">
                    {c.youGet.map((g) => (
                      <li key={g} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-ink">
                        <CircleCheck aria-hidden="true" className="size-4 text-brand-600" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Revenue */}
                {c.revenue.length > 0 && (
                  <section aria-labelledby="rev-title">
                    <h2 id="rev-title" className="border-b border-line pb-2 text-xl font-medium text-ink">
                      How to Generate Revenue with Your {p.name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-body">
                      {p.name} is designed to help you build a profitable business with multiple revenue opportunities.
                    </p>
                    <ul className="mt-4 grid gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 sm:grid-cols-2">
                      {c.revenue.map((r) => (
                        <li key={r.title} className="rounded-lg bg-white p-4">
                          <h3 className="border-b border-line pb-2 text-sm font-semibold text-brand-800">{r.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-body">{r.text}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* License table */}
                <section id="license" aria-labelledby="license-title" className="scroll-mt-24">
                  <h2 id="license-title" className="border-b border-line pb-2 text-xl font-medium text-ink">
                    Choose the Perfect Plan for Your Unique Needs (License)
                  </h2>
                  <p className="mt-2 text-sm text-body">
                    See the differences between the regular and extended licences, and pick the one that fits what you need.
                  </p>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <caption className="sr-only">Regular versus extended licence features</caption>
                      <thead>
                        <tr className="bg-gray-50">
                          <th scope="col" className="px-4 py-3 text-center font-semibold text-ink">Feature</th>
                          <th scope="col" className="px-4 py-3 text-center font-semibold text-ink">Regular Licence</th>
                          <th scope="col" className="bg-brand-50 px-4 py-3 text-center font-semibold text-ink">Extended Licence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {licenseRows.map((r) => (
                          <tr key={r.label} className="border-t border-line even:bg-gray-50/60">
                            <th scope="row" className="px-4 py-3 font-normal text-body">{r.label}</th>
                            {[r.regular, r.extended].map((v, i) => (
                              <td key={i} className={`px-4 py-3 text-center ${i === 1 ? "bg-brand-50/70" : ""}`}>
                                {v ? (
                                  <CircleCheck role="img" aria-label="Included" className="mx-auto size-5 text-brand-600" />
                                ) : (
                                  <CircleX role="img" aria-label="Not included" className="mx-auto size-5 text-sale" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 rounded-3xl bg-brand-700 px-5 py-10 text-center text-white sm:px-10">
                    <p className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                      <Star aria-hidden="true" className="size-3.5 fill-white" /> Extended License Exclusive
                    </p>
                    <h3 className="mt-5 text-2xl font-semibold">Launch Faster with FREE Setup Assistance</h3>
                    <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-brand-50">
                      Extended license buyers receive complimentary backend deployment and domain server configuration from our
                      expert engineering support desk.
                    </p>
                    <ul className="mt-6 flex flex-wrap justify-center gap-3">
                      {["Faster Time to Market", "Support Beyond Launch", "Expert Deployment"].map((t) => (
                        <li key={t} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold">
                          <CircleCheck aria-hidden="true" className="size-5" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* FAQs */}
                <section id="faqs" aria-labelledby="pfaq-title" className="scroll-mt-24">
                  <h2 id="pfaq-title" className="mb-4 border-b border-line pb-2 text-xl font-medium text-ink">
                    Frequently Asked Questions
                  </h2>
                  <Faq items={c.faqs} />
                </section>

                {/* Reviews */}
                <section id="reviews" aria-labelledby="rev-list-title" className="scroll-mt-24">
                  <h2 id="rev-list-title" className="mb-4 border-b border-line pb-2 text-xl font-medium text-ink">
                    Customer Reviews
                  </h2>
                  <ul className="grid gap-3 md:grid-cols-3">
                    {reviews.map((r) => (
                      <li key={r.name} className="rounded-xl border border-line p-5">
                        <p role="img" aria-label="Rated 5 out of 5" className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} aria-hidden="true" className="size-4 fill-rating text-rating" />
                          ))}
                        </p>
                        <blockquote className="mt-3 text-sm leading-6 text-ink">{r.text}</blockquote>
                        <p className="mt-4 text-sm font-semibold text-ink">
                          {r.name} <span className="font-normal text-muted">· {r.topic}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="container-x pb-16">
            <h2 id="related-title" className="mb-6 text-2xl font-semibold text-ink">
              You May Also Like
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      <JsonLd data={productLd} />
    </>
  );
}
