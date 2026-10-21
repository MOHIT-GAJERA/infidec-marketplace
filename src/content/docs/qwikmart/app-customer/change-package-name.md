---
title: Change Package Name
description: Give the app your own unique application ID before publishing — it can never be changed after the first upload.
---

The **package name** (Android `applicationId`, iOS bundle identifier) uniquely identifies your app on Google Play and the App Store. Replace the default with your own, for example `com.yourstore.customer`.

:::danger Choose it once
After the first upload to Google Play the package name can never be changed. If Play says *"This package name is already in use"*, another developer owns it — pick a different one (e.g. `com.yourstoreapp.customer`).
:::

## Android

Edit `android/app/build.gradle.kts`:

```kts title="android/app/build.gradle.kts"
android {
    namespace = "com.qwikmart.app"          // Kotlin package of MainActivity — may stay as is
    defaultConfig {
        applicationId = "com.yourstore.customer"   // ← your package name
        ...
    }
}
```

Only `applicationId` must change. The `namespace` is the internal Kotlin package of `MainActivity.kt`; you may leave it, or rename it together with the folder `android/app/src/main/kotlin/com/qwikmart/app/` and the `package` line in `MainActivity.kt`.

Also update the OpenStreetMap user agent (polite identification for map tiles):

```dart title="lib/features/location/map_picker_screen.dart"
userAgentPackageName: 'com.yourstore.customer',
```

## iOS

Open `ios/Runner.xcworkspace` in Xcode → Runner target → **Signing & Capabilities** → *Bundle Identifier*, or replace every `PRODUCT_BUNDLE_IDENTIFIER` in `ios/Runner.xcodeproj/project.pbxproj`.

## Then

```bash
flutter clean
flutter pub get
```

:::warning Update Firebase after changing the package name
A changed package name invalidates the existing `google-services.json`. Register the new name in Firebase and download the new file — see [Firebase Setup](doc:app-customer/firebase-setup). Also update the **Play Store URL** in Admin → System Settings → App.
:::

**Next:** [Change App Name →](doc:app-customer/change-app-name)
