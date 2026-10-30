---
title: Firebase Setup
description: Register the Partner app in Firebase with its SHA fingerprints, place google-services.json and set the Google sign-in client ID.
---

The steps are the same as for the Customer app, with the partner package name.

:::steps
### Register the Android app
Firebase → Project settings → **Add app → Android** → package `com.go4market.partner` (or yours), nickname `Go4Market Partner`.

### Add SHA-1 and SHA-256
For the debug key, your upload key and, after the first Play upload, the **Play app-signing key**. Google sign-in and phone OTP depend on them. See [Customer App → Firebase Setup](doc:app-customer/firebase-setup#2-add-sha-1-and-sha-256-fingerprints) for the commands.

### Place google-services.json
Download it and copy it to `apps/partner_app/android/app/google-services.json`.

### Update the Dart options
In `packages/g4m_core/lib/src/firebase_options.dart`, set `androidPartner.appId` to the `mobilesdk_app_id` of the partner client in `google-services.json`. Both Android apps share the same Android API key.

### Google sign-in client ID
Set `kGoogleServerClientId` in `apps/partner_app/lib/core/social_auth.dart` to the project's **Web client ID**.
:::

:::warning Storage is used by the Partner app
Sellers upload product photos and store logos, and riders upload their photo and documents, to Cloud Storage. Make sure `storage.rules` are deployed ([Deploy Functions, Rules & Indexes](doc:installation/backend-deploy#2-deploy-rules-and-indexes)).
:::

**Next:** [Run the App →](doc:app-partner/run-the-app)
