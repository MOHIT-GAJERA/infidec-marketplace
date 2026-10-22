---
title: Reports
description: All-time sales analytics. Revenue, orders, items sold, revenue by outlet, category mix, top-selling dishes, order types and payment methods, with a CSV export of top items.
---

**Admin → Reports** (*"Analytics and exportable insights."*) summarises your sales across all orders: website, table QR, app and POS.

![Reports](/docs/go4foodie/images/admin-reports.jpg "Admin → Reports")

**Permission:** `view:reports` (**OWNER** and **MANAGER**).

:::note All-time figures
Reports has **no date filter**. Every number covers all orders in the database. **Canceled** orders are left out of revenue, items, top items, category mix and payment methods, but they are included in the **Orders** count and **Order Types**. For today, last 7 days or last 30 days, use [Table Analytics](doc:admin/table-analytics) (dine-in sessions) and the CSV exports in [Transactions](doc:admin/transactions).
:::

## Summary

| Tile | Value |
|---|---|
| **Revenue** | Sum of non-canceled order totals |
| **Orders** | All orders, canceled included |
| **Items Sold** | Total quantity on non-canceled orders |
| **Avg Order** | Revenue ÷ number of non-canceled orders |

Revenue here is the sum of **order totals** (dishes × price). POS bill adjustments (discount, tax, service, tip) are part of the table session, not the order, so they aren't included. See [Table Analytics](doc:admin/table-analytics) for session revenue.

## Revenue by Outlet

A bar chart of revenue per outlet, sorted by outlet name. Axis labels shorten *"Outlet "* to *"O"* (e.g. *Outlet North* → *ONorth*). Hover to see *"Revenue : $x"*.

## Category Mix

A doughnut chart of revenue per menu category, with a legend listing *category · $revenue · percent %*, largest first. Dishes that are no longer on the menu count as **Other**.

## Top Selling Items

The 8 best-selling dishes by quantity: name, *"42 sold · $1,092"* and a bar relative to the best seller.

## Order Types and Payment Methods

| Card | Rows |
|---|---|
| **Order Types** | Dine-in, Delivery, Pick-up (order counts) |
| **Payment Methods** | Cash, Card, Online (by the payment method on the order) |

POS orders don't carry a payment method on the order (the table bill is paid instead), so they don't appear under Payment Methods. Table payments by method are in [Table Analytics](doc:admin/table-analytics) → **Payment Methods** and in [Transactions](doc:admin/transactions).

## Export top items

Click **Export top items (CSV)** (top right) to download `top-items.csv`:

```text title="top-items.csv"
"Item","Quantity","Revenue"
"Truffle Risotto","42","1092"
```

With no sales yet, the button does nothing.

**Next:** [Table Analytics →](doc:admin/table-analytics)
