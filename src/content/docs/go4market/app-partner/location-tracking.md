---
title: Live Location (Foreground Service)
description: How the Partner app tracks riders while they are online, the Android permissions and foreground service involved, write throttling, and the Play Store declaration.
---

Live tracking is implemented in `apps/partner_app/lib/core/location_service.dart`.

## How it works

- Tracking runs **only while the rider is Online**. Going offline stops it.
- On Android it runs as a **foreground service** with a visible notification ("You are online"), so it continues while the app is in the background or the screen is off.
- Positions come from `geolocator` with high accuracy. Writes to Firestore are **throttled**: at most every **15 seconds**, or sooner once the rider has moved **30 metres**.
- Each write updates only `online`, `lat`, `lng` and `locationUpdatedAt` on `deliveryPartners/{uid}`, the only fields the security rules allow.
- The `onDeliveryPartnerWritten` function copies the position to `orders/{id}.riderLocation` for the rider's active orders. That is what the customer's map shows ([Live Rider Map](doc:admin/live-map)).

## Permissions

Declared in `apps/partner_app/android/app/src/main/AndroidManifest.xml`:

| Permission | Why |
|---|---|
| `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` | Position while the app is in use |
| `ACCESS_BACKGROUND_LOCATION` | Position while the app is in the background |
| `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_LOCATION` | The tracking service (Android 14 requires the *location* type) |
| `POST_NOTIFICATIONS` | The tracking notification and order alerts (Android 13+) |
| `WAKE_LOCK` | Keep the service alive |
| `CAMERA` | Barcode scanning and photos (seller role) |

Before asking, the app shows a short explanation screen, then the system prompts. Riders should choose **Allow all the time** when offered.

:::warning Battery savers
Some manufacturers stop background services aggressively. If location stops updating, ask riders to exclude the app from battery optimisation (Settings → Apps → Go4Market Partner → Battery → Unrestricted).
:::

## Google Play declaration

Because the app uses background location and a location foreground service, Play Console requires a **permission declaration** and a short video. Use the text in [Google Play Listing & Review](doc:app-customer/play-console#partner-app-background-location-and-foreground-service).

If you prefer to skip that review, remove `ACCESS_BACKGROUND_LOCATION` from the manifest. Tracking then continues as long as the app is open or the foreground notification is active.

## Firestore cost

Each online rider writes at most about 4 times a minute, and each write triggers `onDeliveryPartnerWritten`. Fifty riders online for 8 hours make roughly 100,000 writes a day, which is beyond the 20,000-write free tier but costs only cents. Increase `writeEvery` / `writeAfterMeters` in `location_service.dart` to write less often.

**Next:** [Push Notifications →](doc:app-partner/notifications)
