---
title: Localhost Setup
description: Run the API, the admin panel, the website and the mobile app on your own computer against a Firebase project, for development and customisation.
---

For development you can run every part of Go4Foodie on your computer. The local API is the same Express app as the deployed `api` function, started with Node.js on port **8787**. It works against a **real Firestore database** (not the emulator), using a service-account key.

:::warning Use a separate development project
The local API reads and writes the Firestore database of whatever project the key belongs to. Create a second Firebase project (for example `yourrestaurant-dev`) for development. Then a test order never lands in your live restaurant.
:::

## Prerequisites

- Node.js 22.9+, Flutter and Chrome. See [Requirements](doc:installation/requirements)
- A Firebase project with Firestore and Authentication set up ([Create the Firebase Project](doc:installation/firebase-project)), and at least one admin user ([Admin Users](doc:installation/admin-users))
- A service-account key for that project (Project settings → Service accounts → *Generate new private key*), saved outside the repository

## 1. Start the API

Create `firebase/functions/.env.local`. It is git-ignored and never deployed:

```env title="firebase/functions/.env.local"
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/yourrestaurant-dev-key.json
GCLOUD_PROJECT=yourrestaurant-dev
AUTH_SECRET=any-long-random-string-for-dev
LOCAL_TZ=Asia/Kolkata
WEBSITE_URL=http://localhost:3000

# Optional: test SMTP and sandbox gateways
# MAIL_HOST=smtp.ethereal.email
# MAIL_PORT=587
# MAIL_USERNAME=…
# MAIL_PASSWORD=…
# RAZORPAY_KEY_ID=rzp_test_…
# RAZORPAY_KEY_SECRET=…
# STRIPE_PUBLISHABLE_KEY=pk_test_…
# STRIPE_SECRET_KEY=sk_test_…
```

Locally, secrets are plain lines in this file. Then:

```bash
cd firebase/functions
npm install
npm run dev          # tsc && node --env-file-if-exists=.env.local lib/dev.js
```

You should see `api listening on http://localhost:8787`. Check it with `curl http://localhost:8787/up` (answers `ok`). Set `PORT` in `.env.local` to use another port.

Locally the Admin SDK signs the admin custom tokens with the key file, so you don't need any IAM role for that. Re-run `npm run dev` after every code change, because it compiles once. Run `npm run build:watch` in a second terminal if you want continuous compiling.

:::tip Test e-mails without sending real mail
An [Ethereal](https://ethereal.email) test account accepts SMTP and shows each message in a web inbox. The API logs a `preview:` link for every e-mail it sends through Ethereal.
:::

## 2. Admin panel

```bash
cd admin-app
flutter pub get
flutter run -d chrome --dart-define=API_BASE=http://localhost:8787
```

`API_BASE` makes the panel call `http://localhost:8787/api/admin/*` instead of its own origin. The API allows cross-origin calls, so this works out of the box. `firebase_options.dart` must belong to the **same** project as the key. Otherwise the custom token is rejected at sign-in.

## 3. Website

```bash
cd website
npm install
ADMIN_API_URL=http://127.0.0.1:8787 npm run dev      # http://localhost:3000
```

On PowerShell: `$env:ADMIN_API_URL="http://127.0.0.1:8787"; npm run dev`. You can also put `ADMIN_API_URL=http://127.0.0.1:8787` in `website/.env.local`.

## 4. Mobile app

```bash
cd mobile-app
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8787                 # Android emulator
flutter run --dart-define=API_BASE_URL=http://192.168.1.20:8787             # real phone on your Wi-Fi (your PC's LAN IP)
```

`10.0.2.2` is how the Android emulator reaches your computer. More in [Mobile App → Run the App](doc:app/run-the-app).

## What differs from production

| Topic | Local | Deployed |
|---|---|---|
| Secrets | Plain values in `.env.local` | Secret Manager |
| Admin token signing | Key file | Function service account + IAM Credentials API |
| Same-origin `/api` | No, `API_BASE` is set | Yes, Hosting rewrite |
| Image uploads | Saved to the default Storage bucket of the key's project. If an upload fails locally, test it on a deployed function | `uploads/` in the default bucket |

:::note Emulators
`firebase/firebase.json` also defines emulator ports (Functions 5001, Firestore 8080, Auth 9099, Hosting 5000), and `npm run serve` in `functions/` starts the Functions and Firestore emulators. The admin panel and the website aren't wired to the emulators, so the `npm run dev` setup above is the supported local workflow.
:::

**Next:** [Backups & Monitoring →](doc:installation/backups)
