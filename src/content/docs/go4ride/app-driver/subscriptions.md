---
title: Subscription Plans
description: How drivers buy or activate a subscription plan from their wallet in the Driver App, how paid plans waive the ride commission, ride limits, renewals and what your team sees.
---

![Plans](/docs/go4ride/images/app-driver-plans.webp "Available plans")
![Active plan](/docs/go4ride/images/app-driver-plan-active.webp "Current plan")

Subscriptions are an alternative to per-ride commission. A driver pays a fixed price for a period and, while the plan is active, keeps the **whole fare** of every ride.

## Plans

Plans are managed in **Admin → Subscription plans** ([Driver Subscriptions](doc:admin/subscriptions)). **Load defaults** creates three:

| Plan | Price | Validity | Ride limit | Commission while active |
|---|---|---|---|---|
| Free Plan | ₹0 | 30 days | Unlimited | Standard commission |
| Basic Plan | ₹499 | 30 days | 200 rides | **None** |
| Premium Plan | ₹1,499 | 30 days | Unlimited | **None** |

| Field | Meaning |
|---|---|
| Name, description | Shown on the plan card |
| Price | Debited from the driver wallet. `0` or type *free* = free plan |
| Validity (days) | Length of the plan |
| Ride limit | Rides covered by the plan. `-1` = unlimited |
| Active | Only active plans are listed and can be bought |

:::note Every paid plan waives the full commission
The server waives commission for **any** active paid plan with rides left. There is no "reduced commission" option. The seeded Basic Plan description says *Lower commission for part-time drivers*. Edit it to match, for example *No commission on up to 200 rides*.
:::

## In the Driver App

Account → **Subscriptions**:

| Block | Content |
|---|---|
| Current plan card (dark) | Plan name, expiry date, rides used / limit, or nothing when there is no plan |
| **Available plans** + wallet balance | One card per active plan: name, description, price (or **Free**) / validity, ride limit (*Unlimited rides*, *200 rides*), a **Current** pill on the active plan |
| Button | **Subscribe**, **Activate free plan**, or **Extend plan** on the current one |

:::steps
### Choose a plan
**Subscribe** → *Buy Basic Plan?* *₹499.00 will be debited from your wallet. Valid for 30 days.* → **Pay from wallet**. Free plans: *Activate Free Plan?* *This free plan is valid for 30 days.* → **Activate**.

### Server checks
The `purchaseSubscription` callable (driver role required) checks that the plan is active, that the driver profile exists and, for paid plans, that the wallet holds the price: otherwise *Insufficient wallet balance. You need ₹499.00.*

### Activated
In one transaction the function debits the wallet, sets the plan on the driver (`subscriptionId`, `subscriptionName`, `subscriptionExpiry`, `subscriptionRideLimit`, `subscriptionRidesUsed: 0`, `subscriptionWaivesCommission`), adds a row to `subscriptions` and a *Subscription* row to `transactions`.
:::

## Renewing

Buying again while a plan is active **extends from the current expiry**: a 30-day plan bought 10 days before expiry ends 40 days from today. The ride counter starts again at 0.

## At each completed ride

During settlement the server checks the plan:

- **Active** (expiry in the future) **and** rides used below the limit (or unlimited) **and** a paid plan → commission **₹0**, the driver earns the whole fare, `subscriptionRidesUsed` +1.
- Otherwise the normal commission applies.

Example: a cash ride of ₹215 on the Premium Plan → wallet unchanged (no commission to deduct), earnings +₹215. The same ride with no plan and 10 % commission → wallet −₹21.50.

When the plan expires or the ride limit is reached, commission applies again automatically. The app does not send a reminder before expiry.

## Paying for a plan

The price is taken from the **wallet**, so the driver needs a positive balance (from wallet / card rides or cancellation fees). There is no top-up in the Driver App ([Earnings, Wallet & Payouts](doc:app-driver/earnings#adding-money-to-the-wallet)).

## What your team sees

**Admin → Subscription history** lists every purchase (driver, plan, price, *Wallet* or *Free plan*, start, expiry, active). Wallet debits appear in the driver's transactions.

**Next:** [Run the App →](doc:app-driver/run-the-app)
