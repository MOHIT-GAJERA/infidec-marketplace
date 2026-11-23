---
title: Change Package Name
description: Give the Booqora Mobile App your own Android application ID and iOS bundle identifier before publishing, and re-register the apps in Firebase.
---

The **package name** (Android `applicationId`) and the **bundle identifier** (iOS) uniquely identify the app in Google Play and the App Store. The app ships with:

| Platform | Current value | Example of your own |
|---|---|---|
| Android `applicationId` | `io.booqora.booqora_mobile` | `com.yourbrand.rentals` |
| Android `namespace` | `io.booqora.booqora_mobile` | `com.yourbrand.rentals` |
| iOS bundle ID | `io.booqora.booqoraMobile` | `com.yourbrand.rentals` |

:::danger Choose it once
After the first upload to Google Play the package name can **never** be changed. A different package name is a different app with no reviews, installs or history. The same applies to the bundle ID once an app exists in App Store Connect. Decide before your first upload.
:::

Do this step **before** [Firebase Setup](doc:app/firebase-setup) if you can, so you only register the Firebase apps once.

## 1. Gradle

```kts title="booqora_mobile/android/app/build.gradle.kts"
android {
    namespace = "com.yourbrand.rentals"
    // …
    defaultConfig {
        applicationId = "com.yourbrand.rentals"
        // …
    }
}
```

`applicationId` is what Google Play sees. `namespace` is the Kotlin/Java package used for generated code (`R`, `BuildConfig`). Changing both keeps things tidy.

## 2. MainActivity

The activity lives in a folder that matches the package:

```text
android/app/src/main/kotlin/io/booqora/booqora_mobile/MainActivity.kt
```

Move it to the matching new folder and update its first line:

```text
android/app/src/main/kotlin/com/yourbrand/rentals/MainActivity.kt
```

```kotlin title="MainActivity.kt"
package com.yourbrand.rentals
```

Delete the empty old folders afterwards. `AndroidManifest.xml` refers to the activity as `.MainActivity`, which is resolved against `namespace`, so the manifest needs no change.

## 3. iOS bundle identifier

On a Mac, open `ios/Runner.xcworkspace` in Xcode → **Runner** target → **Signing & Capabilities** → **Bundle Identifier**.

Without Xcode, replace the value in `ios/Runner.xcodeproj/project.pbxproj`. It appears for Debug, Release and Profile:

```text title="ios/Runner.xcodeproj/project.pbxproj"
PRODUCT_BUNDLE_IDENTIFIER = com.yourbrand.rentals;
PRODUCT_BUNDLE_IDENTIFIER = com.yourbrand.rentals.RunnerTests;
```

## 4. Re-register the apps in Firebase

A new package name or bundle ID is a new app as far as Firebase is concerned.

1. Firebase console → **Project settings → Add app** → Android with `com.yourbrand.rentals`, and iOS with your bundle ID.
2. Run `flutterfire configure --project=<your-project-id>` again and pick the new apps.
3. Confirm that `lib/firebase_options.dart`, `android/app/google-services.json` and `ios/Runner/GoogleService-Info.plist` show the new IDs. In `firebase_options.dart` the `ios` entry has `iosBundleId`, which must match.
4. Optionally delete the old app registrations from the Firebase project.

## 5. Other places that mention Booqora

The package name does not appear anywhere else in `lib/`. Brand text and links are covered on other pages:

- App name: [Change App Name](doc:app/change-app-name)
- Platform URL and payment return URL: [Firebase Setup](doc:app/firebase-setup)

## 6. Clean and rebuild

```bash title="Terminal"
cd booqora_mobile
flutter clean
flutter pub get
flutter run
```

If Android Studio still shows the old package, use **File → Invalidate Caches / Restart**.

## Checklist

- [x] `applicationId` and `namespace` changed
- [x] `MainActivity.kt` moved and its `package` line updated
- [x] iOS `PRODUCT_BUNDLE_IDENTIFIER` changed
- [x] New Android and iOS apps registered in Firebase, config files regenerated
- [x] App installs and signs in after `flutter clean`

**Next:** [Change App Name →](doc:app/change-app-name)
