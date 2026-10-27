---
title: Release & Play Store
description: Sign the app with your upload key, build the Android App Bundle, publish it on Google Play (store listing with the assets in store/playstore, App content, Data safety, testing tracks) and register the Play App Signing SHA in Firebase.
---

The app has **no in-app purchases**. Packages and featured ads are sold on the website only, so Google Play Billing rules do not apply and you answer *No* to digital purchases in the Play forms.

## Before you build

- [ ] Own package name set and FlutterFire run for it ([Change Package Name](doc:app/change-package-name), [Firebase Setup](doc:app/firebase-setup))
- [ ] App name, launcher icon, splash and the hard-coded `classiadshub.web.app` links replaced ([App Name, Logo & Splash](doc:app/branding))
- [ ] API base URL points at **your** production API ([API Configuration](doc:app/api-configuration))
- [ ] Your own Maps key, **Maps SDK for Android** enabled, key restricted ([Google Maps & Location](doc:app/maps-location))
- [ ] Google provider enabled and the new `google-services.json` in place, if you keep **Continue with Google** ([Login, Register & OTP](doc:app/auth#continue-with-google))
- [ ] Website payment gateways on live keys and Sandbox / Bank Transfer switched off as needed ([Payment Gateways](doc:admin/payment-gateways))
- [ ] **Privacy Policy**, **Terms** and **About** pages written in the Admin Panel ([CMS Pages](doc:admin/pages)). The privacy page must name your app, list the data collected (see [Data safety](#data-safety)) and explain account deletion
- [ ] Test data from QA runs removed from the live database (`tools/qa/cleanup-qa-data.js`, run it with `--dry` first)
- [ ] The version text in **Settings → About** (`settings_screen.dart`) matches `pubspec.yaml`

## 1. Create the upload keystore (once)

```bash
keytool -genkey -v -keystore upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Keep the file outside the repository or in a git-ignored folder.

:::danger Back up the keystore
Keep the `.jks` file and its passwords in two safe places (a password manager and an offline copy). Never commit them. `*.jks` and `key.properties` are already in `.gitignore`. With Play App Signing a lost upload key can be reset by Google support, but it takes days.
:::

## 2. key.properties

```properties title="mobile/android/key.properties (git-ignored)"
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=upload
storeFile=/absolute/path/to/upload-keystore.jks
```

`storeFile` may also be relative; it is resolved from `android/app/`.

## 3. Signing in build.gradle.kts

Release signing is already wired. `android/app/build.gradle.kts` loads `key.properties` and creates a `release` signing config from it:

```kts title="mobile/android/app/build.gradle.kts"
val keystoreProperties = Properties().apply {
    val file = rootProject.file("key.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}

signingConfigs {
    if (keystoreProperties.isNotEmpty()) {
        create("release") { /* keyAlias, keyPassword, storeFile, storePassword */ }
    }
}

buildTypes {
    release {
        signingConfig = if (keystoreProperties.isNotEmpty()) signingConfigs.getByName("release")
                        else signingConfigs.getByName("debug")
    }
}
```

:::warning Missing key.properties = debug-signed bundle
Without `key.properties` the release build silently falls back to the **debug** key. Google Play rejects debug-signed bundles. Always check the signature (step 4).
:::

## 4. Build the App Bundle

Set the version first. The number after `+` is the Android `versionCode` and must increase with every upload:

```yaml title="mobile/pubspec.yaml"
version: 1.0.0+1     # next release: 1.0.1+2
```

```bash
cd mobile
flutter clean
flutter pub get
flutter build appbundle --release
# optional: --dart-define=API_BASE_URL=https://www.yourcompany.com/api/v1
```

The bundle is `mobile/build/app/outputs/bundle/release/app-release.aab`. Check that it is signed with your upload key:

```bash
keytool -printcert -jarfile build/app/outputs/bundle/release/app-release.aab
```

The SHA-1 must be your upload key's, not the debug key's.

## 5. Create the app in Play Console

1. [play.google.com/console](https://play.google.com/console) → **Create app**: your app name, default language, **App**, **Free**. Accept the declarations.
2. **Test and release → Setup → App signing**: keep **Google-managed app signing** (Play App Signing).

## 6. Store listing

**Grow users → Store presence → Main store listing**. Ready-made assets are in **`store/playstore/`**:

| Play Console field | File | Spec |
|---|---|---|
| App icon | `icon-512.png` | 512 × 512 PNG |
| Feature graphic | `feature-graphic.png` | 1024 × 500 PNG |
| Phone screenshots | `phone-screenshots/01-home.png` … `08-my-ads.png` | 8 screenshots, 1080 × 1920 (9:16) |
| Promo video | `promo-30s.mp4` | Play only accepts a **YouTube URL**: upload it to YouTube as Public or Unlisted and paste the link |

The screenshots tell the story in order: home, listings, ad detail, category, chat, post ad, ad detail, my ads. They show the ClassiAds-Hub branding. Replace them with captures of **your** branded app before you publish. `store/compose.mjs` builds framed screenshots from raw captures in `store/raw/` (`node store/compose.mjs`).

Also fill: short description (80 characters max), full description, category (for example **Shopping**), contact email and website.

## 7. App content

**Policy → App content**. Suggested answers for this app:

| Section | Answer |
|---|---|
| Privacy policy | Your website's privacy page, for example `https://www.yourcompany.com/page/privacy` |
| Ads | **No**, unless you add an ad SDK. The app has only an empty AdMob placeholder |
| App access | **Restricted**: give the reviewer a test login (email + password) and note *"Tap Continue with Email on the login screen"* |
| Content rating | Category *All other app types*. User-generated content **Yes**, users interact **Yes**, shares location **Yes**, digital purchases **No** |
| Target audience | **18 and over** (a marketplace with chat between strangers) |
| Financial features | None |
| Account deletion | **Yes, in the app** (Profile → Delete Account) plus a web URL, for example your website's profile page |

### Data safety

All traffic is encrypted in transit (HTTPS / Firebase). Users can delete their account.

| Data type | Collected | Purpose | Required? |
|---|---|---|---|
| Name | Yes | Account management, App functionality | Required |
| Email address | Yes | Account management | Required (or phone) |
| Phone number | Yes | Account management, App functionality | Optional |
| Approximate and precise location | Yes | App functionality (location label, nearby ads) | Optional |
| Photos | Yes | App functionality (ad photos, avatar) | Optional |
| Messages (in-app chat) | Yes | App functionality | Optional |
| Files and docs (ID documents for verification) | Yes | App functionality (seller verification) | Optional |
| Device or other IDs (FCM token) | Yes | App functionality (push) | Required |
| App interactions (Firebase Analytics) | Yes | Analytics | Required |
| Crash logs and diagnostics (Crashlytics) | Yes | App functionality, Analytics | Required |

Data is not **shared**: Firebase and Google act as your service providers. Review this table against your own privacy policy and any SDKs you add.

## 8. Upload and test

:::steps
### Internal testing
**Test and release → Testing → Internal testing** → create a testers list → **Create new release** → upload `app-release.aab` → release name `1.0.0 (1)` → release notes → **Save → Review → Start rollout**.

### Register the App Signing SHA
See the next section. Do it before you test Google sign-in and Maps from Play.

### Test on a real phone
Install from the opt-in link and check: email login, Google sign-in, the map on an ad, a push on a new chat message, posting an ad with a photo, and **Delete Account**.

### Closed test (new personal accounts)
New **personal** developer accounts must run a closed test with at least **12 testers for 14 continuous days** before production access. Organisation accounts skip this.

### Production
**Production → Create new release** → promote the tested release, choose countries, use a staged rollout (for example 20%) → **Send for review**. The first review can take from a few days up to about a week.
:::

## Add the App Signing SHA to Firebase

Google re-signs every app delivered from Play with the **App signing key**. After the first upload:

1. Play Console → **Test and release → App integrity** (App signing) → copy the **App signing key certificate** SHA-1 and SHA-256.
2. Firebase Console → **Project settings → Your apps → Android app → Add fingerprint** → add both.
3. Download `google-services.json` again and replace `mobile/android/app/google-services.json` (needed for Google sign-in), then build and upload a new version.
4. Google Cloud console → your Maps key → **Android apps** restriction → add the same SHA-1 with your package name.

:::danger Works locally, fails from Play
Without this, **Continue with Google** and the map fail in the Play-installed app even though they work in your own builds.
:::

## After launch

- **Crashlytics** in the Firebase Console for crashes, **Play Console → Android vitals** for ANRs.
- For each update: bump `version:` (the `+` number must increase), run `flutter build appbundle --release`, create a new release in the same track.
- If you ever change signing keys, update the SHA fingerprints in Firebase and the Maps key restriction.

## iOS (App Store)

The project builds for iOS (deployment target 13.0), but the release flow is not scripted. In short:

1. Open `mobile/ios/Runner.xcworkspace`, set your Team and bundle ID, and add **Push Notifications** and **Background Modes → Remote notifications** if you use push.
2. Add `NSPhotoLibraryUsageDescription` to `Info.plist` (the image picker needs it; it is missing in the shipped file).
3. Upload an APNs key to Firebase, and use an iOS-restricted Maps key in `AppDelegate.swift`.
4. If you offer Google sign-in on iOS, App Review may require Sign in with Apple ([Login, Register & OTP](doc:app/auth#continue-with-google)).
5. `flutter build ipa --release`, then upload with Xcode Organizer or Transporter and submit in App Store Connect.

**Next:** [Architecture →](doc:api/overview)
