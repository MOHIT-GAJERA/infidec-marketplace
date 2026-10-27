---
title: App Prerequisites
description: Tools, accounts and keys you need before you configure, brand and build the ClassiAds-Hub Flutter app for Android and iOS.
---

The mobile app (`mobile/`) is the buyer and seller app of ClassiAds-Hub. Users browse and search ads, post their own ads with photos and category fields, chat with sellers, send offers, follow sellers, leave reviews, apply for jobs, request a verified badge and get push notifications.

It is a single Flutter project. It does **not** read Firestore directly for business data. Every screen calls the **Cloud Functions REST API** (`/api/v1/*`) with the signed-in user's Firebase ID token. Firebase is used in the app for **Authentication**, **Cloud Messaging** (push), **Analytics** and **Crashlytics**.

![Home](/docs/classiadshub/images/app-home.webp "Home")
![Ad detail](/docs/classiadshub/images/app-ad-detail.webp "Ad detail")
![Post an ad](/docs/classiadshub/images/app-post-ad.webp "Post an Ad")
![Chat](/docs/classiadshub/images/app-chat.webp "Chat with offers")

:::note No in-app purchases
The app sells nothing. Premium packages, featured-ad checkout and transaction history were removed from the app, so Google Play Billing rules do not apply. Sellers buy packages and featured ads **on the website** ([Plans, Featured Ads & Checkout](doc:web/checkout)).
:::

## Before you start

Finish the backend first. The app shows sample data (or nothing) until the API is live and the catalogue is loaded:

1. [Create the Firebase Project](doc:installation/firebase-project) on the Blaze plan.
2. [Deploy the Backend](doc:installation/backend-deploy) (the `api` function, rules, indexes).
3. [Admin Panel Installation](doc:installation/admin-panel) and [Create the First Admin](doc:installation/super-admin).
4. Add categories, custom fields and locations (countries, states, cities) in the Admin Panel. The Post an Ad form reads them.

## Software requirements

| Tool | Version | Notes |
|---|---|---|
| Flutter SDK | 3.41+ (stable) | `pubspec.yaml` requires Dart `^3.11.1` |
| Java JDK | 17 | `build.gradle.kts` compiles for Java 17. Android Studio's bundled `jbr` works |
| Android Studio | latest stable | Android SDK, platform tools, an emulator image **with Google Play** (needed for Google sign-in and Maps) |
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
| Firebase project | [console.firebase.google.com](https://console.firebase.google.com) | Auth (email/password, Google), FCM, Analytics, Crashlytics. The same project that runs the API |
| Google Maps API key | Google Cloud console | Map on the ad detail screen ([Google Maps & Location](doc:app/maps-location)) |
| Google Play developer account | [play.google.com/console](https://play.google.com/console) | Publishing ([Release & Play Store](doc:app/deployment)) |
| Apple Developer Program | developer.apple.com | iOS builds and an APNs key for iOS push (optional) |

Payment gateway keys are **not** needed for the app.

## Project settings (as shipped)

| Setting | Value | File |
|---|---|---|
| Dart package name | `classiads_hub` | `pubspec.yaml` |
| Android `applicationId` / `namespace` | `com.classiads.classiads_hub` | `android/app/build.gradle.kts` |
| iOS bundle identifier | `com.classiads.classiadsHub` | `ios/Runner.xcodeproj/project.pbxproj` |
| App name | `ClassiAds Hub` | `AndroidManifest.xml`, `Info.plist`, `lib/core/config/app_config.dart` |
| `minSdk` / `targetSdk` / `compileSdk` | from your Flutter SDK (`flutter.minSdkVersion` …) | `android/app/build.gradle.kts` |
| iOS deployment target | 13.0 | `project.pbxproj` |
| Version | `1.0.0+1` | `pubspec.yaml` |
| API base URL | the `api` Cloud Function of the demo project | `lib/core/config/app_config.dart` ([API Configuration](doc:app/api-configuration)) |
| Release signing | `android/key.properties`, falls back to the **debug key** when missing | [Release & Play Store](doc:app/deployment) |

## Main packages

| Purpose | Package |
|---|---|
| State and navigation | `flutter_riverpod`, `go_router` |
| Networking | `dio` (REST API client in `lib/core/network/api_client.dart`) |
| Firebase | `firebase_core`, `firebase_auth`, `firebase_messaging`, `firebase_analytics`, `firebase_crashlytics` (plus `cloud_firestore`, `firebase_storage`, `firebase_remote_config`, which are wired as providers but not used by any screen) |
| Notifications | `flutter_local_notifications` |
| Maps and location | `google_maps_flutter`, `geolocator`, `geocoding` |
| Media | `image_picker`, `cached_network_image` |
| Local storage | `shared_preferences` (onboarding flag, language, currency, location label) |
| Branding | `flutter_launcher_icons`, `flutter_native_splash` (dev dependencies) |

## Folder structure

| Path | Content |
|---|---|
| `lib/main.dart` | Firebase init, Crashlytics hooks, FCM background handler, `MaterialApp.router` |
| `lib/firebase_options.dart` | Firebase options per platform (FlutterFire output) |
| `lib/core/config/app_config.dart` | App name, API base URL, Maps key, storage keys |
| `lib/core/router/app_router.dart` | All routes and the login / onboarding redirects |
| `lib/core/theme/app_theme.dart` | Brand colours and Material 3 theme |
| `lib/core/network/` | API client, error type, pagination |
| `lib/core/services/` | `location_service.dart`, `notification_service.dart` |
| `lib/core/dummy/dummy_data.dart` | Sample data shown when the API cannot be reached |
| `lib/features/*` | One folder per area: `auth`, `home`, `ads`, `chat`, `profile`, `verification`, `seller`, `reviews`, `jobs`, `blog`, `content`, `notifications`, `settings`, `shell` |
| `lib/shared/` | Models (`ad.dart`, `category.dart`) and widgets |
| `assets/` | `app-icon.png`, `512.png` (splash), `slide1-3.png` (onboarding), `emty-data.png` |

## Get the dependencies

```bash
cd mobile
flutter pub get
```

## Order of the next pages

:::steps
### Choose your package name
[Change Package Name](doc:app/change-package-name). Do this **before** Firebase, because the Firebase Android app is registered under it.

### Connect Firebase
[Firebase Setup](doc:app/firebase-setup) with FlutterFire, plus the SHA fingerprints.

### Brand the app
[App Name, Logo & Splash](doc:app/branding) and [Theme Colours & Fonts](doc:app/change-theme).

### Point it at your API and add the Maps key
[API Configuration](doc:app/api-configuration) and [Google Maps & Location](doc:app/maps-location), then [Run the App](doc:app/run-the-app).
:::

**Next:** [Firebase Setup →](doc:app/firebase-setup)
