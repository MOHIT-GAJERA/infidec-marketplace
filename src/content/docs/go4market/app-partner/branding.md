---
title: App Name, Logo, Icon & Splash
description: Rename the Partner app, replace its logo and launcher icon, and regenerate the native splash screen.
---

## App name

```xml title="apps/partner_app/android/app/src/main/AndroidManifest.xml"
<application android:label="Your Market Partner" …>
```

The in-app name is `appName` in `lib/core/l10n.dart` (`'Go4Market Partner'`). Search `lib/` for "Go4Market" to update other mentions, such as the onboarding texts and the rider invitation message. For iOS, change `CFBundleDisplayName` in `ios/Runner/Info.plist`.

## Logo and launcher icon

Brand files are in `apps/partner_app/assets/branding/`:

| File | Size | Used for |
|---|---|---|
| `app_icon.png` | 512 × 512 or larger | Launcher icon and adaptive-icon foreground (with a 16 % inset) |
| `logo.png` | 512 × 512, transparent | In-app logo and the native splash |
| `splash_android12.png` | ~960 × 960, logo inside the central circle | Android 12+ splash |

```yaml title="apps/partner_app/pubspec.yaml"
flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/branding/app_icon.png"
  remove_alpha_ios: true
  min_sdk_android: 23
  adaptive_icon_background: "#FFFFFF"
  adaptive_icon_foreground: "assets/branding/app_icon.png"
  adaptive_icon_foreground_inset: 16
```

```bash
cd apps/partner_app
dart run flutter_launcher_icons
```

## Splash

```yaml title="apps/partner_app/pubspec.yaml"
flutter_native_splash:
  color: "#F7FAF8"
  image: assets/branding/logo.png
  android_12:
    image: assets/branding/splash_android12.png
    color: "#F7FAF8"
    icon_background_color: "#F7FAF8"
  android: true
  ios: true
  web: false
```

```bash
dart run flutter_native_splash:create
```

The animated in-app splash is in `lib/features/splash/` (`splash_screen.dart`, `doodle_painter.dart`), and the intro slides are in `lib/features/onboarding/onboarding_screen.dart`.

![Partner app splash](/docs/go4market/images/app-partner-splash.webp "The Partner app splash")

## Store graphics

Replace `playstore/partner_app/graphics/icon_512.png` and `feature_graphic.png` with your own before publishing ([Google Play Listing](doc:app-customer/play-console)).

**Next:** [Theme Colours & Languages →](doc:app-partner/change-theme)
