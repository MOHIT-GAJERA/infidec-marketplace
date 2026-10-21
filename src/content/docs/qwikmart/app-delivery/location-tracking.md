---
title: Live Location (Foreground Service)
description: How rider location is shared while online, and the Google Play foreground-service declaration it requires.
---

When a rider taps **Go online**, the app starts a **location foreground service** with a persistent notification (*"QwikMart Delivery – you are online"*). While online, the rider's position is written to Firestore every **10 seconds** (configurable in Admin → System Settings → Delivery → *Rider location interval*) and copied to their active orders, so:

- nearby orders can be offered / auto-assigned to the closest rider, and
- the customer sees the rider moving on the tracking map.

Going **offline** (or logging out) stops the service and the notification. The app does **not** request background location (`ACCESS_BACKGROUND_LOCATION`) — tracking runs only through the visible foreground service.

## Android permissions (already in the manifest)

```xml title="android/app/src/main/AndroidManifest.xml"
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

Change the notification texts in `lib/core/location_service.dart` (`ForegroundNotificationConfig`).

## Google Play: foreground service declaration

Because the app uses `FOREGROUND_SERVICE_LOCATION`, Play Console → **Policy → App content → Foreground service permissions** must be completed:

:::steps
### Type
Select **Location**.

### Task description
*"Delivery partner live location during an active shift. While the rider is online the app shows a persistent notification and sends the GPS position about every 10 seconds so nearby orders can be offered and customers can track their delivery. It starts when the rider taps Go online and stops when they go offline or sign out."*

### Impact if deferred
*"Customers lose live tracking and order assignment uses a stale position."*

### Video
Record 30–90 seconds on a real phone: log in → **Go online** → allow location → show the notification → switch to another app (notification stays) → back → **Go offline** → notification disappears. Upload to YouTube as **Unlisted** and paste the link.
:::

:::tip Show a short explanation before asking for location
Reviewers like a prominent disclosure: *"YourStore Delivery collects your location while you are online to offer orders near you and let customers track their delivery."*
:::

**Next:** [Delivery Workflow & OTP →](doc:app-delivery/workflow)
