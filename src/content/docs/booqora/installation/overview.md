---
title: Installation Overview
description: The complete Booqora installation on one page, from an empty Google account to a live Rental Platform, Online Store, Marketing Website and Mobile App.
---

This section installs Booqora **from scratch** in your own Firebase project. Follow the pages in order; each one ends with a link to the next. Plan for two to three hours for the backend, the Rental Platform and the Marketing Website, and another half day for the Mobile App.

:::warning The package is configured for the author's project
The source ships pointing at the author's Firebase project `booqora-infidec` and the Hosting sites `booqora-platform` and `booqora-infidec`. You **must** replace these with your own project and sites. The pages below show every file to change; [Connect the Code to Your Project](doc:installation/connect-your-project) has the full list.
:::

## The pieces you will deploy

| Piece | Deployed to | Built from |
|---|---|---|
| Cloud Functions (`paymentConfig`, `createPayment`, `verifyPayment`, `sendEmail`, `onOnlineOrder`) | Cloud Functions v2, Node 22, `asia-south1` | `booqora_platform/functions/` |
| Firestore rules and indexes | Cloud Firestore | `booqora_platform/firestore.rules`, `firestore.indexes.json` |
| Storage rules | Cloud Storage | `booqora_platform/storage.rules` |
| Rental Platform and Online Store | Hosting target `platform` | `booqora_platform/` → `build/web` |
| Marketing Website | Hosting target `website` | `booqora_website/` → `out/` |
| Mobile App | Google Play and the App Store | `booqora_mobile/` |

The platform's `firebase.json` declares the functions, Firestore, Storage and the `platform` Hosting target. The website has its **own** `firebase.json` and `.firebaserc` inside `booqora_website/`.

## Step by step

:::steps
### Requirements
Install Node.js 22, the Firebase CLI and Flutter 3.41. See [Requirements](doc:installation/requirements).

### Create the Firebase project
Blaze plan, Firestore in `asia-south1`, Authentication (e-mail/password and anonymous) and Storage. See [Create the Firebase Project](doc:installation/firebase-project).

### Connect the code
Replace the project ID, the Firebase options files and the Hosting site IDs. See [Connect the Code to Your Project](doc:installation/connect-your-project).

### Secrets and environment
Create the eight Secret Manager secrets and check `functions/.env`. See [Secrets & Environment](doc:installation/environment-configuration).

### Deploy the backend
Functions, Firestore rules, indexes and Storage rules. See [Deploy Functions, Rules & Indexes](doc:installation/backend-deploy).

### Build and deploy the web apps
The Rental Platform with `flutter build web`, then the Marketing Website. See [Build & Deploy to Hosting](doc:installation/hosting).

### Create your first workspace
Sign up and create the first business. See [Create Your First Workspace](doc:installation/first-workspace).

### Go live
[Custom domains](doc:installation/domains), the [Setup Guide](doc:installation/setup-guide), [GitHub Actions](doc:installation/ci-cd) and [backups](doc:installation/backups).

### Mobile App
Re-brand, build and publish. Start at [App Prerequisites](doc:app/prerequisites).
:::

## Commands at a glance

```bash title="Terminal"
# Backend (from booqora_platform/)
cd booqora_platform
firebase use <your-project-id>
(cd functions && npm install)
firebase deploy --only functions,firestore:rules,firestore:indexes,storage

# Rental Platform
flutter pub get
flutter build web --release
firebase deploy --only hosting:platform

# Marketing Website (from booqora_website/)
cd ../booqora_website
npm install
npm run build
firebase deploy --only hosting:website
```

:::tip Test locally first
You can run the Rental Platform on your computer against your new project before deploying any hosting. See [Localhost Setup](doc:installation/localhost-setup).
:::

**Next:** [Requirements →](doc:installation/requirements)
