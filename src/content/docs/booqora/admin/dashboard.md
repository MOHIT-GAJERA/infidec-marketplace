---
title: Dashboard
description: The Rental Platform home screen — monthly KPIs, items going out and coming back, late rentals, the revenue chart, top products and the setup guide.
---

The **Dashboard** (`/`) is the first page after sign-in. It is built live from your orders, products and notes, so every number updates the moment a team member saves a change. The code lives in `booqora_platform/lib/features/dashboard/`.

The header greets you by first name with today's date and has four shortcuts: **New order**, **Add product**, **Add customer** and **View store**. **View store** opens your Online Store at `/s/<workspace-slug>` in a new tab.

![Dashboard](/docs/booqora/images/platform-dashboard.webp "The dashboard of a workspace with orders: revenue hero, KPIs, going out / coming back and the revenue chart")

## First run: the welcome screen

While a workspace has **no orders and no products**, the dashboard shows a welcome card instead of charts. It has buttons for **Ask Bora** (see [Bora assistant](doc:admin/assistant)) and **Add your first product**, plus a compact **Setup guide** card and quick links (*Add products*, *Add customers*, *Open your store*, *Read the guides*).

![Empty dashboard](/docs/booqora/images/platform-dashboard-empty.webp "A brand-new workspace: welcome card, setup guide and quick links")

## Setup guide

**Continue setup** opens `/setup`, a checklist of eight steps. Each step expands to a short explanation, a button that takes you to the right page and **Mark as done**. Most steps also tick themselves when you complete the real action.

| Step | Button goes to | Ticks itself when |
|---|---|---|
| Add your first product | `/inventory/products/new` | A product is created |
| Add your first customer | `/customers/new` | A customer is created |
| Create your first order | `/orders/new` | An order is saved |
| Set up taxes | `/settings/taxes` | Tax settings or a tax profile are saved |
| Customize your online store | `/online-store` | Store settings are saved |
| Connect payments | `/settings/payments` | Payment settings are saved or a provider is switched on |
| Invite your team | `/settings/team` | A team member is invited |
| Upload your logo | `/settings/general` | General settings are saved |

Progress is stored on the workspace document as `onboarding.<step> = true`. The sidebar shows the same progress count.

![Setup guide](/docs/booqora/images/platform-setup-guide.webp "Setup guide with eight expandable steps")

## KPI cards

Once you have data, a purple hero card shows **Revenue in &lt;month&gt;**, the change against last month and a 14-day sparkline. Below it are four cards:

| Card | How it is calculated |
|---|---|
| **Revenue this month** | Sum of `total` of orders created this month, excluding `draft` and `canceled` |
| **Orders this month** | Number of those orders |
| **Active rentals** | Orders with status `started` (items currently out with customers) |
| **Outstanding balance** | Sum of `due` across all orders that are not `canceled` |

:::note Revenue counts by order date
Dashboard and report revenue use the order's creation date, not the pickup date. Draft and canceled orders never count as revenue.
:::

## Going out and coming back

Two side-by-side cards show what has to happen on a given day. Chips let you switch between **Today**, **Tomorrow** and the next five days.

- **Going out** lists `reserved` orders whose pickup (`startsAt`) falls on the selected day.
- **Coming back** lists `started` orders whose return (`stopsAt`) falls on the selected day.

Each row shows the customer, order number, time and item count, and opens the order. If more than six orders match, **View all … orders** takes you to the order list.

### Late rentals

When a reserved order's pickup time or a started order's return time has already passed, the card header shows an amber **View late (n)** button. It opens [Orders](doc:admin/orders), where the **Late** tab lists the same orders.

## Revenue chart and top products

- **Revenue** is a bar chart of the last 30 days, bucketed by order date. **Full report** opens the [Company performance report](doc:admin/reports).
- **Top products** ranks the products by units booked across all non-draft, non-canceled orders. **Report** opens the Product performance report.

## Notes and activity

The bottom row shows **Latest notes** (notes added on orders, customers and products) and the **activity** feed, which records who created, updated or deleted what. The full audit trail is in **Reports → Activity logs**.

**Next:** [Orders →](doc:admin/orders)
