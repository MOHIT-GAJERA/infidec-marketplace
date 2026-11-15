import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

export function getRazorpayKeyId(): string {
  return (
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    ""
  ).trim();
}

export function getRazorpayKeySecret(): string {
  return (process.env.RAZORPAY_KEY_SECRET || "").trim();
}

export function isRazorpayConfigured(): boolean {
  return Boolean(getRazorpayKeyId() && getRazorpayKeySecret());
}

function getAuthHeader(): string {
  const keyId = getRazorpayKeyId();
  const secret = getRazorpayKeySecret();
  if (!keyId || !secret) {
    throw new Error("Razorpay credentials are not configured on the server.");
  }
  return `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`;
}

export type CreateRazorpayOrderInput = {
  amount: number; // in INR (major units, e.g. 500 for ₹500)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
};

export type RazorpayOrderResponse = {
  id: string;
  entity: "order";
  amount: number; // in paise (minor units)
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
};

/**
 * Creates an order on Razorpay servers.
 * The amount is converted to paise (integer minor units).
 */
export async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt,
  notes = {},
}: CreateRazorpayOrderInput): Promise<RazorpayOrderResponse> {
  const auth = getAuthHeader();
  const amountInPaise = Math.round(amount * 100);

  const res = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt: receipt.slice(0, 40),
      notes,
    }),
  });

  const data = (await res.json()) as RazorpayOrderResponse & {
    error?: { code?: string; description?: string };
  };

  if (!res.ok || data.error) {
    const errorMsg =
      data.error?.description ||
      `Razorpay order creation failed with HTTP ${res.status}.`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Verifies Razorpay checkout HMAC-SHA256 signature for:
 * order_id + "|" + payment_id
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = getRazorpayKeySecret();
  if (!secret || !orderId || !paymentId || !signature) return false;

  const payload = `${orderId}|${paymentId}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const a = Buffer.from(expected, "utf-8");
    const b = Buffer.from(signature, "utf-8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Verifies Razorpay webhook event signature using the webhook secret.
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
  secret = process.env.RAZORPAY_WEBHOOK_SECRET,
}: {
  rawBody: string;
  signature: string;
  secret?: string;
}): boolean {
  if (!secret || !signature || !rawBody) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    const a = Buffer.from(expected, "utf-8");
    const b = Buffer.from(signature, "utf-8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

