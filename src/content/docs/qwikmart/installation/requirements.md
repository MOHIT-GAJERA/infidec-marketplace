---
title: Requirements
description: Software to install on your computer and the accounts you need before installing QwikMart.
---

Install these tools on the computer you use to set up QwikMart (Windows, macOS or Linux). You do **not** need a server.

## Software

| Tool | Version | Used for | Check with |
|---|---|---|---|
| **Node.js** | 22 LTS | Backend build, Admin Panel, Web Portal, Firebase CLI | `node -v` |
| **npm** | 10+ (comes with Node.js) | Installing packages | `npm -v` |
| **Firebase CLI** | 14+ (included in `firebase/` as a dev dependency) | Deploying functions, rules, indexes, App Hosting | `npx firebase --version` |
| **Java JDK** | 21 (LTS) | Firebase Emulator Suite (local testing) and Android builds | `java -version` |
| **Git** | Latest | Version control; App Hosting deploys from GitHub | `git --version` |
| **Flutter SDK** | 3.41+ (stable) | Customer and Delivery Boy apps | `flutter --version` |
| **Android Studio** | Latest stable | Android SDK, emulator, signing | — |
| **Xcode** | 26+ (macOS only) | iOS builds | — |
| **Code editor** | VS Code or Android Studio | Editing configuration | — |

:::tip Windows users
Android Studio ships a Java runtime. Add it to your `PATH` so the emulators and Gradle can use it, for example `C:\Program Files\Android\Android Studio\jbr\bin`. Use **Git Bash** or PowerShell for the commands in these docs.
:::

## Verify the tools

```bash
node -v            # v22.x
java -version      # 21.x
flutter doctor -v  # all Android checks green
```

## Accounts

| Account | Why | Cost |
|---|---|---|
| **Google account** + **Google Cloud billing account** | Firebase project on the Blaze plan | Pay as you go, see [costs](doc:admin/third-party-costs) |
| **GitHub** (or GitLab) | Recommended: App Hosting builds from your repository | Free |
| **Google Play Console** | Publish the Android apps | US$25 once |
| **Apple Developer** (optional) | Publish on the App Store | US$99 / year |
| **Razorpay** or another gateway (optional) | Online payments | Per transaction |
| **SMTP provider** (optional) | Transactional e-mail | Usually free for low volume |

## Firebase services used

You will enable these in the next step. QwikMart uses only Google-managed services:

- **Authentication** — Email/Password, Phone and Anonymous providers
- **Cloud Firestore** — Native mode database
- **Cloud Functions** (2nd gen, Node.js 22) — requires the Blaze plan
- **Cloud Storage** — images and documents
- **Cloud Messaging** — push notifications
- **App Hosting** — Admin Panel and Web Portal

## Choose a region

All Cloud Functions run in **`asia-south1` (Mumbai)** by default, which is ideal for India. If your customers are elsewhere, choose the Firestore location closest to them when you create the database, and change the functions region in `firebase/functions/src/shared/firebase.ts` (`REGION`) **and** in every client (see [Environment Configuration](doc:installation/environment-configuration)).

:::warning The Firestore location cannot be changed later
Pick it carefully when you create the database — it is permanent for the project.
:::

**Next:** [Create the Firebase Project →](doc:installation/firebase-project)
