---
title: Firebase Setup
description: Register the Driver App in the same Firebase project as the Customer App and generate its firebase_options.dart, google-services.json and GoogleService-Info.plist.
---

Both apps use **one Firebase project**. The Driver App is a second Android app and a second iOS app inside it, with its own package name. Set your final package name first ([Change Package Name](doc:app-driver/change-package-name)).

The Driver App uses Authentication (phone OTP), Firestore (`drivers`, `rides`, `withdrawals`, `subscriptions`, settings), the Realtime Database (writes `driver_locations/{uid}`), Storage (KYC photos under `kyc/{uid}/…`, support photos), Cloud Functions (`purchaseSubscription`) and Cloud Messaging.

## FlutterFire

```bash
cd apps/driver_app
flutterfire configure --project=your-project-id \
  --platforms=android,ios,web \
  --android-package-name=com.yourcompany.driver \
  --ios-bundle-id=com.yourcompany.driver
```

It overwrites `lib/firebase_options.dart`, `android/app/google-services.json`, `ios/Runner/GoogleService-Info.plist` and `apps/driver_app/firebase.json`. Open `firebase_options.dart` afterwards and check that every `projectId` is yours and that `databaseURL` is set. Without the RTDB URL, riders never see the driver move.

Prefer the console? Add an Android app and an iOS app with the driver package name, download the two config files into the paths above and edit `firebase_options.dart` by hand, as described for the [Customer App](doc:app-customer/firebase-setup).

## SHA fingerprints

Phone sign-in needs the SHA-1 and SHA-256 of every signing key **for this app's** Firebase Android entry: debug key, the driver upload key, and the Play App Signing key after the first upload.

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
keytool -list -v -keystore android/app/upload-keystore.jks -alias upload
```

Firebase → Project settings → **Your apps** → the *driver* Android app → **Add fingerprint**.

:::tip One debug key, two apps
Your debug keystore is the same for both apps. Add its fingerprints to **both** Android apps in Firebase.
:::

## The driver role

When the driver saves the vehicle step for the first time, the app creates `drivers/{uid}`. The `onDriverProfileCreated` Cloud Function then sets the custom claim **`role: driver`**. Security rules (accepting rides, withdrawals) and `purchaseSubscription` depend on it.

The app refreshes the ID token until the claim arrives (`lib/app/driver_claim.dart`, up to 5 tries, 1.5 s apart). If accepting a ride fails with *permission denied* right after registration, the function has not run: check that the backend is deployed and look at the Functions logs.

## Storage rules

KYC photos are uploaded to `kyc/{driverId}/{docTypeId}_{front|back}.jpg`. `firebase/storage.rules` only lets the driver write their own folder (images or PDF, under 10 MB), and only that driver and staff can read it. Deploy the rules before testing uploads ([Deploy the Backend](doc:installation/backend-deploy)).

## iOS extras

The same as for the Customer App: upload the APNs key, add Push Notifications and Background Modes → Remote notifications in Xcode, and add the reversed client ID URL scheme for phone sign-in.

## Check

```bash
cd apps/driver_app
flutter run --dart-define-from-file=../../secret/app_keys.env
```

First launch shows the onboarding slides, then the login. After sign-in, a new driver lands on **Driver onboarding** with the vehicle form. The vehicle type and brand dropdowns are filled from the Admin Panel. If they are empty, load the defaults in **Vehicle types** and **Vehicle brands**.

**Next:** [Change Package Name →](doc:app-driver/change-package-name)
