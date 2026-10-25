---
title: App Name, Logo & Splash
description: Rename the Customer App, replace the logo, and regenerate the launcher icon and native splash screen with flutter_launcher_icons and flutter_native_splash.
---

## App name

The name is set in four places. The shipped Android label and iOS display name are still the Flutter defaults, so change them before your first build:

| Where it shows | File | Key | Shipped value |
|---|---|---|---|
| Android launcher label | `android/app/src/main/AndroidManifest.xml` | `android:label` | `customer_app` |
| iOS home screen name | `ios/Runner/Info.plist` | `CFBundleDisplayName` | `Customer App` |
| iOS short name | `ios/Runner/Info.plist` | `CFBundleName` | `customer_app` |
| In-app text, task switcher | `lib/app/theme_controller.dart` | `BrandConfig(appName: …)` | `Go4Ride` |

```xml title="android/app/src/main/AndroidManifest.xml"
<application
    android:label="YourRide"
    android:name="${applicationName}"
    android:icon="@mipmap/ic_launcher">
```

`appName` from `BrandConfig` is used for the `MaterialApp` title, *About YourRide* in Account, the version line *YourRide v1.0.0*, the update banner and the e-mail subject of *Contact us*.

:::note The Admin Panel "App theme" name does not rename the app
**Settings → App theme & versions** has *Customer app name* and *Customer app colour* fields. The app does not read them today. The name and colours are compiled in from `BrandConfig`.
:::

## Logo

| File | Size | Used for |
|---|---|---|
| `assets/branding/logo.png` | square, 1024 × 1024 recommended, transparent | Login screen (`BrandLogo`, 88 dp with rounded corners) and the in-app splash (256 dp) |
| `assets/launcher/app_icon.png` | 1024 × 1024, no transparency | Launcher icon (Android legacy, iOS) |
| `assets/launcher/adaptive_foreground.png` | 1024 × 1024, transparent, logo inside the central 66 % | Android adaptive icon foreground |
| `assets/launcher/splash.png` | 1152 × 1152 recommended, transparent | Native splash image (Android before 12, iOS) |
| `assets/launcher/splash_android12.png` | 1152 × 1152, logo inside a 768 px circle | Android 12+ splash icon |

`BrandConfig` also declares `logo_light.png` and `icon.png`. The app does not use them, so you only need `logo.png` in `assets/branding/`. If `logo.png` is missing, the login screen falls back to a taxi icon with the app name.

## Launcher icon

```yaml title="apps/customer_app/flutter_launcher_icons.yaml"
# Go4Ride launcher icons. Regenerate with: dart run flutter_launcher_icons
flutter_launcher_icons:
  image_path: "assets/launcher/app_icon.png"
  android: true
  min_sdk_android: 21
  adaptive_icon_background: "#FABE24"     # ← your brand background colour
  adaptive_icon_foreground: "assets/launcher/adaptive_foreground.png"
  adaptive_icon_foreground_inset: 0
  ios: true
  remove_alpha_ios: true
```

## Native splash screen

```yaml title="apps/customer_app/flutter_native_splash.yaml"
# Go4Ride native splash. Regenerate with: dart run flutter_native_splash:create
flutter_native_splash:
  color: "#FABE24"                          # ← splash background
  image: assets/launcher/splash.png
  android_12:
    image: assets/launcher/splash_android12.png
    color: "#FABE24"
  web: false
```

The Flutter splash (`lib/features/splash/splash_screen.dart`) is drawn to match the native one: the same yellow (`_brandYellow = Color(0xFFFABE24)`) with `logo.png` centred at 256 dp and a small spinner. If you change the splash colour, change `_brandYellow` there too, or the hand-off from native to Flutter flashes.

## Generate

```bash
cd apps/customer_app
dart run flutter_launcher_icons
dart run flutter_native_splash:create
```

Uninstall the old app from the device and run it again. Android caches launcher icons.

:::tip Test on Android 8+, 12+ and 13+
Adaptive icons are cropped to a circle, squircle or square depending on the phone, so keep the logo inside the safe zone. Android 12+ shows only the splash **icon** on the `android_12.color` background.
:::

## Other brand values

`lib/app/theme_controller.dart` holds the rest of the brand in `go4RideBrand`:

| Field | Shipped | Used for |
|---|---|---|
| `currencyCode` / `currencySymbol` | `INR` / `₹` | Every amount in the app (fares, wallet, top-up limits) |
| `defaultDialCode` | `+91` | Prefix added to the phone number at login |
| `defaultCountryCode` | `IN` | Region default |
| `supportEmail`, `supportPhone`, `termsUrl`, `privacyUrl` | placeholders | Declared, but the screens use **Admin → Settings → Contact us** and the content pages instead |

Support contact details, About, Privacy policy and Terms come from the Admin Panel, so you can change them without a new build ([General & App Settings](doc:admin/settings)).

**Next:** [Theme Colours & Fonts →](doc:app-customer/change-theme)
