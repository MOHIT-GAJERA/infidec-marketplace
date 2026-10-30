---
title: Localhost Setup
description: Run the Go4Market website, panels and apps on your own computer against your Firebase project while you customise them.
---

Go4Market's clients talk to **your cloud Firebase project** (Firestore, Auth, Functions in `asia-south1`). There is no emulator mode built into the clients. For local development you run the Flutter apps on your machine and keep using the deployed backend. Use a separate **staging project** if you do not want to touch live data.

## 1. Website and panels in Chrome

```bash
# website
cd apps/website
flutter pub get
flutter run -d chrome --web-port 5000

# admin panel (separate terminal)
cd apps/panel
flutter pub get
flutter run -d chrome --web-port 5001 -t lib/main_admin.dart

# seller / delivery panels
flutter run -d chrome --web-port 5002 -t lib/main_seller.dart
flutter run -d chrome --web-port 5003 -t lib/main_delivery.dart
```

`localhost` is an authorized domain by default, so e-mail, Google and phone sign-in work. Hot reload (<kbd>r</kbd>) and hot restart (<kbd>R</kbd>) work as usual.

:::note Images on localhost
If images do not load in Chrome, apply the Storage CORS configuration from [Create the Firebase Project](doc:installation/firebase-project#5-enable-cloud-storage-and-cors).
:::

## 2. Mobile apps on an emulator or phone

```bash
cd apps/customer_app
flutter pub get
flutter run            # pick an Android emulator or a USB-connected phone

cd apps/partner_app
flutter pub get
flutter run
```

Google and phone sign-in on Android need the **debug** SHA-1/SHA-256 registered in Firebase (see [Customer App → Firebase Setup](doc:app-customer/firebase-setup)).

## 3. Working on Cloud Functions

Edit `functions/src/**`, then type-check and deploy only what changed:

```bash
cd functions
npm run build:watch      # tsc --watch in one terminal
# in another terminal, from the repository root:
firebase deploy --only functions:placeOrder,functions:getCheckoutQuote --project <your-project-id>
```

Follow the logs while you test:

```bash
firebase functions:log --project <your-project-id>
```

:::tip Use the Functions emulator for pure logic
`firebase emulators:start --only functions` lets you call functions with `curl` or a Node script while you work on logic. The shipped Flutter clients do not switch to emulators. If you need that, add `useFunctionsEmulator(...)` after `initG4MFirebase(...)` in your own branch.
:::

## 4. Useful scripts

| Command | What it does |
|---|---|
| `node tools/seed/seed.mjs` | Re-seed (safe to repeat) |
| `node tools/seed/smoke.mjs` | Run an end-to-end checkout smoke test against the project |
| `flutter analyze` in any app | Static analysis |
| `flutter test` in any app | Unit/widget tests in each app's `test/` |

**Next:** [Backups & Monitoring →](doc:installation/backups)
