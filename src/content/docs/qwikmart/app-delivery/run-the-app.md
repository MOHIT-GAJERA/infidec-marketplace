---
title: Run the App
description: Run the Delivery Boy App against your Firebase project, the local emulators or the offline demo.
---

```bash
cd delivery_app
flutter pub get
```

| Goal | Command |
|---|---|
| Your Firebase project | `flutter run` |
| Local emulators | `flutter run --dart-define=USE_EMULATORS=true` |
| Real phone + emulators | `flutter run --dart-define=USE_EMULATORS=true --dart-define=EMULATOR_HOST=192.168.1.20` |
| Offline demo | `flutter run --dart-define=USE_MOCK=true` (OTP `123456`) |

## End-to-end test with the customer app

1. Register a rider in the app → approve it in **Admin → Delivery Boys → Pending Approvals**.
2. Rider: **Go online** (allow location and notifications).
3. Customer app/website: place a COD order in the same zone.
4. Rider: Accept → Picked up → Out for delivery → Deliver with the OTP from the customer's order screen.
5. Check Admin → Orders (*Delivered*), Earnings and Cash Collection.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Pending approval" forever | Approve the rider in the Admin Panel and make sure a zone is selected |
| No available orders | Rider's zone differs from the order's zone, the rider is offline, or the order was already assigned |
| Location not updating on the customer's map | Location permission denied or battery optimisation kills the app — allow "unrestricted" battery for the app on aggressive phones |
| "Sign-in is not available" | `firebase_options.dart` / `google-services.json` do not match the package name |

**Next:** [Release & Play Store →](doc:app-delivery/deployment)
