---
title: Installation Overview
description: ClassiAds-Hub is one repository that connects to one Firebase project you own. Install the backend, the Admin Panel, the website and the app in a fixed order, because each step needs what the one before it created.
---

ClassiAds-Hub is delivered as **one repository** with four applications. Every part connects to the **same Firebase project that you own**. There is no PHP, no MySQL and no server to rent.

| # | Folder | Technology | Where it runs |
|---|---|---|---|
| 1 | `functions/` + `firebase/` + `firebase.json`: **Backend** | Cloud Function `api` (Express, TypeScript, Node.js 22) and the scheduled `housekeeping` function, Firestore and Storage rules, Firestore indexes | Your Firebase project (`us-central1`) |
| 2 | `admin/`: **Admin Panel** | Next.js 16 static export | Firebase Hosting, target `admin` |
| 3 | `web/`: **Website** | Next.js 16 static export | Firebase Hosting, target `web` |
| 4 | `mobile/`: **Mobile App** | Flutter (Android & iOS) | Google Play / App Store |

`tools/` holds helper scripts: `tools/payments/setup-payments.mjs` (payment keys), `tools/migrate/` (optional import from the earlier MySQL version) and `tools/qa/` (automated checks).

:::note This section covers the backend, the Admin Panel and the hosting
The **Installation** menu sits under Admin Panel because it creates the Firebase project, deploys the backend and publishes the panel. The website and the mobile app have their own sections. You build them once the backend is live.
:::

## Install in this order

| Step | Page | What it achieves |
|---|---|---|
| 1 | [Requirements](doc:installation/requirements) | Node.js 22, Firebase CLI, Flutter (for the app) installed. Accounts opened |
| 2 | [Create the Firebase Project](doc:installation/firebase-project) | Blaze plan, Firestore, Storage, Authentication (Email/Password, Google), FCM, two Hosting sites |
| 3 | [Deploy the Backend](doc:installation/backend-deploy) | Secrets set, `api` and `housekeeping` live, rules and indexes deployed |
| 4 | [Keys & Environment](doc:installation/environment-configuration) | `functions/.env`, Secret Manager, the Firebase web config in the website and the panel |
| 5 | [Admin Panel Installation](doc:installation/admin-panel) | Build the Next.js panel and publish it to the `admin` Hosting site |
| 6 | [Create the First Admin](doc:installation/super-admin) | Your first login with the `super-admin` role |
| 7 | [Hosting, Domain & SSL](doc:installation/hosting) | Website and panel on your own domains with HTTPS, the checkout return URL |
| 8 | [Setup Guide](doc:installation/setup-guide) | The first ten things to do in the panel |
| 9 | [Localhost Setup](doc:installation/localhost-setup) | Optional. Run the website and the panel on your computer |
| 10 | [Data Migration](doc:installation/data-migration) | Optional. Import data from the earlier MySQL version, or load the sample data |
| 11 | [Backups & Monitoring](doc:installation/backups) | Backups, logs and alerts before you go live |

After that:

- **Website**: [Website Overview](doc:web/overview) → installation, configuration, deployment.
- **Mobile App**: [App Prerequisites](doc:app/prerequisites) → Firebase setup, package name, branding, release.

:::warning Choose your Firebase project once
The project ID ends up in `.firebaserc`, in `web/src/lib/firebase.ts` and `admin/src/lib/firebase.ts`, in the API addresses in `web/src/lib/config.ts`, `admin/src/lib/api.ts` and `mobile/lib/core/config/app_config.dart`, and in the app's `firebase_options.dart`, `google-services.json` and `GoogleService-Info.plist`. Moving to another project later means reconfiguring and republishing everything, including a new app build. Decide on the production project first and keep it.
:::

## How the parts talk to each other

```text title="Architecture"
                 ┌──────────────── Firebase Hosting ────────────────┐
Browser ───────▶ │  web/out   (target web)     /api/** ─┐           │
Browser ───────▶ │  admin/out (target admin)   /api/** ─┤           │
                 └──────────────────────────────────────┼───────────┘
Mobile App ─── https://us-central1-<project>.cloudfunctions.net/api/v1
                                                        ▼
                         Cloud Function "api" (Express, /api/v1 and /v1)
                         │ Firestore · Auth · Storage · FCM · Secret Manager
                         │ Stripe / Razorpay / PayPal (hosted checkout)
Cloud Scheduler ───────▶ Cloud Function "housekeeping" (every 60 minutes)
```

- The website, the Admin Panel and the app never write Firestore directly. They call the **REST API**, which validates every request and writes with the Admin SDK.
- The only direct Firestore access from clients is reading **their own chat threads** (`conversations`, `messages`). See [Security Rules & Storage](doc:api/security-rules).
- Files are uploaded **through the API** (multipart), which stores them in Cloud Storage.
- Sign-in uses **Firebase Authentication**. The API returns the e-mail to sign in with, and every request carries the Firebase ID token.
- Push notifications go through **Firebase Cloud Messaging** to the devices registered with `POST /auth/devices`.

See [Backend Reference → Architecture](doc:api/overview) for the details.

## What you need before starting

- A Google account for the Firebase / Google Cloud project, with a **billing account** (credit or debit card) for the Blaze plan
- A computer with Windows, macOS or Linux (a Mac only if you build the iOS app)
- An e-mail address and a strong password for your first **super-admin** login
- Optional: Stripe, Razorpay and/or PayPal accounts, two domain names (or sub-domains) for the website and the panel
- For the app: a Google Maps Platform key, a Google Play Console account and, for iOS, an Apple Developer account

## Typical layout

| Address | Part | Served by |
|---|---|---|
| `https://www.yourcompany.com` (or `https://your-project-id.web.app`) | Website | Firebase Hosting, target `web` |
| `https://admin.yourcompany.com` (or `https://your-admin-site.web.app`) | Admin Panel | Firebase Hosting, target `admin` |
| `https://www.yourcompany.com/api/v1/…` and `https://admin.yourcompany.com/api/v1/…` | API, same origin | Hosting rewrite → Cloud Function `api` |
| `https://us-central1-your-project-id.cloudfunctions.net/api/v1/…` | API, direct (used by the app) | Cloud Functions |
| `https://www.yourcompany.com/checkout/result?txn=<id>` | Return page after Stripe / Razorpay / PayPal checkout | Website |

**Next:** [Requirements →](doc:installation/requirements)
