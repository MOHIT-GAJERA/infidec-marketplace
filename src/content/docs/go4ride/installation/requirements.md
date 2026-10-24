---
title: Requirements
description: Software to install on your computer, the accounts you need and the Google services Go4Ride uses, before you start the installation.
---

Install these tools on the computer you use to set up Go4Ride (Windows, macOS or Linux). You do **not** need a server: everything runs on Firebase.

## Software

| Tool | Version | Used for | Check with |
|---|---|---|---|
| **Flutter SDK** | 3.41+ stable (Dart 3.11+) | Admin panel (web), Customer App and Driver App | `flutter --version` |
| **Node.js** | **20** (the functions declare `"engines": { "node": "20" }`) | Building and deploying Cloud Functions, running the tests | `node -v` |
| **npm** | Comes with Node.js | Installing the functions and rules-test packages | `npm -v` |
| **Firebase CLI** (`firebase-tools`) | Latest | Deploying functions, rules, indexes and Hosting; the Emulator Suite | `firebase --version` |
| **FlutterFire CLI** | Latest | Generating `firebase_options.dart` and the platform config files | `flutterfire --version` |
| **Java JDK** | 21 recommended | Only for the local Firebase Emulator Suite | `java -version` |
| **Google Chrome** | Latest | Running the admin panel (`flutter run -d chrome`) | — |
| **Android Studio** | Latest stable | Android SDK, emulator, signing the Android apps | — |
| **Xcode** | Latest stable (macOS only) | Building the iOS apps | — |
| **Google Cloud CLI** (`gcloud`) | Optional | IAM roles on the first deploy, Firestore backups | `gcloud --version` |
| **Git** | Latest | Version control | `git --version` |

Install the two CLIs:

```bash
npm install -g firebase-tools
dart pub global activate flutterfire_cli
firebase login
```

:::tip Windows users
Run the commands in **Git Bash** or PowerShell. Make sure the Dart pub cache `bin` folder (`%LOCALAPPDATA%\Pub\Cache\bin`) is on your `PATH`, otherwise `flutterfire` is not found. If Java is not installed, Android Studio's bundled JDK works for the emulators: add `C:\Program Files\Android\Android Studio\jbr\bin` to `PATH`.
:::

## Verify the tools

```bash
flutter doctor -v    # Chrome, Android toolchain (and Xcode on a Mac) green
node -v              # v20.x
firebase --version
flutterfire --version
```

Then resolve the whole workspace once, at the repository root:

```bash
flutter pub get
```

The root `pubspec.yaml` is a **pub workspace**: one `pub get` resolves the three apps and the four shared packages together.

## Accounts

| Account | Why | Cost |
|---|---|---|
| **Google account** + **Google Cloud billing account** | Firebase project on the Blaze plan, Google Maps Platform | Pay as you go, see [Third-Party Service Costs](doc:admin/third-party-costs) |
| **Razorpay, Stripe and/or PayPal** (optional) | Online payments for trips and wallet top-ups | Per transaction |
| **Google Play Console** | Publish both Android apps | US$25 once |
| **Apple Developer Program** (optional) | Publish both iOS apps, APNs key for push and phone login | US$99 / year |

## Google services used

You enable these in the next steps. Go4Ride uses only Google-managed services:

- **Firebase Authentication**: **Phone** (OTP) for riders and drivers, **Email/Password** for the admin panel
- **Cloud Firestore**: the main database (Native mode)
- **Firebase Realtime Database**: live driver locations (`driver_locations`)
- **Cloud Storage for Firebase**: KYC documents, profile photos, support attachments and admin uploads
- **Cloud Functions (2nd gen)**: 19 functions: callables, Firestore triggers, two scheduled jobs and one HTTP endpoint. Needs the Blaze plan
- **Firebase Cloud Messaging**: ride, payment and broadcast notifications
- **Firebase Hosting**: the admin panel (optional, any static host works)
- **Google Maps Platform**: Maps SDK for Android, Maps SDK for iOS, Places API, Directions API, Geocoding API (and Distance Matrix API, listed in the setup guide)
- Behind the scenes, enabled by the first functions deploy: Cloud Build, Artifact Registry, Cloud Run, Eventarc, Pub/Sub and Cloud Scheduler

:::note The admin panel needs no Maps key
The admin panel's maps (zones, online drivers) use **OpenStreetMap** tiles through `flutter_map`. Only the two mobile apps use Google Maps.
:::

## Choose a region

- **Cloud Functions** deploy to **`us-central1`**, the Firebase default. No region is set in the code, and the payment return URL built in `functions/src/payments.ts` assumes `us-central1`. Keep it unless you are ready to change that file too.
- **Firestore and Storage**: choose the location closest to your riders, for example `asia-south1 (Mumbai)` for India.
- **Realtime Database**: one of `us-central1`, `europe-west1` or `asia-southeast1 (Singapore)`. For India, `asia-southeast1` is the closest.

:::warning The Firestore location is permanent
Choose it carefully when you create the database. You can't change it later for that project.
:::

**Next:** [Create the Firebase Project →](doc:installation/firebase-project)
