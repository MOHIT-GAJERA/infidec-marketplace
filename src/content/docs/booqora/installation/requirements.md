---
title: Requirements
description: Accounts, tools and versions you need before installing Booqora.
---

## Accounts

- [x] A **Google account** that will own the Firebase project
- [x] A **billing account** (card) to enable the Firebase **Blaze** plan
- [ ] Optional: a **domain name** for the platform, store and website
- [ ] Optional: **Razorpay**, **Stripe** and/or **PayPal** merchant accounts
- [ ] Optional: an **SMTP** mailbox (a Gmail or Google Workspace account with an app password)
- [ ] Optional: a **Google Play Console** account (Android app)
- [ ] Optional: an **Apple Developer Program** membership and a Mac (iOS app)
- [ ] Optional: a **GitHub** repository for [auto-deploy](doc:installation/ci-cd)

See [Third-Party Service Costs](doc:admin/third-party-costs) for what each of these costs.

## Tools on your computer

| Tool | Version | Used for | Check with |
|---|---|---|---|
| **Node.js** | 22 LTS | Cloud Functions (`"engines": { "node": "22" }`), Firebase CLI, Marketing Website | `node -v` |
| **Firebase CLI** | 14 or newer (CI uses 15) | Deploying functions, rules, indexes and hosting | `firebase --version` |
| **Flutter SDK** | 3.41 stable (Dart 3.11) | Rental Platform and Mobile App | `flutter --version` |
| **FlutterFire CLI** | Latest | Generating `firebase_options.dart` for your project | `flutterfire --version` |
| **Java JDK** | 17 | Android builds (bundled with Android Studio) | `java -version` |
| **Android Studio** | Latest | Android SDK, emulator, `keytool` | – |
| **Xcode** (macOS only) | Latest | iOS builds | `xcodebuild -version` |
| **Google Cloud CLI** | Latest, optional | Firestore exports and bucket settings | `gcloud --version` |
| **Git** | Any | Version control for your customised copy | `git --version` |

Install the Firebase and FlutterFire CLIs and log in:

```bash title="Terminal"
npm install -g firebase-tools
firebase login
dart pub global activate flutterfire_cli
```

Enable Flutter web support once:

```bash title="Terminal"
flutter config --enable-web
flutter doctor
```

The GitHub Actions workflow pins **Flutter 3.41.4**. Use the same version locally to avoid analyser differences between your machine and CI.

:::note Operating system
Every step works on Windows, macOS and Linux, except the iOS build, which needs a Mac. Commands in these docs use a POSIX shell; on Windows, PowerShell works for every command shown unless a separate PowerShell version is given.
:::

:::warning Use a fast local disk
Firebase loads your functions code to discover them before each deploy. On a slow or network drive this can time out with *"User code failed to load"*. Keep the project on an SSD, or raise `FUNCTIONS_DISCOVERY_TIMEOUT` as shown in [Deploy Functions, Rules & Indexes](doc:installation/backend-deploy#discovery-timeout).
:::

## Package contents

```text title="Booqora/"
.github/workflows/deploy.yml        CI: analyse, build and deploy the Rental Platform
booqora_platform/                   Flutter Web Rental Platform + Online Store
  firebase.json · .firebaserc       functions, firestore, storage, hosting target "platform"
  firestore.rules · firestore.indexes.json · storage.rules
  functions/                        Cloud Functions (index.js, package.json, .env)
  lib/                              core/, data/, features/, widgets/, firebase_options.dart
  web/                              index.html, manifest.json, privacy.html, icons
booqora_mobile/                     Flutter Android/iOS app
  lib/  android/  ios/  assets/
booqora_website/                    Next.js 16 Marketing Website
  firebase.json · .firebaserc       hosting target "website"
  src/  public/  scripts/postbuild-seo.mjs
```

:::danger Do not ship secrets
Never commit service-account JSON files, keystores, `key.properties` or a file with real secret values. The included `.gitignore` already excludes a `secret/` folder, `*-firebase.json` and `functions/.secret.local`; keep your own keys there.
:::

**Next:** [Create the Firebase Project →](doc:installation/firebase-project)
