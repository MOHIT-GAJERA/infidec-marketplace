---
title: Push Notifications
description: Order updates and campaigns through Firebase Cloud Messaging.
---

Push works automatically once the app has your `google-services.json` — Cloud Functions send order updates and admin campaigns.

| Part | File / setting |
|---|---|
| FCM setup and token handling | `lib/core/push.dart` |
| Foreground notifications | `flutter_local_notifications`, channel `qwikmart_default` |
| Token storage | `users/{uid}.fcm_tokens` (added at login, removed at logout) |
| In-app notification list | Bell icon on the home screen (`users/{uid}/notifications`) |

## Android

- Android 13+ shows the permission prompt on first launch (`POST_NOTIFICATIONS`).
- Change the channel name/ID in `lib/core/push.dart` if you rename the app.
- The small notification icon uses the launcher icon; for a crisp status-bar icon add a white, transparent `ic_notification` drawable and reference it in `push.dart`.

## iOS

Enable **Push Notifications** and **Background Modes → Remote notifications** in Xcode and upload an **APNs key** in Firebase → Project settings → Cloud Messaging.

## Send a test

Admin → Notifications → audience *Specific User* → choose your account → Send. See [Notifications & Email](doc:admin/notifications).

**Next:** [Manage Languages →](doc:app-customer/languages)
