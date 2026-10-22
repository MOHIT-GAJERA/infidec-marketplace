---
title: Change Package Name
description: Replace com.go4foodie.app with your own application ID on Android and iOS before your first store upload. It can never be changed afterwards.
---

The **package name** (Android `applicationId`, iOS bundle identifier) identifies your app on Google Play and the App Store. The source uses **`com.go4foodie.app`** on both platforms. Replace it with your own, for example `com.yourrestaurant.app`.

There is only **one** package name. Customer, Restaurant and Owner are modes of the same app, not separate builds (the project has no flavors).

:::danger Choose it once
After the first upload to Google Play the package name can never be changed. If Play says *"This package name is already in use"*, another developer already owns it. Pick a different one, for example `com.yourrestaurantapp.app`.
:::

## Android

Edit `android/app/build.gradle.kts`:

```kts title="android/app/build.gradle.kts"
android {
    namespace = "com.go4foodie.app"              // Kotlin package of MainActivity — may stay as is
    defaultConfig {
        // Play Store package name — permanent once published.
        applicationId = "com.yourrestaurant.app"  // ← your package name
        ...
    }
}
```

Only `applicationId` has to change. `namespace` is the internal Kotlin package of `MainActivity.kt`. You can leave it as it is, or rename it together with the folder `android/app/src/main/kotlin/com/go4foodie/app/` and the `package` line in `MainActivity.kt`.

## iOS

Open `ios/Runner.xcworkspace` in Xcode → **Runner** target → **Signing & Capabilities** → *Bundle Identifier*, and pick your team.

You can also replace the identifiers in `ios/Runner.xcodeproj/project.pbxproj`:

| Target | Current | Change to |
|---|---|---|
| Runner (Debug, Release, Profile) | `com.go4foodie.app` | `com.yourrestaurant.app` |
| RunnerTests | `com.go4foodie.app.RunnerTests` | `com.yourrestaurant.app.RunnerTests` |

## Then

```bash
flutter clean
flutter pub get
```

Uninstall the old build from your test phones. Android treats an app with a new package name as a different app, so the old one stays installed next to it.

:::note Nothing to update in Firebase
The mobile app does not use the Firebase SDKs. There is no `google-services.json` or `GoogleService-Info.plist` to download again after a rename. Only your Play Console / App Store Connect listing has to use the new ID.
:::

**Next:** [App Name, Icon & Splash →](doc:app/branding)
