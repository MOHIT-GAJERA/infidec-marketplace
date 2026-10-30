---
title: Change Logo & App Icon
description: Replace the brand images and regenerate the Android adaptive icon and the iOS icon with flutter_launcher_icons.
---

The Customer app's brand images are in `apps/customer_app/assets/brand/`:

| File | Size | Used for |
|---|---|---|
| `logo.png` | 512 × 512, transparent | In-app logo (splash, login, onboarding) and the native splash |
| `icon.png` | 512 × 512 or larger, square | Legacy launcher icon and the iOS icon |
| `icon_foreground.png` | 1024 × 1024, transparent, logo inside the central ~66 % | Android adaptive icon foreground |
| `splash_android12.png` | 1152 × 1152, logo inside the central circle | Android 12+ splash icon |

## 1. Replace the files

Keep the same file names (or update the paths in `pubspec.yaml`). For the adaptive icon foreground, leave generous padding: Android crops the outer third into a circle, squircle or square depending on the launcher.

## 2. Regenerate the launcher icons

The configuration is already in `pubspec.yaml`:

```yaml title="apps/customer_app/pubspec.yaml"
flutter_launcher_icons:
  android: "ic_launcher"
  ios: true
  image_path: "assets/brand/icon.png"
  remove_alpha_ios: true
  background_color_ios: "#FFFFFF"
  min_sdk_android: 24
  adaptive_icon_background: "#FFFFFF"
  adaptive_icon_foreground: "assets/brand/icon_foreground.png"
```

```bash
cd apps/customer_app
dart run flutter_launcher_icons
```

This rewrites the `mipmap-*` folders, `mipmap-anydpi-v26/ic_launcher.xml` and the iOS `AppIcon.appiconset`. Change `adaptive_icon_background` if your icon needs a coloured background.

## 3. Notification icon

Push notifications use `@mipmap/ic_launcher` and the colour `@color/g4m_primary` (`android/app/src/main/res/values/colors.xml`, default `#0B8A4F`). Update the colour to your brand. For a crisp status-bar icon, add a white-on-transparent drawable and point `com.google.firebase.messaging.default_notification_icon` in `AndroidManifest.xml` to it.

## 4. Play Store icon

Upload a separate 512 × 512 PNG in Play Console. The stock one is `playstore/customer_app/graphics/icon_512.png`.

```bash
flutter clean && flutter run
```

**Next:** [Splash Screen →](doc:app-customer/splash-screen)
