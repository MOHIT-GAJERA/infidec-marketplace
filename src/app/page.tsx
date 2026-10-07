import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroImage from "../../public/images/marketplace-hero.webp";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Boxes,
  Flame,
  Globe2,
  Headset,
  Layers,
  BookOpen,
  Search,
  ShieldCheck,
  Smile,
  Store,
  ShoppingCart,
  Code,
  Package,
  Users,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Icon3D } from "@/components/Icon3D";
import { SectionHeading, CenterHeading } from "@/components/SectionHeading";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { featuredApps, productKits, products } from "@/data/products";
import { homeFaqs, testimonials } from "@/data/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
};

const quickTags = ["Grocery", "Diet", "Fitness", "Meal", "Marketplace"];

const stats = [
  {
    title: "In-House Product Experts",
    value: "45+",
    text: "Every solution is designed, developed, and maintained by our own team.",
    Icon: Users,
  },
  {
    title: "Documentation & Guides",
    value: "14+",
    text: "Detailed setup docs and guides included with every product purchase.",
    Icon: BookOpen,
  },
  {
    title: "Ranked Among Top Sellers",
    value: "4.8★",
    text: "Recognized among top sellers for delivering quality products & support.",
    Icon: Award,
  },
];

const reasons = [
  { title: `${products.length}+ Proven Products`, text: "Choose from solutions tested by thousands of businesses worldwide.", Icon: Boxes },
  { title: "Trusted by 24,000+ Clients", text: "Helping startups and businesses bring healthy ideas to market faster.", Icon: ShieldCheck },
  { title: "Dedicated Product Support", text: "Work directly with the same team that creates and maintains every product.", Icon: Headset },
  { title: "Rated 4.8★ for Quality & Support", text: "Verified buyers consistently praise our products and service.", Icon: Smile },
  { title: "Serving 50+ Countries Worldwide", text: "Our products power food, fitness and wellness entrepreneurs around the world.", Icon: Globe2 },
  { title: "Backed by 10+ Years of Experience", text: "Built by a team with a decade of software product expertise.", Icon: BadgeCheck },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden bg-brand-900"
      >
        {/* Template-marketplace laptop photo (Unsplash, Campaign Creators – free Unsplash License) under a dark-blue bottom-to-top gradient so the white headline stays readable */}
        <Image
          src={heroImage}
          alt=""
          fill
          preload
          fetchPriority="high"
          quality={60}
          sizes="100vw"
          placeholder="blur"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900 via-brand-900/85 to-brand-800/60"
        />
        <div className="container-x flex flex-col items-center py-16 text-center sm:py-24 lg:py-32">
          <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 text-[13px] font-medium whitespace-nowrap text-ink shadow-card sm:gap-3 sm:px-4 sm:py-2.5 sm:text-lg">
            <span aria-hidden="true" className="flex -space-x-1">
              {[Store, ShoppingCart, Code, Package].map((I, i) => (
                <span key={i} className="inline-flex size-6 items-center sm:size-7 justify-center rounded-full border-2 border-white bg-brand-50 text-brand-600">
                  <I className="size-4" />
                </span>
              ))}
            </span>
            <span>
              Trusted By <span className="font-semibold text-brand-600">24K+ Clients</span> Worldwide
            </span>
          </p>

          <h1
            id="hero-title"
            className="mt-7 max-w-5xl text-[34px] leading-[1.12] font-semibold tracking-tight text-white sm:text-5xl lg:text-[60px] lg:leading-[1.08]"
          >
            Ready Made Health &amp; Food App Solutions - Source Code &amp; Product Kits
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/85">
            Skip months of development with proven, customizable food delivery, diet, fitness and wellness apps backed by
            10+ years of software development experience.
          </p>

          <form action="/products" method="get" role="search" className="mt-10 w-full max-w-[580px]">
            <label htmlFor="hero-search" className="sr-only">
              Search products
            </label>
            <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white py-1.5 pr-1.5 pl-4 shadow-card focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
              <Search aria-hidden="true" className="size-5 shrink-0 text-muted" />
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Search Product"
                autoComplete="off"
                className="h-9 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700"
              >
                <ArrowRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          </form>

          <ul aria-label="Popular searches" className="mt-5 flex flex-wrap justify-center gap-3">
            {quickTags.map((t) => (
              <li key={t}>
                <Link
                  href={`/products?q=${encodeURIComponent(t.toLowerCase())}`}
                  className="inline-flex min-h-9 items-center rounded-full border border-white/30 bg-white/10 px-4 text-[15px] text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand-700"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured products */}
      <section aria-labelledby="featured-title" className="container-x py-16 lg:py-20">
        <SectionHeading
          id="featured-title"
          title="Featured Products"
          description="Explore best-selling health, food & wellness App & Web source code built to launch, customize, and grow your business."
          icon={<Flame aria-hidden="true" className="size-5" />}
          cta={{ href: "/products", label: "View All Products" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredApps.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Built, owned & supported */}
      <section aria-labelledby="team-title" className="cv-auto bg-brand-50 py-16 lg:py-20">
        <div className="container-x">
          <CenterHeading
            id="team-title"
            title="Built, Owned & Supported by One Team"
            description="Every product is created and maintained by our in-house experts, delivering consistent quality, faster support, and long-term reliability."
          />
          <ul className="grid gap-5 md:grid-cols-3">
            {stats.map(({ title, value, text, Icon }, i) => (
              <li
                key={title}
                className="group relative rounded-2xl border-4 border-white bg-white/80 p-8 shadow-card sm:p-10"
              >
                <Icon3D Icon={Icon} index={i} size="lg" className="absolute top-6 right-6" />
                <h3 className="relative text-base font-semibold text-ink">{title}</h3>
                <p className="relative mt-6 text-2xl font-semibold text-brand-700">{value}</p>
                <p className="relative mt-6 text-base leading-6 text-body">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Our kits */}
      <section aria-labelledby="kits-title" className="cv-auto container-x py-16 lg:py-20">
        <SectionHeading
          id="kits-title"
          title="Our Kits"
          description="Complete, ready-to-launch product kits — customer apps, websites and admin panels with full source code, built by our team for health, food and wellness businesses."
          icon={<Layers aria-hidden="true" className="size-5" />}
          cta={{ href: "/products", label: "View All Kits" }}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productKits.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section aria-labelledby="loved-title" className="cv-auto container-x pt-6 pb-16 lg:pb-20">
        <CenterHeading
          id="loved-title"
          title="Loved by Founders & Developers"
          description="Don't just take our word for it. Read what our clients have to say about our code quality and support."
        />
        <Testimonials items={testimonials} />
      </section>

      {/* Why choose */}
      <section aria-labelledby="why-title" className="cv-auto relative isolate overflow-hidden bg-brand-900 py-16 lg:py-20">
        {/* Same photo + dark-blue gradient as the hero */}
        <Image src={heroImage} alt="" fill quality={60} sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900 via-brand-900/85 to-brand-800/60" />
        <div className="container-x">
          <CenterHeading
            id="why-title"
            tone="dark"
            title={`Why Thousands Choose ${site.name}?`}
            description="More than source code - get proven products, expert support, and everything you need to launch with confidence."
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ title, text, Icon }, i) => (
              <li key={title} className="group rounded-2xl bg-white p-6">
                <Icon3D Icon={Icon} index={i} />
                <h3 className="mt-12 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-4 text-base leading-6 text-body">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="cv-auto py-16 lg:py-20">
        <div className="container-x">
          <CenterHeading
            id="faq-title"
            title="Have Questions? We've Got Answers"
            description="Get quick answers about our products, source code, licenses, support services, and other important information before you buy."
          />
          <Faq items={homeFaqs} />
          <div className="mt-10 flex justify-center">
            <Link href="/faqs" className="btn-outline px-6 py-3 text-base">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
