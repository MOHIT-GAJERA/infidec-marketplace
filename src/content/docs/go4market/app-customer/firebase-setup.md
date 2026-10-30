---
title: Firebase Setup
description: Register the Customer app in Firebase, add the SHA-1 and SHA-256 fingerprints for Google and phone sign-in, and place google-services.json.
---

## 1. Register the Android app

Firebase console → Project settings → **Your apps → Add app → Android**:

- **Package name**: `com.go4market.customer`, or your own if you [changed it](doc:app-customer/change-package-name) (do that first).
- **App nickname**: `Go4Market Customer`.
- **SHA-1**: add it now (below), or later under the app's settings.

## 2. Add SHA-1 and SHA-256 fingerprints

Google sign-in and phone OTP on Android only work for signing keys whose fingerprints are registered. Add **both SHA-1 and SHA-256** for **every** key that signs the app:

| Key | When | How to get it |
|---|---|---|
| Debug key | `flutter run` on your PC | `keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android` |
| Upload key | Release builds you install yourself | `keytool -list -v -keystore <your-upload.jks> -alias <alias>` |
| **Play app-signing key** | Builds installed from Google Play | Play Console → your app → **Test and release → App integrity → App signing** |

Alternatively, run `cd android && ./gradlew signingReport` (Windows: `gradlew signingReport`).

:::danger Most "sign-in works in debug but not from Play" problems
Google Play re-signs your app with its own key. If the **app-signing key's** SHA-1 and SHA-256 are not in Firebase, Google sign-in fails with error 10 and phone OTP falls back to reCAPTCHA or fails. Add them as soon as the first release is uploaded.
:::

## 3. Place `google-services.json`

Download the file for this app and copy it to:

```text
apps/customer_app/android/app/google-services.json
```

The Gradle plugin `com.google.gms.google-services` (in `android/app/build.gradle.kts`) reads it for FCM. After you add fingerprints you do not need to re-download it for sign-in, but re-download it whenever you add a new Android app or change the package name.

## 4. Update the Dart Firebase options

The app initialises Firebase from `packages/g4m_core/lib/src/firebase_options.dart` (`G4MFirebaseOptions.androidCustomer`). Copy `mobilesdk_app_id` and `current_key` from your `google-services.json` into that file ([details](doc:installation/connect-your-project#2-firebase-options-for-every-flutter-client)).

## 5. Google sign-in client ID

Set `webClientId` in `apps/customer_app/lib/core/social_auth.dart` to your project's **Web client ID** (Authentication → Sign-in method → Google → Web SDK configuration). See [Sign-in methods](doc:app-customer/auth-methods).

## Checklist

- [x] Android app registered with your package name
- [x] SHA-1 **and** SHA-256 for debug, upload and Play app-signing keys
- [x] `android/app/google-services.json` in place
- [x] `firebase_options.dart` and `webClientId` updated

**Next:** [Run the App →](doc:app-customer/run-the-app)
