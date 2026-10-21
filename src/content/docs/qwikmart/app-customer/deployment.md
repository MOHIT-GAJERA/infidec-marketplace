---
title: Release & Play Store
description: Sign the release build, create the Android App Bundle and publish the Customer App on Google Play — step by step.
---

## 1. Create the upload keystore (once)

```bash
keytool -genkey -v -keystore /secure/yourstore-customer-upload.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

:::danger Back up the keystore
Store the `.jks` file and its passwords in two safe places (password manager + offline copy). Never commit it to Git. With Play App Signing a lost upload key can be reset, but it takes days.
:::

## 2. Point Gradle at it

```properties title="customer_app/android/key.properties (git-ignored)"
storePassword=<store password>
keyPassword=<key password>
keyAlias=upload
storeFile=C:/secure/yourstore-customer-upload.jks
```

`android/app/build.gradle.kts` signs release builds with this file automatically. Without it the build falls back to the **debug** key, which Google Play rejects.

## 3. Build

```bash
cd customer_app
flutter clean && flutter pub get
flutter build appbundle --release        # → build/app/outputs/bundle/release/app-release.aab
flutter build apk --release              # optional, for testing on phones
```

Check the signer:

```bash
keytool -printcert -jarfile build/app/outputs/bundle/release/app-release.aab   # Owner must be YOUR certificate, not "Android Debug"
```

## 4. Publish on Google Play

:::steps
### Create the app
Play Console → **Create app** → name, default language, *App*, *Free* → accept declarations.

### App content (Policy → App content)
Privacy policy URL (`https://yourstore.com/pages/privacy`), Ads: **No**, **Sign-in details** for the reviewer (a test customer account, e-mail login), Content rating, Target audience **18+**, Data safety (see below), Financial features: **none**, Health: **none**, Advertising ID: **No**.

### Store listing
App name, short and full description, 512 × 512 icon (`assets/icon/play_store_512.png`), 1024 × 500 feature graphic, at least 2 phone screenshots (1080 × 1920 recommended), category **Shopping**, contact e-mail.

### Internal testing
Test and release → Internal testing → Create release → **Use Google-generated app signing key** → upload the `.aab` → release notes → roll out. Add testers and install from the opt-in link.

### Add the Play signing SHA keys to Firebase
App integrity → App signing → copy **SHA-1** and **SHA-256** → Firebase → Android app → Add fingerprint. Required for phone OTP on Play installs.

### Closed test (new personal accounts only)
Personal developer accounts created after November 2023 must run a closed test with **12 testers for 14 days** before production. Organisation accounts can go straight to production.

### Production
Production → Countries (e.g. India) → Create release → *Add from library* → staged rollout (20 % → 100 %). First review takes 1–7 days.
:::

## Data safety answers (customer app)

Collected (not shared), encrypted in transit, deletion available (URL: `/pages/delete-account`):

| Data type | Required? | Purpose |
|---|---|---|
| Name, Email, Phone number | Optional | App functionality, Account management |
| User IDs | Required | Account management |
| Address | Required | App functionality |
| Precise location | Optional | App functionality |
| User payment info (Razorpay checkout) | Optional | App functionality |
| Purchase history | Required | App functionality |
| Other financial info (wallet) | Optional | App functionality |
| Other in-app messages (support chat) | Optional | App functionality |
| Photos (avatar, reviews, returns) | Optional | App functionality |
| Other user-generated content (reviews) | Optional | App functionality |
| Device or other IDs (push token) | Required | App functionality |

## Updates

Increase `version:` in `pubspec.yaml` (e.g. `1.0.1+2` → `1.0.2+3`), build the bundle, upload a new release.

**Next:** [Delivery Boy App →](doc:app-delivery/prerequisites)
