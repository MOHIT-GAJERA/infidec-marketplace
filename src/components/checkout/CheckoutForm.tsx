"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Info, LoaderCircle, Lock, ShoppingCart } from "lucide-react";
import { Field, fieldClass } from "@/components/forms/Field";
import { useStore } from "@/components/store/StoreProvider";
import { OrderSummary } from "./OrderSummary";
import { useCartLines } from "./CartView";
import { inr } from "@/lib/site";
import { countries, EMAIL_RE, GSTIN_RE, indianStates, paymentMethods, PHONE_RE, POSTAL_RE } from "@/lib/validation";

type Billing = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const empty: Billing = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  gstin: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const DEMO_PAYMENTS = process.env.NEXT_PUBLIC_PAYMENT_MODE !== "live";

function validate(b: Billing, payment: string, terms: boolean) {
  const e: Record<string, string> = {};
  if (b.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!EMAIL_RE.test(b.email.trim())) e.email = "Enter a valid email.";
  if (!PHONE_RE.test(b.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid phone number.";
  if (b.gstin && !GSTIN_RE.test(b.gstin.trim().toUpperCase())) e.gstin = "Enter a valid 15-character GSTIN.";
  if (b.address.trim().length < 5) e.address = "Enter your street address.";
  if (b.city.trim().length < 2) e.city = "Enter your city.";
  if (b.state.trim().length < 2) e.state = "Enter your state.";
  if (!POSTAL_RE.test(b.postalCode.trim())) e.postalCode = "Enter a valid PIN / postal code.";
  if (!b.country) e.country = "Choose your country.";
  if (!payment) e.paymentMethod = "Choose a payment method.";
  if (!terms) e.acceptTerms = "Please accept the license terms.";
  return e;
}

export function CheckoutForm() {
  const router = useRouter();
  const { ready, cart, clearCart } = useStore();
  const { lines, subtotal, tax, total } = useCartLines();
  const [b, setB] = useState<Billing>(empty);
  const [payment, setPayment] = useState("upi");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  // Pre-fill billing details from the signed-in account.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ user }) => {
        if (cancelled) return;
        if (!user) {
          router.replace("/?auth=login&next=%2Fcheckout");
          return;
        }
        setB((prev) => ({
          ...prev,
          fullName: prev.fullName || `${user.firstName} ${user.lastName}`.trim(),
          email: prev.email || user.email,
          phone: prev.phone || user.phone,
          company: prev.company || user.company || "",
          country: user.country || prev.country,
        }));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [router]);

  const set = (k: keyof Billing, v: string) => {
    setB((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
    if (formError) setFormError("");
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(b, payment, terms);
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ slug, license, plan }) => ({ slug, license, plan })),
          billing: b,
          paymentMethod: payment,
          acceptTerms: terms,
        }),
      });
      const json = (await res.json()) as { ok: boolean; orderId?: string; error?: string; errors?: Record<string, string> };
      if (res.status === 401) {
        router.replace("/?auth=login&next=%2Fcheckout");
        return;
      }
      if (!res.ok || !json.ok || !json.orderId) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error || "Could not place your order. Please try again.");
      }
      clearCart();
      router.push(`/order-success?id=${encodeURIComponent(json.orderId)}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not place your order. Please try again.");
      setBusy(false);
    }
  }

  if (ready && !lines.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <ShoppingCart aria-hidden="true" className="mx-auto size-12 text-brand-600" strokeWidth={1.5} />
        <p className="mt-4 text-xl font-semibold text-ink">Nothing to check out</p>
        <p className="mt-2 text-body">Your cart is empty.</p>
        <Link href="/products" className="btn-primary mt-6">
          Browse Products <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    );
  }

  const isIndia = b.country === "India";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
      <div className="space-y-6">
        <section aria-labelledby="billing-title" className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 id="billing-title" className="text-lg font-semibold text-ink">
            Billing Details
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required error={errors.fullName}>
              {(a) => <input {...a} autoComplete="name" value={b.fullName} onChange={(e) => set("fullName", e.target.value)} className={fieldClass(errors.fullName)} />}
            </Field>
            <Field label="Email" required error={errors.email}>
              {(a) => <input {...a} type="email" autoComplete="email" value={b.email} onChange={(e) => set("email", e.target.value)} className={fieldClass(errors.email)} />}
            </Field>
            <Field label="Phone" required error={errors.phone}>
              {(a) => <input {...a} type="tel" inputMode="tel" autoComplete="tel" value={b.phone} onChange={(e) => set("phone", e.target.value)} className={fieldClass(errors.phone)} />}
            </Field>
            <Field label="Company" hint="Optional">
              {(a) => <input {...a} autoComplete="organization" value={b.company} onChange={(e) => set("company", e.target.value)} className="field" />}
            </Field>
            <Field label="GSTIN" hint="Optional – for a GST invoice" error={errors.gstin} className="sm:col-span-2">
              {(a) => (
                <input
                  {...a}
                  value={b.gstin}
                  onChange={(e) => set("gstin", e.target.value.toUpperCase())}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  className={fieldClass(errors.gstin)}
                />
              )}
            </Field>
            <Field label="Street Address" required error={errors.address} className="sm:col-span-2">
              {(a) => (
                <input {...a} autoComplete="street-address" value={b.address} onChange={(e) => set("address", e.target.value)} placeholder="House / flat no., street, area" className={fieldClass(errors.address)} />
              )}
            </Field>
            <Field label="City" required error={errors.city}>
              {(a) => <input {...a} autoComplete="address-level2" value={b.city} onChange={(e) => set("city", e.target.value)} className={fieldClass(errors.city)} />}
            </Field>
            <Field label="State / Region" required error={errors.state}>
              {(a) =>
                isIndia ? (
                  <select {...a} autoComplete="address-level1" value={b.state} onChange={(e) => set("state", e.target.value)} className={fieldClass(errors.state)}>
                    <option value="">Select state</option>
                    {indianStates.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <input {...a} autoComplete="address-level1" value={b.state} onChange={(e) => set("state", e.target.value)} className={fieldClass(errors.state)} />
                )
              }
            </Field>
            <Field label={isIndia ? "PIN Code" : "Postal Code"} required error={errors.postalCode}>
              {(a) => <input {...a} inputMode={isIndia ? "numeric" : "text"} autoComplete="postal-code" value={b.postalCode} onChange={(e) => set("postalCode", e.target.value)} className={fieldClass(errors.postalCode)} />}
            </Field>
            <Field label="Country" required error={errors.country}>
              {(a) => (
                <select
                  {...a}
                  autoComplete="country-name"
                  value={b.country}
                  onChange={(e) => {
                    set("country", e.target.value);
                    set("state", "");
                  }}
                  className={fieldClass(errors.country)}
                >
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </section>

        <section aria-labelledby="payment-title" className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 id="payment-title" className="text-lg font-semibold text-ink">
            Payment Method
          </h2>
          <fieldset className="mt-4 grid gap-3 sm:grid-cols-2" aria-describedby={errors.paymentMethod ? "pay-err" : undefined}>
            <legend className="sr-only">Choose a payment method</legend>
            {paymentMethods.map((m) => (
              <label
                key={m.key}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${payment === m.key ? "border-brand-600 bg-brand-50" : "border-line hover:border-brand-300"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.key}
                  checked={payment === m.key}
                  onChange={() => setPayment(m.key)}
                  className="mt-0.5 size-5 shrink-0 accent-brand-600"
                />
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{m.label}</span>
                  <span className="block text-sm text-body">{m.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
          {errors.paymentMethod && (
            <p id="pay-err" className="mt-2 text-sm text-red-700">
              {errors.paymentMethod}
            </p>
          )}
          <p className="mt-4 flex items-start gap-2 text-sm text-body">
            <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-600" />
            Payments are processed securely by our payment partner. We never store your card or bank details.
          </p>
          {DEMO_PAYMENTS && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-accent-50 px-4 py-3 text-sm text-accent-700">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              Demo mode: no real payment is taken. Orders are confirmed immediately so you can test the full flow.
            </p>
          )}
        </section>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24">
        <section aria-labelledby="items-title" className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 id="items-title" className="text-lg font-semibold text-ink">
            Your Items ({lines.length})
          </h2>
          <ul className="mt-4 space-y-3">
            {lines.map(({ item, line }) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="line-clamp-1 font-medium text-ink">{line.product.name}</span>
                  <span className="block text-body">
                    {item.license === "extended" ? "Extended" : "Regular"} license
                    {line.plan ? ` + ${line.plan.name} installation` : ""}
                  </span>
                </span>
                <span className="shrink-0 font-medium text-ink">{inr(line.total)}</span>
              </li>
            ))}
          </ul>
          <Link href="/cart" className="mt-3 inline-block text-sm font-medium text-brand-600 underline underline-offset-2">
            Edit cart
          </Link>
        </section>

        <OrderSummary subtotal={subtotal} tax={tax} total={total}>
          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  if (errors.acceptTerms) setErrors((p) => ({ ...p, acceptTerms: "" }));
                }}
                aria-invalid={errors.acceptTerms ? true : undefined}
                aria-describedby={errors.acceptTerms ? "co-terms-err" : undefined}
                className="mt-0.5 size-4 shrink-0 accent-brand-600"
              />
              <span>
                I agree to the{" "}
                <Link href="/license-terms" target="_blank" className="font-medium text-brand-600 underline underline-offset-2">
                  License Terms
                </Link>{" "}
                and{" "}
                <Link href="/refund-policy" target="_blank" className="font-medium text-brand-600 underline underline-offset-2">
                  Refund Policy
                </Link>
                .
              </span>
            </label>
            {errors.acceptTerms && (
              <p id="co-terms-err" className="mt-1.5 text-sm text-red-700">
                {errors.acceptTerms}
              </p>
            )}
          </div>
          {formError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {formError}
            </p>
          )}
          <button type="submit" disabled={busy || !ready} className="btn-dark mt-5 w-full py-3 text-base disabled:opacity-70">
            {busy ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> : <Lock aria-hidden="true" className="size-5" />}
            {busy ? "Placing order…" : `Pay ${inr(total)}`}
          </button>
        </OrderSummary>
      </div>
    </form>
  );
}
