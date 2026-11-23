---
title: Reports
description: The seven built-in reports — company performance, product performance, availability, product fulfillment, customers, coupons and activity logs — with period filters and CSV export.
---

**Reports** (`/reports`) turns your orders, products, customers and coupons into ready-made reports. Every report is calculated live in the browser from your workspace data; there is nothing to schedule or sync. The code is in `booqora_platform/lib/features/reports/`.

![Reports](/docs/booqora/images/platform-reports.webp "The reports overview grouped by business, inventory, customers, coupons and activity")

## Reports overview

The overview groups the reports into cards. **Run report** opens `/reports/<type>`.

| Group | Report | Route |
|---|---|---|
| Business reports | Company performance | `/reports/performance` |
| Inventory reports | Product performance | `/reports/products` |
| | Availability | `/reports/availability` |
| | Product fulfillment | `/reports/fulfillment` |
| Customer reports | Customers | `/reports/customers` |
| Coupon reports | Coupons | `/reports/coupons` |
| Activity | Activity logs | `/reports/activity` |

## Common controls

- **Period** filter in the side panel (a date range). Without a period most reports show **All time**; the Availability report defaults to the next 30 days.
- **Search** box on reports with a table.
- **Export CSV** downloads the rows of the table as `<type>-report.csv`.
- Metric cards at the top, then charts (where available) and a sortable table.

:::note What counts as revenue
Revenue in every report excludes **draft** and **canceled** orders. Company performance, Customers and Coupons use the order's creation date; Product performance and Product fulfillment use the pickup date.
:::

## Company performance

Revenue, orders, average order value, items rented and deposits held.

![Company performance](/docs/booqora/images/platform-report-performance.webp "Revenue chart, orders by status and the daily table")

- **Metrics**: Revenue, Orders, Avg. order value, Items rented and **Deposit held** (deposits on reserved and started orders).
- **Charts**: Revenue over the period and **Orders by status**.
- **Table / CSV**: Period, Orders, Revenue.

## Product performance

How each product earned its keep. Tabs: **Rental products**, **Sales items**, **Services**.

![Product performance](/docs/booqora/images/platform-report-products.webp "Times rented, units, duration, revenue and ROI per product")

| Column | Meaning |
|---|---|
| Added | Product creation date |
| Quantity | Current stock |
| Times rented / Times sold | Number of orders containing the product |
| Units rented | Total units across those orders |
| Rent duration (h) | Hours rented × units |
| Revenue | Sum of the product's line totals |
| Purchase cost | Default purchase cost × stock (rentals) or × units (sales items, services) |
| ROI % | (Revenue − purchase cost) ÷ purchase cost |

## Availability

Stock versus reservations for each active rental product in the period: **Quantity**, **Reserved**, **Downtime**, **Available** and a status of *Available*, *Fully booked* or *Shortage*. Metrics show rental products, units in stock, units reserved and the number of shortages. The calculation is the one in [Availability](doc:admin/availability).

## Product fulfillment

A pick list for your warehouse: every line on orders whose **pickup** falls in the period, in pickup order. Columns: Pickup, Order, Customer, Product, Qty, Method (pickup or delivery) and Status. Metrics: Orders going out, Lines, Units and **Awaiting pickup** (orders still `reserved`).

## Customers

Customer value and outstanding balances.

![Customers report](/docs/booqora/images/platform-report-customers.webp "Revenue share, average order value and balances per customer")

- **Metrics**: New customers, Total revenue, Avg. order value and Balance due (across all customers).
- **Columns**: #, Name, Email, Discount %, Balance due, Orders, Revenue, Revenue % (share of total revenue) and Avg. order value.

## Coupons

Per code: Discount, **Total uses** (the coupon's lifetime counter), **Orders in period**, **Discount given**, **Revenue** of those orders and Status. Metrics: Active coupons, Redemptions, Discount given and Revenue. See [Coupons](doc:admin/coupons).

## Activity logs

A complete audit trail from `workspaces/{wid}/activity`: who created, updated or deleted what, and when.

- **Filter** by **Record type** (orders, customers, products, settings and so on) and search by user, action or record.
- **Metrics**: Events, Team members, Created and Deleted.
- **Columns / CSV**: When, User, Action, Record type, Record.

:::tip Use exports for your accountant
Combine **Company performance** with the **Invoices** CSV from [Documents](doc:admin/documents) for a month-end pack.
:::

**Next:** [Online Store overview →](doc:store/overview)
