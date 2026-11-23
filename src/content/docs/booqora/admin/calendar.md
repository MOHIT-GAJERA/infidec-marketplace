---
title: Calendar
description: The availability calendar — day, week and month views, the per-product timeline, the pickup and return agenda, the legend, availability checks and the .ics export.
---

The **Calendar** (`/calendar`) shows bookings, pickups, returns and downtime across your inventory on a timeline. It reads products, orders and downtimes live, so changes made by any team member show up immediately. The code is in `booqora_platform/lib/features/calendar/calendar_page.dart`.

![Calendar](/docs/booqora/images/platform-calendar.webp "Week view: one row per rental product, coloured bars per order and the agenda")

## Header actions

| Button | What it does |
|---|---|
| **Check availability** | Pick a product, **From** and **Until**; shows how many units are free, including buffers and downtime |
| **Subscribe** | Download an `.ics` file and copy the team calendar link |
| **New order** | Opens `/orders/new` |

## Views and navigation

Switch between **Day**, **Week** and **Month**. **Today** jumps back to the current date, and the arrows move one day, week or month.

| View | Columns | Range |
|---|---|---|
| Day | 24 hourly columns | One day |
| Week | 7 day columns | Starts on Monday, or Sunday if *Settings → General → week start* is Sunday |
| Month | One column per day | First to last day of the month |

Today's column is highlighted and weekends are shaded in the week and month views.

## Timeline per product

The left column lists every **active rental product** (sales items and services are not shown) with its stock count and number of bookings in the range. Each row shows bars for:

- orders with status `draft`, `reserved` or `started` that contain the product;
- downtime records that are `scheduled` or `started`.

Hover a bar to see the order number, customer, quantity, status and period. Click an order bar to open the order; click a downtime bar to open the product's **Downtime** tab.

Click a product name to open a quick view with **In stock**, **Available now** and **Out now**, plus two tabs: **Current** (started, or reserved with pickup already passed) and **Upcoming orders**. **View in inventory** opens the product.

## Legend

| Swatch | Meaning |
|---|---|
| Purple bar | **Reserved** — units are blocked |
| Blue bar | **Started** — items are out with the customer |
| Amber bar | **Late** — started, but the return time has passed. The bar stretches up to now |
| Dashed outline | **Draft** — not yet holding stock |
| Red stripes | **Downtime** — maintenance, repair or missing units |

:::tip Drafts do not block stock
Only reserved and started orders count against availability. A dashed draft bar is a reminder, not a reservation. See [Availability](doc:admin/availability).
:::

## Agenda

The **Agenda** card lists every pickup and return in the visible range, grouped by day:

- **Pickup** events for `reserved` orders whose pickup time is in the range;
- **Return** events for `reserved` and `started` orders whose return time is in the range. Overdue returns of started orders are marked late.

Each entry shows the time, order number, customer and item count, and opens the order. If nothing is due you see *No pickups or returns*.

## Subscribe and export

**Subscribe → Download .ics** creates `booqora-orders.ics` with every `reserved` and `started` order. Each event has the order number and customer as the title and the status and items in the description. Import it into Google Calendar, Outlook or Apple Calendar, and download a fresh file when you want to update it.

The **Team calendar link** is the `/calendar` URL of your Rental Platform. It is meant for team members who already have access to your workspace.

:::note Not a live feed
The `.ics` file is a snapshot. Calendar apps will not refresh it automatically.
:::

**Next:** [Customers →](doc:admin/customers)
