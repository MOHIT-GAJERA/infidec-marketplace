---
title: Change Package Name
description: Give the Customer app your own application ID before publishing. It can never be changed after the first upload to Google Play.
---

The **package name** (Android `applicationId`) uniquely identifies the app on Google Play. Replace `com.go4market.customer` with your own, for example `com.yourmarket.customer`.

:::danger Choose it once
After the first upload to Google Play the package name can never be changed. If Play says the name is already in use, pick another.
:::

## 1. Gradle

```kts title="apps/customer_app/android/app/build.gradle.kts"
android {
    namespace = "com.yourmarket.customer"
    defaultConfig {
        applicationId = "com.yourmarket.customer"
        // …
    }
}
```

## 2. MainActivity

Move `android/app/src/main/kotlin/com/go4market/customer/MainActivity.kt` to `android/app/src/main/kotlin/com/yourmarket/customer/MainActivity.kt` and change its first line:

```kotlin title="MainActivity.kt"
package com.yourmarket.customer
```

(You may keep the old `namespace` and folder; only `applicationId` must change. Changing both keeps things tidy.)

## 3. Hard-coded references in Dart

| File | What |
|---|---|
| `lib/screens/shell/main_shell.dart` | `market://details?id=…` and the Play URL used by the force-update dialog |
| `lib/screens/location/location_picker_screen.dart` | `userAgentPackageName` for OpenStreetMap tiles |
| `lib/screens/orders/order_detail_screen.dart` | `userAgentPackageName` on the tracking map |

## 4. Firebase

A new package name needs a new Android app in Firebase:

1. Register `com.yourmarket.customer` in Firebase with SHA-1 and SHA-256.
2. Replace `android/app/google-services.json`.
3. Update `appId` of `androidCustomer` in `packages/g4m_core/lib/src/firebase_options.dart`.

See [Firebase Setup](doc:app-customer/firebase-setup).

## 5. iOS (optional)

Set the bundle identifier in Xcode (Runner target → Signing & Capabilities), or replace `PRODUCT_BUNDLE_IDENTIFIER` in `ios/Runner.xcodeproj/project.pbxproj`.

## 6. Clean and rebuild

```bash
flutter clean
flutter pub get
flutter run
```

Finally, record the new Play Store link in Admin → Settings → App versions and in `storeUrls`.

**Next:** [Change App Name →](doc:app-customer/change-app-name)
