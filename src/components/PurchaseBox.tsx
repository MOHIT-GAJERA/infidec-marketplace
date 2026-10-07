"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircleHelp, Check, ShoppingCart } from "lucide-react";
import { plans } from "@/data/installation";
import { formatPrice } from "@/lib/site";
import { Price } from "./Price";
import { useStore } from "./store/StoreProvider";
import { PENDING_KEY } from "./store/pending";
import { useAuthDialog } from "./auth/AuthDialog";

type Props = { slug: string; name: string; title: string; image?: string; price: number; oldPrice?: number; extendedPrice: number };

export function PurchaseBox({ slug, name, title, image, price, oldPrice, extendedPrice }: Props) {
  const router = useRouter();
  const { openAuth } = useAuthDialog();
  const { ready, userName, addToCart, currency } = useStore();
  const [license, setLicense] = useState<"regular" | "extended">("regular");
  const [plan, setPlan] = useState("none");
  const [added, setAdded] = useState<false | "added" | "exists">(false);
  const [busy, setBusy] = useState(false);

  const act = (action: "cart" | "buy") => {
    const item = { slug, name: title, image, license, plan };
    if (!userName) {
      // Remember the selection; it is added to the cart automatically right after login/registration.
      try {
        sessionStorage.setItem(PENDING_KEY, JSON.stringify(item));
      } catch {
        /* ignore */
      }
      const next = action === "buy" ? "/checkout" : `/products/${slug}`;
      openAuth({ mode: "login", next, reason: action });
      return;
    }
    setBusy(true);
    const result = addToCart(item);
    if (action === "buy") {
      router.push("/checkout");
    } else {
      setAdded(result);
      setBusy(false);
    }
  };

  const planPrice = plans.find((p) => p.key === plan)?.price ?? 0;
  const total = (license === "regular" ? price : extendedPrice) + planPrice;

  const option = (key: "regular" | "extended", title: string, desc: string, amount: number, strike?: number) => {
    const active = license === key;
    return (
      <label
        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
          active ? "border-brand-600 bg-brand-50" : "border-line hover:border-brand-300"
        }`}
      >
        <input
          type="radio"
          name="license"
          value={key}
          checked={active}
          onChange={() => {
            setLicense(key);
            setAdded(false);
          }}
          className="mt-0.5 size-5 shrink-0 accent-brand-600"
        />
        <span className="flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[15px] font-semibold text-ink">{title}</span>
            <span className="flex items-baseline gap-2">
              {strike && (
                <s className="text-sm text-muted">
                  <Price inr={strike} />
                </s>
              )}
              <Price inr={amount} className="text-lg font-semibold text-ink" />
            </span>
          </span>
          <span className="mt-1.5 block text-sm leading-5 text-body">{desc}</span>
        </span>
      </label>
    );
  };

  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-center justify-between">
            <p id="license-legend" className="text-[15px] font-medium text-ink">
              Choose License Method
            </p>
            <Link href="#license" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              See Difference <CircleHelp aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <fieldset aria-labelledby="license-legend" className="mt-3 space-y-3">
            {option("regular", "Regular License", "Full source code with everything you need to build your project.", price, oldPrice)}
            {option(
              "extended",
              "Extended License",
              "Full source code with complete setup, configuration, and live deployment.",
              extendedPrice,
            )}
          </fieldset>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="install-plan" className="text-[15px] font-medium text-ink">
              Choose Installation Plans
            </label>
            <Link href="/installation" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              See Plans <CircleHelp aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <select
            id="install-plan"
            value={plan}
            onChange={(e) => {
              setPlan(e.target.value);
              setAdded(false);
            }}
            className="field mt-2 py-2.5 text-sm"
          >
            <option value="none">No Installation Service</option>
            {plans.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name} – {formatPrice(p.price, currency)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 border-t border-line p-5">
        <p className="flex items-center justify-between">
          <span className="text-base font-semibold text-ink">Order Total:</span>
          <output aria-live="polite" className="text-2xl font-semibold text-brand-600">
            <Price inr={total} />
          </output>
        </p>
        {added ? (
          <div className="flex gap-2">
            <p role="status" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-50 py-3 text-sm font-semibold text-brand-800">
              <Check aria-hidden="true" className="size-5" /> {added === "exists" ? "Already in cart" : "Added to cart"}
            </p>
            <Link href="/cart" prefetch={false} className="btn-outline flex-1 py-3 text-base">
              View Cart
            </Link>
          </div>
        ) : (
          <button type="button" onClick={() => act("cart")} disabled={busy} className="btn-outline w-full py-3 text-base disabled:opacity-60">
            <ShoppingCart aria-hidden="true" className="size-5" />
            Add to Cart
          </button>
        )}
        <button type="button" onClick={() => act("buy")} disabled={busy} className="btn-dark w-full py-3 text-base disabled:opacity-60">
          Buy {name} Now
        </button>
        {!userName && ready && (
          <p className="text-center text-sm text-body">
            <button type="button" onClick={() => openAuth({ mode: "login" })} className="font-semibold text-brand-600 underline underline-offset-2">
              Log in
            </button>{" "}
            or{" "}
            <button type="button" onClick={() => openAuth({ mode: "register" })} className="font-semibold text-brand-600 underline underline-offset-2">
              create an account
            </button>{" "}
            to purchase.
          </p>
        )}
        <p className="text-center text-sm leading-5 text-muted">
          Secure Checkout processed via Card / UPI / Stripe / Razorpay
        </p>
      </div>
    </div>
  );
}
