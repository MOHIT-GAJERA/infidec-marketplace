---
title: App Name, Icon & Splash
description: Rename the app, replace the logos, and generate the launcher icon and native splash screen with flutter_launcher_icons and flutter_native_splash.
---

## App name

| Platform | File | Key |
|---|---|---|
| Android (launcher label) | `android/app/src/main/AndroidManifest.xml` | `android:label="Go4Foodie"` |
| iOS (home screen name) | `ios/Runner/Info.plist` | `CFBundleDisplayName` → `Go4Foodie` |
| Task switcher / web title | `lib/main.dart` | `MaterialApp.router(title: 'Go4Foodie', …)` |

The name **Go4Foodie** also appears in a few strings in the app. Search the code for `Go4Foodie` and replace the ones you need:

| File | Text |
|---|---|
| `lib/features/common/profile_screen.dart` | Footer `Go4Foodie · v1.0.0` |
| `lib/features/customer/payment_webview.dart` | Merchant name in the Razorpay checkout (`'name': 'Go4Foodie'`) |
| `lib/features/customer/checkout_screen.dart` | Payment description `Go4Foodie order` |
| `lib/features/auth/login_screen.dart` | *New to Go4Foodie?* |
| `lib/features/customer/gift_cards_screen.dart` | *Treat someone to an evening at Go4Foodie.* |

:::tip Restaurant name, address and phone come from the Admin Panel
The **Visit us** card on the customer home shows the restaurant profile from **Admin → Settings** ([Settings](doc:admin/settings)). If a field is empty, the card falls back to a hard-coded sample address and phone, and the opening hours line is always hard-coded. To change them, edit `_VisitCard` in `lib/features/customer/customer_shell.dart`.
:::

## Logo images

All images are in `mobile-app/assets/images/`. Replace them with your own files. Keep the same names and aspect ratios:

| File | Size | Used for |
|---|---|---|
| `app_icon.png` | 1024 × 1024, no transparency | Launcher icon (Android legacy, iOS) |
| `app_icon_fg.png` | 1024 × 1024, transparent, logo inside the central 66 % | Android adaptive icon foreground and Android 12+ splash icon |
| `splash_logo.png` | 1152 × 1152, transparent | Native splash logo (before Android 12, and iOS) |
| `go4foodie_logo.png` / `go4foodie_logo_light.png` | 600 × 600 | Stacked logo (in-app splash). The `_light` version is for dark backgrounds |
| `go4foodie_logo_wide.png` / `go4foodie_logo_wide_light.png` | 1200 × 336 | Horizontal logo on the welcome, login and register screens (`BrandLogo` in `lib/widgets/common.dart`) |
| `food_grill.jpg`, `food_pizza.jpg`, `food_salad.jpg` | photos | Onboarding slides and the customer home hero |

The dark theme uses the `_light` logos, and so does the dark welcome screen.

## Launcher icon

The icon is configured in `pubspec.yaml`:

```yaml title="pubspec.yaml"
# Launcher icon: dart run flutter_launcher_icons
flutter_launcher_icons:
  android: true
  ios: true
  image_path: assets/images/app_icon.png
  adaptive_icon_background: "#FFFFFF"      # ← your brand background colour
  adaptive_icon_foreground: assets/images/app_icon_fg.png
  remove_alpha_ios: true
```

## Native splash screen

```yaml title="pubspec.yaml"
# Brand splash (white background + Go4Foodie logo): dart run flutter_native_splash:create
flutter_native_splash:
  color: "#FFFFFF"
  image: assets/images/splash_logo.png
  android_12:
    color: "#FFFFFF"
    image: assets/images/app_icon_fg.png
    icon_background_color: "#FFFFFF"
  fullscreen: false
```

The app keeps the native splash on screen until the first frame is ready (`FlutterNativeSplash.preserve` in `lib/main.dart`). The in-app splash then shows the stacked logo while it restores the session.

## Generate

```bash
cd mobile-app
flutter pub get
dart run flutter_launcher_icons
dart run flutter_native_splash:create
```

Uninstall the old app from the device and run it again. Android caches launcher icons.

:::tip Test on Android 8+, 12+ and 13+
Adaptive icons are cropped to a circle, squircle or square depending on the phone, so keep your logo inside the safe zone. Android 12+ shows the splash **icon** (`app_icon_fg.png`) centred on the `android_12.color` background.
:::

## Onboarding slides

Each mode shows three onboarding slides the first time it is opened (stored per mode as `onboarded_<role>`). The texts and images are in `_slides` in `lib/features/onboarding/onboarding_screen.dart`.

| Mode | Slides |
|---|---|
| Customer | Our menu · Order your way · Reserve |
| Restaurant | Live floor · Point of sale · Service |
| Owner | Insights · Full control · Oversight |

## Currency symbol

Amounts in the app are formatted as US dollars (`NumberFormat.simpleCurrency(name: 'USD')` in `lib/core/format.dart`). If your restaurant uses another currency, change `name: 'USD'` there, for example to `'INR'` or `'EUR'`. Online payments are charged in the gateway currency set on the backend (`RAZORPAY_CURRENCY`, `STRIPE_CURRENCY`; see [Environment Configuration](doc:installation/environment-configuration)).

**Next:** [Change Theme →](doc:app/change-theme)
