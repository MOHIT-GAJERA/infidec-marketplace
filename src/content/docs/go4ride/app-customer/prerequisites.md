---
title: App Prerequisites
description: Tools, accounts and keys you need before you configure, brand and build the Go4Ride Customer App for Android and iOS.
---

The Customer App (`apps/customer_app/`) is the **rider app**. Riders sign in with their phone number, book a City cab, Intercity (sharing or personal), Rental or Parcel ride, track the driver live, pay with cash, the Go4Ride wallet or online (Razorpay, Stripe, PayPal) and raise support tickets.

It is a Flutter app inside the Go4Ride **Pub workspace**. It shares models, repositories, services and the design system with the Driver App and the Admin Panel through `packages/core`, `packages/data`, `packages/services` and `packages/ui_kit`. It talks **directly to Firebase**. There is no separate API server.

![Login](/docs/go4ride/images/app-customer-login.webp "Phone login")
![Home](/docs/go4ride/images/app-customer-home.webp "Home: map and services")
![Ride](/docs/go4ride/images/app-customer-ride.webp "Live ride")
![Wallet](/docs/go4ride/images/app-customer-wallet.webp "Wallet")

## Before you start

Finish the backend first. The app has nothing to show until your Firebase project exists, the backend is deployed and the catalogue is loaded:

1. [Create the Firebase Project](doc:installation/firebase-project) (Blaze plan, Phone sign-in enabled).
2. [Deploy the Backend](doc:installation/backend-deploy) (Cloud Functions, rules, indexes).
3. [Admin Panel Installation](doc:installation/admin-panel), then **Load defaults** on Services, Vehicle types, Rental packages and the reason lists.

## Software requirements

| Tool | Version | Notes |
|---|---|---|
| Flutter SDK | 3.41+ (stable) | `pubspec.yaml` requires `flutter: ">=3.41.0"` and Dart `^3.11.0` |
| Java JDK | 17 | The Android build compiles for Java 17. Android Studio's bundled `jbr` works |
| Android Studio | latest stable | Android SDK, platform tools, an emulator image with **Google Play** |
| Firebase CLI | latest | `npm i -g firebase-tools`, used by FlutterFire |
| FlutterFire CLI | latest | `dart pub global activate flutterfire_cli` |
| Xcode + CocoaPods | latest stable | macOS only, for iOS builds |

```bash
flutter doctor -v
```

All Android checks (and Xcode checks on a Mac) must be green.

## Accounts and keys

| What | Where | Used for |
|---|---|---|
| Firebase project | [console.firebase.google.com](https://console.firebase.google.com) | Auth (phone OTP), Firestore, Realtime Database, Storage, Functions, FCM |
| Google Maps API key | Google Cloud console | Map, place search, reverse geocoding, routes ([Google Maps & Location](doc:app-customer/maps-location)) |
| Google Play developer account | [play.google.com/console](https://play.google.com/console) | Publishing ([Release & Play Store](doc:app-customer/deployment)) |
| Apple Developer Program | developer.apple.com | iOS builds and APNs key (optional) |
| Payment gateway accounts | Razorpay / Stripe / PayPal | Online payments. Keys go in the Admin Panel, not in the app ([Payment Gateways](doc:admin/payment-gateways)) |

## Project settings (as shipped)

| Setting | Value | File |
|---|---|---|
| Android `applicationId` / `namespace` | `com.go4ride.customer` | `android/app/build.gradle.kts` |
| iOS bundle identifier | `com.go4ride.customer` | `ios/Runner.xcodeproj/project.pbxproj` |
| `minSdk` / `targetSdk` / `compileSdk` | from your Flutter SDK (`flutter.minSdkVersion` …) | `android/app/build.gradle.kts` |
| iOS deployment target | 14.0 | `project.pbxproj` |
| Version | `1.0.0+1` | `pubspec.yaml` |
| Android permissions | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` (plus what the plugins merge in) | `AndroidManifest.xml` |
| Release signing | **debug key** until you add your own | see [Release & Play Store](doc:app-customer/deployment) |

## Main packages

| Purpose | Package |
|---|---|
| State and navigation | `flutter_riverpod`, `go_router` |
| Firebase | `firebase_core`, `firebase_auth`, `cloud_firestore`, `firebase_database`, `firebase_storage`, `cloud_functions`, `firebase_messaging` |
| Maps and location | `google_maps_flutter`, `geolocator` |
| Other | `url_launcher` (calls, e-mail, WhatsApp, payment pages), `image_picker` (ticket photos), `flutter_markdown_plus` (About / Privacy / Terms), `package_info_plus` (update check), `intl` |
| Branding | `flutter_launcher_icons`, `flutter_native_splash` (dev dependencies) |

## Get the dependencies

The repository is one workspace, so run `pub get` once from the repository root:

```bash
# in the repository root (the folder that contains apps/, packages/ and functions/)
flutter pub get
```

## Order of the next pages

:::steps
### Choose your package name
[Change Package Name](doc:app-customer/change-package-name). Do this **before** Firebase, because the Firebase Android app is registered under it.

### Connect Firebase
[Firebase Setup](doc:app-customer/firebase-setup) with FlutterFire.

### Brand the app
[App Name, Logo & Splash](doc:app-customer/branding) and [Theme Colours & Fonts](doc:app-customer/change-theme).

### Add the Maps key and run
[Google Maps & Location](doc:app-customer/maps-location), then [Run the App](doc:app-customer/run-the-app).
:::

**Next:** [Firebase Setup →](doc:app-customer/firebase-setup)
