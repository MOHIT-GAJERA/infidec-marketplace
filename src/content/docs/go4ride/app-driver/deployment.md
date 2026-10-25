---
title: Release & Play Store
description: Sign and build the Driver App, publish it on Google Play as a second app (reviewer access with an approved test driver, Data safety, location answers, content rating) and prepare the iOS build.
---

The Driver App is published as its **own app** with its own listing, signing key and review. The build steps are the same as for the Customer App. This page lists them briefly and covers what is different for drivers.

## 1. Signing

:::steps
### Upload keystore
```bash
cd apps/driver_app
keytool -genkey -v -keystore android/app/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```
Use a **separate** keystore from the rider app and back it up.

### key.properties
`apps/driver_app/android/key.properties` with `storePassword`, `keyPassword`, `keyAlias=upload`, `storeFile=upload-keystore.jks` (git-ignored).

### Release signing in Gradle
`apps/driver_app/android/app/build.gradle.kts` also ships with `signingConfig = signingConfigs.getByName("debug")` for release. Add the `keystoreProperties` block, `signingConfigs { create("release") { … } }` and the `buildTypes` change exactly as shown in [Customer App → Release & Play Store](doc:app-customer/deployment).
:::

## 2. Build

```bash
cd apps/driver_app
flutter clean
flutter pub get
flutter build appbundle --release --dart-define-from-file=../../secret/app_keys.env
# → build/app/outputs/bundle/release/app-release.aab
keytool -printcert -jarfile build/app/outputs/bundle/release/app-release.aab   # your certificate, not "Android Debug"
```

Increase `version:` in `apps/driver_app/pubspec.yaml` for every upload (`1.0.0+1` → `1.0.1+2`).

## 3. Before you submit

- [ ] Android label and iOS name changed from `driver_app` / `Driver App` ([App Name, Logo & Colour](doc:app-driver/branding))
- [ ] Driver content pages (About, Privacy, Terms) filled in the Admin Panel, public privacy policy URL
- [ ] **Account deletion**: the Driver App has no delete option. Add an in-app path and a public deletion web page, as Google Play and Apple require. Explain what you keep (trip and payout records for accounting)
- [ ] An **approved test driver** for the reviewer (see App access below)

## 4. Google Play

Use the same **organization** developer account as the rider app (D-U-N-S verified, see [Customer App → Release & Play Store](doc:app-customer/deployment)). Then:

:::steps
### Create the app
Play Console → **Create app** → *YourRide Driver*, *App*, *Free*. Category **Maps & Navigation** or **Business**. Mention in the description that the app is for registered drivers of your service.

### App access
*All or some functionality is restricted.* The reviewer cannot pass KYC, so prepare a **test phone number with a fixed code** in Firebase Auth whose driver profile is **already approved** in the Admin Panel, with a positive wallet. Give the number, the code and short steps (*sign in, flip the online switch*).

### Store listing
Short and full description, 512 × 512 icon, 1024 × 500 feature graphic, 2–8 phone screenshots (1080 × 1920 recommended): registration, documents, online home, request card, trip with OTP, earnings, plans. 7-inch and 10-inch tablet screenshots only if you support tablets.

### App content
Privacy policy, Ads (*No*), Content rating, Target audience **18+** (drivers must be adults with a licence), Data safety (below), Financial features (earnings wallet and payouts to your own drivers, no lending or banking), Government apps *No*, Health *No*.

### Location permissions
The Driver App requests only **foreground** location (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`). It has no `ACCESS_BACKGROUND_LOCATION` and no foreground service, so the **background location** declaration and video are **not** needed. If you later add background tracking, you must add the permission, a location foreground service, and complete the *Location permissions* declaration with a video showing the prominent disclosure.

### Tracks
**Internal testing** (Use Google-generated app signing key, upload the bundle) → add the **App signing key** SHA-1 and SHA-256 to the *driver* Firebase Android app and to the Maps key → **Closed testing** with a pilot group of drivers → **Production** with a staged rollout.
:::

## Data safety answers (driver app)

Encrypted in transit: **Yes**. Deletion: **on request** (your deletion URL). Not shared with third parties (Firebase and payment providers act as service providers).

| Data type | Collected | Optional? | Purpose |
|---|---|---|---|
| Location: **precise** and **approximate** | Yes | Required while online | App functionality (dispatch, live tracking for riders, SOS) |
| Personal info: **Name** | Yes | Required | App functionality, Account management |
| Personal info: **Phone number** | Yes | Required (login) | Account management |
| Personal info: **Other info** (vehicle details, plate number, female driver flag, licence and document numbers on photos) | Yes | Required for KYC | App functionality, Fraud prevention / security |
| Photos and videos: **Photos** | Yes | Required (KYC documents), optional (support) | App functionality, Fraud prevention / security, Customer support |
| Financial info: **Purchase history** | Yes | Required | App functionality (subscriptions) |
| Financial info: **Other financial info** | Yes | Required | App functionality (wallet, earnings, payout requests) |
| Messages: **Other in-app messages** | Yes | Optional | Customer support |
| Device or other IDs | Yes | Required | App functionality (push) |

## Content rating

Category **All other app types**. No violence, sexual content, gambling or drugs. **Yes** to sharing the user's location with other users (riders see the driver's position during a ride). If you sell subscription plans, answer *Yes* to digital purchases.

## iOS / App Store summary

1. Xcode: bundle ID and team, Push Notifications, Background Modes → Remote notifications, APNs key in Firebase.
2. `Info.plist` already has camera, photo library and location texts. Rewrite them for your brand. The location texts mention booking rides; change them to *share your location with riders while you are online*.
3. `flutter build ipa --release --dart-define-from-file=../../secret/app_keys.env` → upload with Xcode Organizer or Transporter.
4. App Store Connect: App Privacy with the answers above, reviewer test number and code for the approved driver, in-app account deletion.

Apple may ask why a driver app is not limited to your company. Explain in the review notes that drivers register and are verified by your operations team.

## After release

Set **Driver app versions → Play Store URL** (and App Store URL) in the Admin Panel. Raise the minimum version when you need every driver on the new build. With **Force update** on, drivers below it see *Update required* and cannot go online ([Maintenance Mode & App Versions](doc:admin/maintenance)).

**Next:** [Backend Reference →](doc:api/overview)
