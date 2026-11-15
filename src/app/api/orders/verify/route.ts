import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { orders } from "@/lib/db";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  }

  let body: {
    orderId?: unknown;
    razorpayOrderId?: unknown;
    razorpayPaymentId?: unknown;
    razorpaySignature?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON request." }, { status: 400 });
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const razorpayOrderId = typeof body.razorpayOrderId === "string" ? body.razorpayOrderId.trim() : "";
  const razorpayPaymentId = typeof body.razorpayPaymentId === "string" ? body.razorpayPaymentId.trim() : "";
  const razorpaySignature = typeof body.razorpaySignature === "string" ? body.razorpaySignature.trim() : "";

  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json(
      { ok: false, error: "Missing required payment verification details." },
      { status: 400 }
    );
  }

  const order = await orders.findForUser(orderId, user.id);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }

  // Already marked as paid (e.g. from webhook or previous call)
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, orderId: order.id });
  }

  // Verify that the Razorpay order ID matches what was created for this order
  if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
    return NextResponse.json(
      { ok: false, error: "Order ID mismatch." },
      { status: 400 }
    );
  }

  const isValid = verifyRazorpayPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    await orders.update(order.id, { status: "failed" });
    return NextResponse.json(
      { ok: false, error: "Payment verification failed. Invalid signature." },
      { status: 400 }
    );
  }

  await orders.update(order.id, {
    status: "paid",
    razorpayPaymentId,
    razorpaySignature,
    paidAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}

