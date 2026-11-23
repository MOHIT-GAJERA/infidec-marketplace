---
title: Firebase Setup
description: Connect the Booqora Mobile App to your own Firebase project with flutterfire configure, replace the platform config files and point the app at your platform URL.
---

The Mobile App uses the **same Firebase project as the Rental Platform**. It signs in with Firebase Authentication (email and password), reads and writes Firestore, uploads images to Storage and calls the Cloud Functions in region `asia-south1`.

:::warning Replace the author's project
The package ships configured for the author's project (`booqora-infidec`). You must point it at **your** project, `<your-project-id>`, before you run or publish the app. Otherwise your build talks to someone else's backend and every sign-in fails.
:::

## Files that hold the Firebase config

| File | Platform | Created by |
|---|---|---|
| `lib/firebase_options.dart` | All | `flutterfire configure` |
| `android/app/google-services.json` | Android | Firebase console or `flutterfire configure` |
| `ios/Runner/GoogleService-Info.plist` | iOS | Firebase console or `flutterfire configure` |

`lib/main.dart` initialises Firebase with `DefaultFirebaseOptions.currentPlatform`, so **`firebase_options.dart` is the file that really matters**. Replace the other two as well so they all describe the same project.

:::steps
### Register the apps in Firebase

Firebase console → your project → **Project settings → General → Add app**:

- **Android**: package name `io.booqora.booqora_mobile` (or your own, see [Change Package Name](doc:app/change-package-name)).
- **iOS**: bundle ID `io.booqora.booqoraMobile` (or your own).

Download `google-services.json` and `GoogleService-Info.plist` when asked.

If you plan to change the package name, do that **first** and register the new IDs. It saves registering the apps twice.

### Run flutterfire configure

```bash title="Terminal"
cd booqora_mobile
firebase login
flutterfire configure --project=<your-project-id> --platforms=android,ios
```

Choose the Android and iOS apps you registered. The CLI rewrites `lib/firebase_options.dart` and writes the platform files into `android/app/` and `ios/Runner/`.

The shipped `firebase_options.dart` also has a `web` entry. It is only used when the mobile UI is previewed in a browser for QA. Add `web` to `--platforms` if you want to keep that, or leave the old entry out.

### Check the platform files

Make sure `android/app/google-services.json` and `ios/Runner/GoogleService-Info.plist` now contain `<your-project-id>`. In Xcode, `GoogleService-Info.plist` must be a member of the **Runner** target.

### Point the app at your platform URL

Two constants hold the public address of the Rental Platform. Change both to your hosting domain:

```dart title="lib/core/browser.dart"
static const origin = 'https://<your-platform-domain>';
```

```dart title="lib/data/payments.dart"
static const returnUrl = 'https://<your-platform-domain>/pay/return';
```

`origin` builds the Online Store link shown under **More → View online store** and **Share store link** (`<origin>/s/<workspace-slug>`). `returnUrl` is where Stripe and PayPal send the customer after paying; the platform's return page verifies the payment on the server.

### Check the Functions region

`lib/data/payments.dart` calls the functions with `FirebaseFunctions.instanceFor(region: 'asia-south1')`. If you deployed the functions to a different region, change it here too.
:::

## What must already be enabled

These are done during the platform installation. The app depends on them:

- [x] **Authentication → Email/Password** enabled.
- [x] **Firestore** created, with the rules and indexes from the platform deployed.
- [x] **Storage** created, with the platform's `storage.rules` deployed (product photos and logos).
- [x] **Cloud Functions** deployed with your payment and SMTP secrets ([Secrets & Environment](doc:installation/environment-configuration)).

There is no separate mobile backend, no extra rules file and no app-only collection. A workspace created in the app is identical to one created on the web.

## SHA fingerprints

The app signs in with email and password only, so Firebase does not need SHA-1 or SHA-256 fingerprints for the app to work. You can still add your upload key and the Play **App signing** key fingerprints to the Android app in Firebase. You will need them if you later add Google Sign-In or App Check.

## Test the connection

```bash title="Terminal"
flutter pub get
flutter run
```

Create an account on the phone. The new user should appear in Firebase **Authentication → Users**, and after the workspace step a new workspace document appears in Firestore. Sign in to the Rental Platform with the same account and you should see the same workspace.

**Next:** [Run the App →](doc:app/run-the-app)
