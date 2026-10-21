---
title: Push Notifications (FCM)
description: How QwikMart sends push notifications with Firebase Cloud Messaging, and how to enable web push.
---

Push notifications use **Firebase Cloud Messaging (FCM)** and need no API key — Cloud Functions send them with the Firebase Admin SDK.

## Automatic notifications

| Event | Who is notified |
|---|---|
| Order placed / status changed (processed, out for delivery, delivered, cancelled) | Customer |
| New order available or assigned | Delivery boys of the zone / the assigned rider |
| Return approved, refund completed | Customer |
| Rider approved or rejected | Delivery boy |
| New chat message | Customer / rider / support |

Each app registers its device token at login (`users/{uid}.fcm_tokens`) and removes it at logout.

## Send a campaign

**Admin → Notifications**: title, message, optional image, and the audience — *Everyone*, *All Customers*, *All Delivery Boys* or a *Specific User*. Sent campaigns are listed in the same screen.

![Notifications](/docs/qwikmart/images/admin-notifications.jpg "Admin → Notifications")

## Mobile apps

- **Android**: works out of the box once `google-services.json` is in the app. Android 13+ asks the user for notification permission on first launch.
- **iOS**: upload an **APNs authentication key** in Firebase console → Project settings → Cloud Messaging → Apple app configuration, and enable *Push Notifications* + *Background Modes → Remote notifications* in Xcode.

## Web push (website, optional)

1. Firebase console → Project settings → **Cloud Messaging → Web Push certificates** → *Generate key pair*.
2. Copy the public key into **Admin → System Settings → Firebase → VAPID Key** and into the website environment (`NEXT_PUBLIC_FIREBASE_VAPID_KEY`).
3. Redeploy the website. Visitors who allow notifications receive order updates in the browser.
