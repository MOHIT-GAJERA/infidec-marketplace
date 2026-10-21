---
title: Change App Logo & Splash
description: Replace the launcher icon, adaptive icon and native splash screen with your brand.
---

## Source images

Replace the files in `customer_app/assets/icon/` (keep the names and sizes):

| File | Size | Use |
|---|---|---|
| `app_icon.png` | 1024 × 1024 | Launcher icon (Android legacy, iOS, web) — no transparency for iOS |
| `app_icon_foreground.png` | 1024 × 1024, transparent, logo inside the central 66 % | Android adaptive icon foreground |
| `app_icon_monochrome.png` | 1024 × 1024, single colour | Android 13 themed icon |
| `app_icon_round.png` | 1024 × 1024 | Legacy round icon |
| `play_store_512.png` | 512 × 512, 32-bit PNG | Google Play listing icon |
| `splash_*.png` | see `flutter_native_splash.yaml` | Native splash logo / Android 12 icon / bottom wordmark |

In-app logos (header, login screen) are in `assets/images/` — replace them with images of the same size.

## Adaptive icon background colour

```yaml title="flutter_launcher_icons.yaml"
flutter_launcher_icons:
  image_path: "assets/icon/app_icon.png"
  android: "ic_launcher"
  adaptive_icon_background: "#0E9623"        # ← your brand colour
  adaptive_icon_foreground: "assets/icon/app_icon_foreground.png"
  adaptive_icon_monochrome: "assets/icon/app_icon_monochrome.png"
  ios: true
  remove_alpha_ios: true
  background_color_ios: "#0E9623"
```

## Generate

```bash
cd customer_app
dart run flutter_launcher_icons
dart run flutter_native_splash:create
```

Then uninstall the old app from the device and run it again — Android caches launcher icons.

:::tip Test on Android 8+, 12+ and 13+
Adaptive icons are cropped to a circle, squircle or square depending on the phone; keep your logo inside the safe zone. Android 12+ shows the splash *icon* on a coloured background.
:::

**Next:** [Change Theme Colour & Font →](doc:app-customer/change-theme)
