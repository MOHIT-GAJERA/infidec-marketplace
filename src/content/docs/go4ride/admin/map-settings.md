---
title: Maps & Location
description: Where the Google Maps key lives, which Google APIs to enable, how the apps use maps and location, and the Map settings page in the admin panel.
---

Maps are central to Go4Ride: riders search pickup and drop addresses and follow their driver, the fare estimate is built from the route, and drivers share their live position. This page explains the **Google Maps key**, the **Map settings** page and the location flow.

## The Google Maps key

The key is **built into the apps**, not stored in the admin panel. It lives in one git-ignored file at the repository root:

```bash title="secret/app_keys.env"
MAPS_API_KEY=your-google-maps-key
```

Copy `config/app_keys.example.env` to `secret/app_keys.env` and put your own key in it. That one file feeds three places in both apps:

| Platform | How the key gets in |
|---|---|
| **Android** | `android/app/build.gradle.kts` reads the file and fills the `${MAPS_API_KEY}` placeholder in `AndroidManifest.xml` |
| **iOS** | `ios/Flutter/Debug.xcconfig` and `Release.xcconfig` include the file; `Info.plist` exposes it as `GMSApiKey` |
| **Dart** (Places, Directions, Geocoding calls) | Run or build with `--dart-define-from-file=../../secret/app_keys.env` |

```bash
cd apps/customer_app
flutter run --dart-define-from-file=../../secret/app_keys.env
```

:::danger Never commit real keys
`secret/` is git-ignored for a reason. Keep `config/app_keys.example.env` as a template with placeholder values only, and never ship a key in a public repository or a screenshot.
:::

### Enable these APIs

In Google Cloud Console → **APIs & Services → Library**, for the project that owns the key:

| API | Used for |
|---|---|
| Maps SDK for Android | Maps in both Android apps |
| Maps SDK for iOS | Maps in both iOS apps |
| Places API | Pickup / drop search (autocomplete and place details) |
| Directions API | Route distance and duration for the fare estimate |
| Geocoding API | Address for a map position |
| Distance Matrix API | Listed in the setup checklist; enable it with the others |

### Restrict the key

Under **Credentials → your key**:

- **Application restrictions**: Android apps with the package names `com.go4ride.customer` and `com.go4ride.driver` (or your own, see [Change Package Name](doc:app-customer/change-package-name)) plus their SHA-1 fingerprints, and iOS apps with their bundle ids.
- **API restrictions**: only the APIs above.
- Set **quotas** per API so a mistake can't run up a bill (see [Third-Party Service Costs](doc:admin/third-party-costs#google-maps-platform)).

:::warning One key, two kinds of calls
The Maps SDKs are restricted by app, but the Places, Directions and Geocoding calls are plain HTTPS requests from the app. If a Dart-side call fails with *REQUEST_DENIED*, check that the key's restrictions allow these APIs from your apps. Some teams use a second key for the web-service APIs.
:::

## Map settings page

**Settings → App setup → Map settings** (*"The Google Maps key is built into the apps (secret/app_keys.env); these control map behaviour."*), saved to `settings/map`:

| Field | Default | Notes |
|---|---|---|
| Map provider | Google Maps | Google Maps / OpenStreetMap |
| Default zoom | 14 | |
| Default latitude | 21.1702 | *"Surat by default."* |
| Default longitude | 72.8311 | |
| Restrict place search to country | `in` | *"ISO code; empty = worldwide."* |

:::note What v1.0 reads
The v1.0 apps don't read `settings/map` yet: they always use Google Maps, open on the rider's or driver's current location, and search places worldwide, biased to the current position. Set your values here now; they are ready for a future update. The admin panel's own maps (zones, online drivers) use **OpenStreetMap** tiles and open on Surat when there is nothing to show.
:::

## How the apps use location

| App | What happens |
|---|---|
| **Customer App** | Asks for location permission to centre the map and fill the pickup. The rider can also search or pick any address. During a ride the driver's car moves on the map from the Realtime Database |
| **Driver App** | Location permission is **required to go online**. While online, the app writes its position to `driver_locations/{driverId}` in the Realtime Database and updates `currentLocation` on the driver profile, which `onRideCreated` uses for the search radius |
| **Admin Panel** | [Online drivers](doc:admin/online-drivers) shows those positions live; [Zones](doc:admin/zones) lets you draw areas |

Platform permission texts (Android manifest, iOS `NSLocationWhenInUseUsageDescription`) are covered in [Google Maps & Location](doc:app-customer/maps-location).

**Next:** [Maintenance Mode & App Versions →](doc:admin/maintenance)
