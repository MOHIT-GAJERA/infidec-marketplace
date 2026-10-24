---
title: Change Package Name
description: Replace com.go4ride.customer with your own Android application ID and iOS bundle identifier before you connect Firebase and upload to the stores.
---

The **package name** (Android `applicationId`, iOS bundle identifier) identifies the app on Google Play and the App Store. The Customer App ships as **`com.go4ride.customer`**. Replace it with your own, for example `com.yourcompany.rider`.

The Customer App and the Driver App are **two separate apps** with two package names. Rename the driver app too ([Driver App → Change Package Name](doc:app-driver/change-package-name)).

:::danger Choose it once
After the first upload to Google Play the package name can never be changed. Use a reverse domain you own, in lower case, for example `com.yourcompany.rider`. If Play says *"This package name is already in use"*, pick another one.
:::

## Android

### 1. build.gradle.kts

```kts title="apps/customer_app/android/app/build.gradle.kts"
android {
    namespace = "com.yourcompany.rider"          // Kotlin package of MainActivity
    ...
    defaultConfig {
        applicationId = "com.yourcompany.rider"  // Play Store package name, permanent once published
        ...
    }
}
```

`applicationId` is the one that matters for the stores. Keep `namespace` the same value so the Kotlin package matches.

### 2. MainActivity package

Move the Kotlin file to the folder of the new package and update its first line:

| Before | After |
|---|---|
| `android/app/src/main/kotlin/com/go4ride/customer/MainActivity.kt` | `android/app/src/main/kotlin/com/yourcompany/rider/MainActivity.kt` |
| `package com.go4ride.customer` | `package com.yourcompany.rider` |

```kotlin title="android/app/src/main/kotlin/com/yourcompany/rider/MainActivity.kt"
package com.yourcompany.rider

import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity()
```

Delete the old empty `com/go4ride/customer` folders. `AndroidManifest.xml` refers to `.MainActivity`, which is resolved against `namespace`, so it needs no change.

## iOS

Open `apps/customer_app/ios/Runner.xcworkspace` in Xcode → **Runner** target → **Signing & Capabilities** → set *Bundle Identifier* and your *Team*.

Or replace the values in `ios/Runner.xcodeproj/project.pbxproj`:

| Target | Current | Change to |
|---|---|---|
| Runner (Debug, Release, Profile) | `com.go4ride.customer` | `com.yourcompany.rider` |
| RunnerTests | `com.go4ride.customer.RunnerTests` | `com.yourcompany.rider.RunnerTests` |

## Then

1. Run **FlutterFire** again so Firebase has an Android and iOS app with the new IDs, and the new `google-services.json` / `GoogleService-Info.plist` are written ([Firebase Setup](doc:app-customer/firebase-setup)). The Google Services plugin fails the build when `google-services.json` has no client for your `applicationId`.
2. Add the SHA-1 / SHA-256 fingerprints to the new Firebase Android app.
3. Update the **Android apps** restriction of your Google Maps key to the new package name ([Google Maps & Location](doc:app-customer/maps-location)).
4. In the Admin Panel, set the Play Store URL with the new ID under **Settings → App theme & versions** (`https://play.google.com/store/apps/details?id=com.yourcompany.rider`). The update prompt opens it.
5. Clean and rebuild:

```bash
cd apps/customer_app
flutter clean
flutter pub get
```

Uninstall the old build from your test phones. Android treats an app with a new package name as a different app, so the old one stays installed next to it.

**Next:** [App Name, Logo & Splash →](doc:app-customer/branding)
