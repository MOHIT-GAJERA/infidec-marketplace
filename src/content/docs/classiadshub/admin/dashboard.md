---
title: Dashboard
description: The Admin Panel home screen with ad, user and review counters, the monthly revenue chart, recent ads, reports and chats, status charts, top customers and the most viewed ads.
---

**Admin → Dashboard** is the first page after login. It greets you with *"Welcome back, <first name>!"* and shows a live summary of the marketplace. Every number comes from one call, `GET /api/v1/admin/dashboard?year=<year>`, which reads the Firestore collections `ads`, `users`, `subscriptions`, `transactions`, `favorites`, `reviews`, `categories`, `reports`, `conversations` and `ad_sales`.

![Admin dashboard](/docs/classiadshub/images/admin-dashboard.jpg "Admin → Dashboard")

Every staff member can open the dashboard. It is the one module that needs no permission in the role (see [Roles, Staff & Permissions](doc:admin/roles-permissions)).

## Counters

The top row has five ad counters. The second row has four larger tiles.

| Tile | What it counts |
|---|---|
| **Total Ads** | Every ad document, in any status |
| **Featured Ads** | Ads with `is_featured = true` |
| **Active Ads** | Ads with status `approved` whose `expires_at` is still in the future |
| **Expired Ads** | Ads with status `expired`, plus approved ads whose expiry date has passed but were not yet switched by the hourly job |
| **Sold Ads** | Ads with status `sold` |
| **All Users** | User accounts that are not deleted (customers, sellers and staff) |
| **Subscriptions** | All subscription records, in any status |
| **Favorite Ads** | Number of favourites saved by users |
| **Total Reviews** | Number of review documents (buyer and seller reviews) |

:::note Expired vs. Active
The hourly `housekeeping` job sets approved ads to `expired` when `expires_at` passes and sends the seller an *"Ad expired"* notification. Between two runs the dashboard already counts such ads as expired, so the totals stay correct. See [Scheduled Jobs](doc:api/scheduled-jobs).
:::

## Revenue chart

The **Revenue** card shows a bar chart with one pair of bars per month:

| Series | Source |
|---|---|
| **Subscription** (navy) | Completed transactions of type `subscription` |
| **Feature Ads** (amber) | All other completed transactions (featured-ad purchases) |

- Only transactions with status `completed` count. The month is taken from `paid_at` (or `created_at`).
- **Total** next to the legend is the sum of all completed transactions (all years).
- The drop-down switches between **This Year** and the two previous years.

:::warning Currency of the total
The total is always formatted as **USD** (for example *Total USD 144.84*), and amounts are added up without converting currencies. If you sell plans in several currencies, use **Package Management → Payment Transactions** for exact figures (see [Subscriptions & Transactions](doc:admin/transactions)).
:::

## Recent Ads

The 10 newest ads (any status). **View All** opens **Ads Listing → All Ads**.

| Column | Shows |
|---|---|
| **Image** | First ad image |
| **Name** | Ad title |
| **User** | Seller avatar and name |
| **Price** | Formatted price, e.g. `USD 99,999.00` |
| **Category** | Ad category |
| **Address** | Address, city and country |
| **Status** | *Under Review*, *Approved*, *Rejected*, *Sold*, *Expired*, *Inactive* or *Draft* |
| **Created** | Date the ad was created |
| **Action** | Eye icon: opens the ad detail page |

## Recent Reports and Recent Chats

**Recent Reports** lists the 10 newest user reports: ad image, **Advertisement**, **Item Owner**, reporting **User**, **Reason** and **Ad Status**. A report about a user (not an ad) shows *User report*. **View All** opens **Reports → User Reports** ([Report Reasons & User Reports](doc:admin/reports)).

**Recent Chats** lists the 10 conversations with the latest message: ad image with the buyer's avatar, ad title, buyer name, time since the last message and the unread count (buyer + seller unread). Click a chat to open it in **Chat Management → Chats** with the product and conversation already selected. An ad that was deleted shows *Deleted ad*.

## Charts

| Card | What it shows |
|---|---|
| **Ads Statistics** | Ads per status (doughnut). `pending` is labelled *Under Review* |
| **Top 5 Categories by Ads** | The five **main** categories with the most ads. Ads in subcategories count for their top-level parent |
| **Top Sold Items by Category** | Sold ads per main category |
| **Customer Statistics** | **Active** users (status `active`) vs. **Inactive** (suspended or banned) |

## Top Customer and Most Viewed

- **Top Customer**: the 10 users with the most ads. Columns **Profile**, **Name**, **Ads** and **Sold Item**. **View All** opens **Customers & Roles → Customers**.
- **Most Viewed**: the 10 approved ads with the highest `views_count`. Columns **Image**, **Ad Title**, **User**, **Category**, **View**, **Location** (city, state) and an eye icon to open the ad.

The dashboard tables can be sorted by the columns that show sort arrows, and the toolbar button lets you choose the visible columns. Reload the page to refresh the numbers.

:::tip Performance on large data sets
The dashboard reads the full `ads`, `users`, `transactions`, `reports` and `conversations` collections on every load. That is fine for small and medium marketplaces. With many thousands of ads it gets slower and uses more Firestore reads. Keep the dashboard as a summary and use the filtered list pages for daily work.
:::

**Next:** [Ads & Moderation →](doc:admin/ads)
