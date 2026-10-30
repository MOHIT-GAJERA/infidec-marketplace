---
title: Change Package Name
description: Replace com.go4market.partner with your own application ID before the first upload to Google Play.
---

:::danger Choose it once
The package name cannot be changed after the first upload to Google Play.
:::

## 1. Gradle

```kts title="apps/partner_app/android/app/build.gradle.kts"
android {
    namespace = "com.yourmarket.partner"
    defaultConfig {
        applicationId = "com.yourmarket.partner"
    }
}
```

## 2. MainActivity

Move `android/app/src/main/kotlin/com/go4market/partner/MainActivity.kt` to the matching folder for your package and change its `package` line.

## 3. Hard-coded references

| File | What |
|---|---|
| `lib/core/device.dart` | `playStoreUrl` (force-update button) and the map `userAgentPackageName` |
| `lib/features/seller/riders_screen.dart` | The rider invitation text that mentions the app |

Search `lib/` for `com.go4market.partner` to be sure.

## 4. Firebase

Register the new package in Firebase with SHA-1 and SHA-256, replace `android/app/google-services.json`, and update `androidPartner.appId` in `packages/g4m_core/lib/src/firebase_options.dart`.

## 5. Rebuild

```bash
flutter clean
flutter pub get
flutter run
```

**Next:** [App Name, Logo, Icon & Splash →](doc:app-partner/branding)
