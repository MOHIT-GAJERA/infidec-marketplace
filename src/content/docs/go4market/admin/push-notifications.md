---
title: Push Notifications & Campaigns
description: How Go4Market delivers app and browser push with FCM and registerPushToken, which events notify whom, and how to send broadcast campaigns.
---

Go4Market uses **Firebase Cloud Messaging (FCM)** for Android and web push. Nothing to buy and no server key to configure: Cloud Functions send messages with the project's own credentials.

## How devices are registered

On every app start, token refresh and sign-in, each client calls the **`registerPushToken`** callable with `{token, platform: 'android' | 'web' | 'ios'}`. The function:

- subscribes the token **server-side** to the topic `all` plus the role topic (`customers`, `sellers` or `delivery`; admins only get `all`). Browsers cannot subscribe to topics themselves, so this is what lets campaigns reach the web;
- stores the token in `users/{uid}.fcmTokens` (de-duplicated, at most 10 per user). Anonymous visitors are registered too.

The panels call `unregisterPushToken` before sign-out (the apps and website rely on pruning). Tokens that FCM reports as invalid are removed automatically.

## Who gets what

| Event | Recipient | Opens |
|---|---|---|
| Order placed / confirmed / packed / out for delivery / delivered / cancelled | Customer | `/orders/<id>` on the website or in the app |
| New order, no rider available, return request, low stock, attribute alert, account review | Seller | Seller panel or Partner app |
| Order assigned, cash settled, salary credited | Delivery partner | Delivery panel or Partner app |
| Wallet credit, refund, referral reward, membership, payout, abandoned-cart reminder | Owner | Wallet, earnings or cart |
| Campaign | Chosen audience | The campaign link |

Every notification is also written to the user's **inbox** (`users/{uid}/notifications`), shown under the bell icon in the panels and apps.

Android messages use high priority, the channel `go4market_default` and the brand colour. Web messages carry a link to the recipient's own site (`WEBSITE_URL`, `SELLER_URL`, `DELIVERY_URL` or `ADMIN_URL`).

## Web push requirements

- `firebase-messaging-sw.js` must be at the **root** of each site. It is in `apps/website/web/`, and `tool/build_all.ps1` copies it into each panel build. It must contain **your** web config ([Connect the Code](doc:installation/connect-your-project#3-web-push-service-workers)).
- Panel users switch on push in the profile menu → **Enable notifications**. Website visitors see a small "Turn on notifications" card; the browser permission prompt appears when they tap it.
- The default Firebase VAPID key is used. To use your own, build the panels with `--dart-define=FCM_VAPID_KEY=<key>`.

## Campaigns (broadcast push)

**Admin → Marketing → Push campaigns** (`/marketing/campaigns`):

1. **Add**: title, message, optional image and link, and the **audience** (`all`, `customers`, `sellers`, `delivery`).
2. **Send now** calls `sendCampaign`, which sends to the FCM topic and adds an inbox entry for each user in the audience.
3. The list shows when each campaign was sent and its status.

:::tip Test on yourself first
Create a campaign for *sellers* while you are signed in to the Partner app with the demo seller, check how it looks, then send the real one to customers.
:::

## Troubleshooting

| Symptom | Fix |
|---|---|
| No push on Android 13+ | The user denied the notification permission; enable it in system settings |
| No push in the browser | Notifications blocked for the site, or `firebase-messaging-sw.js` missing or holding another project's config |
| `FCM rejected the token` | The client is configured for another Firebase project. Check `firebase_options.dart` and `google-services.json` |

**Next:** [AI Descriptions (Gemini) →](doc:admin/ai-descriptions)
