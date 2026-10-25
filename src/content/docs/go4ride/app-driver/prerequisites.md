---
title: App Prerequisites
description: What the Go4Ride Driver App does, the tools you need to build it, and how it differs from the Customer App.
---

The Driver App (`apps/driver_app/`) is the app for your drivers. A driver signs in with their phone number, registers a vehicle, uploads KYC documents, waits for approval, goes online, accepts ride requests, runs the trip with the rider's OTP, and tracks wallet, earnings, payouts and subscription plans.

It is a separate Flutter app with its **own package name** (`com.go4ride.driver`) and its own Play Store listing. It lives in the same Pub workspace as the Customer App and shares `packages/core`, `data`, `services` and `ui_kit`.

![Onboarding](/docs/go4ride/images/app-driver-onboarding.webp "First-launch slides")
![Documents](/docs/go4ride/images/app-driver-documents.webp "KYC documents")
![Home offline](/docs/go4ride/images/app-driver-home-offline.webp "Home")
![Request](/docs/go4ride/images/app-driver-request.webp "Ride request")

## Software requirements

The same as the Customer App ([Customer App Prerequisites](doc:app-customer/prerequisites)):

| Tool | Version |
|---|---|
| Flutter SDK | 3.41+ (Dart `^3.11.0`) |
| Java JDK | 17 |
| Android Studio | latest stable, emulator image with Google Play |
| Firebase CLI + FlutterFire CLI | latest |
| Xcode + CocoaPods | latest (macOS, iOS only) |

```bash
flutter doctor -v
flutter pub get          # once, in the repository root
```

## Project settings (as shipped)

| Setting | Value | File |
|---|---|---|
| Android `applicationId` / `namespace` | `com.go4ride.driver` | `android/app/build.gradle.kts` |
| MainActivity | `android/app/src/main/kotlin/com/go4ride/driver/MainActivity.kt` | |
| iOS bundle identifier | `com.go4ride.driver` | `ios/Runner.xcodeproj/project.pbxproj` |
| iOS deployment target | 14.0 | |
| Android label / iOS display name | `driver_app` / `Driver App` (change them, see [Branding](doc:app-driver/branding)) | |
| In-app name | `Go4Ride Driver` | `lib/app/theme_controller.dart` |
| Version | `1.0.0+1` | `pubspec.yaml` |
| Release signing | debug key until you add your own | [Release & Play Store](doc:app-driver/deployment) |

## Permissions

| Platform | Permission | Why |
|---|---|---|
| Android | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` | Share the live position while online |
| Android | none extra for the camera | `image_picker` uses the system camera app for document photos |
| iOS | `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription` | Location |
| iOS | `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription` | Document photos and support attachments |

The manifest has **no** `ACCESS_BACKGROUND_LOCATION` and no foreground service. The driver shares location while the app is open ([Going Online & Live Location](doc:app-driver/going-online)).

## Main packages

| Purpose | Package |
|---|---|
| State and navigation | `flutter_riverpod`, `go_router` |
| Firebase | `firebase_core`, `firebase_auth`, `cloud_firestore`, `firebase_database`, `firebase_storage`, `cloud_functions`, `firebase_messaging` |
| Location | `geolocator` (`google_maps_flutter` is included; the current screens show no map) |
| Documents | `image_picker` (camera or gallery) |
| OTP entry | `pinput` |
| Other | `shared_preferences` (onboarding seen), `url_launcher`, `package_info_plus`, `flutter_markdown_plus`, `intl` |
| Branding | `flutter_launcher_icons`, `flutter_native_splash` |

## Admin setup the driver app depends on

| Admin page | Used for |
|---|---|
| [Vehicle Types, Brands & Models](doc:admin/vehicles) | Registration dropdowns |
| [Driver Documents](doc:admin/driver-documents) | Which documents to upload, two-sided, expiry |
| [Drivers & KYC](doc:admin/drivers) | Approve or reject documents, block drivers |
| Settings → **Driver & ride** | Minimum wallet, accept window, search radius, waiting time |
| [Driver Subscriptions](doc:admin/subscriptions) | Plans in the app |
| [Payout Requests](doc:admin/payouts) | Withdrawal approvals |

**Next:** [Firebase Setup →](doc:app-driver/firebase-setup)
