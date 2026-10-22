---
title: Orders
description: Every website, QR table and POS order in one list. Filter, open the detail, move an order through Pending, Preparing, Ready and Completed, or cancel it.
---

**Admin → Orders** (*"Track and manage every order across outlets."*) lists every order, newest first: take-away and dine-in orders from the **website**, **table QR** orders, orders placed in the **mobile app**, and **POS** orders entered by staff.

![Orders](/docs/go4foodie/images/admin-orders.jpg "Admin → Orders")

**Permission:** `manage:orders` (**OWNER**, **MANAGER** and **STAFF**).

## Stats

| Tile | Value |
|---|---|
| **Total Orders** | All orders |
| **Completed** | Status *Completed* |
| **Canceled** | Status *Canceled* |
| **Revenue** | Sum of completed orders' totals |

The tiles always count **all** orders, whatever filters you set.

## Filters

| Filter | Options |
|---|---|
| Status pills | **All, Pending, Preparing, Ready, Completed, Canceled** |
| Channel | **All channels / Online / In-house (POS)** |
| Type | **All types / Dine-in / Delivery / Pick-up** |
| Search | **Search order # or customer…** (order number or customer name) |

## Order list

| Column | Shows |
|---|---|
| **Order** | Order number (e.g. `ORD-48213`) plus badges: **Table N** (dine-in at a table), **Online** (website / app), **Stripe** / **PayPal** / **Razorpay** (paid through a gateway) |
| **Customer** | Name, or *Table N* for POS orders without a guest name |
| **Type** | Dine-in, Delivery or Pick-up |
| **Items** | Total quantity |
| **Total** | Order total |
| **Time** | Placed at, e.g. `7:42 PM` |
| **Status** | Coloured badge |
| **View** | Eye icon. Clicking anywhere on the row opens the detail |

If nothing matches you see *"No orders match your filters."* The footer shows *"Showing X of Y orders."* The list loads when you open the page. Reload it (or switch pages) to see orders placed since.

## Order statuses

| Status | Colour | Meaning |
|---|---|---|
| **Pending** | Grey | Received, not started. Every new order starts here |
| **Preparing** | Amber | Kitchen is cooking |
| **Ready** | Blue | Ready to serve, or ready for pickup |
| **Completed** | Green | Served or collected. Counts as revenue |
| **Canceled** | Red | Will not be fulfilled |

## Order detail

![Order detail](/docs/go4foodie/images/admin-order-detail.jpg "Orders → order detail")

The modal (titled with the order number) shows:

- status badge, **Online** and gateway pills, and the time placed (`Oct 22, 7:42 PM`),
- a **stepper** Pending → Preparing → Ready → Completed. A canceled order shows a red *"This order was canceled."*,
- **Customer**, **Type**, **Table** (if any), **Outlet**, **Payment** (payment method), **Phone** and **Email** (online orders), and **Stripe / PayPal / Razorpay Payment** (the gateway's payment ID, for reconciling),
- for take-away orders, a **SCHEDULED PICKUP** box (*"Fri, Oct 23 · 18:30"*) or **ASAP PICKUP** (*"As soon as possible"*). See [Ordering](doc:web/ordering),
- the customer's **Notes**,
- the **Items** (`2× Truffle Risotto` and line totals) and the **Total**.

## Move an order along

:::steps
### Open the order
Click the row.

### Advance the status
Under **Update status**, click **Mark Preparing**, then **Mark Ready**, then **Mark Completed**. Only the next step is offered, so you can't skip back.

### Or cancel it
**Mark Canceled** (red outline) is available until the order is completed.
:::

Completed and canceled orders are final. The detail then reads *"This order is Completed — no further actions."*

:::note Completion email
When an order is marked **Completed** and it has a customer email (website and app orders), the customer receives the branded **order completed** email with the items and total. POS orders have no email, so nothing is sent. If SMTP isn't configured or the send fails, the status still changes and the failure is only logged. See [SMTP settings](doc:admin/smtp-settings) and [Emails](doc:admin/emails).
:::

:::tip Errors
The status changes on screen immediately. If the server rejects it (for example your session expired), a red toast appears. Reload the page to see the true status.
:::

## Where orders come from

| Source | Channel | Type | Status at creation |
|---|---|---|---|
| Website take-away (Schedule Now / Later) | Online | Pick-up | Pending |
| Website / app table QR (`/order?table=…`) | Online | Dine-in (with **Table N**) | Pending |
| POS **Send to kitchen** / Restaurant App | In-house (POS) | Dine-in | Pending |

Online payments are verified with the gateway before the order is created. See [Payment gateways](doc:admin/payment-gateways). Orders are never deleted from this screen.

**Next:** [Reservations →](doc:admin/reservations)
