---
title: Requirements
description: Software to install on your computer, the accounts you need and the Google services ClassiAds-Hub uses, before you start the installation.
---

Install these tools on the computer you use to set up ClassiAds-Hub (Windows, macOS or Linux). You do **not** need a server: everything runs on Firebase.

## Software

| Tool | Version | Used for | Check with |
|---|---|---|---|
| **Node.js** | **22** (the functions declare `"engines": { "node": "22" }` and `firebase.json` sets `"runtime": "nodejs22"`) | Building and deploying the functions, building the website and the Admin Panel, the tools scripts | `node -v` |
| **npm** | Comes with Node.js | Installing packages in `functions/`, `web/`, `admin/` and `tools/*` | `npm -v` |
| **Firebase CLI** (`firebase-tools`) | Latest | Deploying functions, rules, indexes and Hosting; setting secrets; the emulators | `firebase --version` |
| **Git** | Latest | Version control | `git --version` |
| **Google Chrome** | Latest | Testing the website and the panel. The browser QA scripts in `tools/qa/` drive Chrome | — |
| **Flutter SDK** | Stable with Dart **3.11+** (`mobile/pubspec.yaml`: `sdk: ^3.11.1`) | Only for the mobile app | `flutter --version` |
| **Android Studio** | Latest stable | Android SDK, emulator, signing the Android app | — |
| **Xcode** | Latest stable (macOS only) | Building the iOS app | — |
| **FlutterFire CLI** | Latest | Generating the app's `firebase_options.dart` | `flutterfire --version` |
| **Google Cloud CLI** (`gcloud`) | Optional | IAM roles if the first deploy needs them, Firestore backups | `gcloud --version` |
| **MySQL / MariaDB** | Optional | Only for the one-time [Data Migration](doc:installation/data-migration) | — |

Install the Firebase CLI and sign in:

```bash
npm install -g firebase-tools
firebase login
```

:::tip Windows users
Run the commands in **Git Bash** or PowerShell. The scripts in `tools/` call `firebase` and `npm` through the shell, so both must be on your `PATH`.
:::

## Verify the tools

```bash
node -v              # v22.x
firebase --version
flutter doctor -v    # only if you build the app
```

Then install the packages of the three Node projects once:

```bash
cd functions && npm install && cd ..
cd admin && npm install && cd ..
cd web && npm install && cd ..
```

## Accounts

| Account | Why | Cost |
|---|---|---|
| **Google account** + **Google Cloud billing account** | Firebase project on the Blaze plan | Pay as you go, see [Third-Party Service Costs](doc:admin/third-party-costs) |
| **Stripe, Razorpay and/or PayPal** (optional) | Online payments for packages and featured ads on the website | Per transaction |
| **Domain names** (optional) | The website and the Admin Panel on your own addresses | Per year |
| **Google Play Console** | Publish the Android app | US$25 once |
| **Apple Developer Program** (optional) | Publish the iOS app, Sign in with Apple, APNs for push | US$99 / year |

## Google services used

You enable these in the next steps. ClassiAds-Hub uses only Google-managed services:

- **Firebase Authentication**: **Email/Password** (every account, including phone-only accounts through a synthetic e-mail), **Google** (website and app, optional) and **Apple** (iOS app, optional)
- **Cloud Firestore**: the main database (Native mode)
- **Cloud Storage for Firebase**: ad photos, avatars, content images, KYC documents, receipts and résumés
- **Cloud Functions (2nd gen)**: the `api` HTTPS function and the scheduled `housekeeping` function. Needs the Blaze plan
- **Secret Manager**: the three payment secret keys
- **Firebase Cloud Messaging**: push notifications to the app (and web push with a VAPID key)
- **Firebase Hosting**: two sites, one for the website and one for the Admin Panel
- **Google Maps Platform**: Maps SDK for Android and iOS, used by the mobile app only
- Behind the scenes, enabled by the first functions deploy: Cloud Build, Artifact Registry, Cloud Run, Cloud Scheduler and Pub/Sub

:::note The website and the panel need no Maps key
The Admin Panel's location picker uses **OpenStreetMap** tiles through Leaflet. The website's Nearby page uses the browser's location. Only the mobile app uses Google Maps.
:::

## Choose a region

- **Cloud Functions** run in **`us-central1`**. The region is set in `functions/src/index.ts` (`setGlobalOptions({ region: "us-central1", maxInstances: 20 })`) and repeated in the Hosting rewrites in `firebase.json` and in the API addresses of the website, the panel and the app. Keep it unless you are ready to change all of them.
- **Firestore and Storage**: choose the location closest to your users, for example `asia-south1 (Mumbai)` for India or `europe-west1` for Europe.

:::warning The Firestore location is permanent
Choose it carefully when you create the database. You can't change it later for that project.
:::

**Next:** [Create the Firebase Project →](doc:installation/firebase-project)
