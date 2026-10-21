---
title: Delivery Workflow & OTP
description: From a new order alert to a completed delivery — what the rider does and what happens on the server.
---

![Orders](/docs/qwikmart/images/app-delivery-orders.webp "Available and active orders")
![Workflow](/docs/qwikmart/images/app-delivery-workflow.webp "Order workflow")
![OTP](/docs/qwikmart/images/app-delivery-otp.webp "Delivery OTP")

## Order lists

| Tab | Shows |
|---|---|
| **Available** | Unassigned orders of the rider's zone (received / processed / ready for pickup) — hidden after the rider rejects one |
| **Active** | Orders assigned to the rider that are not finished |
| **History** | Delivered, cancelled and returned orders |

All lists update in real time; a push notification announces new orders.

## Steps on the order screen

:::steps
### Accept Order
`acceptOrder` assigns the order to the rider (or **Reject** to pass it on). With auto-assign on, orders arrive already assigned.

### Mark as Picked Up
At the store. The order screen shows the store address with a **Navigate** button (opens Google Maps / the phone's map app).

### Out for Delivery
The customer now sees live tracking and the rider's name and phone.

### Deliver Order
Ask the customer for the **6-digit delivery OTP** (shown only in the customer's app) and enter it. For COD orders the rider also confirms *"I have collected ₹X"*. `deliverOrder` verifies the OTP, marks the order *Delivered* and records commission and cash.
:::

:::note OTP can be switched off
Admin → System Settings → Delivery → *Delivery OTP required*. Keep it on to prevent false "not delivered" claims.
:::

## Return pickups

Approved returns assigned to the rider appear under **Returns**; the rider collects the item and taps **Picked up**.

## Invoice

Each order has an in-app invoice and an **Open PDF** button (`getInvoiceUrl`).

**Next:** [Earnings, Cash & Wallet →](doc:app-delivery/earnings)
