---
title: Orders & Order Flow
description: The unified order list, the order detail page, every order status and who can move it, rider assignment, the delivery OTP, cancellations and invoices.
---

Every order from the website, the Customer app and the POS lands in one collection, `orders`. Admins see all orders; sellers see orders that contain their items; riders see the orders assigned to them.

## Order list

**Admin → Orders → All orders** (`/orders`). Separate views exist for **Self-pickup orders** (`/orders/pickup`) and **POS orders** (`/orders/pos`).

![All orders](/docs/go4market/images/admin-orders.webp "Status tiles, filters (status, payment, method, channel, speed) and the order table")

- Status tiles at the top: New, Processing, On the way, Delivered, Cancelled, Today's sales.
- Filters: status, payment status, payment method, channel (`web`, `app`, `pos`) and **speed** (`standard`, `quick15`, `quick30`, `scheduled`).
- Table or card view, CSV export, and **New POS sale**.

## Order detail

Click an order number to open `/orders/:id`:

- **Items** grouped by seller, with variant, add-ons, price and MRP.
- **Payment**: subtotal, delivery fee, coupon and membership discount, wallet used, tax, total, payable, payment method and status, and cash collected.
- **Customer** and **delivery address** on an OpenStreetMap map, with the distance.
- **Timeline** of every status change with time, actor and note.
- **Actions** for the next step, rider assignment, cancel, **Invoice** (`/print/invoice/:id`, printable).

![Order detail](/docs/go4market/images/admin-order-delivered.webp "A delivered COD order: items, payment, customer, map and the next action")

## Status flow

```text
pending ─(paid)→ placed → confirmed → packed → assigned → picked_up → out_for_delivery → delivered
                                         └─────────── pickup orders: packed → ready_for_pickup → delivered
side exits: cancelled · returned
```

| Status | Meaning | Who moves it here |
|---|---|---|
| `pending` | Waiting for online payment | `placeOrder` (Razorpay, Stripe, PayPal) |
| `placed` | Paid, COD or wallet order received | `placeOrder` / `confirmPayment` |
| `confirmed` | Seller accepted | Seller, admin |
| `packed` | Ready for a rider | Seller, admin. Triggers **auto-assign** if enabled |
| `assigned` | A rider is set | `assignDeliveryPartner` (admin/seller) or `acceptDelivery` (rider) |
| `picked_up` | Rider has the parcel | Rider, admin |
| `out_for_delivery` | On the way; customer gets the OTP | Rider, admin |
| `ready_for_pickup` | Pickup order ready at the store | Seller, admin |
| `delivered` | Handed over. Requires the **delivery OTP** except for admins | Rider (home) / seller (pickup) / admin |
| `cancelled` | Cancelled | Customer before `packed`; seller or admin any time before delivery |
| `returned` | Returned after delivery | Admin via returns |

Every change goes through the `updateOrderStatus` callable, which validates the transition and the actor's role and appends to `timeline`. Sellers move one step at a time; admins may jump forward.

## Assigning a rider

On a `confirmed` or `packed` home-delivery order:

- **Auto-assign nearest online rider** calls `assignDeliveryPartner` with no partner. It picks the nearest approved, online rider who serves the city, trying the seller's own fleet first.
- **Choose rider** lists online riders with distance and cash in hand.
- Riders can also **self-accept** from the delivery pool in the Partner app or Delivery panel (`acceptDelivery`).

![Rider assigned](/docs/go4market/images/admin-order-assigned.webp "After assignment: next step Picked up, or reassign")

## Delivery OTP and cash

Each order has a 4-digit `deliveryOtp`. The customer sees it in the app or website (and by SMS if enabled). The rider must enter it to mark the order delivered; the Partner app never displays it. For COD orders the rider confirms **cash collected**, which creates a `cashCollections` record and increases the rider's `cashInHand`.

## What happens on delivery

`updateOrderStatus` → `delivered` settles the money in one transaction:

- each seller's balance is credited with **gross − commission − their share of seller coupons** (`settlement.sellers`);
- the rider's earnings are credited according to their salary type ([Cash Collection & Salary](doc:admin/cash-salary));
- the referral reward is paid on the customer's first delivered order;
- stats, push, e-mail and SMS go out.

## Cancelling

Cancelling restores stock and the coupon, and refunds the wallet part plus any captured online payment **to the customer's wallet**. Unpaid online orders are auto-cancelled after 30 minutes.

**Next:** [Point of Sale & Barcode →](doc:admin/pos)
