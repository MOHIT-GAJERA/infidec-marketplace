"use client";

import { useStore } from "@/components/store/StoreProvider";
import { formatPrice, inr } from "@/lib/site";
import { GST_RATE } from "@/lib/validation";

/** Totals are always charged in INR; USD visitors also see an approximate conversion. */
export function OrderSummary({ subtotal, tax, total, children }: { subtotal: number; tax: number; total: number; children?: React.ReactNode }) {
  const { currency } = useStore();
  return (
    <section aria-labelledby="summary-title" className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 id="summary-title" className="text-lg font-semibold text-ink">
        Order Summary
      </h2>
      <dl className="mt-4 space-y-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-body">Subtotal</dt>
          <dd className="text-ink">{inr(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-body">GST ({Math.round(GST_RATE * 100)}%)</dt>
          <dd className="text-ink">{inr(tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
          <dt className="text-ink">Total</dt>
          <dd className="text-brand-600">{inr(total)}</dd>
        </div>
        {currency === "USD" && (
          <div className="flex justify-between text-sm">
            <dt className="text-body">Approx. in USD</dt>
            <dd className="text-body">≈ {formatPrice(total, "USD")}</dd>
          </div>
        )}
      </dl>
      {currency === "USD" && <p className="mt-2 text-xs leading-5 text-muted">You will be charged in INR. Your bank converts the amount at its own rate.</p>}
      {children}
    </section>
  );
}
