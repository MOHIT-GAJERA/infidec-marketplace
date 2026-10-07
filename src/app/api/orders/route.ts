import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { currentUser } from "@/lib/auth";
import { orders, type Order, type OrderItem } from "@/lib/db";
import { priceLine, totals, type License } from "@/lib/pricing";
import { countries, EMAIL_RE, GSTIN_RE, paymentMethods, PHONE_RE, POSTAL_RE } from "@/lib/validation";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  return NextResponse.json({ ok: true, orders: await orders.listByUser(user.id) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in to place an order." }, { status: 401 });

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Items: re-price everything on the server – client prices are never trusted.
  const rawItems = Array.isArray(b.items) ? b.items.slice(0, 20) : [];
  const items: OrderItem[] = [];
  for (const it of rawItems) {
    if (!it || typeof it !== "object") continue;
    const { slug, license, plan } = it as Record<string, unknown>;
    if (typeof slug !== "string" || (license !== "regular" && license !== "extended") || typeof plan !== "string") continue;
    const line = priceLine(slug, license as License, plan);
    if (!line) continue;
    items.push({
      slug,
      name: line.product.title,
      license: license as License,
      plan,
      planName: line.plan?.name,
      licensePrice: line.licensePrice,
      planPrice: line.planPrice,
      total: line.total,
    });
  }
  if (!items.length) return NextResponse.json({ ok: false, error: "Your cart is empty." }, { status: 422 });

  const bill = (b.billing ?? {}) as Record<string, unknown>;
  const s = (k: string, max = 120) => (typeof bill[k] === "string" ? (bill[k] as string).trim().slice(0, max) : "");
  const billing = {
    fullName: s("fullName", 100),
    email: s("email").toLowerCase(),
    phone: s("phone", 20).replace(/[\s-]/g, ""),
    company: s("company", 100) || undefined,
    gstin: s("gstin", 15).toUpperCase() || undefined,
    address: s("address", 200),
    city: s("city", 60),
    state: s("state", 60),
    postalCode: s("postalCode", 10),
    country: s("country", 60),
  };

  const errors: Record<string, string> = {};
  if (billing.fullName.length < 2) errors.fullName = "Enter your full name.";
  if (!EMAIL_RE.test(billing.email)) errors.email = "Enter a valid email.";
  if (!PHONE_RE.test(billing.phone)) errors.phone = "Enter a valid phone number.";
  if (billing.gstin && !GSTIN_RE.test(billing.gstin)) errors.gstin = "Enter a valid 15-character GSTIN.";
  if (billing.address.length < 5) errors.address = "Enter your street address.";
  if (billing.city.length < 2) errors.city = "Enter your city.";
  if (billing.state.length < 2) errors.state = "Enter your state.";
  if (!POSTAL_RE.test(billing.postalCode)) errors.postalCode = "Enter a valid PIN / postal code.";
  if (!countries.includes(billing.country)) errors.country = "Choose your country.";
  const paymentMethod = typeof b.paymentMethod === "string" ? b.paymentMethod : "";
  if (!paymentMethods.some((m) => m.key === paymentMethod)) errors.paymentMethod = "Choose a payment method.";
  if (b.acceptTerms !== true) errors.acceptTerms = "Please accept the license terms.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please fix the highlighted fields.", errors }, { status: 422 });
  }

  const t = totals(items.reduce((sum, i) => sum + i.total, 0));
  const order: Order = {
    id: `BOW-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`,
    userId: user.id,
    items,
    ...t,
    currency: "INR",
    paymentMethod,
    // TODO: create a Razorpay/Stripe order here and mark as paid from the gateway webhook.
    status: "paid",
    billing,
    createdAt: new Date().toISOString(),
  };
  await orders.create(order);
  return NextResponse.json({ ok: true, orderId: order.id });
}
