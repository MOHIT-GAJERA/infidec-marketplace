---
title: Firebase Setup
description: Connect the app to your own Firebase project with FlutterFire, replace google-services.json, GoogleService-Info.plist and firebase_options.dart, and register the SHA-1 / SHA-256 fingerprints.
---

The app must use the **same Firebase project as your backend**. The API verifies the Firebase ID token the app sends with every request, so a token issued by another project is rejected.

In the app, Firebase provides:

| Service | Used for |
|---|---|
| Authentication | Email/password sessions (also for phone accounts), **Continue with Google** |
| Cloud Messaging (FCM) | Push notifications; the device token is sent to `POST /auth/devices` |
| Analytics | Usage events (automatic) |
| Crashlytics | Crash reports. `main.dart` routes Flutter and async errors to Crashlytics |

All other data (ads, chats, profiles) comes from the REST API, not from the Firebase SDK.

The download still contains the Firebase files of the demo project. Replace them **after** you have chosen the final package name ([Change Package Name](doc:app/change-package-name)), because the Firebase Android app is registered under that name.

## Option A: FlutterFire CLI (recommended)

```bash
npm i -g firebase-tools
dart pub global activate flutterfire_cli
firebase login

cd mobile
flutterfire configure --project=your-project-id \
  --platforms=android,ios \
  --android-package-name=com.yourcompany.classifieds \
  --ios-bundle-id=com.yourcompany.classifieds
```

It registers the apps in your project (if needed) and overwrites:

| File | Content |
|---|---|
| `lib/firebase_options.dart` | `DefaultFirebaseOptions` for android, ios (and web if you include it) |
| `android/app/google-services.json` | Android config, read by the `com.google.gms.google-services` Gradle plugin (Analytics and Crashlytics need it) |
| `ios/Runner/GoogleService-Info.plist` | iOS config |

:::warning Check the project ID afterwards
Open `lib/firebase_options.dart` and make sure every `projectId` is **your-project-id** and every `storageBucket` is your bucket. If the app still logs in to the demo project, FlutterFire did not overwrite the file. Run the command again from inside `mobile/`.
:::

## Option B: Firebase console

1. Project Overview → **Add app → Android**. Package name = your `applicationId`.
2. Download **`google-services.json`** into `mobile/android/app/`.
3. Add an **iOS** app with your bundle ID. Download **`GoogleService-Info.plist`** into `mobile/ios/Runner/` and add it to the **Runner** target in Xcode.
4. Edit `lib/firebase_options.dart` and replace `apiKey`, `appId`, `messagingSenderId`, `projectId`, `storageBucket` (and `iosBundleId` for iOS) with the values from **Project settings → Your apps**.

```dart title="mobile/lib/firebase_options.dart"
static const FirebaseOptions android = FirebaseOptions(
  apiKey: 'YOUR_ANDROID_API_KEY',
  appId: '1:000000000000:android:xxxxxxxxxxxxxxxx',
  messagingSenderId: '000000000000',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.firebasestorage.app',
);
```

:::note The app keeps booting without Firebase
`main.dart` wraps `Firebase.initializeApp` in a try/catch. If the options are wrong the app still opens, but login, push and Crashlytics do not work. Watch the debug console for `Firebase init skipped:`.
:::

## Enable the sign-in providers

In **Firebase Console → Authentication → Sign-in method**:

| Provider | Needed for |
|---|---|
| **Email/Password** | Every email login and every phone login (phone accounts sign in with a synthetic email that the API returns as `auth_email`) |
| **Google** | The **Continue with Google** button. Pick a support email and save; Firebase creates the OAuth clients |

After enabling Google, **download `google-services.json` again**. The new file contains the OAuth client that Google sign-in needs. See [Login, Register & OTP](doc:app/auth#continue-with-google).

## SHA fingerprints

Google sign-in (and the Maps key restriction) only work when Firebase knows the SHA-1 **and** SHA-256 of every key that signs the app:

| Key | When it is used | How to get it |
|---|---|---|
| Debug key | `flutter run` | `cd mobile/android && ./gradlew signingReport` (variant `debug`) |
| Upload key | your release builds | `keytool -list -v -keystore /path/to/upload-keystore.jks -alias upload` |
| Play App Signing key | the app installed from Google Play | Play Console → **Test and release → App integrity** (after the first upload) |

Add each one in **Firebase Console → Project settings → Your apps → Android app → Add fingerprint**. Then download `google-services.json` again and replace the old file.

:::danger Works locally, fails from Play
Google re-signs your app with the Play App Signing key. If that SHA-1/SHA-256 is missing in Firebase, Google sign-in fails only in the Play-installed app. Add it right after the first upload ([Release & Play Store](doc:app/deployment#add-the-app-signing-sha-to-firebase)).
:::

## Push on iOS (optional)

iOS push needs an **APNs authentication key**: Apple Developer → Keys → create a key with *Apple Push Notifications service*, then upload it in **Firebase Console → Project settings → Cloud Messaging → Apple app configuration**. In Xcode, add the **Push Notifications** and **Background Modes → Remote notifications** capabilities to the Runner target.

## Backend side

The backend must run in the same project: deploy it as described in [Deploy the Backend](doc:installation/backend-deploy), and point the app at that project's `api` function ([API Configuration](doc:app/api-configuration)).

**Next:** [Change Package Name →](doc:app/change-package-name)
