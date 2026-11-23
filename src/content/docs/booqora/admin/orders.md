---
title: Orders
description: The order list and order editor — statuses, rental period, products and availability, deposits, discounts, coupons, taxes, payments, documents and emails.
---

Orders are the heart of Booqora. Every booking, whether you create it in the Rental Platform or a customer places it in the Online Store, is one document in `workspaces/{wid}/orders`. The screens live in `booqora_platform/lib/features/orders/`.

## Order list

**Orders** (`/orders`) shows every order with live availability checks.

![Orders](/docs/booqora/images/platform-orders.webp "Order list with tabs, metrics, filters and status pills")

- **Tabs**: **All**, **Upcoming** (reserved, pickup in the future), **Late** (reserved with pickup in the past, or started with return in the past) and **With shortage** (draft, reserved or started orders that need more units than are available). Each tab shows a count.
- **Metrics** (toggle with **Hide metrics / Show metrics**): Orders, Items ordered, Revenue (reserved, started, returned and archived orders) and Due.
- **Search** by order number, customer name or email.
- **Filters**: Status, Payment status, Pickup date range and Source (*Manual* or *Online store*), each with live counts.
- **Columns**: #, Customer, Status (plus **late** and **shortage** pills), From → Until, Total, Payment and Tags.
- **Bulk actions**: Archive, Cancel, Delete. **Export CSV** downloads the filtered rows.

Online orders without a number are labelled **Web order**.

## Statuses

```text
draft → reserved → started → returned → archived
  └──────┴─→ canceled            (canceled / archived → Restore to draft)
```

| Status | Meaning | Holds stock? |
|---|---|---|
| `draft` | Quote or work in progress. Online Store bookings arrive here | No |
| `reserved` | Confirmed booking; units are blocked for the period | Yes |
| `started` | Items picked up and out with the customer | Yes, until returned |
| `returned` | Items are back | No |
| `archived` | Finished and filed away | No |
| `canceled` | Called off; reserved items are released | No |

The editor header shows the primary next step for the current status: **Reserve** (draft), **Pick up** (reserved), **Return** (started) and **Archive** (returned). The **More actions** menu offers **Revert to draft**, **Undo pick up**, **Undo return**, **Restore to draft**, **Cancel order**, **Duplicate** and **Delete**. Any status other than draft or canceled needs at least one product line.

## Creating an order

:::steps
### Open the editor
Click **Add order** (or **New order** on the dashboard or a customer page). The route is `/orders/new`; from a customer it is `/orders/new?customer=<id>`.

### Choose the customer
**Select customer** searches by name, email or phone, or **New customer** creates one inline. The customer's main address fills the billing address and their default discount is applied. Choose **Pickup** or **Delivery** and a location.

### Set the rental period
Pick **Pickup (From)** and **Return (Until)**. The defaults come from *Settings → Rental period* (09:00 pickup, 17:00 return the next day). The card shows the duration.

### Add products
Type in **Search to add products** to add active products or bundles. Use **Add custom line** for things like a delivery fee. Change quantities with − / +, and click a price to **Override price** (or go back to **Use automatic price**).

### Save or reserve
**Save as draft** keeps the order without blocking stock. **Reserve** checks availability first.
:::

![New order](/docs/booqora/images/platform-order-new.webp "The order editor: customer, rental period, products and summary")

Prices are recalculated whenever the period changes. See [Pricing](doc:admin/pricing) for how a line price is worked out.

## Availability and shortages

Each product line shows a badge: **n available**, **n more available** or a red **Shortage n**. On **Reserve**, Booqora runs the availability check from [Availability](doc:admin/availability). If any product is short and does **not** have *Allow shortage* switched on, a **Not enough stock to reserve** dialog lists the products and the order stays a draft. Reduce quantities, change the period, or allow shortages on the product.

## Summary: discounts, coupons, taxes and deposits

| Row | Source |
|---|---|
| Subtotal | Sum of line totals |
| Discount | **Add a discount** — a percentage, pre-filled from the customer |
| Coupon | **Add a coupon** — validated against active state, dates, usage limit, minimum spend and eligible products ([Coupons](doc:admin/coupons)) |
| Tax | Per line from the product's tax profile; shown as *Tax (included)* when prices include tax ([Taxes & Locations](doc:admin/taxes-locations)) |
| Total incl. taxes | Subtotal − discounts + tax |
| Security deposit | From the customer's deposit rule, or the workspace default |

A coupon set not to stack with customer discounts removes the manual discount. Discounts are spread proportionally over the lines before tax is applied.

## Payments panel

The side panel shows **Paid** and **Due**, the payment status and the latest payments.

- **Add payment** records an amount with a method (**Cash**, **Card**, **Bank transfer**, **UPI**) and a type (**Charge**, **Refund**, **Security deposit**). Security deposits are held separately and do not reduce the amount due.
- **Collect online payment** (shown while something is due) opens a dialog for the configured providers. **Charge now** opens the provider's checkout; **Create link** makes a payment link you can **Copy**, **Open** or **Email to customer**. The order updates automatically once paid. See [Payment Gateways](doc:admin/payment-gateways).

Payment status is `payment_due`, `partially_paid`, `paid` or `overpaid`, recalculated after every payment.

![Order detail](/docs/booqora/images/platform-order.webp "A saved order with payments, documents, email, tags, notes and activity")

## Documents, emails and notes

- **Documents** card: **New quote**, **New contract**, **Packing slip** and **Create invoice** create a document from the order and open it. See [Documents](doc:admin/documents).
- **Email** card: **Send confirmation** sends an order confirmation to the customer's email through the `sendEmail` Cloud Function. If sending fails you can open it in your own mail app. See [Email & SMTP](doc:admin/email-smtp).
- After the first save, **Tags**, **Notes** and the **Activity** log appear in the side panel.

Web orders that are not linked to a customer show **Create customer from order**.

**Next:** [Calendar →](doc:admin/calendar)
