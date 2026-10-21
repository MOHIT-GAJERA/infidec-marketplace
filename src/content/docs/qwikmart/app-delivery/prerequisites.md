---
title: App Prerequisites
description: Tools and setup for the QwikMart Delivery Boy App (Flutter).
---

The Delivery Boy App (`delivery_app/`) is used by your riders to register, go online, accept orders, navigate, deliver with OTP and track earnings.

![Login](/docs/qwikmart/images/app-delivery-login.webp "Login")
![Home](/docs/qwikmart/images/app-delivery-home.webp "Home — go online")
![Orders](/docs/qwikmart/images/app-delivery-orders.webp "Orders")
![Workflow](/docs/qwikmart/images/app-delivery-workflow.webp "Delivery workflow")

## Requirements

The same tools as the Customer App — see [Customer App → Prerequisites](doc:app-customer/prerequisites): Flutter 3.41+, Java 21, Android Studio, FlutterFire CLI (Xcode on macOS for iOS).

```bash
cd delivery_app
flutter doctor -v
flutter pub get
```

## Configuration switches

`lib/core/config.dart` (override with `--dart-define`):

| Define | Default | Use |
|---|---|---|
| `USE_EMULATORS` | `false` | Local Firebase Emulator Suite |
| `EMULATOR_HOST` | `10.0.2.2` on Android | LAN IP for a real phone |
| `USE_MOCK` | `false` | Offline demo |
| `FALLBACK_TO_MOCK` | `false` | Development only — falls back to demo data when Firebase is unreachable |

:::danger Production builds
Build releases with the defaults (`flutter build appbundle --release --dart-define=FALLBACK_TO_MOCK=false` is the safest command). Never ship a build that can fall back to demo data.
:::

## Firebase services used

Authentication (e-mail/password), Firestore (orders in real time, rider location), Cloud Functions (accept, status, deliver, withdraw), Storage (licence and ID documents), Cloud Messaging (new-order alerts).

**Next:** [Firebase Setup →](doc:app-delivery/firebase-setup)
