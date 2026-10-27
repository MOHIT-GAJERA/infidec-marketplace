---
title: Google Maps & Location
description: Add your Google Maps key for Android and iOS, enable Maps SDK for Android, restrict the key, and see how the app uses geolocator and geocoding for the location prompt and Nearby Ads.
---

The app uses location in three places:

| Feature | Package | Needs a Maps key? |
|---|---|---|
| Map with a pin on the **ad detail** screen ("Location" section) | `google_maps_flutter` | **Yes** (Maps SDK for Android / iOS) |
| **Find My Location** on the location prompt (city label on Home) | `geolocator` + `geocoding` | No. Reverse geocoding uses the phone's built-in geocoder |
| **Nearby Ads** (ads within a radius of the phone) | `geolocator` | No |

![Ad detail map](/docs/classiadshub/images/app-ad-detail.webp "Ad detail with the location map")
![Nearby](/docs/classiadshub/images/app-nearby.webp "Nearby Ads")

:::warning Blank map = key problem
If the map area on an ad stays grey or blank, the key is missing, **Maps SDK for Android** is not enabled, billing is off, or the key restriction does not list your package name and SHA-1.
:::

## 1. Create or pick the key

Google Cloud console → select the project linked to your Firebase project → **APIs & Services → Credentials → Create credentials → API key**. Billing must be enabled for the project. Your Firebase project is already on Blaze, so it is.

## 2. Enable the APIs

**APIs & Services → Library**:

| API | Needed for |
|---|---|
| **Maps SDK for Android** | The map on Android |
| **Maps SDK for iOS** | The map on iOS (only if you ship iOS) |

## 3. Put the key in the app

### Android

```xml title="mobile/android/app/src/main/AndroidManifest.xml"
<!-- Google Maps Platform API key (Maps SDK for Android). -->
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_KEY" />
```

### iOS

```swift title="mobile/ios/Runner/AppDelegate.swift"
import GoogleMaps

override func application(...) -> Bool {
  GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_KEY")
  return super.application(application, didFinishLaunchingWithOptions: launchOptions)
}
```

### Dart constant

`lib/core/config/app_config.dart` also has `googleMapsApiKey` with a default value (overridable with `--dart-define=GOOGLE_MAPS_KEY=…`). No screen reads it today, but replace the default with your key or an empty string so the demo key does not ship in your build.

:::danger Replace the demo key
The download contains the demo project's key in `AndroidManifest.xml`, `AppDelegate.swift`, `app_config.dart` and `web/index.html`. It is restricted to the demo package name and will not work for your app. Replace it in all four files.
:::

## 4. Restrict the key

In **Credentials**, click the key:

:::steps
### Application restrictions
Choose **Android apps** → **Add** and add your package name (for example `com.yourcompany.classifieds`) with **each** SHA-1:

- the debug key, from `cd mobile/android && ./gradlew signingReport` (variant `debug`);
- your upload key;
- the **Play App Signing** key, from Play Console → **Test and release → App integrity** after the first upload.

If you also ship iOS, create a second key restricted to **iOS apps** with your bundle ID and use it in `AppDelegate.swift`.

### API restrictions
**Restrict key** → tick **Maps SDK for Android** (and **Maps SDK for iOS** for the iOS key) → **Save**.

### Wait and reinstall
Changes take up to 5 minutes. Reinstall the app and open any ad: the map should show the pin.
:::

## Permissions

Android (`AndroidManifest.xml`):

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

iOS (`Info.plist`): `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription`, both *"ClassiAds needs your location to show nearby listings and detect your city."* Change the text to your app name. The app only asks for **while in use** access.

## How location is used in the app

All location calls go through `lib/core/services/location_service.dart`:

| Method | What it does |
|---|---|
| `currentPosition()` | Checks that location services are on, asks for permission if needed, then reads the position with **medium** accuracy and a **12 s** time limit. Falls back to the last known position. Returns `null` when denied |
| `describe(lat, lng)` | Reverse-geocodes with `placemarkFromCoordinates` (8 s timeout) into *"City, Country"* (city = locality, sub-administrative area or administrative area) |

### Location prompt

After the first login the router opens `/location` (**What's your location?**):

| Button | Result |
|---|---|
| **Find My Location** | Reads the position, turns it into *"City, Country"* and saves it as `location_label`. If permission is denied: *"Location permission denied — pick "Other Location" instead."* |
| **Other Location** | Skips detection. Home then shows **Add Location** |

Either way the prompt is marked as answered (`location_prompted`) and is not shown again. The label is stored **only on the phone** (`shared_preferences`); it is not sent to the API and does not filter the home feed.

### Nearby Ads

The location card on Home opens **Nearby Ads** (`/nearby`). It calls `GET /ads/nearby?latitude=…&longitude=…&radius=…` with the phone's position and a radius slider from **5 to 200 km** (default 25 km). Each card shows the distance. If the position cannot be read, it searches around a fixed fallback point (Mumbai) and says *"Location unavailable — showing results around Mumbai."* Change `_fallbackLat` / `_fallbackLng` in `lib/features/ads/screens/nearby_screen.dart` to your main city.

### Ad location

The map on the ad detail screen uses the `location.latitude` / `location.longitude` that the API returns for the ad. Ads without coordinates show only the city name (or *"Location not provided"*) without a map. Tapping the map tries to hand off to Google Maps with a `https://www.google.com/maps/search/?api=1&query=lat,lng` link; the app has no `url_launcher`, so on some devices this does nothing. In the app, sellers pick **Country → State → City** from your location lists when posting; they do not drop a pin, and the app sends no coordinates. Ads posted from the app therefore have no map and do not appear in Nearby Ads.

**Next:** [Login, Register & OTP →](doc:app/auth)
