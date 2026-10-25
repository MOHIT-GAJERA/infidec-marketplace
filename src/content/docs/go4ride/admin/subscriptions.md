---
title: Driver Subscriptions
description: Driver plans with a price, validity in days and a ride limit. Drivers buy them from their wallet; paid plans waive the per-ride commission while active. Includes the subscription history.
---

Subscriptions are an alternative to commission: a driver pays a **fixed fee** for a period and keeps the **whole fare** of every ride in that period (up to the plan's ride limit). **Admin → Finance → Subscriptions** has two pages:

| Page | Subtitle | Collection |
|---|---|---|
| **Plans** | *"Driver plans: a fixed fee instead of per-ride commission"* | `subscription_plans` |
| **History** | *"Plans purchased or assigned to drivers"* | `subscriptions` |

## Plans

![Subscription plans](/docs/go4ride/images/admin-subscription-plans.jpg "Admin → Finance → Subscriptions → Plans")

On an empty page click **Load 3 defaults**:

| Name | Description | Price | Validity | Ride limit | Type |
|---|---|---|---|---|---|
| Free Plan | Try Go4Ride with standard commission. | ₹0 | 30 days | Unlimited (`-1`) | Free |
| Basic Plan | Lower commission for part-time drivers. | ₹499 | 30 days | 200 | Paid |
| Premium Plan | Zero commission, unlimited rides. | ₹1,499 | 30 days | Unlimited | Paid |

### Fields

| Field | Type | Notes |
|---|---|---|
| **Name** | Text, required | Shown to drivers |
| **Description** | Multi-line | One line under the name |
| **Price** | Money, required | Debited from the driver's wallet. `0` = free |
| **Validity (days)** | Number, required | e.g. `30` |
| **Ride limit** | Number, default `-1` | *"-1 = unlimited rides."* Rides covered before commission applies again |
| **Type** | Free / Paid | A free plan keeps the standard commission |
| **Features** | Tags | e.g. *Zero commission, Priority support*. Shown as bullet points |
| **Active** | Switch | Inactive plans can't be bought |

:::warning Paid plans waive commission completely
Settlement doesn't lower the commission for a paid plan, it sets it to **zero** while the plan is active and under its ride limit. The default *Basic Plan* description says "Lower commission"; edit the text so it matches what drivers really get.
:::

## How a driver buys a plan

1. In the Driver App, **Subscriptions** lists the active plans with price, validity, ride limit and features, and shows the driver's wallet balance.
2. The driver taps **Subscribe** (or **Activate free plan**) and confirms *"Buy Premium Plan?"* → **Pay from wallet**.
3. The `purchaseSubscription` function does everything in one transaction. It checks the plan is active and, for a paid plan, that the wallet has enough (*"Insufficient wallet balance. You need ₹1499.00."*). It debits the price from the driver's wallet and writes a `subscription` ledger row, sets the plan on the driver (name, expiry, ride limit, rides used = 0, and whether it waives commission) and adds a row to **History**.
4. Buying again while a plan is active **extends** it from the current expiry (**Extend plan**).

![Driver plans](/docs/go4ride/images/app-driver-plans.webp "Driver App: available plans")
![Active plan](/docs/go4ride/images/app-driver-plan-active.webp "Current plan with its expiry date")

### At settlement

For each completed ride, if the driver's plan waives commission, hasn't expired and has rides left, commission is 0 and the ride counts towards `subscriptionRidesUsed`. When the plan expires or the limit is reached, normal [commission](doc:admin/commission-wallet) applies again.

## History

![Subscription history](/docs/go4ride/images/admin-subscription-history.jpg "Admin → Finance → Subscriptions → History")

Read-only list, newest first. Tabs **All / Active / Inactive**, **Search** by driver name or plan, **Export CSV**.

| Column | Example |
|---|---|
| **Name** | Driver name |
| **Plan** | Premium Plan |
| **Price** | ₹1,499.00 |
| **Paid via** | *Wallet* or *Free plan* |
| **Started** | 1 Oct 2026 |
| **Expires** | 31 Oct 2026 |
| **Active** | Yes / No |

:::note History rows are records only
Deleting a history row doesn't cancel the driver's plan, and the **Active** flag on a row isn't switched off automatically at expiry. The driver's real plan state is on the driver document (`subscriptionExpiry`, `subscriptionRideLimit`, `subscriptionRidesUsed`). v1.0 has no screen to assign a plan to a driver by hand.
:::

**Next:** [Payout Requests →](doc:admin/payouts)
