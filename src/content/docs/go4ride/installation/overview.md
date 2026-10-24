---
title: Installation Overview
description: Go4Ride is one Flutter monorepo that connects to one Firebase project you own. Install the backend, the admin panel and the two apps in a fixed order, because each step needs what the one before it created.
---

Go4Ride is delivered as a single **Flutter pub workspace (monorepo)**. Every part of it connects to the **same Firebase project that you own**. There is no PHP, no MySQL and no server to rent.

| # | Folder | Technology | Where it runs |
|---|---|---|---|
| 1 | `functions/` + `firebase/` + `firebase.json`: **Backend** | 19 Cloud Functions v2 (TypeScript, Node.js 20), Firestore / Storage / Realtime Database rules, Firestore indexes | Your Firebase project (`us-central1`) |
| 2 | `apps/admin_panel/`: **Admin Panel** | Flutter Web | Firebase Hosting (or any static host) |
| 3 | `apps/customer_app/`: **Customer App** | Flutter (Android & iOS) | Google Play / App Store |
| 4 | `apps/driver_app/`: **Driver App** | Flutter (Android & iOS) | Google Play / App Store |

The three apps share four packages: `packages/core` (models and enums), `packages/data` (Firestore, RTDB and Storage repositories), `packages/services` (maps, notifications, location) and `packages/ui_kit` (theme and brand). `tests/rules/` holds the security-rules test suite.

:::note This section covers the backend and the admin panel
The **Installation** menu sits under Admin Panel because it creates the Firebase project, deploys the backend and publishes the panel. The Customer App and the Driver App have their own sections. You build them once the backend is live.
:::

## Install in this order

| Step | Page | What it achieves |
|---|---|---|
| 1 | [Requirements](doc:installation/requirements) | Flutter, Node.js 20, Firebase CLI and FlutterFire CLI installed. Accounts opened |
| 2 | [Create the Firebase Project](doc:installation/firebase-project) | Blaze plan, Firestore, Realtime Database, Storage, Authentication (Phone + Email/Password), FCM |
| 3 | [Deploy the Backend](doc:installation/backend-deploy) | Functions, rules and indexes live. First-deploy IAM roles in place |
| 4 | [Keys & Environment](doc:installation/environment-configuration) | `firebase_options.dart` for each app, the Google Maps key file, payment keys |
| 5 | [Admin Panel Installation](doc:installation/admin-panel) | Build the Flutter Web panel and publish it |
| 6 | [Create the First Admin](doc:installation/super-admin) | Your first login with the `admin` custom claim |
| 7 | [Hosting, Domain & SSL](doc:installation/hosting) | The panel on your own domain with HTTPS |
| 8 | [Setup Guide](doc:installation/setup-guide) | The first ten things to do in the panel |
| 9 | [Localhost & Emulators](doc:installation/localhost-setup) | Optional. Run everything on your computer with the Firebase Emulator Suite |
| 10 | [Backups & Monitoring](doc:installation/backups) | Backups, logs and alerts before you go live |

After that, brand and publish the apps:

- **Customer App**: [App Prerequisites](doc:app-customer/prerequisites) → Firebase setup, package name, branding, release.
- **Driver App**: [App Prerequisites](doc:app-driver/prerequisites) → Firebase setup, package name, branding, release.

:::warning Choose your Firebase project once
The project ID ends up in `.firebaserc`, in each app's `firebase_options.dart`, `google-services.json` and `GoogleService-Info.plist`, and in the payment return address the backend builds. Moving to another project later means reconfiguring and republishing everything, including new app builds. Decide on the production project first and keep it.
:::

## How the parts talk to each other

![Go4Ride architecture](/docs/go4ride/images/architecture.svg "Apps talk directly to Firebase. Cloud Functions handle money, roles, dispatch and payments")

- The apps read and write **Cloud Firestore** directly. The security rules decide what each role may touch.
- Anything involving **money or roles** (settlement, wallet, cancellation fees, payouts, subscriptions, KYC decisions, staff accounts, online payments) runs in **Cloud Functions** with the Admin SDK.
- Live driver positions go through the **Realtime Database** (`driver_locations/{driverId}`).
- Documents, photos and support attachments go to **Cloud Storage**.
- Push notifications go through **Firebase Cloud Messaging**.

There is no REST API to host. See [API → Architecture](doc:api/overview) for the details.

## What you need before starting

- A Google account for the Firebase / Google Cloud project, with a **billing account** (credit or debit card) for the Blaze plan
- A computer with Windows, macOS or Linux (a Mac only if you build the iOS apps)
- A **Google Maps Platform** API key (created in the same Google Cloud project)
- An e-mail address and a strong password for your first **admin** login
- Optional: Razorpay, Stripe and/or PayPal accounts for online payments, a domain for the admin panel
- For publishing: a Google Play Console account and, for iOS, an Apple Developer account

## Typical layout

| Address | Part | Served by |
|---|---|---|
| `https://admin.yourcompany.com` (or `https://your-project-id.web.app`) | Admin Panel | Firebase Hosting |
| `https://us-central1-your-project-id.cloudfunctions.net/paymentReturn` | Payment return page after Razorpay / Stripe / PayPal checkout | Cloud Functions |
| Google Play / App Store | Customer App (`com.go4ride.customer`) and Driver App (`com.go4ride.driver`) | — |

**Next:** [Requirements →](doc:installation/requirements)
