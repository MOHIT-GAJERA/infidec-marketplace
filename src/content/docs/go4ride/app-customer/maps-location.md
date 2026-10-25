---
title: Google Maps & Location
description: Create and restrict the Google Maps key, put it in secret/app_keys.env for Android, iOS and Dart, and understand how the Customer App uses location, place search and routes.
---

The Customer App uses Google Maps in two ways:

| Feature | How | Google API |
|---|---|---|
| Map on Home and on the ride screen, rider's blue dot, driver marker | `google_maps_flutter` (native SDK) | **Maps SDK for Android**, **Maps SDK for iOS** |
| Pickup / destination search | REST call from the app (`place/autocomplete`, `place/details`) | **Places API** |
| Pickup prefilled from GPS | REST `geocode` (reverse geocoding) | **Geocoding API** |
| Distance and duration for the fare estimate | REST `directions` | **Directions API** |

All four come from `packages/services/lib/src/maps/maps_service.dart` and use the **same key**.

## 1. Create the key

:::steps
### Enable the APIs
Google Cloud console → your Firebase project → APIs & Services → **Enable APIs**: Maps SDK for Android, Maps SDK for iOS, Places API, Geocoding API, Directions API. Billing must be on (the Blaze plan covers it).

### Create the key
APIs & Services → Credentials → **Create credentials → API key**.

### Restrict the APIs
Edit the key → **API restrictions → Restrict key** → tick only the five APIs above.
:::

:::warning Legacy APIs
The app calls the classic web-service endpoints of Places and Directions. Google lists these as *Legacy* products. If your Cloud project does not let you enable them, contact us before you go live.
:::

## 2. Put the key in one file

The key lives in one git-ignored file at the repository root, **`secret/app_keys.env`**:

```properties title="secret/app_keys.env (git-ignored)"
MAPS_API_KEY=AIzaSy…your-key
# optional: a cloud-styled map
# GOOGLE_MAPS_MAP_ID=your-map-id
```

That file feeds three places:

| Platform | How it is read |
|---|---|
| Android | `android/app/build.gradle.kts` loads `../../../secret/app_keys.env` and sets `manifestPlaceholders["MAPS_API_KEY"]`. The manifest uses it as `com.google.android.geo.API_KEY` |
| iOS | `ios/Flutter/Debug.xcconfig` and `Release.xcconfig` `#include?` the file. `Info.plist` exposes it as `GMSApiKey` = `$(MAPS_API_KEY)` |
| Dart (place search, routes) | `--dart-define-from-file=../../secret/app_keys.env` on every `flutter run` and `flutter build`. `lib/config/app_env.dart` reads `MAPS_API_KEY` |

:::danger Only public values in app_keys.env
`--dart-define-from-file` compiles **every** line of the file into the app, where anyone can extract it. Keep payment secrets, SMTP passwords and service-account keys out of this file. They belong in the Admin Panel (**Payment secrets**) and Cloud Functions ([Keys & Environment](doc:installation/environment-configuration)).
:::

If the Dart define is missing, `AppEnv.hasMaps` is false: the map shows a placeholder and place search cannot work, even though the Android SDK has the key.

## 3. Restrict the key to your apps

For the **Maps SDK** you can lock the key to your app signatures:

1. Get the SHA-1 of your **upload key** and of the **Play App Signing key** (Play Console → Test and release → App integrity → App signing).
2. Credentials → the key → **Application restrictions → Android apps** → add `com.yourcompany.rider` with each SHA-1. Add the debug SHA-1 for development.
3. For iOS, a second key restricted to **iOS apps** with your bundle ID.

:::warning Android-app restriction and the REST calls
Place search, reverse geocoding and directions are plain HTTPS calls made by Dart. They do not send the Android package / certificate headers, so Google rejects them (`REQUEST_DENIED`) when the key has an **Android apps** restriction. Two ways to handle it:

- Keep **one key** with **API restrictions only** (step 1) and watch usage and quotas in the console.
- Use **two keys**: an app-restricted key for the native SDK (`MAPS_ANDROID_KEY` read in `build.gradle.kts` instead of `MAPS_API_KEY`) and an API-restricted key for `MAPS_API_KEY` in Dart.
:::

## Location permission

| Platform | Declared |
|---|---|
| Android | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` in `AndroidManifest.xml` |
| iOS | `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription` in `Info.plist` |

The map asks for permission when it first opens. The booking screen then reads one GPS fix and fills **Pickup** with the reverse-geocoded address (or *Current location*). Riders can change pickup and destination with the search sheet, which starts searching after 3 characters and biases results to 50 km around the pickup.

The rider app uses location only while it is open. It does not request background location.

Edit the permission texts in `Info.plist` to match your brand before you submit to the App Store.

## Where the map opens

The Home map has no starting position of its own and opens at a fixed fallback (`_fallbackCenter` in `lib/features/home/widgets/map_view.dart`) until the rider taps the my-location button. Set it to your city:

```dart title="lib/features/home/widgets/map_view.dart"
static const _fallbackCenter = LatLng(21.1702, 72.8311); // your city
```

:::note Admin "Map settings"
**Admin → Settings → Map settings** (default zoom, latitude/longitude, places country) is stored for the platform, but the Customer App does not read it today. See [Maps & Location](doc:admin/map-settings).
:::

## Troubleshooting

| Problem | Fix |
|---|---|
| Grey map with a Google logo | Maps SDK for Android/iOS not enabled, wrong key, or the Android-apps restriction is missing your SHA-1 |
| Map placeholder instead of a map | The app was started without `--dart-define-from-file`, so `MAPS_API_KEY` is empty in Dart |
| Search shows Google's error text (for example *This IP, site or mobile application is not authorized…*) or *Maps error: REQUEST_DENIED* | Places API not enabled, or the key has an Android-apps restriction (see above) |
| Pickup stays *Set pickup location* | Location is off on the phone, or the permission was denied (*Location permission is required to continue.*). Re-enable it in system settings |
| Fare estimate missing, red route error with **Retry** | Directions API not enabled for the key |

**Next:** [Phone Login (OTP) →](doc:app-customer/auth)
