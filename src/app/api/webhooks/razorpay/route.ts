import { NextResponse } from "next/server";
import { orders } from "@/lib/db";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
      secret: webhookSecret,
    });
    if (!isValid) {
      console.warn("[Razorpay Webhook] Invalid webhook signature");
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
    }
  }

  let event: {
    event?: string;
    payload?: {
      order?: { entity?: { id?: string; receipt?: string } };
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          status?: string;
          notes?: { orderId?: string };
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = event.event;
  const paymentEntity = event.payload?.payment?.entity;
  const orderEntity = event.payload?.order?.entity;

  const razorpayOrderId = orderEntity?.id || paymentEntity?.order_id;
  const razorpayPaymentId = paymentEntity?.id;
  const orderId =
    orderEntity?.receipt || paymentEntity?.notes?.orderId;

  if (eventName === "order.paid" || eventName === "payment.captured") {
    let order = orderId ? await orders.findById(orderId) : undefined;
    if (!order && razorpayOrderId) {
      order = await orders.findByRazorpayOrderId(razorpayOrderId);
    }

    if (order && order.status !== "paid") {
      await orders.update(order.id, {
        status: "paid",
        razorpayPaymentId: razorpayPaymentId || order.razorpayPaymentId,
        paidAt: new Date().toISOString(),
      });
      console.info(`[Razorpay Webhook] Order ${order.id} marked as paid via webhook (${eventName})`);
    }
  } else if (eventName === "payment.failed") {
    let order = orderId ? await orders.findById(orderId) : undefined;
    if (!order && razorpayOrderId) {
      order = await orders.findByRazorpayOrderId(razorpayOrderId);
    }
    if (order && order.status === "pending") {
      await orders.update(order.id, { status: "failed" });
      console.info(`[Razorpay Webhook] Order ${order.id} marked as failed via webhook`);
    }
  }

  return NextResponse.json({ status: "ok" });
}

