---
title: Cash Collection & Salary
description: Track COD cash held by riders, settle it, and pay riders per order or monthly with per-km and delivery-fee bonuses.
---

## Cash collection (COD)

When a rider delivers a **Cash on Delivery** order and confirms *Cash collected*, Go4Market:

- creates a `cashCollections` record (`deliveryPartnerId`, `orderId`, `amount`, status `collected`);
- increases the rider's `cashInHand`;
- stores `cashCollected` on the order.

**Admin → Delivery → Cash collection** (`/delivery/cash`):

![Cash collection](/docs/go4market/images/admin-cash-collection.webp "Cash with riders, riders holding cash, largest balance, riders to settle and the collection ledger")

- **Riders to settle**: each rider with cash in hand. Click **Settle**, enter the amount deposited and an optional note. This calls `settleCash`, which reduces `cashInHand`, writes a `cashSettlements` record and notifies the rider.
- **Collection ledger**: every collection with order, amount, status and dates.

A seller can settle the cash of riders in **their own fleet** from the Seller panel.

:::tip Settle daily
Ask riders to deposit cash at the end of each shift and settle it the same day. The *Largest balance* tile shows who is carrying the most cash.
:::

## Rider pay

Pay is set per rider (`deliveryPartners.salary`) or falls back to the platform default (`settings/platform.riderPay`, edited in **Delivery → Delivery settings**):

| Type | How it is paid |
|---|---|
| `per_order` | On every delivered order: `amount + perKm × distanceKm + bonusPct % × deliveryFee`, credited to the rider's balance |
| `monthly` | `runMonthlySalaries` credits the monthly `amount` on the **1st of each month at 09:00 IST** |

A rider's own `salary.type` and `amount` override the default. The per-km and bonus % come from `riderPay`.

## Salary page

**Admin → Delivery → Salary** (`/delivery/salary`) lists riders with their salary type, amount, earnings this month and balance. Edit a rider's salary here, or pay a one-off bonus with a **fund transfer** of type *credit* ([Finance](doc:admin/finance#fund-transfers)).

Riders withdraw their earnings through withdrawal requests, like sellers.

**Next:** [Customers & Product Requests →](doc:admin/customers)
