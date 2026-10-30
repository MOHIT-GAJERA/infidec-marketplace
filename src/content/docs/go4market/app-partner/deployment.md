---
title: Release & Play Store
description: Sign and build the Partner app bundle with key.properties, then publish it on Google Play with the background-location declaration.
---

## 1. Signing

Use the same upload keystore as the Customer app, or a separate one ([Release Build & Keystore](doc:app-customer/deployment#1-create-the-upload-keystore-once)). Copy the template and fill it in:

```bash
cd apps/partner_app/android
cp key.properties.example key.properties
```

```properties title="apps/partner_app/android/key.properties"
# storeFile is relative to android/app/ (an absolute path also works)
storePassword=<store-password>
keyPassword=<key-password>
keyAlias=upload
storeFile=upload-keystore.jks
```

Without `key.properties`, release builds are signed with the debug key and Play rejects them.

## 2. Version

Raise `version:` in `apps/partner_app/pubspec.yaml` (for example `1.0.1+2`) for every upload, then set **Admin → Settings → App versions → Partner** when the update is live.

## 3. Build

```bash
cd apps/partner_app
flutter clean
flutter build appbundle --release
# → build/app/outputs/bundle/release/app-release.aab
```

## 4. Publish

Follow [Google Play Listing & Review](doc:app-customer/play-console). For the Partner app in particular:

- Category **Business**; texts from `playstore/partner_app/listing.md`; screenshots from `playstore/partner_app/screenshots/`.
- **App access**: give reviewers both a seller and a delivery login, and keep Demo mode on during review.
- **Location permissions** declaration and video for background location, and the **foreground service** type *Location*.
- **Data safety**: photos (products, documents) and precise background location for riders.

## 5. After the first upload

Add the **Play app-signing** SHA-1 and SHA-256 to the partner Android app in Firebase, otherwise Google and phone sign-in fail for users who install from Play.

**Next:** [Website Overview →](doc:web/overview)
