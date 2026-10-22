---
title: Transactions
description: One read-only payments feed across online orders, gift-card purchases and POS table payments, with gateway totals, filters and CSV export.
---

**Admin → Transactions** (*"Payments across orders, gift cards & tables."*) brings every payment into one list, newest first. Use it to reconcile your gateway payouts and your cash drawer. The page is **read-only**.

![Transactions](/docs/go4foodie/images/admin-transactions.jpg "Admin → Transactions")

**Permission:** `view:reports` (**OWNER** and **MANAGER**).

## What's included

| Source | Pill | Rows | Reference | Method | Status |
|---|---|---|---|---|---|
| **Order** | Orange | Orders that have a payment method (online-paid website and app orders), latest 250 | Order number | **Razorpay / Stripe / PayPal**, or the order's payment method (e.g. `ONLINE`) | Order status |
| **Gift Card** | Gold | Gift cards and coupons with payment **Paid**, latest 250 | Code | Gateway, or **Online** | Gift-card status |
| **Table** | Blue | Every POS payment: split payments and the final **Close & Pay** amount, latest 250 | `Table 5` | Cash, Credit Card, Debit Card, UPI, Wallet… | PAID |

The gateway payment ID (Razorpay `pay_…`, Stripe `pi_…`, PayPal order ID) is shown under the reference, so you can find the payment in your gateway dashboard. See [Payment gateways](doc:admin/payment-gateways).

:::note POS orders are counted as Table payments
Dishes sent to the kitchen from the POS create orders **without** a payment method, so they don't appear as *Order* rows. Their money appears as **Table** rows when the bill is paid. Nothing is counted twice.
:::

## Stats

The tiles are calculated on the **filtered** rows:

| Tile | Value |
|---|---|
| **Transactions** | Number of rows |
| **Total Amount** | Sum of amounts |
| **Gateway Payments** | Rows paid through Razorpay, Stripe or PayPal |
| **Gateway Amount** | Sum of those rows |

## Filters

- Source pills: **All / Order / Gift Card / Table**
- **All methods**, plus every method that occurs in the data (sorted)
- **Search ref, customer, payment id…**
- **Export**

## Table

| Column | Shows |
|---|---|
| **Source** | Order / Gift Card / Table pill |
| **Reference** | Order number, code or table, plus the payment ID in monospace |
| **Customer** | Name, or — |
| **Method** | Gateway methods are shown as a blue pill |
| **Amount** | Amount |
| **Date** | `Oct 22, 7:42 PM` |

If nothing matches you see *"No transactions match your filters."*

## Export to CSV

:::steps
### Filter what you need
For example, choose **Table** and the method **Cash** to count the cash drawer.

### Export
Click **Export**. The filtered rows download as `transactions-2026-10-22.csv`.
:::

```text title="transactions-YYYY-MM-DD.csv"
"Date","Source","Reference","Customer","Method","Amount","Status","PaymentId"
"2026-10-22 19:42:10","Table","Table 5","Jane Doe","Cash","86","PAID",""
```

Dates are `YYYY-MM-DD HH:MM:SS` (UTC).

:::tip Large histories
Each source is limited to its latest **250** rows, so the page stays fast. For long periods, export regularly (for example every week), or use [Table Analytics](doc:admin/table-analytics) and [Reports](doc:admin/reports) for totals.
:::

**Next:** [Reports →](doc:admin/reports)
