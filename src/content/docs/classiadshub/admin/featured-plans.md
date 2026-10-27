---
title: Featured Ad Plans
description: Set the price and duration options a seller can pay for to promote one of their ads to Featured.
---

A **featured ad plan** is a one-off promotion for a single ad: the seller pays once and the ad is marked **Featured** for a number of days. Featured ads carry `is_featured: true` and appear in Feature Sections that use the *Featured* filter (see [Feature Sections](doc:admin/featured-sections)).

Sellers buy plans **on the website** only, from the checkout page for one of their ads. The mobile app has no purchases.

Manage plans in **Admin → Package Management → Featured Ad Plans**. Subtitle: *"Pricing for promoting a single advertisement to Featured"*. The data is the Firestore `featured_ad_plans` collection (`/admin/crud/featured_ad_plans`).

![Featured Ad Plans](/docs/classiadshub/images/admin-featured-plans.jpg "Admin → Package Management → Featured Ad Plans")

## The list

The toolbar has **Search...** (by name), **Refresh**, **Columns** and **Export CSV** (`featured_ad_plans.csv`).

| Column | Shows |
|---|---|
| **Name** | Plan name (sortable) |
| **Description** | First two lines |
| **Price** | Currency code and price, e.g. `USD 4.99` |
| **Duration (Days)** | How long the ad stays featured |
| **Active** | Toggle. Inactive plans are hidden from the website |
| **Action** | Edit, Delete |

Plans are ordered by **Sort order**, then by id.

## Create or edit a plan

Click **Create Plan**. The dialog has:

| Field | Notes |
|---|---|
| **Name** | Required, e.g. *Featured — 7 days* |
| **Description** | Optional text shown to the seller |
| **Price** | Required, in major units (`4.99`). Stored in cents |
| **Currency (ISO)** | 3-letter code. Default `USD` |
| **Duration (Days)** | Required, at least 1. Default `7` |
| **Sort order** | Lower numbers are listed first |

Click **Save** (or **Update**). New plans are active.

## What happens when a seller buys a plan

1. The website calls `POST /ads/{id}/feature/checkout` with the plan and gateway. Only the ad's owner can do this.
2. The API creates a `pending` transaction of type `featured_ad` (price plus **Tax (%)**).
3. When the payment is confirmed, the ad gets `is_featured: true` and `featured_until` = now + the plan's days. If the ad is already featured, the days are **added to the current end date**, so buying again extends the promotion.
4. The hourly `housekeeping` job removes the Featured flag once `featured_until` has passed.

A refund of the transaction (see [Subscriptions & Transactions](doc:admin/transactions#refund-a-transaction)) removes the Featured flag at once.

:::tip Feature an ad without payment
Admins can feature any ad for free from [Ads & Moderation](doc:admin/ads). That sets `featured_until` to 30 days by default and creates no transaction.
:::

**Next:** [Subscriptions & Transactions →](doc:admin/transactions)
