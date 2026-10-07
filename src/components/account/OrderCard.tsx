import Link from "next/link";
import { Download } from "lucide-react";
import type { Order } from "@/lib/db";
import { paymentMethods } from "@/lib/validation";
import { inr } from "@/lib/site";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

export function OrderCard({ order, headingLevel = "h3" }: { order: Order; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-gray-50 px-5 py-4">
        <div>
          <H className="text-base font-semibold text-ink">Order {order.id}</H>
          <p className="text-sm text-body">{formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${order.status === "paid" ? "bg-brand-50 text-brand-800" : "bg-accent-50 text-accent-700"}`}
        >
          {order.status}
        </span>
      </div>
      <ul className="divide-y divide-line">
        {order.items.map((it) => (
          <li key={`${it.slug}-${it.license}-${it.plan}`} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <Link href={`/products/${it.slug}`} className="font-medium text-ink hover:text-brand-600">
                {it.name}
              </Link>
              <p className="text-sm text-body">
                {it.license === "extended" ? "Extended" : "Regular"} license
                {it.planName ? ` + ${it.planName} installation` : ""}
              </p>
              {order.status === "paid" && (
                <Link
                  href="/documentation"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 underline underline-offset-2"
                >
                  <Download aria-hidden="true" className="size-4" /> Download &amp; setup guide
                </Link>
              )}
            </div>
            <p className="font-semibold text-ink">{inr(it.total)}</p>
          </li>
        ))}
      </ul>
      <dl className="grid gap-2 border-t border-line px-5 py-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-body">Subtotal</dt>
          <dd className="font-medium text-ink">{inr(order.subtotal)}</dd>
        </div>
        <div>
          <dt className="text-body">GST</dt>
          <dd className="font-medium text-ink">{inr(order.tax)}</dd>
        </div>
        <div>
          <dt className="text-body">Total paid</dt>
          <dd className="font-semibold text-brand-600">{inr(order.total)}</dd>
        </div>
        <div>
          <dt className="text-body">Payment</dt>
          <dd className="font-medium text-ink">{paymentMethods.find((m) => m.key === order.paymentMethod)?.label ?? order.paymentMethod}</dd>
        </div>
      </dl>
    </article>
  );
}
