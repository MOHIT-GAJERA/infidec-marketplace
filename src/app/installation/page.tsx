import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ctaImage from "../../../public/images/marketplace-cta.webp";
import heroImage from "../../../public/images/marketplace-hero.webp";
import {
  ArrowRight,
  CircleArrowRight,
  CircleCheck,
  CircleX,
  CloudCog,
  FileCheck2,
  Headset,
  Mail,
  Rocket,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Icon3D } from "@/components/Icon3D";
import { PageHeader } from "@/components/PageHeader";
import { CenterHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { planFeatures, plans } from "@/data/installation";
import { absUrl, site } from "@/lib/site";
import { Price } from "@/components/Price";

export const metadata: Metadata = {
  title: "Installation Pricing Plans – Expert App & Server Setup",
  description:
    "Let our experts install your food, fitness or wellness app: VPS setup, database, SSL, Firebase, push notifications and Play Store / App Store publishing. Plans from ₹21,999.",
  alternates: { canonical: "/installation" },
  openGraph: { url: "/installation" },
};

const benefits = [
  { title: "Expert Tech Team", text: "Our experienced developers handle the entire setup with precision and care.", Icon: UsersRound },
  { title: "Secure Installation", text: "We follow best practices to protect your data, credentials, and hosting environment.", Icon: ShieldCheck },
  { title: "Ongoing Support", text: "Get full assistance before, during, and after installation with no extra charges.", Icon: Headset },
  { title: "Hosting Compatibility", text: "We configure your system for cPanel, VPS, shared, or cloud servers with ease.", Icon: CloudCog },
  { title: "Error-Free Delivery", text: "Each feature is tested to ensure everything works smoothly from day one.", Icon: FileCheck2 },
  { title: "Scalable Setup", text: "Our installations are optimized for performance, speed, and future growth.", Icon: Rocket },
];

const needs = ["App Logo / Icon", "Advertisement ID", "Firebase Owner Access", "Server Access", "Play Console Access", "Apple Connect"];

export default function InstallationPage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "App Installation & Reskinning Service",
    provider: { "@id": `${site.url}/#organization` },
    url: absUrl("/installation"),
    offers: plans.map((p) => ({ "@type": "Offer", name: `${p.name} Installation Plan`, price: p.price, priceCurrency: "INR" })),
  };

  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/installation", label: "Installation" },
        ]}
        title="Installation Pricing Plans"
        description="Skip the technical headaches. Our team installs your product on your server, configured correctly and ready to perform from day one."
      />

      {/* Pricing table */}
      <section aria-labelledby="plans-title" className="container-x py-16 lg:py-20">
        <CenterHeading
          id="plans-title"
          title="Our Secure Installation Plans"
          description="Let our expert team handle your product installation from start to finish, delivering a secure, error free setup that is optimized for performance and built for your server. Save time, avoid technical issues, and go live with confidence."
        />
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <caption className="sr-only">Installation plan comparison</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[18%] border-r border-line p-4 align-top text-base font-semibold text-ink">
                  Features
                </th>
                {plans.map((p) => (
                  <th key={p.key} scope="col" className="border-r border-line p-4 align-top font-normal last:border-r-0">
                    <span className="block text-base font-semibold text-brand-600">{p.name}</span>
                    <s className="mt-5 block text-sm text-muted">
                      <Price inr={p.oldPrice} />
                    </s>
                    <Price inr={p.price} className="block text-2xl font-semibold text-ink" />
                    <span className="mt-3 block min-h-10 text-xs leading-5 text-body">{p.note}</span>
                    <Link
                      href={`/contact-us?plan=${p.key}`}
                      className="btn-dark mt-3 w-full py-2"
                    >
                      Buy Now<span className="sr-only">: {p.name} plan</span> <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planFeatures.map((f) => (
                <tr key={f.label} className="border-t border-line">
                  <th scope="row" className="border-r border-line p-4 text-[13px] font-semibold text-ink">
                    {f.label}
                  </th>
                  {f.values.map((v, i) => (
                    <td key={i} className="border-r border-line p-4 text-center last:border-r-0">
                      {v ? (
                        <CircleCheck role="img" aria-label="Included" className="mx-auto size-5 text-brand-600" />
                      ) : (
                        <CircleX role="img" aria-label="Not included" className="mx-auto size-5 text-sale" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line">
                <th scope="row" className="border-r border-line p-4 text-[13px] font-semibold text-ink">
                  Support Duration
                </th>
                {plans.map((p, i) => (
                  <td
                    key={p.key}
                    className={`border-r border-line p-4 text-center last:border-r-0 ${i === plans.length - 1 ? "font-semibold text-brand-600" : "text-ink"}`}
                  >
                    {p.support}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why buy */}
      <section aria-labelledby="why-install-title" className="relative isolate overflow-hidden bg-brand-900 py-16 lg:py-20">
        {/* Same photo + dark-blue gradient as the home hero */}
        <Image src={heroImage} alt="" fill quality={60} sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900 via-brand-900/85 to-brand-800/60" />
        <div className="container-x">
          <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-brand-200 uppercase">
                <span aria-hidden="true">✦</span> How We Work <span aria-hidden="true">✦</span>
              </p>
              <h2 id="why-install-title" className="max-w-md text-2xl leading-tight font-semibold text-white sm:text-[28px]">
                Why Should You Buy Our Installation Plans?
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-7 text-white/85 lg:justify-self-end">
              Choosing the right installation plan isn&apos;t just about setup, it&apos;s about peace of mind, performance, and
              long term success. Here&apos;s why our installation plans are the best investment for your product:
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ title, text, Icon }, i) => (
              <li key={title} className="group rounded-xl bg-white p-6 sm:p-8">
                <Icon3D Icon={Icon} index={i} />
                <h3 className="mt-6 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-3 text-[15px] leading-6 text-body">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we need */}
      <section aria-labelledby="need-title" className="container-x py-16 lg:py-20">
        <CenterHeading id="need-title" eyebrow="Before We Started" title="What We Need From You for a Smooth Reskinning Process" />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((n, i) => (
            <li key={n} className="flex items-center gap-4 rounded-xl border border-line p-4 shadow-card">
              <span className="inline-flex h-11 min-w-12 items-center justify-center rounded-lg bg-brand-50 text-lg font-semibold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-semibold text-ink">{n}</span>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-10 max-w-3xl text-center text-[15px] leading-7 text-body">
          After everything, we will provide you with all your original code and keys. You can revoke access rights from your
          original account.
        </p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-center text-[15px] font-medium text-ink">
          Installation and reskinning are subject to
          <Link href="/terms-and-conditions" className="inline-flex items-center gap-1 text-brand-600 underline underline-offset-2">
            Terms and Conditions. <CircleArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </p>
      </section>

      {/* CTA banner */}
      <section aria-labelledby="cta-title" className="container-x pb-16 lg:pb-20">
        <div className="grid overflow-hidden rounded-xl bg-ink md:grid-cols-[1.1fr_1fr]">
          <div className="relative isolate overflow-hidden bg-brand-600 px-6 py-8 md:[clip-path:polygon(0_0,100%_0,92%_100%,0_100%)] md:py-10 md:pr-16 md:pl-8">
            <Image src={ctaImage} alt="" fill quality={60} sizes="(min-width: 768px) 55vw, 100vw" className="-z-20 object-cover" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-700/75" />
            <h2 id="cta-title" className="text-2xl leading-tight font-bold text-white uppercase sm:text-[28px]">
              Ready to start your journey with us?
            </h2>
          </div>
          <div className="flex flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <div className="flex items-center gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <Mail aria-hidden="true" className="size-5" />
              </span>
              <p className="flex flex-col">
                <span className="text-sm text-gray-300">Email Support</span>
                <a href={`mailto:${site.email}`} className="text-lg font-semibold break-all text-white hover:underline">
                  {site.email}
                </a>
              </p>
            </div>
            <Link href="/contact-us" className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-brand-50 sm:self-auto">
              Contact Us <CircleArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={serviceLd} />
    </>
  );
}
