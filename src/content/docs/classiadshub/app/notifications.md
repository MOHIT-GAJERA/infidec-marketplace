---
title: Push Notifications
description: How the app receives FCM push notifications, the Android channel and local notifications, the in-app Notifications list, which events send a push, and how admins broadcast from the Admin Panel.
---

![Notifications](/docs/classiadshub/images/app-notifications.webp "Notifications")

Every notification is created by the **backend** (`functions/src/lib/notify.ts`). It is saved in the `notifications` collection (the in-app list) **and** pushed with Firebase Cloud Messaging to all devices of the user. The app never sends pushes itself.

## How a device gets pushes

:::steps
### Permission
After the first frame, `NotificationService.initialize()` (`lib/core/services/notification_service.dart`) asks for permission: the FCM prompt on iOS and the `POST_NOTIFICATIONS` runtime permission on Android 13+.

### Channel
On Android it creates the channel **`classiads_default`** (*ClassiAds notifications*, high importance). `AndroidManifest.xml` sets the same id as `com.google.firebase.messaging.default_notification_channel_id`, and the backend sends every push with `channelId: "classiads_default"`.

### Device token
After sign-in the app sends the FCM token to `POST /auth/devices` (`fcm_token`, `platform`) and again on every token refresh. The API stores it in the `devices` collection. Invalid tokens are removed automatically when a send fails.
:::

| App state | What happens |
|---|---|
| Foreground | FCM does not show anything by itself, so the app shows the push as a **local notification** with `flutter_local_notifications` |
| Background / closed | Android or iOS shows the notification from the FCM payload. A background handler (`_firebaseMessagingBackgroundHandler` in `main.dart`) initialises Firebase |
| Tap | Opens the app. Taps are emitted on `NotificationService.taps`, but no screen listens to that stream yet, so the app does not jump to the chat or ad. Subscribe to `taps` and route on the `type`, `ad_id` or `conversation_id` data keys if you want deep links |

:::note Notification icon
Local notifications use `@mipmap/ic_launcher` as the small icon. Android shows small icons as a white silhouette, so a full-colour launcher icon becomes a grey square. For production add a white-on-transparent icon in `android/app/src/main/res/drawable/` and use it in `AndroidInitializationSettings('@drawable/ic_notification')`, plus a `com.google.firebase.messaging.default_notification_icon` meta-data entry for background pushes.
:::

## Requirements

| What | Where |
|---|---|
| Firebase configured in the app | [Firebase Setup](doc:app/firebase-setup) |
| Cloud Messaging API enabled | Firebase Console → Project settings → Cloud Messaging (enabled by default in new projects) |
| APNs key for iOS | Firebase Console → Cloud Messaging → Apple app configuration ([Firebase Setup](doc:app/firebase-setup#push-on-ios-optional)) |
| A real device or an emulator **with Google Play** | Emulators without Play services get no FCM token |

## Events that send a push

| Type | Title | Sent to | When |
|---|---|---|---|
| `chat.message` | New message | The other participant | A chat message (or the first message when a chat starts) |
| `offer.received` | New offer | Seller | A buyer makes an offer |
| `offer.accepted` / `offer.rejected` | Offer accepted / Offer rejected | Buyer | The seller answers |
| `offer.countered` | Counter offer | The other party | A counter offer (website / API) |
| `ad.approved` / `ad.rejected` | Ad approved / Ad rejected | Ad owner | An admin moderates the ad |
| `ad.expired` | Ad expired | Ad owner | The hourly `housekeeping` job expires the ad |
| `sale.confirmed` | Purchase confirmed | Buyer | The seller confirms the buyer under **Who bought?** |
| `review.received` | New review | Reviewed user | A review is submitted |
| `follow.new` | New follower | Followed user | Someone follows the user |
| `verification.approved` / `verification.rejected` | You are verified! / Verification rejected | User | An admin reviews the KYC request |
| `job.application` / `job.application_status` | New job application / Application update | Employer / applicant | Job applications |
| `payment.completed`, `payment.refunded`, `payment.failed` | Payment successful / refunded / rejected | Buyer | Website payments (the app only shows them in the list) |
| `admin.broadcast` | Your title | Chosen audience | An admin sends a push from the Admin Panel |

## Notifications screen

Route `/notifications` (**Notifications**, login required), opened from the bell on Home or **Profile → Notifications**.

| Element | Behaviour |
|---|---|
| List | `GET /notifications`: title (bold while unread), body and age |
| Tap an unread row | `POST /notifications/:id/read` |
| **Mark all read** | `POST /notifications/read-all` |

The bell badge on Home uses `GET /notifications/unread-count` and refreshes when you come back from this screen.

## Send a push from the Admin Panel

**Admin → Push Notifications** ([Push Notifications](doc:admin/push-notifications)) sends an `admin.broadcast`:

| Field | Meaning |
|---|---|
| Title, Body | The notification text (title up to 191 characters, body up to 2000) |
| Target | `all` users, a `role`, one `user`, or `selected` users |
| Item type / Item ID | Optional data attached to the push (for example an ad) |
| Image | Optional image URL, attached to the push and the in-app entry |

Each recipient gets an entry in the Notifications list and a push on every registered device.

:::tip Test a push
Sign in on a phone, put the app in the background, then from a second account send a chat message about one of the first account's ads. A **New message** notification should arrive within seconds. If nothing comes: check notification permission, that the device appears in Firestore `devices` with your user id, and the function logs for `FCM send failed`.
:::

**Next:** [Run the App →](doc:app/run-the-app)
