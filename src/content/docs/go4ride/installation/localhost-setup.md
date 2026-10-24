---
title: Localhost & Emulators
description: Run the Go4Ride backend, admin panel, Customer App and Driver App on your own computer with the Firebase Emulator Suite. No cloud project, no costs, safe to experiment.
---

The **Firebase Emulator Suite** runs Authentication, Firestore, Realtime Database, Cloud Functions and Storage locally. All three apps have a built-in emulator mode, switched on with `--dart-define=USE_EMULATOR=true`. Together you get a complete offline copy of Go4Ride: ideal for development, customisation and trying updates before deploying them.

## Prerequisites

- Flutter, Node.js 20, Firebase CLI and a **Java JDK** (the emulators are Java programs). See [Requirements](doc:installation/requirements)
- `flutter pub get` at the repository root and `npm install` in `functions/`

You don't need a Firebase project for this. The apps use a **demo project** (`demo-mytaxi`, defined in each app's `lib/config/firebase_dev.dart`) with dummy keys. The emulators never contact Google for a `demo-` project.

## 1. Start the emulators

```bash
cd functions && npm run build && cd ..
firebase emulators:start --project demo-mytaxi --only auth,firestore,database,functions,storage
```

| Emulator | Port (from `firebase.json`) |
|---|---|
| Emulator UI | `http://127.0.0.1:4000` |
| Authentication | 9099 |
| Firestore | 8080 |
| Realtime Database | 9000 |
| Cloud Functions | 5001 |
| Storage | 9199 |

`firebase.json` sets `"singleProjectMode": true`, so every app must use the same project ID: keep `demo-mytaxi` for all three. Keep `npm --prefix functions run build:watch` running in a second terminal while you change backend code: the Functions emulator reloads on every build.

:::tip Java not on your PATH?
Android Studio's bundled JDK works. In Git Bash: `export PATH="/c/Program Files/Android/Android Studio/jbr/bin:$PATH"`. On macOS: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`.
:::

:::note Keep your local data
Add `--export-on-exit=./emulator-data` to save the database when you stop the emulators, and `--import=./emulator-data` to load it next time. Without them every run starts empty.
:::

## 2. Admin panel against the emulators

```bash
cd apps/admin_panel
flutter run -d chrome --web-port=5060 --dart-define=USE_EMULATOR=true
```

Click **First time? Create an admin account**, sign up with any e-mail (for example `admin@yourcompany.com`) and a password, then click **Grant admin (dev / emulator only)** on the *Admin access required* screen. That calls the `devBootstrapAdmin` function, which only works inside the emulator. You are now an admin. Load the defaults as in the [Setup Guide](doc:installation/setup-guide).

## 3. Apps against the emulators

```bash
cd apps/customer_app
flutter run -d chrome --web-port=5000 --dart-define=USE_EMULATOR=true --dart-define-from-file=../../secret/app_keys.env

cd apps/driver_app
flutter run -d chrome --web-port=5050 --dart-define=USE_EMULATOR=true --dart-define-from-file=../../secret/app_keys.env
```

- In Chrome the apps connect to `127.0.0.1`. On the **Android emulator** they connect to `10.0.2.2` automatically, so `flutter run -d emulator-5554 --dart-define=USE_EMULATOR=true …` works too.
- On a **real phone**, change `_host` in the app's `lib/config/firebase_dev.dart` to your computer's LAN address (for example `192.168.1.20`) and start the emulators with `"host": "0.0.0.0"` on each emulator in `firebase.json`.
- **Phone login**: the Auth emulator doesn't send SMS. The code appears in the terminal running the emulators and in the Emulator UI (Authentication tab).
- The Maps key is still needed for place search and routes, because Google Maps is not emulated.

:::warning Never ship an emulator build
`USE_EMULATOR` defaults to `false`. Do not pass it to `flutter build appbundle`, `flutter build ipa` or `flutter build web` for production.
:::

## What doesn't work locally

| Feature | Why |
|---|---|
| Push notifications | FCM isn't emulated. Functions skip users without an `fcmToken`; on web the apps don't register one |
| Scheduled jobs | `expireRideRequests` and `dailyAnalyticsRollup` don't run on a timer in the emulator. Trigger them from the Emulator UI or the functions shell (`npm --prefix functions run shell`) |
| Online payments | Possible with gateway **test keys** saved in the local panel, but the gateway returns to `http://127.0.0.1:5001/demo-mytaxi/us-central1/paymentReturn`, which only the same computer can open. Test from Chrome, not from a phone |

## Admin SDK scripts against the emulator

To run a one-off Admin SDK script against the emulators (for example the [make-admin script](doc:installation/super-admin)), point it at them first:

```bash
export FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
export FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
node functions/make-admin.mjs admin@yourcompany.com demo-mytaxi
```

## Tests

```bash
dart test packages/core                     # domain models, fare and promo math
flutter test packages/data                  # repositories on an in-memory Firestore
flutter test apps/customer_app              # app logic and widgets
cd functions && npm test                    # Jest: pricing, commission, cancellation, subscriptions
cd tests/rules && npm install && npm test   # security rules (Firestore emulator must be running)
```

See [Testing](doc:api/testing) for what each suite covers.

**Next:** [Backups & Monitoring →](doc:installation/backups)
