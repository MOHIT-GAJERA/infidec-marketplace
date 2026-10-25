---
title: Push Notifications
description: How the Customer App receives Firebase Cloud Messaging pushes: admin broadcasts through topics, ride and payment updates through the device token, and the setup for Android and iOS.
---

Go4Ride sends push notifications with **Firebase Cloud Messaging (FCM)** from Cloud Functions. There are two kinds:

| Kind | Sent by | Target | Examples |
|---|---|---|---|
| **Broadcast** | Admin → Push notifications → `sendBroadcast` | FCM topic `all` or `customers` | Offers, announcements |
| **Personal** | Ride, payment and cancellation functions → `notifyUser("users", uid, …)` | The `fcmToken` stored on `users/{uid}` | *A driver accepted your ride.*, *Your driver has arrived.*, *No drivers available*, *A cancellation fee of 25 was charged.*, payment results |

## Broadcasts (topics)

When a rider signs in, `lib/app/push_topics.dart` asks for notification permission and subscribes the device to the topics **`all`** and **`customers`** (once per user, Android and iOS only). Anything you send from **Admin → Push notifications** to *Everyone* or *Customers* reaches these devices ([Push Notifications](doc:admin/push-notifications)).

Push is best-effort: on an emulator without Google Play services, or when the rider refuses the permission, subscription is skipped quietly and the app keeps working.

## Personal notifications (device token)

The functions look up `fcmToken` on the rider's `users/{uid}` document. If there is no token, they skip the push.

:::warning The shipped app does not save the token yet
`UserRepository.updateFcmToken` exists in `packages/data`, but the Customer App never calls it. Until you add the lines below, riders receive **broadcasts only**, not the ride-status pushes. The live ride screen still updates in real time, so the ride itself works.
:::

Add the token after sign-in, for example in the auth listener of `lib/app/app.dart`:

```dart title="apps/customer_app/lib/app/app.dart"
ref.listen(authStateProvider, (_, next) {
  final uid = next.valueOrNull;
  if (uid == null) return;
  final push = ref.read(notificationServiceProvider);
  subscribePushTopics(push, uid);

  // Save the device token for personal ride / payment pushes.
  final users = ref.read(userRepositoryProvider);
  push.getToken().then((t) { if (t != null) users.updateFcmToken(uid, t); });
  push.onTokenRefresh().listen((t) => users.updateFcmToken(uid, t));
});
```

`updateFcmToken` updates an existing `users` document, so a first-time rider gets the token saved on the next launch after profile setup. Save it again after **Continue** on the profile screen if you want it immediately.

## What the rider sees

| App state | Behaviour |
|---|---|
| Background or closed | The system shows the notification (title + body) |
| Open (foreground) | Nothing is shown. The app does not listen to foreground messages. The screens update live from Firestore instead |
| Tap on a notification | Opens the app on its last screen. Pushes carry `rideId` and `type` in `data`, but the app does not deep-link yet |

## Android setup

- No extra code. `firebase_messaging` registers its service through the merged manifest.
- Android 13+ asks for the notification permission when the rider signs in. If no prompt appears on your build, add `<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>` to `android/app/src/main/AndroidManifest.xml`.
- Test on a device or an emulator image **with Google Play**.

## iOS setup

1. Apple Developer → Keys → create an **APNs key** (.p8). Firebase → Project settings → Cloud Messaging → upload it with the Key ID and Team ID.
2. Xcode → Runner → Signing & Capabilities → add **Push Notifications** and **Background Modes → Remote notifications**.
3. Run on a real iPhone. The simulator does not receive remote pushes in every Xcode version.

## Test a broadcast

1. Sign in on a phone and accept the permission prompt.
2. Put the app in the background.
3. Admin → **Push notifications** → audience *Customers* → title and message → send it.

The notification arrives within seconds. Firebase console → Messaging also lets you send a test to the `customers` topic.

**Next:** [Run the App →](doc:app-customer/run-the-app)
