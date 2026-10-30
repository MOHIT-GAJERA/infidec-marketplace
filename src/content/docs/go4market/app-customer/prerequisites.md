---
title: App Prerequisites
description: What you need before configuring, building and publishing the Go4Market Customer app.
---

The **Customer app** (`apps/customer_app`, package `com.go4market.customer`) is the Flutter shopping app for Android. It shares models, theme and Firebase options with every other client through `packages/g4m_core`.

![Customer app home](/docs/go4market/images/app-customer-home.webp "The Customer app home: module tabs, search with voice, hero banner and categories")

## Before you start

- [x] The backend is deployed and seeded ([Installation](doc:installation/overview))
- [x] `packages/g4m_core/lib/src/firebase_options.dart` points to your project ([Connect the Code](doc:installation/connect-your-project#2-firebase-options-for-every-flutter-client))
- [x] You have decided on your **package name** (for example `com.yourmarket.customer`)

## Tools

| Tool | Version |
|---|---|
| Flutter | 3.41 stable (Dart 3.11) |
| Android Studio | Latest, with the current Android SDK and an emulator |
| JDK | 17 (bundled with Android Studio) |
| A real Android phone | Recommended for location, voice search and push |

```bash
flutter doctor
cd apps/customer_app
flutter pub get
```

## Project layout

```text title="apps/customer_app/"
android/                    Gradle (Kotlin DSL), manifest, google-services.json, key.properties
assets/brand/               logo.png, icon.png, icon_foreground.png, splash_android12.png
lib/main.dart               entry point: preferences, background push handler, edge-to-edge
lib/app.dart                MaterialApp, theme, localisation
lib/core/                   data access, payments, push, location, Google/phone sign-in, theme
lib/screens/                splash, onboarding, auth, home, categories, search, product, cart,
                            orders, wallet, wishlist, location, profile, shell
lib/l10n/                   app_en.arb, app_hi.arb (generated AppLocalizations)
l10n.yaml · pubspec.yaml    localisation and dependencies (icons and splash config included)
```

## Key packages

`firebase_core`, `firebase_auth`, `cloud_firestore`, `cloud_functions`, `firebase_messaging`, `flutter_local_notifications`, `google_sign_in`, `razorpay_flutter`, `url_launcher`, `flutter_map` + `latlong2` (OpenStreetMap), `geolocator`, `speech_to_text` (voice search), `share_plus`, `package_info_plus` (force update), `google_fonts`.

:::note iOS
The project includes an `ios/` folder, but Firebase is configured only for Android and web. To ship on iOS, add an iOS app in Firebase, `GoogleService-Info.plist`, iOS `FirebaseOptions` in `firebase_options.dart`, and the Razorpay/Google sign-in iOS settings.
:::

**Next:** [Firebase Setup →](doc:app-customer/firebase-setup)
