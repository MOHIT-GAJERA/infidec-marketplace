---
title: Requirements
description: Accounts, tools and versions you need before installing Go4Market.
---

## Accounts

- [x] A **Google account** that will own the Firebase project
- [x] A **billing account** (card) to enable the Firebase **Blaze** plan
- [x] A **Google Play Console** account (for the two Android apps)
- [ ] Optional: a **domain name** for the website and panels
- [ ] Optional: **Razorpay**, **Stripe** and/or **PayPal** merchant accounts
- [ ] Optional: an **SMTP** mailbox (a Gmail or Google Workspace account with an app password)
- [ ] Optional: an **SMS** provider account (Twilio, MSG91 or Fast2SMS)
- [ ] Optional: a **Google AI Studio** API key for Gemini

## Tools on your computer

| Tool | Version | Used for | Check with |
|---|---|---|---|
| **Node.js** | 22 LTS | Cloud Functions build, seed script, Firebase CLI | `node -v` |
| **Firebase CLI** | 14 or newer | Deploying functions, rules, indexes and hosting | `firebase --version` |
| **Flutter SDK** | 3.41 stable (Dart 3.11) | Website, panels and both apps | `flutter --version` |
| **Google Cloud CLI** | Latest | Storage CORS (`gcloud storage` or `gsutil`) | `gcloud --version` |
| **Java JDK** | 17 | Android builds (bundled with Android Studio) | `java -version` |
| **Android Studio** | Latest | Android SDK, emulator, `keytool` | – |
| **Git** | Any | Version control for your customised copy | `git --version` |

Install the Firebase CLI and log in:

```bash
npm install -g firebase-tools
firebase login
```

Enable Flutter web support once:

```bash
flutter config --enable-web
flutter doctor
```

:::note Operating system
Every step works on Windows, macOS and Linux. The panel build helper `apps/panel/tool/build_all.ps1` is a **PowerShell** script. On macOS or Linux run it with PowerShell 7 (`pwsh`), or use the plain `flutter build web` commands shown in [Build & Deploy the Web Apps](doc:installation/hosting#without-powershell).
:::

:::warning Use a fast local disk
Building functions and running Firebase deploy discovery on a slow or network drive can time out. Keep the project on an SSD; on Windows prefer the `C:` drive. See the `FUNCTIONS_DISCOVERY_TIMEOUT` note in [Deploy Functions, Rules & Indexes](doc:installation/backend-deploy#discovery-timeout).
:::

## Package contents

```text title="Go4Market/"
firebase.json · .firebaserc         hosting targets, functions, firestore, storage
firestore.rules · firestore.indexes.json · storage.rules · storage.cors.json
functions/                          Cloud Functions (TypeScript)
tools/seed/                         seed script (Node, Admin SDK)
packages/g4m_core/                  shared Dart package (theme, models, Firebase options)
apps/website/                       Flutter Web storefront
apps/panel/                         Flutter Web Admin, Seller and Delivery panels
apps/customer_app/                  Flutter Android app (com.go4market.customer)
apps/partner_app/                   Flutter Android app (com.go4market.partner)
playstore/                          store listings, screenshots, feature graphics
docs/                               ARCHITECTURE.md, API.md, PANEL_COVERAGE.md
```

**Next:** [Create the Firebase Project →](doc:installation/firebase-project)
