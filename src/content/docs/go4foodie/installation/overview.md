---
title: Installation Overview
description: Go4Foodie is delivered as four folders that all connect to one Firebase project. Install them in a fixed order, because each step needs what the one before it created.
---

Go4Foodie is delivered as **four application folders**, and all of them connect to the **same Firebase project that you own**. Install them in a fixed order.

| # | Folder | Technology | Where it runs |
|---|---|---|---|
| 1 | `firebase/`: **Backend** | Cloud Function `api` (TypeScript, Node.js 22), Firestore & Storage rules, Hosting config, migration tool | Your Firebase project (`asia-south1`) |
| 2 | `admin-app/`: **Admin Panel** | Flutter Web | Firebase Hosting (admin site) |
| 3 | `website/`: **Customer Website** | Next.js 16 (SSR) | Firebase App Hosting |
| 4 | `mobile-app/`: **Mobile App** | Flutter (Customer, Restaurant and Owner modes) | Android & iOS |

:::note This section covers the backend and the admin panel
The **Installation** menu sits under Admin Panel because it creates the Firebase project and installs the backend and the panel. Every other part talks to those two. The website and the mobile app have their own sections, and you set them up once the API is live.
:::

## Install in this order

The order matters. Each step produces something the next step needs.

| Step | Page | What it achieves |
|---|---|---|
| 1 | [Requirements](doc:installation/requirements) | Install Node.js, Firebase CLI and Flutter. Open the accounts you need |
| 2 | [Create the Firebase Project](doc:installation/firebase-project) | Blaze plan, Firestore, Authentication, Storage, web app, Hosting sites |
| 3 | [Deploy the Backend](doc:installation/backend-deploy) | Secrets set, function service account chosen, `api` function and rules live |
| 4 | [Environment Configuration](doc:installation/environment-configuration) | Every secret and plain setting explained, plus how to change the region |
| 5 | [Admin Panel Installation](doc:installation/admin-panel) | Build the Flutter Web panel and publish it on the admin site |
| 6 | [Data Migration](doc:installation/data-migration) | Optional. Import an existing MySQL database |
| 7 | [Admin Users](doc:installation/admin-users) | Create your first **Owner** login |
| 8 | [Hosting, Domain & SSL](doc:installation/hosting) | Admin panel, API and website on your own domains with HTTPS |
| 9 | [Setup Guide](doc:installation/setup-guide) | The first ten things to do in the panel |
| 10 | [Localhost Setup](doc:installation/localhost-setup) | Optional. Run the API, panel and website on your computer |
| 11 | [Backups & Monitoring](doc:installation/backups) | Backups, logs and alerts before you go live |

Once the API is live, the other two parts point at it:

- **Website**: set `ADMIN_API_URL` to your API host and deploy to App Hosting. See [Web Portal](doc:web/overview).
- **Mobile App**: set `API_BASE_URL` to your API host, change the package name and build. See [Mobile App](doc:app/prerequisites).

:::warning Choose your Firebase project once
The project ID ends up in `.firebaserc`, the function's service account, the admin panel's `firebase_options.dart`, the website's `ADMIN_API_URL` and the app's default API address. Moving to another project later means re-configuring and re-publishing everything. Decide on the production project first and keep it.
:::

## No server to rent

Go4Foodie does **not** need a VPS, PHP, MySQL, cron jobs or a queue worker:

- The **backend** is one Cloud Function that scales automatically, including down to zero.
- The **database** is Cloud Firestore with automatic replication.
- The **admin panel** is static files on Firebase Hosting. The **website** runs on Firebase App Hosting (managed Cloud Run with HTTPS and CDN).

## What you need before starting

- A Google account for the Firebase / Google Cloud project, with a **billing account** (credit or debit card) for the Blaze plan
- A domain name (optional but recommended), with access to its DNS settings
- An e-mail address and a strong password for your **Owner** login
- SMTP credentials and payment gateway keys, if you want e-mails and online payments from day one
- Optional: a `mysqldump` of an existing Go4Foodie MySQL database, if you are moving from an older installation

## Typical layout

| Address | Part | Served by |
|---|---|---|
| `https://yourrestaurant.com` | Customer Website | App Hosting |
| `https://admin.yourrestaurant.com` | Admin Panel (+ `/api/**`) | Hosting site **admin** |
| `https://your-api-host` (for example `api.yourrestaurant.com` or `yourrestaurant-1a2b3.web.app`) | API for the website and the mobile app | Hosting site **api** |
| Google Play / App Store | Mobile App | — |

Both Hosting sites send `/api/**` to the same function. The panel calls the API on its own origin, and the website and app call the API host.

**Next:** [Requirements →](doc:installation/requirements)
