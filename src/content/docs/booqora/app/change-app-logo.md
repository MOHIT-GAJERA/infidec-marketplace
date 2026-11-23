---
title: Change Logo & App Icon
description: Replace the brand images in assets/brand, regenerate the Android adaptive icon and the iOS app icon, and keep the logo inside the safe zone.
---

The Booqora logo appears in two places: **inside the app** (splash, onboarding, sign-in, headers) and as the **launcher icon** on the home screen. They come from different files.

![Launcher icon](/docs/booqora/images/app-launcher-icon.webp "The adaptive launcher icon on an Android home screen")

## 1. In-app brand images

All in-app images live in `booqora_mobile/assets/brand/` (declared in `pubspec.yaml` under `flutter: assets:`). Replace each file with your own, **keeping the file name and a similar size**:

| File | Size | Used for |
|---|---|---|
| `logo_mark.png` | 673 × 673, transparent | Symbol only. Animated splash, onboarding header, sign-in screen, `AppLogo(mark: true)` |
| `logo_full.png` | 2144 × 621, transparent | Symbol plus wordmark. `AppLogo()` in headers |
| `app_icon.png` | 1024 × 1024 | Master app icon. Source for the launcher icons and the 512 × 512 Play Store icon |
| `splash_mark.png` | 768 × 768, transparent | Native splash (Android 11 and lower, iOS) |
| `splash_android12.png` | 1152 × 1152, transparent | Native splash on Android 12+ |

The splash images are covered in [Splash, Onboarding & Intro](doc:app/splash-onboarding).

:::tip Light logo on a dark background
The splash and onboarding use a dark violet background (`#1C0938`), and `logo_mark.png` sits on top of it. Use a version of your mark that reads well on a dark colour, or change the splash colours too.
:::

## 2. Launcher icon

The generated icons are already in the project:

| Platform | Location |
|---|---|
| Android (legacy) | `android/app/src/main/res/mipmap-*/ic_launcher.png` |
| Android (adaptive, API 26+) | `mipmap-anydpi-v26/ic_launcher.xml` → foreground `mipmap-*/ic_launcher_foreground.png` (432 × 432 at xxxhdpi) on background colour `ic_launcher_background` (`#FFFFFF`) in `res/values/` |
| iOS | `ios/Runner/Assets.xcassets/AppIcon.appiconset/` (all sizes up to `Icon-App-1024x1024@1x.png`) |

The package does **not** list `flutter_launcher_icons` in `pubspec.yaml`, so to regenerate the icons from your own image, add it as a dev dependency with this configuration:

```yaml title="booqora_mobile/pubspec.yaml"
dev_dependencies:
  flutter_launcher_icons: ^0.14.4

flutter_launcher_icons:
  android: "ic_launcher"
  ios: true
  image_path: "assets/brand/app_icon.png"
  adaptive_icon_background: "#FFFFFF"
  adaptive_icon_foreground: "assets/brand/app_icon_foreground.png"
  remove_alpha_ios: true
```

`app_icon_foreground.png` is a file you create: a 1024 × 1024 transparent PNG with only your logo, inside the safe zone described below. Then run:

```bash title="Terminal"
cd booqora_mobile
flutter pub get
dart run flutter_launcher_icons
```

The tool overwrites the `mipmap-*` folders, `ic_launcher.xml`, the background colour and the iOS `AppIcon.appiconset`. Alternatively, use Android Studio → right-click `res` → **New → Image Asset** for Android and drop a 1024 × 1024 PNG into the `AppIcon` set in Xcode for iOS.

`remove_alpha_ios: true` matters: App Store Connect rejects an app icon with transparency.

## 3. The adaptive icon safe zone

Android 8+ crops the adaptive icon into a circle, squircle or rounded square depending on the phone. Only the centre of the foreground is guaranteed to be visible.

- The foreground canvas is **108 × 108 dp**; only the central **66 × 66 dp** circle is always shown (about 61%).
- For a 1024 × 1024 foreground image, keep the logo inside a centred circle of about **620 px** diameter, with transparent padding around it.
- The background layer fills the whole shape. Use a solid colour (`adaptive_icon_background`) or a full-bleed image.

:::warning Logo cut off on some phones
If your logo touches the edges of the foreground image, some launchers clip it. Booqora 1.0 shipped a fix for exactly this ("Android 12 splash / adaptive icon logo cut-off"). Preview the icon in Android Studio's Image Asset tool, which shows the safe zone, before building.
:::

## 4. Play Store icon

Google Play asks for a separate **512 × 512 PNG** (32-bit, up to 1 MB). Export it from `app_icon.png`. It is uploaded in Play Console, not bundled in the app. See [Google Play Listing & Review](doc:app/play-console).

## 5. Rebuild

```bash title="Terminal"
flutter clean
flutter run
```

Uninstall the previous build if the old icon remains. Launchers cache icons aggressively.

**Next:** [Splash, Onboarding & Intro →](doc:app/splash-onboarding)
