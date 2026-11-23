---
title: App Prerequisites
description: The tools, accounts and backend you need before you build and publish the Booqora Mobile App for Android and iOS.
---

The **Mobile App** (`booqora_mobile/`) is a Flutter app for Android and iOS. It is the pocket version of the Rental Platform: same Firebase project, same Firestore data, same Cloud Functions. A business signs in with the same account on the web and on the phone and sees the same orders, products and customers.

:::note Set up the platform first
The app has no backend of its own. Create the Firebase project and deploy the Rental Platform, Cloud Functions and security rules **before** you build the app. Follow [Installation Overview](doc:installation/overview) up to [Build & Deploy to Hosting](doc:installation/hosting).
:::

## Tools

| Tool | Version | Used for |
|---|---|---|
| Flutter SDK | **3.41** (stable channel), Dart 3.11 | Everything. `pubspec.yaml` requires `sdk: ^3.11.1` |
| JDK | **17** | Android builds. `build.gradle.kts` compiles for Java 17. Android Studio's bundled JDK (`jbr`) is fine |
| Android Studio | Current stable | Android SDK, emulator, Gradle (Android Gradle Plugin 8.11, Kotlin 2.3) |
| Android SDK | Platform and build tools installed by Android Studio | Builds use Flutter's default `compileSdk`, `targetSdk` and `minSdk` |
| Xcode + CocoaPods | Current stable, **on a Mac** | iOS builds only (deployment target iOS 13.0) |
| FlutterFire CLI | Latest | Generating `firebase_options.dart` for your project |
| Firebase CLI | Latest | Logging in for `flutterfire configure` |
| Git | Any | Optional, for your own version control |

Check the installation:

```bash title="Terminal"
flutter --version
flutter doctor -v
java -version
```

`flutter doctor` should show green ticks for **Flutter**, **Android toolchain** and **Android Studio**. The **Xcode** line only matters if you build for iOS.

Install the FlutterFire CLI once:

```bash title="Terminal"
dart pub global activate flutterfire_cli
firebase login
```

## Accounts

- [x] A **Firebase project** with Authentication (Email/Password), Firestore, Storage and Functions enabled. This is the project you created in [Create the Firebase Project](doc:installation/firebase-project).
- [x] The **Cloud Functions** deployed (`paymentConfig`, `createPayment`, `verifyPayment`, `sendEmail`). The app calls them for online payments and emails. See [Deploy Functions, Rules & Indexes](doc:installation/backend-deploy).
- [x] The **Rental Platform** hosted on your domain. The app opens payment return pages and store links on it.
- [ ] A **Google Play developer account** (one-time USD 25) for publishing on Android.
- [ ] An **Apple Developer Program** membership (USD 99 per year) if you publish on the App Store.
- [ ] A payment provider account (Razorpay, Stripe or PayPal) if you want to collect online payments from the app. Keys live on the server, not in the app ([Payment Gateways](doc:admin/payment-gateways)).

## What is in the folder

```text title="booqora_mobile/"
android/              Gradle project (applicationId, signing, R8 rules)
ios/                  Xcode project (bundle id, Info.plist)
assets/brand/         Logo, app icon and splash images
lib/
  main.dart           Firebase init, theme, router
  firebase_options.dart
  core/               router.dart, theme.dart, browser.dart, format.dart
  data/               Firestore layer shared with the platform
  features/           One folder per module (home, orders, inventory …)
  widgets/            Shared UI (tab shell, sheets, inputs, animations)
pubspec.yaml          Packages, splash config, dependency overrides
```

The `lib/data/` folder (schema, database helpers, rental pricing, session, payments client) mirrors the Rental Platform, so the two apps always agree on field names and pricing rules.

## Hardware

- A Windows, macOS or Linux machine with at least 8 GB RAM (16 GB recommended). `android/gradle.properties` gives Gradle up to 8 GB of heap.
- A **real Android phone** for camera testing. The barcode scanner needs a physical camera; most emulators cannot provide one.
- A Mac only if you ship to iOS.

**Next:** [Firebase Setup →](doc:app/firebase-setup)
