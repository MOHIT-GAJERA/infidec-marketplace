import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Infidec Marketplace account password.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: true, follow: true },
};

// Self-service reset needs an email provider; until one is connected, resets are handled by support.
export default function ForgotPasswordPage() {
  return (
    <section className="bg-soft py-12 lg:py-20">
      <div className="container-x flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 text-center shadow-card sm:p-8">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Mail aria-hidden="true" className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-ink">Forgot your password?</h1>
          <p className="mt-3 text-base leading-7 text-body">
            Email our support team from the address you registered with and we&apos;ll help you reset it within one
            business day.
          </p>
          <a href={`mailto:${site.email}?subject=Password%20reset`} className="btn-primary mt-6 w-full py-3 text-base">
            Email {site.email}
          </a>
          <Link href="/?auth=login" className="mt-4 inline-block text-sm font-semibold text-brand-600 underline underline-offset-2">
            Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
