---
title: Change Package Name
description: Set your own application ID for the Delivery Boy App.
---

```kts title="delivery_app/android/app/build.gradle.kts"
android {
    namespace = "com.qwikmart.delivery"         // Kotlin package — may stay
    defaultConfig {
        applicationId = "com.yourstore.delivery"  // ← your package name
    }
}
```

Also update the map tile user agent:

```dart title="delivery_app/lib/features/orders/widgets/order_map.dart"
userAgentPackageName: 'com.yourstore.delivery',
```

iOS: change the bundle identifier in Xcode (Runner → Signing & Capabilities) or in `ios/Runner.xcodeproj/project.pbxproj`.

```bash
flutter clean && flutter pub get
```

:::danger
The package name is permanent after the first Google Play upload. Register the new name in Firebase and download a new `google-services.json` ([Firebase Setup](doc:app-delivery/firebase-setup)). Update **Delivery App Play Store URL** in Admin → System Settings → App.
:::

**Next:** [Change App Name, Logo & Colour →](doc:app-delivery/branding)
