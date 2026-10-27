---
title: Change Package Name
description: Replace com.classiads.classiads_hub with your own Android application ID and iOS bundle identifier before you connect Firebase and upload to the stores.
---

The **package name** (Android `applicationId`, iOS bundle identifier) identifies the app on Google Play and the App Store. The app ships as:

| Platform | Current value |
|---|---|
| Android `applicationId` and `namespace` | `com.classiads.classiads_hub` |
| iOS bundle identifier | `com.classiads.classiadsHub` |

Replace both with your own, for example `com.yourcompany.classifieds`.

:::danger Choose it once
After the first upload to Google Play the package name can never be changed. Use a reverse domain you own, in lower case, for example `com.yourcompany.classifieds`. If Play says *"This package name is already in use"*, pick another one.
:::

## Android

### 1. build.gradle.kts

```kts title="mobile/android/app/build.gradle.kts"
android {
    namespace = "com.yourcompany.classifieds"          // Kotlin package of MainActivity
    ...
    defaultConfig {
        applicationId = "com.yourcompany.classifieds"  // Play Store package name, permanent once published
        ...
    }
}
```

`applicationId` is the one that matters for the stores. Keep `namespace` the same value so the Kotlin package matches.

### 2. MainActivity package

Move the Kotlin file to the folder of the new package and update its first line:

| Before | After |
|---|---|
| `android/app/src/main/kotlin/com/classiads/classiads_hub/MainActivity.kt` | `android/app/src/main/kotlin/com/yourcompany/classifieds/MainActivity.kt` |
| `package com.classiads.classiads_hub` | `package com.yourcompany.classifieds` |

```kotlin title="android/app/src/main/kotlin/com/yourcompany/classifieds/MainActivity.kt"
package com.yourcompany.classifieds

import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity()
```

Delete the old empty `com/classiads/classiads_hub` folders. `AndroidManifest.xml` refers to `.MainActivity`, which is resolved against `namespace`, so it needs no change.

## iOS

Open `mobile/ios/Runner.xcworkspace` in Xcode → **Runner** target → **Signing & Capabilities** → set *Bundle Identifier* and your *Team*.

Or replace the values in `ios/Runner.xcodeproj/project.pbxproj`:

| Target | Current | Change to |
|---|---|---|
| Runner (Debug, Release, Profile) | `com.classiads.classiadsHub` | `com.yourcompany.classifieds` |
| RunnerTests | `com.classiads.classiadsHub.RunnerTests` | `com.yourcompany.classifieds.RunnerTests` |

Also update `iosBundleId` in `lib/firebase_options.dart` (FlutterFire does this for you).

## Then

1. Run **FlutterFire** again so Firebase has an Android and iOS app with the new IDs, and the new `google-services.json` / `GoogleService-Info.plist` / `firebase_options.dart` are written ([Firebase Setup](doc:app/firebase-setup)). The Google Services plugin fails the build when `google-services.json` has no client for your `applicationId`.
2. Add the SHA-1 / SHA-256 fingerprints to the new Firebase Android app.
3. Update the **Android apps** restriction of your Google Maps key to the new package name ([Google Maps & Location](doc:app/maps-location)).
4. Clean and rebuild:

```bash
cd mobile
flutter clean
flutter pub get
```

Uninstall the old build from your test phones. Android treats an app with a new package name as a different app, so the old one stays installed next to it.

:::tip The Dart package name can stay
`name: classiads_hub` in `pubspec.yaml` is only the Dart package name used in imports. Users never see it, so you do not need to change it.
:::

**Next:** [App Name, Logo & Splash →](doc:app/branding)
