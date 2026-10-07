import { getProduct, type Product } from "@/data/products";
import { plans } from "@/data/installation";
import { GST_RATE } from "./validation";

export type License = "regular" | "extended";

export const extendedPriceOf = (p: Pick<Product, "price">) => Math.round((p.price * 41.6) / 100) * 100 - 1;

/** Single source of truth for what a cart line costs. Returns null for unknown products/plans. */
export function priceLine(slug: string, license: License, planKey: string) {
  const p = getProduct(slug);
  if (!p) return null;
  const plan = planKey === "none" ? undefined : plans.find((x) => x.key === planKey);
  if (planKey !== "none" && !plan) return null;
  const licensePrice = license === "extended" ? extendedPriceOf(p) : p.price;
  const planPrice = plan?.price ?? 0;
  return { product: p, plan, licensePrice, planPrice, total: licensePrice + planPrice };
}

export function totals(subtotal: number) {
  const tax = Math.round(subtotal * GST_RATE);
  return { subtotal, tax, total: subtotal + tax };
}
