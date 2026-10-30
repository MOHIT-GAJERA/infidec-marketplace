---
title: Installation Overview
description: The complete Go4Market installation on one page, from an empty Google account to a live marketplace with two apps.
---

This section installs Go4Market **from scratch** in your own Firebase project. Follow the pages in order; each one ends with a link to the next. Plan for half a day for the backend and web sites, and another half day for the two apps.

## The pieces you will deploy

| Piece | Deployed to | Built from |
|---|---|---|
| Cloud Functions (≈ 50 callables, triggers and schedules) | Cloud Functions v2, `asia-south1` | `functions/` |
| Firestore rules and ≈ 130 composite indexes | Cloud Firestore | `firestore.rules`, `firestore.indexes.json` |
| Storage rules and CORS | Cloud Storage | `storage.rules`, `storage.cors.json` |
| Website | Hosting site `<your-project-id>` | `apps/website` → `build/web` |
| Admin panel | Hosting site `<your-project-id>-admin` | `apps/panel` → `build/admin` |
| Seller panel | Hosting site `<your-project-id>-seller` | `apps/panel` → `build/seller` |
| Delivery panel | Hosting site `<your-project-id>-delivery` | `apps/panel` → `build/delivery` |
| Customer app | Google Play | `apps/customer_app` |
| Partner app | Google Play | `apps/partner_app` |

All four hosting targets are declared in `firebase.json` and mapped to site IDs in `.firebaserc`.

## Step by step

:::steps
### Requirements
Install Node.js 22, the Firebase CLI, Flutter 3.41 and the Google Cloud CLI. See [Requirements](doc:installation/requirements).

### Create the Firebase project
Blaze plan, Authentication providers (e-mail, Google, phone, anonymous), Firestore, Storage with CORS, a web app and the two Android apps. See [Create the Firebase Project](doc:installation/firebase-project).

### Connect the code to your project
Replace the default project ID, Firebase options, Google client ID and site URLs in the source. See [Connect the Code to Your Project](doc:installation/connect-your-project).

### Secrets and functions/.env
Create `functions/.env` and the Secret Manager secrets for payments, SMTP and SMS. See [Secrets & functions/.env](doc:installation/environment-configuration).

### Deploy the backend
Build and deploy functions, Firestore rules and indexes, and Storage rules. See [Deploy Functions, Rules & Indexes](doc:installation/backend-deploy).

### Seed data
Load modules, categories, demo sellers, products, settings and demo accounts. See [Seed Demo Data](doc:installation/seed-data).

### Build and deploy the four web sites
Create the hosting sites, build the website and the three panels and deploy them. See [Build & Deploy the Web Apps](doc:installation/hosting).

### Create your Super Admin
See [Create the Super Admin](doc:installation/super-admin), then add [custom domains](doc:installation/domains) and follow the [Setup Guide](doc:installation/setup-guide).

### Apps
[Customer App](doc:app-customer/prerequisites) and [Partner App](doc:app-partner/prerequisites).
:::

:::tip Keep a notes file
Write down your **Project ID**, the four hosting URLs, the web **OAuth client ID** and your **SHA-1 / SHA-256** fingerprints as you go. You will paste them into several files.
:::

**Next:** [Requirements →](doc:installation/requirements)
