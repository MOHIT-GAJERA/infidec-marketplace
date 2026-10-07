import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-soft py-24">
      <div className="container-x text-center">
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-ink">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-base text-body">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Explore our products instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-outline px-5 py-3">
            Go Home
          </Link>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}
