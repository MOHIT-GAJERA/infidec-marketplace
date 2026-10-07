import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/Faq";
import { allFaqs } from "@/data/content";

export const metadata: Metadata = {
  title: "FAQs – Source Code, Licenses, Installation & Support",
  description:
    "Answers to common questions about Infidec Marketplace app source code, regular vs extended licenses, installation services, refunds, payments and support.",
  alternates: { canonical: "/faqs" },
  openGraph: { url: "/faqs" },
};

export default function FaqsPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/faqs", label: "FAQs" },
        ]}
        title="Frequently Asked Questions"
        description="Everything you need to know about our products, licences, installation services and support."
      />
      <section aria-labelledby="all-q" className="container-x max-w-5xl py-12 lg:py-16">
        <h2 id="all-q" className="sr-only">All questions</h2>
        <Faq items={allFaqs} />
        <p className="mt-10 text-center text-base text-body">
          Still have questions?{" "}
          <Link href="/contact-us" className="font-semibold text-brand-600 underline underline-offset-2">
            Contact our support team
          </Link>
        </p>
      </section>
    </>
  );
}
