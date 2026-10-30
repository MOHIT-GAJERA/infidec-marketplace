---
title: Push Notifications
description: How the Partner app receives new-order, assignment, cash and payout notifications for sellers and riders.
---

Push in the Partner app works like the Customer app ([Customer App → Push Notifications](doc:app-customer/notifications)), with partner-specific events.

## How it works

`apps/partner_app/lib/core/push.dart`:

1. Requests the notification permission (Android 13+).
2. Calls **`registerPushToken`** `{token, platform: 'android'}` on start, on token refresh and after sign-in. The server subscribes the token to `all` and the role topic: **`sellers`** or **`delivery`**.
3. Shows foreground messages with `flutter_local_notifications` on the channel **`orders`** ("Orders & deliveries", high importance).
4. Opens the related order or screen when a notification is tapped.

## What partners receive

| Role | Notifications |
|---|---|
| Seller | New order, order status changes, **no rider available**, return requested, low or out of stock, attribute alerts, store approved/rejected, withdrawal processed |
| Delivery | Order assigned to you, cash settled, salary credited, application approved, withdrawal processed |
| Both | Campaigns sent to *sellers* or *delivery* in Admin → Push campaigns |

Everything also appears in **More → Notifications** (the inbox).

:::note Channel IDs
The server sends Android notifications with the channel ID `go4market_default`; the Partner app creates the channel `orders`. Background notifications still show (on the default channel). Align the IDs if you want them grouped under one channel.
:::

**Next:** [Release & Play Store →](doc:app-partner/deployment)
