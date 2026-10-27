---
title: Firebase Settings
description: The Firebase Settings page shows which Firebase project the platform runs on and stores the web push VAPID key; its project values are written in the Admin Panel source and must be changed for your project.
---

The whole backend runs on one Firebase project: Cloud Functions (the API), Firestore, Authentication, Storage, Cloud Messaging and Hosting. **Admin → Settings → Firebase Settings** (*"The whole backend runs on this Firebase project"*) is a reference page for that project.

![Firebase Settings](/docs/classiadshub/images/admin-settings-firebase.jpg "Settings → Firebase Settings")

## Project card

| Row | Example for your project |
|---|---|
| **Project ID** | `your-project-id` |
| **Auth domain** | `your-project-id.firebaseapp.com` |
| **Storage bucket** | `your-project-id.firebasestorage.app` |
| **Messaging sender ID** | Your sender id |
| **Web app ID** | `1:000000000000:web:0000000000000000` |
| **API base** | `/api/v1 → Cloud Function api (us-central1)` |

**Open Firebase console** opens the project overview in the Firebase console.

:::warning These rows are hard-coded
The values on this card and the console link are written in the `FirebaseInfo` component of `admin/src/app/(panel)/settings/[section]/section.tsx`. They are display only and are not read from your config. After you move to your own project, edit the `rows` array and the console URL there, then rebuild and deploy the Admin Panel. The Admin Panel's real Firebase connection comes from `admin/src/lib/firebase.ts` (see [Admin Panel Installation](doc:installation/admin-panel)).
:::

The File Manager subtitle (*"Firebase Storage · your bucket"*) is hard-coded the same way in the `FileManager` component.

## Web push card

| Field | Notes |
|---|---|
| **VAPID key** | *"Firebase console → Project settings → Cloud Messaging → Web Push certificates"*. Click **Generate key pair** there and paste the public key |

**Save** stores it in `settings/firebase.vapid_key` (*"Saved."*). It is the same value as **Web push VAPID key** in [Notification Settings](doc:admin/otp-notifications#notification-settings). The shipped website does not use web push yet, so the key is only needed if you add Firebase Messaging to the website.

## Where the Firebase config really lives

| Component | File |
|---|---|
| Firebase CLI project | `.firebaserc` (project id, Hosting targets `web` and `admin`) |
| Hosting, rewrites, rules files | `firebase.json` (`/api/**` → function `api`) |
| Cloud Functions | Uses the default service account of the project; no key file needed |
| Admin Panel | `admin/src/lib/firebase.ts` |
| Website | `web/src/lib/firebase.ts` |
| Flutter app | `mobile/lib/firebase_options.dart`, `mobile/android/app/google-services.json` |

Moving to your own project is covered step by step in [Create the Firebase Project](doc:installation/firebase-project) and [Keys & Environment](doc:installation/environment-configuration). The status of Firestore, Storage and Auth can be checked on [System Status](doc:admin/system-status).

**Next:** [Watermark & File Manager →](doc:admin/media-settings)
