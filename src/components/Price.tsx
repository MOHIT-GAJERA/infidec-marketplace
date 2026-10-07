"use client";

import { useStore } from "./store/StoreProvider";
import { formatPrice } from "@/lib/site";

/**
 * Renders an INR amount in the visitor's chosen currency.
 * Server HTML is always INR (SEO + structured data); USD is applied after hydration.
 */
export function Price({ inr: amount, className }: { inr: number; className?: string }) {
  const { currency } = useStore();
  return <span className={className}>{formatPrice(amount, currency)}</span>;
}
