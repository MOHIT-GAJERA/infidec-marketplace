"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LoaderCircle, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "@/components/store/StoreProvider";
import { OrderSummary } from "./OrderSummary";
import { priceLine, totals } from "@/lib/pricing";
import { Price } from "@/components/Price";

export function useCartLines() {
  const { cart } = useStore();
  const lines = cart
    .map((item) => ({ item, line: priceLine(item.slug, item.license, item.plan) }))
    .filter((x): x is { item: (typeof cart)[number]; line: NonNullable<ReturnType<typeof priceLine>> } => !!x.line);
  return { lines, ...totals(lines.reduce((s, x) => s + x.line.total, 0)) };
}

export function CartView() {
  const { ready, removeFromCart } = useStore();
  const { lines, subtotal, tax, total } = useCartLines();

  if (!ready) {
    return (
      <p className="flex items-center justify-center gap-2 py-20 text-body">
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> Loading your cart…
      </p>
    );
  }

  if (!lines.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <ShoppingCart aria-hidden="true" className="mx-auto size-12 text-brand-600" strokeWidth={1.5} />
        <p className="mt-4 text-xl font-semibold text-ink">Your cart is empty</p>
        <p className="mt-2 text-body">Browse our ready-made apps and product kits to get started.</p>
        <Link href="/products" className="btn-primary mt-6">
          Browse Products <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <section aria-labelledby="cart-items" className="rounded-2xl border border-line bg-white">
        <h2 id="cart-items" className="border-b border-line px-5 py-4 text-lg font-semibold text-ink">
          {lines.length} item{lines.length > 1 ? "s" : ""} in your cart
        </h2>
        <ul className="divide-y divide-line">
          {lines.map(({ item, line }) => (
            <li key={item.id} className="flex gap-4 p-5">
              <div className="relative hidden aspect-[16/9] w-36 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                <Image
                  src={line.product.image ?? `/thumbs/${line.product.slug}.svg`}
                  alt=""
                  fill
                  quality={60}
                  sizes="144px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${line.product.slug}`} className="line-clamp-2 font-semibold text-ink hover:text-brand-600">
                  {line.product.title}
                </Link>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-body">{item.license === "extended" ? "Extended License" : "Regular License"}</dt>
                    <dd className="text-ink">
                      <Price inr={line.licensePrice} />
                    </dd>
                  </div>
                  {line.plan && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-body">{line.plan.name} Installation</dt>
                      <dd className="text-ink">
                        <Price inr={line.planPrice} />
                      </dd>
                    </div>
                  )}
                </dl>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-md py-1 text-sm font-medium text-red-700 hover:underline"
                  >
                    <Trash2 aria-hidden="true" className="size-4" /> Remove
                    <span className="sr-only"> {line.product.name}</span>
                  </button>
                  <p className="text-lg font-semibold text-ink">
                    <Price inr={line.total} />
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-4 lg:sticky lg:top-24">
        <OrderSummary subtotal={subtotal} tax={tax} total={total}>
          <Link href="/checkout" prefetch={false} className="btn-dark mt-5 w-full py-3 text-base">
            Proceed to Checkout <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
          <Link href="/products" className="mt-3 block text-center text-sm font-medium text-brand-600 underline underline-offset-2">
            Continue shopping
          </Link>
        </OrderSummary>
        <p className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
          <ShieldCheck aria-hidden="true" className="size-5 shrink-0" /> Secure checkout · Instant download after payment
        </p>
      </div>
    </div>
  );
}
