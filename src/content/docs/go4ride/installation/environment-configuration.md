---
title: Keys & Environment
description: Where every key and configuration value lives in Go4Ride. Firebase config per app, the single Google Maps key file, build-time defines, and the payment keys stored in Firestore.
---

Go4Ride has very little configuration on disk. There are three kinds of values, each kept in exactly one place:

| Kind | Where it lives | Set with |
|---|---|---|
| **Firebase config** (project, app IDs, API key) | `lib/firebase_options.dart`, `google-services.json`, `GoogleService-Info.plist` in each app | `flutterfire configure` |
| **Google Maps key** (and optional Map ID) | `secret/app_keys.env` at the repository root (git-ignored) | A text editor |
| **Payment gateway keys, SMTP, business rules** | Firestore: `settings/*` (public) and `secure_settings/*` (admin + functions only) | The admin panel |

The Cloud Functions have **no `.env` file and no Secret Manager secrets**. They read gateway keys from Firestore at the moment they are needed, so a key you change in the panel works on the next payment without a redeploy.

## 1. Firebase config for each app

Run the FlutterFire CLI once in each app folder, with your project ID:

```bash
cd apps/admin_panel
flutterfire configure --project=your-project-id --platforms=web

cd ../customer_app
flutterfire configure --project=your-project-id --platforms=android,ios

cd ../driver_app
flutterfire configure --project=your-project-id --platforms=android,ios
```

Each run registers the missing Firebase apps and overwrites:

| File | Contents |
|---|---|
| `apps/<app>/lib/firebase_options.dart` | `DefaultFirebaseOptions.currentPlatform` used by `main.dart` |
| `apps/<app>/android/app/google-services.json` | Android config (customer and driver apps) |
| `apps/<app>/ios/Runner/GoogleService-Info.plist` | iOS config (customer and driver apps) |
| `apps/<app>/firebase.json` | FlutterFire's own record of the project and app IDs |

The `firebase_options.dart` files in the package point at the Go4Ride demo project. Until you overwrite them, the apps sign in to the wrong project, so run the command in **all three** folders. `google-services.json` and `GoogleService-Info.plist` are git-ignored; keep a copy in your password manager.

:::warning Package names first
`flutterfire configure` registers the Android and iOS apps under the package name it finds (`com.go4ride.customer`, `com.go4ride.driver`). If you plan to rename them, do that first ([Customer](doc:app-customer/change-package-name), [Driver](doc:app-driver/change-package-name)), then run the command.
:::

## 2. Google Maps key (one file)

In the Google Cloud Console of the **same project**, enable:

- **Maps SDK for Android** and **Maps SDK for iOS** (the map widgets)
- **Places API** (address autocomplete and place details)
- **Geocoding API** (address of a tapped point)
- **Directions API** (route, distance and duration for the fare estimate)
- **Distance Matrix API** (listed in the setup checklist)

Then create an API key under **APIs & Services → Credentials**. Copy `config/app_keys.example.env` to `secret/app_keys.env` and set your own values:

```env title="secret/app_keys.env"
MAPS_API_KEY=AIza...your-key
# Optional: your own Google Maps Map ID for cloud map styling. Leave empty for the standard style.
GOOGLE_MAPS_MAP_ID=
```

That one file feeds three places:

| Platform | How it reads the key |
|---|---|
| **Android** | `android/app/build.gradle.kts` loads `../../../secret/app_keys.env` and sets the manifest placeholder `${MAPS_API_KEY}` |
| **iOS** | `ios/Flutter/Debug.xcconfig` and `Release.xcconfig` include the file; `Info.plist` exposes it as `GMSApiKey` = `$(MAPS_API_KEY)` |
| **Dart** (Places, Directions, Geocoding calls) | `AppEnv.googleMapsApiKey` reads `MAPS_API_KEY` from `--dart-define-from-file` |

So always run and build the mobile apps with the file:

```bash
cd apps/customer_app
flutter run --dart-define-from-file=../../secret/app_keys.env
```

:::danger Restrict the key and never commit it
`secret/` is git-ignored. Delete any sample values from `config/app_keys.example.env` before you put the code in your own repository, and keep only variable names there. In Credentials, restrict the key to the APIs above and to your Android package names + SHA-1 fingerprints and iOS bundle IDs.
:::

:::note Places and Directions on new Google Cloud projects
The apps call the classic web services (`maps.googleapis.com/maps/api/place/…`, `/directions/…`, `/geocode/…`). On some newer Google Cloud projects these appear in the API Library as **Places API** / **Directions API** with a *Legacy* label. Enable those exact APIs. If the Maps console does not offer them for your project, contact Google Maps support or your Google Maps partner before launch.
:::

## 3. Build-time defines

The apps read these with `String.fromEnvironment` / `bool.fromEnvironment`:

| Define | Apps | Purpose |
|---|---|---|
| `MAPS_API_KEY` | Customer, Driver | Google Maps web-service key (from `secret/app_keys.env`) |
| `GOOGLE_MAPS_MAP_ID` | Customer, Driver | Optional cloud Map ID for the map style |
| `USE_EMULATOR` | All three | `true` connects to the local Firebase Emulator Suite. Never use it for a release build. See [Localhost & Emulators](doc:installation/localhost-setup) |

`STRIPE_PK` and `RAZORPAY_KEY_ID` are also read by the customer app's `AppEnv`, but the online checkout no longer uses them: payments run through hosted gateway pages started by the backend. You can leave them out.

## 4. Payment gateway keys (admin panel)

Enter these in the admin panel after you have [created the first admin](doc:installation/super-admin):

| Panel page | Firestore document | Keys | Readable by |
|---|---|---|---|
| **Settings → Payment methods** | `settings/payment` | `cashEnabled`, `walletEnabled`, `razorpayEnabled`, `razorpayMode`, `razorpayKeyId`, `stripeEnabled`, `stripeMode`, `stripePublishableKey`, `paypalEnabled`, `paypalMode` (`sandbox` / `live`), `paypalClientId` | Everyone (the apps show only the enabled methods) |
| **Settings → Payment secrets** | `secure_settings/payment` | `razorpayKeySecret`, `stripeSecretKey`, `paypalSecret` (plus webhook secret fields, which the current backend does not use) | Admins and Cloud Functions only |

The functions merge both documents (`loadGatewayConfig()` in `functions/src/gateways.ts`). A gateway works when it is enabled and both its keys are present. **PayPal** uses the live API when `paypalMode` is `live`, otherwise the sandbox. **Razorpay** and **Stripe** are in test or live mode according to the keys you paste (`rzp_test_…` / `sk_test_…` versus live keys).

### Currency for Stripe and PayPal

Fares are in INR. Razorpay always charges INR. Stripe and PayPal charge in `stripeCurrency` / `paypalCurrency`, which default to **INR** when not set. If your Stripe or PayPal account settles in USD, add these fields to `settings/payment` in the Firestore console (the panel has no form for them yet):

| Field | Example | Meaning |
|---|---|---|
| `stripeCurrency` | `usd` | Currency of the Stripe Checkout session |
| `paypalCurrency` | `USD` | Currency of the PayPal order |
| `usdPerInr` | `0.012` | Conversion rate used when the currency is USD (default `0.012`, minimum charge 0.50) |

Full gateway setup and test cards: [Payment Gateways](doc:admin/payment-gateways).

## 5. Other settings in Firestore

Everything else you configure in **Settings** in the panel. Each page is one document in `settings/` (public read, admin write): `general`, `app_theme`, `app`, `map`, `maintenance`, `business`, `driver_ride`, `surge`, `payment`, `landing`, `contact`. SMTP credentials go to `secure_settings/smtp`. See [General & App Settings](doc:admin/settings).

:::note About `docs/SETUP.md`
Older notes in the repository mention `firebase functions:secrets:set` for gateway secrets and `--dart-define` values like `GOOGLE_MAPS_API_KEY`. The current code does not use either: secrets are in `secure_settings/payment`, and the Maps define is `MAPS_API_KEY`.
:::

**Next:** [Admin Panel Installation →](doc:installation/admin-panel)
