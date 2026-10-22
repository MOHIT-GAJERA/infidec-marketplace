---
title: App Prerequisites
description: Tools to install before you configure and build the Go4Foodie mobile app (Flutter, Android and iOS).
---

The mobile app (`mobile-app/`) is **one Flutter application** for Android and iOS. It contains three apps in one. On the first screen the user picks **Customer App**, **Restaurant App** (staff POS) or **Owner App**. All three use the same backend: the `api` Cloud Function, which serves the `/api/mobile/*` routes.

![Welcome](/docs/go4foodie/images/app-welcome.webp "First screen: choose Customer, Restaurant or Owner")
![Login](/docs/go4foodie/images/app-login.webp "Sign in")
![Customer home](/docs/go4foodie/images/app-customer-home.webp "Customer App")
![Restaurant floor](/docs/go4foodie/images/app-restaurant-floor.webp "Restaurant App")
![Owner dashboard](/docs/go4foodie/images/app-owner-dashboard.webp "Owner App")

## Software requirements

| Tool | Version | Notes |
|---|---|---|
| Flutter SDK | 3.41+ (stable channel) | `pubspec.yaml` requires Dart SDK `^3.11.1`. See [flutter.dev/get-started](https://docs.flutter.dev/get-started/install) |
| Dart | bundled with Flutter | |
| Java JDK | 17 or newer | The Android build compiles for Java 17. Android Studio ships a JDK (`jbr`) |
| Android Studio | latest stable | Android SDK, emulator, SDK command-line tools |
| Xcode | latest stable | macOS only, for iOS |
| CocoaPods | latest | macOS only |

You do **not** need the Firebase CLI, FlutterFire or a `google-services.json` for the app. It does not use the Firebase SDKs. It talks to your backend over HTTPS with a JSON API and a bearer token.

## Android settings

These are already set in `android/app/build.gradle.kts`:

- `namespace` / `applicationId` **`com.go4foodie.app`**. Change it before you publish ([Change Package Name](doc:app/change-package-name)).
- `minSdk`, `targetSdk` and `compileSdk` come from your Flutter SDK (`flutter.minSdkVersion`, `flutter.targetSdkVersion`). The Play release kit lists Android 7.0 (API 24) as the minimum and API 36 as the target.
- Kotlin `2.2.20`, Java 17.
- Release signing reads `android/key.properties` ([Release & Play Store](doc:app/deployment)).
- Permissions: `INTERNET` and `CAMERA` (the table QR scanner).

## iOS settings

- Bundle identifier **`com.go4foodie.app`**. Display name **Go4Foodie**.
- Deployment target **iOS 13.0**.

:::warning Add the camera permission text before building for iOS
`ios/Runner/Info.plist` has no `NSCameraUsageDescription`. Without it iOS closes the app when the customer opens **Scan table QR**. Add the key before your first iOS build (see [Release & Play Store](doc:app/deployment#ios-camera-permission)).
:::

## Verify your setup

```bash
flutter doctor -v
```

All Android checks must be green, and so must the Xcode checks on a Mac. Then run:

```bash
cd mobile-app
flutter pub get
```

## Main packages

| Purpose | Package |
|---|---|
| State management | `flutter_riverpod` |
| Navigation | `go_router` |
| HTTP client | `dio` (JSON, 12 s connect and 25 s receive timeouts) |
| Session storage | `flutter_secure_storage` (token, role, profile), `shared_preferences` (server address, theme, last used app) |
| Images | `cached_network_image` |
| Charts | `fl_chart` (Owner dashboard and reports) |
| Payments | `webview_flutter` (Razorpay Checkout / Stripe Payment Element in a WebView) |
| QR codes | `mobile_scanner` (scan table QR), `qr_flutter` (show a table's QR in **Tables & QR**) |
| Fonts | `google_fonts` (Manrope for text, Fraunces for headings) |
| Branding | `flutter_launcher_icons`, `flutter_native_splash` |
| Other | `intl`, `smooth_page_indicator`, `cupertino_icons` |

## Build-time switches

`lib/core/api.dart` reads two values. You can override both with `--dart-define`:

| Define | Use |
|---|---|
| `API_BASE_URL` | Base URL of your backend (the Firebase Hosting site that rewrites `/api/**` to the `api` function) |
| `SITE_ORIGIN` | Your public website origin. The payment WebView loads under it, because gateways check the domain |

Details are on the next page.

:::note No push notifications
The app has no Firebase Cloud Messaging and asks for no notification permission. Staff see new orders through screens that refresh on a timer (floor every 8 s, orders board every 10 s, owner dashboard every 30 s). Customers see order status the same way (order detail every 10 s).
:::

**Next:** [API Configuration →](doc:app/api-configuration)
