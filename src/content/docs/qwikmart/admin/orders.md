---
title: Orders & Order Flow
description: Order statuses, how an order moves from placement to delivery, rider assignment, cancellations, self-pickup and invoices.
---

**Admin → Orders** lists every order with filters (status, store, zone, payment method, payment status, delivery type, date) and search by order number, customer or phone. The list updates live.

![Orders](/docs/qwikmart/images/admin-orders.jpg "Admin → Orders")

## Order statuses

| Status | Meaning |
|---|---|
| **Payment Pending** | Online payment not completed yet |
| **Received** | Order placed (COD / wallet) or payment confirmed |
| **Processed** | Store is picking and packing |
| **Shipped** | eCommerce order handed to the courier / rider |
| **Ready for Pickup** | Packed and waiting for the rider (or the customer, for self-pickup) |
| **Picked Up** | Rider collected the order from the store |
| **Out for Delivery** | Rider is on the way — customer sees live tracking |
| **Delivered** | Delivered with the customer's OTP |
| **Cancelled** | Cancelled by the customer, the store or an admin |
| **Returned** | Delivered order returned (see [Returns](doc:admin/returns)) |

## Typical quick-commerce flow

:::steps
### Placed
The customer places the order. The server checks stock, prices, coupon and delivery fee, reserves stock and generates the **delivery OTP**. Status: *Received* (or *Payment Pending* for online payment until verified).

### Assigned
With **auto-assign** on, the nearest online rider of the zone is assigned immediately. Otherwise open the order → **Assign delivery boy**, or let riders accept it from their *Available* list.

### Packed
The store marks it *Processed* → *Ready for Pickup*.

### Picked up & out for delivery
The rider updates the status in the Delivery Boy app; the customer sees the rider on the map.

### Delivered
The rider enters the customer's OTP (and confirms cash collected for COD). Rider commission and cash-in-hand are recorded automatically; sales statistics update.
:::

## Order detail

![Order detail](/docs/qwikmart/images/admin-order-detail.jpg "Order detail: items, bill, customer, rider, timeline")

From an order you can:

- change the **status** (only valid next steps are offered),
- **assign / change the delivery boy**,
- view the **delivery OTP** (for support calls),
- edit the **payment status** (e.g. mark a bank transfer as paid),
- **message the customer** (opens a support chat),
- print or download the **invoice**,
- **delete** a cancelled or payment-pending order.

## Cancellations and refunds

- Customers can cancel while the order is *Payment Pending*, *Received* or *Processed* (unless a product is marked non-cancellable).
- Cancelling restocks the items. Amounts paid online or from the wallet are **refunded to the customer's wallet** instantly.

## Self Pickup

**Self Pickup** lists orders the customer collects at the store. Mark them *Ready for Pickup*, then *Delivered* when collected.

## Store panel

Store owners see and process only their own store's orders in the [Store Panel](doc:admin/store-panel).
