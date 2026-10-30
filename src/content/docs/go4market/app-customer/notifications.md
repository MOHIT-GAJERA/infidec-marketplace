---
title: Push Notifications
description: How the Customer app receives FCM push, registers its token with registerPushToken, shows foreground notifications and opens the right screen on tap.
---

Push works out of the box once `google-services.json` and `firebase_options.dart` point to your project. There is no server key to configure.

## How it works

`apps/customer_app/lib/core/push.dart`:

1. Asks for the **notification permission** (Android 13+ `POST_NOTIFICATIONS`).
2. Gets the FCM token and calls **`registerPushToken`** `{token, platform: 'android'}` on start, on token refresh and after sign-in. The server subscribes the token to the `all` and `customers` topics and stores it on the user.
3. Shows notifications that arrive while the app is open with `flutter_local_notifications` on the channel **`g4m_default`** ("Go4Market updates", high importance).
4. Handles background messages with `firebaseBackgroundHandler` (registered in `main.dart`).
5. On tap, opens the `link` from the message data (for example `/orders/<id>`) through `lib/screens/link_router.dart`.

In v1.0 the Customer app does not call `unregisterPushToken` on sign-out; stale tokens are pruned automatically when FCM rejects them.

## What customers receive

Order status updates, refunds and wallet credits, referral rewards, membership activation, subscription problems, abandoned-cart reminders and campaigns. Each one also appears in **Account → Notifications** (the inbox).

## Customise

| What | Where |
|---|---|
| Channel name and description | `_channel` in `lib/core/push.dart` |
| Default channel, icon, colour for background messages | `AndroidManifest.xml` meta-data (`default_notification_channel_id`, `default_notification_icon`, `default_notification_color`) |
| Accent colour | `g4m_primary` in `res/values/colors.xml` |

:::note Channel IDs
The server sends Android notifications with the channel ID `go4market_default` (`functions/src/lib/notify.ts`), while the app creates and declares `g4m_default`. Android then delivers background notifications on the app's default channel from the manifest, so they still appear. If you want them on a specific channel, use the same ID in both places.
:::

## Test

1. Sign in on a phone as the demo customer.
2. Admin → Marketing → Push campaigns → create one for **customers** → **Send now**.
3. Or place an order and move it through the statuses in the Seller panel.

**Next:** [Maps & Location →](doc:app-customer/maps-location)
