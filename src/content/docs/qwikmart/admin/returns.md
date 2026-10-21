---
title: Returns & Refunds
description: Review return requests, schedule rider pickups and refund to the wallet or the original payment method.
---

Customers request a return from a delivered order (**My Orders → order → Return**) within the product's **return window**, choosing the item, quantity and reason and adding photos.

![Return requests](/docs/qwikmart/images/admin-returns.jpg "Admin → Return Requests")

## Return statuses

| Status | Meaning |
|---|---|
| **Pending** | Waiting for your review |
| **Approved** | Accepted — schedule a pickup |
| **Rejected** | Declined with a remark (customer sees it) |
| **Pickup Assigned** | A rider will collect the item |
| **Picked Up** | Item collected and restocked |
| **Refund Completed** | Money refunded |

## Process a return

:::steps
### Review
Open the request, check the photos and reason. **Approve** or **Reject** (with remark).

### Pickup
Assign a delivery boy. The rider sees the pickup in the app and marks it **Picked up** — stock is added back.

### Refund
Choose the **refund method** — *Wallet* (instant) or *Original payment* — and the amount (defaults to the item price × quantity). Complete the refund.
:::

:::note Refund to original payment
QwikMart records the refund, but the money must be returned in your gateway dashboard (e.g. Razorpay → Payments → Refund). Wallet refunds are instant and fully automatic.
:::

Pending or rejected requests can be deleted. The **Return Pickups** menu lists all pickups assigned to riders.
