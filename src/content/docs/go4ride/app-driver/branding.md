---
title: App Name, Logo & Colour
description: Rename the Driver App, replace its logo, launcher icon and splash, and change its brand colours in theme_controller.dart.
---

The Driver App is branded the same way as the Customer App, with its own files under `apps/driver_app/`.

## App name

| Where it shows | File | Key | Shipped value |
|---|---|---|---|
| Android launcher label | `android/app/src/main/AndroidManifest.xml` | `android:label` | `driver_app` |
| iOS home screen name | `ios/Runner/Info.plist` | `CFBundleDisplayName` | `Driver App` |
| iOS short name | `ios/Runner/Info.plist` | `CFBundleName` | `driver_app` |
| In-app name | `lib/app/theme_controller.dart` | `appName` in `brandProvider` | `Go4Ride Driver` |

Use a name drivers recognise next to the rider app, for example *YourRide Driver* or *YourRide Partner*.

## Logo, icon and splash

| File | Used for |
|---|---|
| `assets/branding/logo.png` | Login screen logo and in-app splash |
| `assets/launcher/app_icon.png` | Launcher icon (1024 × 1024, no transparency) |
| `assets/launcher/adaptive_foreground.png` | Android adaptive icon foreground |
| `assets/launcher/splash.png`, `splash_android12.png` | Native splash |

The configuration is in `apps/driver_app/flutter_launcher_icons.yaml` and `flutter_native_splash.yaml`, with the same keys as the Customer App (background `#FABE24`). Regenerate after you replace the images:

```bash
cd apps/driver_app
dart run flutter_launcher_icons
dart run flutter_native_splash:create
```

Give the driver icon a visible difference (for example a steering wheel badge or a dark background) so drivers who also ride do not confuse the two apps. The full asset sizes are listed in [App Name, Logo & Splash](doc:app-customer/branding).

## Brand colours

The driver brand is built from the shared defaults with `copyWith`:

```dart title="apps/driver_app/lib/app/theme_controller.dart"
const go4RideYellow = Color(0xFFFABE24);   // accent
const go4RideInk = Color(0xFF0A0A0A);      // near-black primary

final brandProvider = Provider<BrandConfig>(
  (_) => BrandConfig.mytaxi.copyWith(
    appName: 'Go4Ride Driver',
    primaryColor: go4RideInk,
    secondaryColor: const Color(0xFF2B2B2B),
    accentColor: go4RideYellow,
    currencyCode: 'INR',
    currencySymbol: '₹',
    defaultCountryCode: 'IN',
    defaultDialCode: '+91',
    supportEmail: 'support@go4ride.app',
  ),
);
```

| Theme | What changes |
|---|---|
| `driverLightTheme` | ui_kit light theme, yellow as `secondary`, black floating buttons with yellow icons |
| `driverDarkTheme` | Yellow becomes `primary`: yellow buttons with black text |

`go4RideYellow` and `go4RideInk` are also used directly in a few widgets: the onboarding dots and icons (`onboarding_screen.dart`), the account header (`account_screen.dart`) and the current-plan card (`subscriptions_screen.dart`). Change the two constants and all of them follow. The in-app splash colour is a separate `_brandYellow` in `lib/features/splash/splash_screen.dart`.

The **dial code** (`defaultDialCode`) is the prefix added at login, and `currencySymbol` formats every amount (wallet, fares, plans).

Dark mode follows the phone. Drivers can switch with **Account → Dark mode / Light mode** (not saved between launches).

## Onboarding slides

On the first launch the app shows three slides before the login, then remembers it in `shared_preferences` (`driver_onboarding_done_v1`). Slides published in **Admin → Onboarding** for the *driver* audience replace the built-in ones ([Banners & Onboarding](doc:admin/banners-onboarding)):

| Built-in slide | Text |
|---|---|
| Drive & earn on your terms | *Go online whenever you like and get ride requests from riders near you.* |
| Track every rupee | *See your earnings live and request payouts straight to your bank.* |
| Safety built in | *One-tap SOS, trip OTPs and 24×7 support keep every ride secure.* |

To change the built-in ones, edit `fallbackOnboardingSlides` in `lib/features/onboarding/onboarding_screen.dart`.

:::note Admin "Driver app name / colour"
The fields in **Settings → App theme & versions** are not read by the Driver App today. Name and colours are compiled in.
:::

**Next:** [Registration & KYC Documents →](doc:app-driver/registration)
