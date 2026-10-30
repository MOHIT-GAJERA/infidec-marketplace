---
title: Release Build & Keystore
description: Create your upload keystore, configure key.properties, set the version and build the signed Android App Bundle (AAB) for Google Play.
---

Google Play accepts only **Android App Bundles** signed with **your** upload key. Debug-signed builds are rejected.

## 1. Create the upload keystore (once)

```bash
keytool -genkeypair -v -keystore ~/keys/yourmarket-upload.jks \
  -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

On Windows, `keytool` is in Android Studio's JDK: `"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"`.

One keystore can sign both the Customer and the Partner app.

:::danger Back up the keystore and passwords
Keep the `.jks` file and its passwords in a password manager and a second safe place. If you lose them, you must ask Google to reset the upload key before you can ship updates.
:::

## 2. Create `android/key.properties`

```properties title="apps/customer_app/android/key.properties"
storePassword=<store-password>
keyPassword=<key-password>
keyAlias=upload
storeFile=C:/Users/you/keys/yourmarket-upload.jks
```

`storeFile` is resolved from `android/app/`, so an absolute path is simplest. The Partner app ships a template, `apps/partner_app/android/key.properties.example`, with the same format.

`android/app/build.gradle.kts` loads this file automatically. If it is missing, release builds fall back to the debug key. `key.properties` and `*.jks` are git-ignored; never commit them.

## 3. Set the version

```yaml title="apps/customer_app/pubspec.yaml"
version: 1.0.0+1     # versionName + versionCode
```

Raise the number after `+` for **every** upload, for example `1.0.1+2`.

## 4. Build the bundle

```bash
cd apps/customer_app
flutter clean
flutter build appbundle --release
# → build/app/outputs/bundle/release/app-release.aab
```

The release build uses R8 minification and resource shrinking with the keep rules in `android/app/proguard-rules.pro`.

## 5. Add the release fingerprints to Firebase

After the first upload, copy the **App signing key** SHA-1 and SHA-256 from Play Console (Test and release → App integrity) into the Firebase Android app. Also add your **upload key** fingerprints. Without them Google and phone sign-in fail in the Play build ([Firebase Setup](doc:app-customer/firebase-setup#2-add-sha-1-and-sha-256-fingerprints)).

## 6. Before you upload

- [x] Package name, app name, icon and splash are yours
- [x] `firebase_options.dart`, `google-services.json` and `webClientId` point to your project
- [x] Live payment keys configured on the server and in the panel
- [x] `version` raised

Then continue with [Google Play Listing & Review](doc:app-customer/play-console).

**Next:** [Google Play Listing & Review →](doc:app-customer/play-console)
