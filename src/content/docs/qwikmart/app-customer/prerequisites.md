---
title: App Prerequisites
description: Tools to install before configuring and building the QwikMart Customer App (Flutter).
---

The Customer App (`customer_app/`) is a Flutter application for Android and iOS. Install these tools first.

![Customer app screens](/docs/qwikmart/images/app-customer-home.webp "Home")
![Product](/docs/qwikmart/images/app-customer-product.webp "Product")
![Cart](/docs/qwikmart/images/app-customer-cart.webp "Cart & checkout")
![Tracking](/docs/qwikmart/images/app-customer-tracking.webp "Live tracking")

## Software requirements

| Tool | Tested version | Notes |
|---|---|---|
| Flutter SDK | 3.41+ (stable channel) | [flutter.dev/get-started](https://docs.flutter.dev/get-started/install) |
| Dart | bundled with Flutter | |
| Java JDK | 21 | Android Studio ships one (`jbr`) |
| Android Studio | latest stable | Android SDK, emulator, SDK command-line tools |
| Xcode | 26+ | macOS only, for iOS |
| CocoaPods | latest | macOS only |
| FlutterFire CLI | latest | `dart pub global activate flutterfire_cli` |
| Firebase CLI | 14+ | `npm install -g firebase-tools` (or `npx firebase`) |

## Android settings

Already configured in `android/app/build.gradle.kts`:

- `compileSdk` / `targetSdk` **36** (Google Play requires API 36 for new apps and updates from 31 August 2026)
- `minSdk` **24** (Android 7.0)
- R8 code shrinking for release builds with keep rules for Razorpay (`android/app/proguard-rules.pro`)

## Verify your setup

```bash
flutter doctor -v
```

All Android checks (and Xcode on a Mac) must be green. Then:

```bash
cd customer_app
flutter pub get
```

## Main packages

| Purpose | Package |
|---|---|
| State management | `flutter_riverpod` |
| Navigation | `go_router` |
| Firebase | `firebase_core`, `firebase_auth`, `cloud_firestore`, `cloud_functions`, `firebase_storage`, `firebase_messaging` |
| Maps & location | `flutter_map` (OpenStreetMap — no API key), `geolocator`, `geocoding` |
| Payments | `razorpay_flutter` |
| Fonts | `google_fonts` (Plus Jakarta Sans) |

## Configuration switches

`lib/core/config.dart` — all values can be overridden with `--dart-define`:

| Define | Default | Use |
|---|---|---|
| `USE_EMULATORS` | `false` | Connect to the local Firebase Emulator Suite |
| `EMULATOR_HOST` | `10.0.2.2` (Android) | LAN IP of your PC for a real phone |
| `USE_MOCK` | `false` | Offline demo data, no Firebase |

:::warning
Release builds must use the defaults — never pass `USE_EMULATORS` or `USE_MOCK` to `flutter build`.
:::

**Next:** [Firebase Setup →](doc:app-customer/firebase-setup)
