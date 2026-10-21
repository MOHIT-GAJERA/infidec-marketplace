---
title: Firebase Setup
description: Register the Customer App in your Firebase project and generate google-services.json and firebase_options.dart.
---

The app talks only to your Firebase project. Connect it **after** you have chosen the final package name ([Change Package Name](doc:app-customer/change-package-name)) — the Firebase Android app is registered under that name.

## Option A — FlutterFire CLI (recommended)

```bash
dart pub global activate flutterfire_cli
npx firebase login
cd customer_app
flutterfire configure --project=yourstore-1a2b3 --platforms=android,ios,web \
  --android-package-name=com.yourstore.customer --ios-bundle-id=com.yourstore.customer
```

This registers the apps in Firebase (if needed) and writes:

| File | Content |
|---|---|
| `lib/firebase_options.dart` | Firebase options per platform |
| `android/app/google-services.json` | Android config (read by the Google Services Gradle plugin) |
| `ios/Runner/GoogleService-Info.plist` | iOS config |

## Option B — Firebase console

1. Project Overview → **Add app → Android**. Package name = your `applicationId` (e.g. `com.yourstore.customer`), nickname *Customer App*.
2. Download **`google-services.json`** into `customer_app/android/app/`.
3. Open `lib/firebase_options.dart` and update the `android` (and `web`) options with your project's values — `apiKey`, `appId`, `messagingSenderId`, `projectId`, `storageBucket`.

## Add the SHA fingerprints (phone OTP)

Phone login on Android needs the SHA-1 **and** SHA-256 of every key that signs the app:

```bash
# debug key (development)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
# your upload key (release)
keytool -list -v -keystore /secure/yourstore-customer-upload.jks -alias upload
```

Firebase console → Project settings → **Your apps** → the Android app → **Add fingerprint** (once per value). After the first Play upload add the **Play App Signing** key too — see [Login Methods & Phone OTP](doc:app-customer/auth-methods).

Or with the CLI:

```bash
npx firebase apps:android:sha:create <ANDROID_APP_ID> <SHA_VALUE> --project yourstore-1a2b3
```

## Check

```bash
flutter run
```

The app starts on the onboarding screen and the location step lists your zones. If it shows "DEMO DATA" or cannot load zones, re-check the project ID in `firebase_options.dart`.

:::note iOS
Add the iOS app (bundle ID), place `GoogleService-Info.plist` in `ios/Runner/`, add the *reversed client ID* URL scheme to `Info.plist`, enable Push Notifications and upload your APNs key in Firebase (Cloud Messaging). A Mac with Xcode is required.
:::

**Next:** [Change Package Name →](doc:app-customer/change-package-name)
