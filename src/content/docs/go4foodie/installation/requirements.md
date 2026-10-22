---
title: Requirements
description: Software to install on your computer and the accounts you need before installing Go4Foodie.
---

Install these tools on the computer you use to set up Go4Foodie (Windows, macOS or Linux). You do **not** need a server.

## Software

| Tool | Version | Used for | Check with |
|---|---|---|---|
| **Node.js** | 22 LTS (22.9 or newer) | Building and deploying the function, the website, the migration tool | `node -v` |
| **npm** | 10+ (comes with Node.js) | Installing packages | `npm -v` |
| **Firebase CLI** | Latest (14+) | Deploying functions, Hosting, rules, secrets and App Hosting | `firebase --version` |
| **Flutter SDK** | 3.41+ stable (Dart 3.11+) | Building the admin panel (web) and the mobile app | `flutter --version` |
| **Google Chrome** | Latest | Running the admin panel locally (`flutter run -d chrome`) | — |
| **Git** | Latest | Version control. App Hosting can deploy from GitHub | `git --version` |
| **Google Cloud CLI** (`gcloud`) | Optional | IAM roles, Firestore backups and exports | `gcloud --version` |
| **Android Studio** / **Xcode** | Latest stable | Building the mobile app (Android / iOS) | — |
| **Code editor** | VS Code or Android Studio | Editing configuration | — |

Install the Firebase CLI globally:

```bash
npm install -g firebase-tools
firebase login
```

:::tip Windows users
Run the commands in **Git Bash** or PowerShell. Where a command sets an environment variable inline (`FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy …`), PowerShell uses `$env:FUNCTIONS_DISCOVERY_TIMEOUT=90; firebase deploy …` instead.
:::

## Verify the tools

```bash
node -v            # v22.x
firebase --version # 14.x or newer
flutter doctor -v  # Chrome (web) and, for the app, Android toolchain green
```

## Accounts

| Account | Why | Cost |
|---|---|---|
| **Google account** + **Google Cloud billing account** | Firebase project on the Blaze plan | Pay as you go, see [costs](doc:admin/third-party-costs) |
| **GitHub** (optional) | App Hosting can build the website from your repository | Free |
| **SMTP mailbox or provider** | Order, reservation and gift card e-mails | Usually free for low volume |
| **Razorpay, Stripe and/or PayPal** (optional) | Online payments | Per transaction |
| **Google Play Console** | Publish the Android app | US$25 once |
| **Apple Developer** (optional) | Publish on the App Store | US$99 / year |

## Google services used

You enable these in the next steps. Go4Foodie uses only Google-managed services:

- **Cloud Firestore**: Native mode database, location `asia-south1`
- **Cloud Functions (2nd gen)**: one HTTPS function `api`, Node.js 22. Needs the Blaze plan
- **Firebase Authentication**: custom tokens for admin sign-in. No sign-in provider needs to be enabled
- **Cloud Storage**: menu image uploads (`uploads/` in the default bucket)
- **Firebase Hosting**: two sites, *admin* and *api*
- **Firebase App Hosting**: the Next.js website
- **Secret Manager**: the five backend secrets
- **IAM Service Account Credentials API**: lets the function sign the admin custom tokens
- Cloud Build, Artifact Registry and Cloud Run: used behind the scenes by Functions and App Hosting

## Choose a region

The function and the database are set up for **`asia-south1` (Mumbai)**, which suits India. The website runs on App Hosting in **`asia-southeast1` (Singapore)**, the nearest App Hosting region, because App Hosting has no Mumbai region. If your guests are elsewhere, pick a closer Firestore location and change the function region too. See [Environment Configuration → Changing the region](doc:installation/environment-configuration#changing-the-region).

:::warning The Firestore location is permanent
Choose it carefully when you create the database. You can't change it later for that project.
:::

**Next:** [Create the Firebase Project →](doc:installation/firebase-project)
