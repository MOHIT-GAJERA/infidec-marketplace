---
title: Change Package Name
description: Replace com.go4ride.driver with your own Android application ID and iOS bundle identifier for the Driver App.
---

The Driver App ships as **`com.go4ride.driver`**. Give it its own ID next to the rider app, for example:

| App | Package name |
|---|---|
| Customer App | `com.yourcompany.rider` |
| Driver App | `com.yourcompany.driver` |

:::danger Permanent after the first upload
Google Play never lets you change the package name of a published app. Decide on both names before you register the apps in Firebase.
:::

## Android

```kts title="apps/driver_app/android/app/build.gradle.kts"
android {
    namespace = "com.yourcompany.driver"
    ...
    defaultConfig {
        applicationId = "com.yourcompany.driver"
        ...
    }
}
```

Then move `MainActivity.kt`:

| Before | After |
|---|---|
| `android/app/src/main/kotlin/com/go4ride/driver/MainActivity.kt` | `android/app/src/main/kotlin/com/yourcompany/driver/MainActivity.kt` |
| `package com.go4ride.driver` | `package com.yourcompany.driver` |

```kotlin title="MainActivity.kt"
package com.yourcompany.driver

import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity()
```

Delete the empty `com/go4ride/driver` folders. The manifest uses `.MainActivity`, resolved against `namespace`.

## iOS

Xcode → `apps/driver_app/ios/Runner.xcworkspace` → **Runner** → Signing & Capabilities → *Bundle Identifier* `com.yourcompany.driver` and your team. Or edit `ios/Runner.xcodeproj/project.pbxproj`:

| Target | Current | Change to |
|---|---|---|
| Runner (Debug, Release, Profile) | `com.go4ride.driver` | `com.yourcompany.driver` |
| RunnerTests | `com.go4ride.driver.RunnerTests` | `com.yourcompany.driver.RunnerTests` |

## Then

1. Run FlutterFire for the new IDs ([Firebase Setup](doc:app-driver/firebase-setup)) and add the SHA fingerprints.
2. Add the new package name (with its SHA-1) to your Maps key restriction if you restrict by app.
3. Admin Panel → **Settings → App theme & versions → Driver app versions → Play Store URL**: `https://play.google.com/store/apps/details?id=com.yourcompany.driver`.
4. Clean:

```bash
cd apps/driver_app
flutter clean
flutter pub get
```

Uninstall the old build from test phones before installing the renamed one.

**Next:** [App Name, Logo & Colour →](doc:app-driver/branding)
