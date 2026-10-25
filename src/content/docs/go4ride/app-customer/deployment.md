---
title: Release & Play Store
description: Sign the Customer App with your upload key, build the Android App Bundle, publish it on Google Play with an organization developer account (store listing, Data safety, content rating, testing tracks) and prepare the iOS build.
---

## Before you build

- [ ] Own package name set ([Change Package Name](doc:app-customer/change-package-name)) and FlutterFire run for it
- [ ] App name, logo, launcher icon and splash replaced ([App Name, Logo & Splash](doc:app-customer/branding)). The shipped Android label is still `customer_app`
- [ ] `secret/app_keys.env` contains your **production** `MAPS_API_KEY` and nothing secret
- [ ] Backend deployed, catalogue loaded, Payment methods on **live** keys
- [ ] **About**, **Privacy policy** and **Terms** written in the Admin Panel, and a public privacy policy URL on your website
- [ ] **Account deletion**: Google Play requires an in-app way to delete the account **and** a public web page to request deletion. The Customer App has no delete option yet, so add one (for example a *Delete account* tile that opens your deletion page or raises a support ticket, plus the web page) before you submit
- [ ] A **test phone number** with a fixed code in Firebase Auth for the reviewer ([Phone Login (OTP)](doc:app-customer/auth))

## 1. Create the upload keystore (once)

```bash
cd apps/customer_app
keytool -genkey -v -keystore android/app/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

:::danger Back up the keystore
Keep the `.jks` file and its passwords in two safe places (a password manager and an offline copy). Never commit it. `*.jks`, `*.keystore` and `key.properties` are already in `.gitignore`. With Play App Signing a lost upload key can be reset by Google support, but it takes days.
:::

## 2. key.properties

```properties title="apps/customer_app/android/key.properties (git-ignored)"
storePassword=<store password>
keyPassword=<key password>
keyAlias=upload
storeFile=upload-keystore.jks
```

`storeFile` is relative to `android/app/`.

## 3. Sign release builds with it

The shipped `android/app/build.gradle.kts` signs **release builds with the debug key** (`signingConfig = signingConfigs.getByName("debug")`), which Google Play rejects. Replace the `buildTypes` block and add the signing config:

```kts title="apps/customer_app/android/app/build.gradle.kts"
// next to the existing appKeys block, above android { … }
val keystoreProperties = java.util.Properties().apply {
    val f = rootProject.file("key.properties")
    if (f.exists()) f.inputStream().use { load(it) }
}

android {
    // … namespace, compileSdk, defaultConfig unchanged …

    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String?
            keyPassword = keystoreProperties["keyPassword"] as String?
            storeFile = (keystoreProperties["storeFile"] as String?)?.let { file(it) }
            storePassword = keystoreProperties["storePassword"] as String?
        }
    }

    buildTypes {
        release {
            signingConfig = if (keystoreProperties.isEmpty) signingConfigs.getByName("debug")
                            else signingConfigs.getByName("release")
        }
    }
}
```

## 4. Version

`pubspec.yaml` → `version: 1.0.0+1`. The part before `+` is the version name (also compared with the minimum version in the Admin Panel), the number after `+` is the `versionCode`, which must increase with every upload.

## 5. Build the App Bundle

```bash
cd apps/customer_app
flutter clean
flutter pub get
flutter build appbundle --release --dart-define-from-file=../../secret/app_keys.env
# → build/app/outputs/bundle/release/app-release.aab
```

Check that it is signed with **your** key, not *Android Debug*:

```bash
keytool -printcert -jarfile build/app/outputs/bundle/release/app-release.aab
```

Optional, for testers outside Play: `flutter build apk --release --dart-define-from-file=../../secret/app_keys.env`.

:::warning Never forget the define
A bundle built without `--dart-define-from-file` has no Maps key in Dart: place search and fares do not work. Install the release build on a phone and book one ride before you upload.
:::

## 6. Google Play developer account (organization)

Publish under an **organization** account for a business app. You need:

| Requirement | Notes |
|---|---|
| **D-U-N-S number** | Free from Dun & Bradstreet (dnb.com). Name and address must match your legal entity exactly. Allow up to 30 days |
| Organization details | Legal name, address, website, phone, a verified contact e-mail and developer phone |
| One-time fee | USD 25 |
| Identity verification | Google verifies the organization and the account owner before you can publish |

Organization accounts can release straight to production. The rule of **12 testers for 14 days** in a closed test applies only to new **personal** accounts.

## 7. Publish on Google Play

:::steps
### Create the app
Play Console → **Create app** → app name, default language, *App*, *Free* → accept the declarations. Category **Maps & Navigation** or **Travel & Local**.

### Store listing
Grow users → Store presence → **Main store listing**: short description (80 chars), full description (4,000 chars), and the graphics below. Add your support e-mail and website under Store settings.

### App content (Policy → App content)
Privacy policy URL, **App access** (*All or some functionality is restricted*: give the reviewer test phone number and its fixed code, and explain the OTP), **Ads** (*No*), **Content rating**, **Target audience**, **Data safety**, **Financial features**, **Government apps** (*No*), **Health** (*No*). Details below.

### Internal testing
Test and release → Testing → **Internal testing** → Create new release → **Use Google-generated app signing key** (Play App Signing) → upload `app-release.aab` → release notes → **Save and roll out**. Add up to 100 testers by e-mail and install from the opt-in link.

### Add the Play signing key to Firebase and Maps
Test and release → **App integrity** → App signing → copy the **SHA-1 and SHA-256** of the *App signing key certificate*. Add both to the Firebase Android app (phone OTP fails on Play installs without them) and the SHA-1 to your Maps key restriction.

### Closed testing (recommended)
**Closed testing** → create a track, add a testers list or Google Group, promote the internal release. Use it for a pilot with real riders and drivers in one city.

### Production
**Production** → Countries / regions (e.g. India) → Create new release → *Add from library* → **Staged rollout** (20 % → 50 % → 100 %). The first review usually takes a few days, sometimes up to 7.
:::

## Store listing assets

| Asset | Size | Notes |
|---|---|---|
| App icon | 512 × 512 PNG, 32-bit, max 1 MB | Same artwork as `assets/launcher/app_icon.png` |
| Feature graphic | 1024 × 500 JPG or 24-bit PNG, no transparency | Brand yellow with logo and a short line works well |
| Phone screenshots | 2–8, 16:9 or 9:16, 320–3840 px per side (1080 × 1920 recommended) | Home, booking with fare, live ride with OTP, wallet, support |
| 7-inch tablet screenshots | up to 8, same rules | Required only if you target tablets. Take them on a 7" emulator |
| 10-inch tablet screenshots | up to 8, same rules | Same, on a 10" emulator (e.g. Pixel Tablet) |

## Content rating

Fill in the IARC questionnaire with category **All other app types**. Answer **No** to violence, sexual content, profanity, drugs and gambling. Answer **Yes** to *shares the user's current location with other users* (the driver sees the pickup) and to *digital purchases* if you enable online payments or wallet top-ups. The result is usually *Everyone* / *3+*.

## Target audience

Choose **18 and over** only. Riders book and pay for transport, and the app is not designed for children. Answer *No* to "appeals to children".

## Financial features

The Go4Ride wallet is a balance used only to pay for rides inside your service, and online payments go through Razorpay, Stripe or PayPal. Choose the option that matches your business (most operators select that the app provides no financial features such as loans, banking or crypto). Ask your legal adviser if your wallet is regulated as stored value in your country.

## Data safety answers (customer app)

Data is **encrypted in transit** (HTTPS / Firebase). Users **can request deletion** (give your deletion URL). Data is **not shared** with third parties: Firebase and the payment gateways process it on your behalf as service providers.

| Data type | Collected | Optional? | Purpose |
|---|---|---|---|
| Location: **precise** and **approximate** | Yes | Required to book | App functionality (pickup, live tracking, SOS) |
| Personal info: **Name** | Yes | Required | Account management, App functionality |
| Personal info: **Email address** | Yes | Optional | Account management |
| Personal info: **Phone number** | Yes | Required (login) | Account management, App functionality |
| Financial info: **Purchase history** | Yes | Required | App functionality (rides, top-ups, wallet transactions) |
| Financial info: **User payment info** | **No**: cards and UPI are entered on the gateway's page | — | — |
| Photos and videos: **Photos** | Yes | Optional (support attachments) | Customer support |
| Messages: **Other in-app messages** | Yes | Optional (support chat) | Customer support |
| Device or other IDs | Yes | Required (FCM push) | App functionality |
| App activity, web history, contacts, audio, files, health | No | — | — |

**Permissions in the bundle:** location (fine and coarse, foreground only) plus what the Firebase and plugin libraries merge in (internet, network state, FCM). Check the final list in Play Console → App bundle explorer. No background location, so no location declaration is needed for the Customer App.

## iOS / App Store summary

On a Mac with Xcode and an Apple Developer account:

1. Set the bundle ID and team in Xcode, add **Push Notifications** and **Background Modes → Remote notifications**, upload the APNs key to Firebase.
2. Edit the location and photo texts in `Info.plist` (`NSLocationWhenInUseUsageDescription`, `NSPhotoLibraryUsageDescription`). The deployment target is iOS 14.0.
3. Build: `flutter build ipa --release --dart-define-from-file=../../secret/app_keys.env`.
4. Upload `build/ios/ipa/*.ipa` with Xcode Organizer or **Transporter**, then create the app in App Store Connect.
5. Fill in **App Privacy** with the same answers as the Data safety form, give the reviewer the test phone number and code, and submit. Apple also requires in-app account deletion (guideline 5.1.1(v)).

## Updates

1. Increase `version:` in `pubspec.yaml` (for example `1.0.0+1` → `1.0.1+2`).
2. Build the bundle with the same `--dart-define-from-file` and upload a new release to the same track.
3. When most riders have updated, raise **Customer app versions → Android minimum version** in the Admin Panel to show the update prompt, or switch **Force update** on to block old versions ([Maintenance Mode & App Versions](doc:admin/maintenance)). Set the **Play Store URL** there so the button opens your listing.

**Next:** [Driver App Prerequisites →](doc:app-driver/prerequisites)
