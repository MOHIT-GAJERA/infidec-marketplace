---
title: Release & Play Store
description: Sign the release build, create the Android App Bundle with your API URL, publish the Go4Foodie app on Google Play, and prepare the iOS build.
---

One build contains all three modes (Customer, Restaurant and Owner). You publish **one app**.

## 1. Create the upload keystore (once)

```bash
keytool -genkey -v -keystore android/app/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

:::danger Back up the keystore
Store the `.jks` file and its passwords in two safe places (a password manager and an offline copy). Never commit it to Git. `.jks`, `.keystore` and `key.properties` are already git-ignored. With Play App Signing a lost upload key can be reset, but it takes days.
:::

## 2. Point Gradle at it

```properties title="mobile-app/android/key.properties (git-ignored)"
storePassword=<store password>
keyPassword=<key password>
keyAlias=upload
storeFile=upload-keystore.jks
```

`storeFile` is relative to `android/app/`. You can also use an absolute path. When `key.properties` exists, `android/app/build.gradle.kts` signs release builds with it. Without it, the build **falls back to the debug key**, and Google Play rejects that.

## 3. Build

Set your own servers. Without these flags the build uses the defaults in `lib/core/api.dart` ([API Configuration](doc:app/api-configuration)).

```bash
cd mobile-app
flutter clean && flutter pub get
flutter build appbundle --release \
  --dart-define=API_BASE_URL=https://yourrestaurant-1a2b3.web.app \
  --dart-define=SITE_ORIGIN=https://www.yourrestaurant.com
# → build/app/outputs/bundle/release/app-release.aab

flutter build apk --release --dart-define=API_BASE_URL=… --dart-define=SITE_ORIGIN=…   # optional, for testing on phones
```

On Windows `cmd`, end the lines with `^` instead of `\`, or put everything on one line.

Check the signer:

```bash
keytool -printcert -jarfile build/app/outputs/bundle/release/app-release.aab   # Owner must be YOUR certificate, not "Android Debug"
```

:::warning Never upload a LAN test build
A build made with `API_BASE_URL=http://192.168.…` or `10.0.2.2` only works on your network. Install it on a phone and sign in before you upload. The default server must be your public **HTTPS** API host.
:::

## 4. Before you submit

- [ ] Backend deployed on HTTPS, and `GET https://<your-api-host>/api/menu` returns your menu
- [ ] Website live, with the privacy page at `https://<your-domain>/privacy`
- [ ] Restaurant profile set in Admin → Settings (the customer home shows it)
- [ ] Payment gateways on **live** keys, with your website domain (`SITE_ORIGIN`) allowed in their dashboards
- [ ] A reviewer login (a test **customer** account) on the live server
- [ ] **Account deletion**: Google Play requires an in-app way to delete the account and a public web page where users can request deletion. The app does not include this yet, so add it before you submit (for example a *Delete account* request page on your website and a link to it in Profile)
- [ ] Keystore and `key.properties` backed up

## 5. Publish on Google Play

:::steps
### Create the app
Play Console → **Create app** → name, default language, *App*, *Free* → accept the declarations. Category **Food & Drink**.

### App content (Policy → App content)
Privacy policy URL (`https://www.yourrestaurant.com/privacy`), Ads: **No**, **App access**: *All or some functionality is restricted*, with the reviewer's customer login. Content rating: category *All other app types*. Answer **Yes** to digital purchases (food orders and gift cards are paid in the app), and to alcohol references only if you sell alcohol. Target audience **18+** if your menu lists alcohol. Data safety (see below). Government, financial features, health: **No**.

### Store listing
App name, short and full description, 512 × 512 icon, 1024 × 500 feature graphic, and at least 2 phone screenshots (1080 × 1920 recommended). The listing can mention all three modes: ordering and booking for guests, plus the Restaurant and Owner apps for the team.

### Internal testing
Test and release → Internal testing → Create release → **Use Google-generated app signing key** → upload the `.aab` → release notes → roll out. Add testers and install from the opt-in link.

### Closed test (new personal accounts only)
Personal developer accounts created after November 2023 must run a closed test with **12 testers for 14 days** before production. Organisation accounts can go straight to production. Start this early.

### Production
Production → countries → Create release → *Add from library* → staged rollout (20 % → 100 %). The first review takes 1–7 days.
:::

## Data safety answers

Collected (not shared), encrypted in transit (HTTPS), deletion available:

| Data type | Collected | Purpose |
|---|---|---|
| Name | Yes | Account management, App functionality |
| Email address | Yes | Account management (login), App functionality |
| Phone number | Yes | App functionality (orders, bookings) |
| Purchase history | Yes | App functionality (orders, bookings, gift cards) |
| Payment info | **No**: handled by Razorpay / Stripe, card details never reach your server | — |
| Photos / camera | **No**: the camera only scans table QR codes, nothing is stored | — |
| Location | No | — |

**Permissions:** `INTERNET` and `CAMERA` (QR scanning). No sensitive-permission declaration is needed.

## iOS camera permission

`ios/Runner/Info.plist` does **not** contain a camera usage text. iOS terminates the app when **Scan table QR** opens the camera, and App Store review rejects such builds. Add this before your first iOS build:

```xml title="ios/Runner/Info.plist"
<key>NSCameraUsageDescription</key>
<string>The camera is used to scan the QR code on your table so you can order from it.</string>
```

## iOS build

On a Mac with Xcode:

```bash
cd mobile-app
flutter build ipa --release \
  --dart-define=API_BASE_URL=https://yourrestaurant-1a2b3.web.app \
  --dart-define=SITE_ORIGIN=https://www.yourrestaurant.com
```

Set your team and bundle ID in Xcode first ([Change Package Name](doc:app/change-package-name)). The deployment target is iOS 13.0. Upload the `.ipa` with Xcode Organizer or Transporter, and complete App Privacy in App Store Connect with the same answers as the Play data safety form.

## Updates

Increase `version:` in `pubspec.yaml` (for example `1.0.0+1` → `1.0.1+2`). The number after `+` must always increase. Then build the bundle with the same `--dart-define` values and upload a new release. The version text in Profile (`Go4Foodie · v1.0.0`) is hard-coded in `lib/features/common/profile_screen.dart`, so update it too.

**Next:** [Web Portal Overview →](doc:web/overview)
