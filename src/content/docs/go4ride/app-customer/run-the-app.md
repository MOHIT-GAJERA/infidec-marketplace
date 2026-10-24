---
title: Run the App
description: Run the Customer App on an emulator or phone against your Firebase project or the local Firebase Emulator Suite, walk through a first ride and run the tests.
---

```bash
# repository root: resolve the whole workspace once
flutter pub get

cd apps/customer_app
flutter devices                 # list emulators and phones
```

| Goal | Command (from `apps/customer_app`) |
|---|---|
| Your Firebase project, with Maps | `flutter run --dart-define-from-file=../../secret/app_keys.env` |
| A specific device | add `-d <device-id>` |
| Local Firebase Emulator Suite | `flutter run --dart-define-from-file=../../secret/app_keys.env --dart-define=USE_EMULATOR=true` |
| Release build on a phone | `flutter run --release --dart-define-from-file=../../secret/app_keys.env` |
| In Chrome (emulators only, no native map) | `flutter run -d chrome --web-port=5000 --dart-define=USE_EMULATOR=true` |

`--dart-define-from-file` passes `MAPS_API_KEY` to Dart. Without it the app starts, but the map shows a placeholder and place search does not work ([Google Maps & Location](doc:app-customer/maps-location)).

:::tip VS Code / Android Studio
Add the flag to your run configuration once, for example in `.vscode/launch.json`: `"args": ["--dart-define-from-file=../../secret/app_keys.env"]`.
:::

## Local emulators

From the repository root:

```bash
cd functions && npm install && npm run build && cd ..
firebase emulators:start --project demo-mytaxi --only auth,firestore,database,functions,storage
```

| Emulator | Port |
|---|---|
| Auth | 9099 |
| Firestore | 8080 |
| Realtime Database | 9000 |
| Functions | 5001 |
| Storage | 9199 |

With `USE_EMULATOR=true` the app uses dummy options for the `demo-mytaxi` project and connects every SDK to the emulators (`lib/config/firebase_dev.dart`). The Android emulator reaches your PC at **`10.0.2.2`**, other platforms at `127.0.0.1`. The emulators need Java. Phone sign-in works with any number: the code appears in the Emulator UI and the terminal. Details: [Localhost & Emulators](doc:installation/localhost-setup).

## First-ride walkthrough

You need the Driver App on a second device (or emulator) and an approved, online driver ([Driver App → Run the App](doc:app-driver/run-the-app)).

1. **Login** → enter a test number (for example `90000 00001`) → **Send code** → enter the 6-digit code → **Verify**.
2. **Your profile** → name → **Continue** → Home.
3. Tap **Cab** → set the destination → pick a vehicle type → **Cash** → **Confirm**.
4. *Finding your driver* → on the driver phone, **Accept**.
5. The rider sees *Driver assigned*, the driver card and the **OTP card**.
6. Driver: **Navigate to pickup** → **I've arrived** → **Start trip** → enter the rider's OTP → **Complete trip**.
7. Rider: *Trip completed*. Open **My rides** and **Wallet**.

Repeat with **Wallet** (top up first) and **Card / UPI** with test keys ([Wallet & Payments](doc:app-customer/payments)).

![Login](/docs/go4ride/images/app-customer-login.webp "Login")
![Home](/docs/go4ride/images/app-customer-home.webp "Home")
![Ride](/docs/go4ride/images/app-customer-ride.webp "Ride")
![Maintenance](/docs/go4ride/images/app-customer-maintenance.webp "Maintenance mode")

## Live gates from the Admin Panel

`lib/app/app_gate.dart` sits above every screen and reacts to Firestore without a restart:

| Admin setting | Effect in the app |
|---|---|
| **Maintenance mode → Customer app under maintenance** | Full-screen *We'll be right back* with your message. Clears as soon as you switch it off |
| **App theme & versions → Android / iOS minimum version** above the installed version, **Force update** off | Dismissible banner *A new version of Go4Ride is available.* with **Update** |
| Same, **Force update** on | Blocking *Update required* page with **Update now** (opens the store URL you set) |

See [Maintenance Mode & App Versions](doc:admin/maintenance). The installed version is the `version:` in `pubspec.yaml` (`1.0.0`).

## Troubleshooting

| Problem | Fix |
|---|---|
| reCAPTCHA browser page or *app not authorized* at login | Add the SHA-1 and SHA-256 of the key that signed this build ([Firebase Setup](doc:app-customer/firebase-setup)) |
| Login works but the app shows someone else's data | `firebase_options.dart` is from another project. Run `flutterfire configure` again |
| Map placeholder | Missing `--dart-define-from-file` |
| Grey map | Maps SDK not enabled or key restricted to other apps |
| Build fails: *No matching client found for package name* | `google-services.json` does not contain your `applicationId`. Re-run FlutterFire after renaming |
| *Finding your driver* changes to *No drivers available* at once | No driver is online, approved, close enough or with enough wallet ([Booking a Ride](doc:app-customer/booking)) |
| Driver marker missing | Driver app in the background, or wrong `databaseURL` |
| *We'll be right back* after maintenance | The setting is still on, or the phone is offline. It clears live when switched off |
| Emulator: *Emulator connect failed* in the log | Emulators not running, or started without the `--only` list above |

## Tests

```bash
cd apps/customer_app
flutter analyze
flutter test
```

The tests cover the maintenance and update gates, the fare estimator, service and vehicle mapping, top-up limits, the home service list and ride history. Backend tests are described in [Testing](doc:api/testing).

**Next:** [Release & Play Store →](doc:app-customer/deployment)
