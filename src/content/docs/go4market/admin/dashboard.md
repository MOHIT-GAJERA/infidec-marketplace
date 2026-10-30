---
title: Dashboard
description: The Admin dashboard's tiles, charts and lists, where the numbers come from, and how the module switcher scopes them.
---

**Admin → Dashboard** (`/dashboard`) is the first screen after login. It greets you by name and summarises the business for the period you choose (**7 days**, **30 days** or **12 months**).

![Admin dashboard](/docs/go4market/images/admin-dashboard.webp "Today's tiles, sales overview and order status")

## What it shows

| Block | Content |
|---|---|
| **KPI tiles** | Revenue, orders, average order value, customers, pending orders, delivered, each with change versus the previous period |
| **Sales overview** | Revenue or orders per day (toggle) |
| **Order status** | Donut of orders by status |
| **Business performance** | Key ratios for the period, such as delivered and cancelled share |
| **Top categories** | Revenue by root category |
| **Catalogue & inventory** | Active, pending and out-of-stock products |
| **Customers by platform** | Orders from web, app and POS |
| **Top selling / top rated products**, **top sellers** | Leaderboards |
| **Recent orders** | The latest orders with status, linking to the order |

Shortcuts in the header: **View orders** and **Add product**.

## Where the numbers come from

The dashboard reads pre-aggregated documents written **only by Cloud Functions**:

- `stats/overview`: all-time totals (orders, revenue, customers, sellers, products, by status, by channel).
- `stats/daily_<yyyyMMdd>`: one document per day with orders, revenue, delivered, cancelled, returns, new users, and splits by channel, payment method, module and category.

`onOrderWritten` updates them on every order change. Unpaid (`pending`) orders count for nothing; cancelled and returned orders count as orders but add no revenue.

:::tip Use the module switcher
Pick *Grocery*, *Food*, *Pharmacy* or *Shopping* in the top bar to see the dashboard for one module only, in that module's colour.
:::

**Next:** [Orders & Order Flow →](doc:admin/orders)
