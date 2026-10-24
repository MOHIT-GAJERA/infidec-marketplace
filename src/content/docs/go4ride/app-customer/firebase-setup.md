---
title: Firebase Setup
description: Register the Customer App in your Firebase project with FlutterFire and generate firebase_options.dart, google-services.json and GoogleService-Info.plist.
---

The Customer App uses the Firebase SDKs directly: **Authentication** (phone OTP), **Cloud Firestore** (rides, users, settings, catalogue), **Realtime Database** (live driver positions in `driver_locations`), **Cloud Storage** (support photos), **Cloud Functions** (`createPayment`, `checkPayment`) and **Cloud Messaging** (push).

The files in the download still point to the author's demo project. Replace them with your own project **after** you have chosen the final package name ([Change Package Name](doc:app-customer/change-package-name)), because the Firebase Android app is registered under that name.

## Option A: FlutterFire CLI (recommended)

```bash
npm i -g firebase-tools
dart pub global activate flutterfire_cli
firebase login

cd apps/customer_app
flutterfire configure --project=your-project-id \
  --platforms=android,ios,web \
  --android-package-name=com.yourcompany.rider \
  --ios-bundle-id=com.yourcompany.rider
```

It registers the apps in your project (if needed) and overwrites:

| File | Content |
|---|---|
| `lib/firebase_options.dart` | `DefaultFirebaseOptions` for android, ios and web |
| `android/app/google-services.json` | Android config, read by the `com.google.gms.google-services` Gradle plugin |
| `ios/Runner/GoogleService-Info.plist` | iOS config |
| `firebase.json` (in `apps/customer_app/`) | FlutterFire's record of the project and app IDs |

`web` is optional. It is only useful for running the app in Chrome against the emulators.

:::warning Check the project ID afterwards
Open `lib/firebase_options.dart` and make sure every `projectId` is **your-project-id**. If the app still opens with someone else's data, FlutterFire did not overwrite the file. Run the command again from inside `apps/customer_app`.
:::

## Option B: Firebase console

1. Project Overview → **Add app → Android**. Package name = your `applicationId`, nickname *Go4Ride Customer*.
2. Download **`google-services.json`** into `apps/customer_app/android/app/`.
3. Add an **iOS** app with your bundle ID and put **`GoogleService-Info.plist`** in `apps/customer_app/ios/Runner/`.
4. Edit `lib/firebase_options.dart` and replace `apiKey`, `appId`, `messagingSenderId`, `projectId`, `databaseURL` and `storageBucket` for each platform with the values from Project settings → Your apps.

`databaseURL` matters. The live driver marker on the ride screen reads the Realtime Database, so the URL must be your project's RTDB instance.

## SHA fingerprints (required for phone OTP)

Android phone sign-in only works when Firebase knows the SHA-1 **and** SHA-256 of every key that signs the app:

```bash
# debug key (flutter run)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# your upload key (release builds)
keytool -list -v -keystore android/app/upload-keystore.jks -alias upload
```

Firebase console → Project settings → **Your apps** → the Android app → **Add fingerprint** (once per value). After your first Play upload, also add the **App signing key** fingerprints from Play Console → Test and release → App integrity ([Release & Play Store](doc:app-customer/deployment)).

On Windows the debug keystore is `%USERPROFILE%\.android\debug.keystore`.

## Services to enable in the console

| Service | Setting |
|---|---|
| Authentication | Sign-in method → **Phone** enabled |
| Firestore | Created, rules deployed from `firebase/firestore.rules` |
| Realtime Database | Created, rules from `firebase/database.rules.json` |
| Storage | Created, rules from `firebase/storage.rules` |
| Cloud Messaging | Enabled by default. For iOS upload an APNs key |

The backend deploy covers the rules ([Deploy the Backend](doc:installation/backend-deploy)).

## iOS extras

- Upload your **APNs authentication key** in Firebase → Project settings → Cloud Messaging. Phone Auth uses silent push to verify the device, and FCM needs it for notifications.
- In Xcode → Runner → **Signing & Capabilities**, add **Push Notifications** and **Background Modes → Remote notifications**. The shipped project does not have them yet.
- Add the **reversed client ID** (or Encoded App ID) from `GoogleService-Info.plist` as a URL scheme (Runner → Info → URL Types). Firebase uses it for the reCAPTCHA fallback of phone sign-in. The shipped `Info.plist` has no URL types.

## Check

```bash
cd apps/customer_app
flutter run --dart-define-from-file=../../secret/app_keys.env
```

The app opens on the phone login. Home shows the services from **Admin → Services**. If the service tiles stay on the built-in fallback list or the wallet never loads, the app is pointing at the wrong project or the catalogue is empty.

:::tip Local development without a cloud project
Add `--dart-define=USE_EMULATOR=true` and the app ignores `firebase_options.dart` and connects to the Firebase Emulator Suite (project `demo-mytaxi`). See [Run the App](doc:app-customer/run-the-app).
:::

**Next:** [Change Package Name →](doc:app-customer/change-package-name)
