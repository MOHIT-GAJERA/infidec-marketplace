---
title: Localhost Setup
description: Run the whole platform on your own computer with the Firebase Emulator Suite — no cloud costs, safe to experiment.
---

The **Firebase Emulator Suite** runs Authentication, Firestore, Cloud Functions and Storage locally. Combined with the sample data in the package you get a complete, offline copy of QwikMart — ideal for development, customisation and trying updates before deploying them.

## Prerequisites

- Node.js 22, Java 21 (the emulators are Java programs) and Flutter — see [Requirements](doc:installation/requirements)
- Dependencies installed: `npm install` in `firebase/`, `firebase/functions/`, `admin/` and `web/`

## 1. Start the emulators

```bash
cd firebase
npm --prefix functions run build
npx firebase emulators:start --project yourstore-1a2b3 --import tools/emulator-data
```

| Emulator | Port |
|---|---|
| Emulator UI | `http://127.0.0.1:4000` |
| Authentication | 9099 |
| Firestore | 8080 |
| Cloud Functions | 5001 |
| Storage | 9199 |

Keep `npm --prefix functions run build:watch` running in a second terminal while you change backend code — the Functions emulator reloads on every build.

:::note Starting empty
Leave out `--import tools/emulator-data` to start with an empty database. Add `--export-on-exit=./my-data` to keep your local changes between runs (do not overwrite `tools/emulator-data`).
:::

## 2. Admin Panel against the emulators

```env title="admin/.env.local"
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourstore-1a2b3
NEXT_PUBLIC_USE_EMULATORS=true
NEXT_PUBLIC_EMULATOR_HOST=127.0.0.1
```

```bash
cd admin && npm run dev       # http://localhost:3001/admin/login  (admin@gmail.com / 123456 with the sample data)
```

## 3. Website against the emulators

```env title="web/.env.local"
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourstore-1a2b3
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_USE_EMULATORS=true
```

```bash
cd web && npm run dev         # http://localhost:3000
```

## 4. Apps against the emulators

```bash
cd customer_app
flutter run --dart-define=USE_EMULATORS=true                         # Android emulator → host 10.0.2.2
flutter run --dart-define=USE_EMULATORS=true --dart-define=EMULATOR_HOST=192.168.1.20   # real phone on your Wi-Fi

cd ../delivery_app
flutter run --dart-define=USE_EMULATORS=true
```

Debug builds allow plain HTTP so the phone can reach the emulators; release builds never do.

:::warning Never ship an emulator build
`USE_EMULATORS`, `USE_MOCK` and `FALLBACK_TO_MOCK` default to `false`. Do not pass them to `flutter build appbundle --release`.
:::

## Offline demo mode (no Firebase at all)

For quick UI work the website and both apps also include an in-memory demo:

```bash
cd web && NEXT_PUBLIC_USE_MOCK=true npm run dev
cd customer_app && flutter run --dart-define=USE_MOCK=true
cd delivery_app && flutter run --dart-define=USE_MOCK=true
```

A "DEMO DATA" badge shows the demo is active; the OTP is always `123456`.

## Tests

```bash
cd firebase/functions && npm test        # backend test-suite on the emulators (rules, pricing, orders, wallet, riders…)
cd customer_app && flutter test
cd delivery_app && flutter test
```

**Next:** [Backups & Monitoring →](doc:installation/backups)
