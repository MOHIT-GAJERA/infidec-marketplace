---
title: Run the App
description: Run the Customer App on an emulator or phone against your Firebase project, the local emulators or offline demo data.
---

```bash
cd customer_app
flutter pub get
flutter devices                 # list emulators / phones
```

| Goal | Command |
|---|---|
| Your live Firebase project | `flutter run` |
| Local Firebase Emulator Suite | `flutter run --dart-define=USE_EMULATORS=true` |
| Real phone + emulators on your PC | `flutter run --dart-define=USE_EMULATORS=true --dart-define=EMULATOR_HOST=192.168.1.20` |
| Offline demo (no Firebase) | `flutter run --dart-define=USE_MOCK=true` |
| Release build on a phone | `flutter run --release` |

## First-run walkthrough

1. Onboarding (3 slides) → **Location**: *Use current location* or choose a city.
2. Home: Quick / eCommerce toggle, categories, banners, product sliders.
3. Add to cart → **Login** (phone OTP or e-mail) → checkout → place a COD order.
4. **My Orders** → live status, delivery OTP, tracking once a rider is out for delivery.

![Order](/docs/qwikmart/images/app-customer-order.webp "Order detail with delivery OTP")
![Tracking](/docs/qwikmart/images/app-customer-tracking.webp "Live tracking")
![Category](/docs/qwikmart/images/app-customer-category.webp "Categories")
![Wallet](/docs/qwikmart/images/app-customer-wallet.webp "Wallet")

## Troubleshooting

| Problem | Fix |
|---|---|
| "DEMO DATA" badge / sample products | Firebase failed to start — check `firebase_options.dart` and `google-services.json` belong to your project and package name |
| OTP opens a browser reCAPTCHA | Add the SHA-1/SHA-256 of the signing key in Firebase ([details](doc:app-customer/auth-methods)) |
| "We don't deliver here" | No zone contains the location — draw zones in Admin → Zones |
| Every action fails with *internal* / *not-found* | Functions region mismatch or functions not deployed ([Environment](doc:installation/environment-configuration#functions-region)) |
| Lists stay empty with an index error in the log | Firestore indexes still building, or not deployed |

## Tests

```bash
flutter analyze
flutter test
```

**Next:** [Release & Play Store →](doc:app-customer/deployment)
