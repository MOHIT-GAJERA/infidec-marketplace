---
title: Theme Colours & Fonts
description: Change the brand colours, dark mode behaviour and font of the Customer App through BrandConfig, theme_controller.dart and the shared ui_kit design system.
---

Go4Ride is a **white-label** suite. All three apps build their Material 3 theme from one `BrandConfig` object and the shared design system in `packages/ui_kit`. To rebrand the Customer App you change one constant.

| File | What it holds |
|---|---|
| `apps/customer_app/lib/app/theme_controller.dart` | `go4RideBrand` (the Customer App brand), the light and dark theme functions, the theme-mode controller |
| `packages/ui_kit/lib/src/branding/brand_config.dart` | The `BrandConfig` class and its defaults |
| `packages/ui_kit/lib/src/theme/app_theme.dart` | `AppTheme.light(brand)` / `AppTheme.dark(brand)`: buttons, inputs, cards, app bar |
| `packages/ui_kit/lib/src/theme/app_colors.dart` | Status colours (success, warning, error, info) and light/dark neutrals |
| `packages/ui_kit/lib/src/theme/app_typography.dart` | Text sizes and the font family |

:::warning ui_kit is shared
Changes in `packages/ui_kit` affect the Customer App, the Driver App **and** the Admin Panel. For a Customer-only change, edit `theme_controller.dart`.
:::

## Brand colours

```dart title="apps/customer_app/lib/app/theme_controller.dart"
/// Go4Ride signature yellow (logo, splash, accents).
const go4RideYellow = Color(0xFFFABE24);

const go4RideBrand = BrandConfig(
  appName: 'Go4Ride',
  primaryColor: Color(0xFF0A0A0A),   // buttons, focused inputs, icons
  secondaryColor: go4RideYellow,
  accentColor: go4RideYellow,        // OTP card, service tiles, page dots, selected package
  ...
);
```

| Colour | Light mode | Dark mode |
|---|---|---|
| `primaryColor` (near-black) | Seed of the colour scheme, filled buttons with white text, focused input border | Replaced by the accent (black would vanish on the dark background) |
| `accentColor` (yellow) | OTP card background, service tile tint, selected rental package, onboarding dots, update banner icon | `primary`: filled buttons with black text, outlined and text buttons |
| `secondaryColor` | `colorScheme.secondary` | `colorScheme.secondary` |

For example, a blue brand:

```dart
const brandBlue = Color(0xFF1E5EFF);

const go4RideBrand = BrandConfig(
  appName: 'YourRide',
  primaryColor: Color(0xFF0B1B3F),
  secondaryColor: brandBlue,
  accentColor: brandBlue,
  ...
);
```

Keep enough contrast. In dark mode the accent becomes the button colour with **black** text (`onPrimary: Colors.black` in `customerDarkTheme`). If your accent is dark, change `onPrimary` and the button `foregroundColor` there to white.

### Colours outside the theme

| Place | File | Value |
|---|---|---|
| In-app splash background | `lib/features/splash/splash_screen.dart` | `_brandYellow = Color(0xFFFABE24)` |
| Native splash and adaptive icon background | `flutter_native_splash.yaml`, `flutter_launcher_icons.yaml` | `#FABE24` ([App Name, Logo & Splash](doc:app-customer/branding)) |
| SOS button, error text | `AppColors.error` in ui_kit | `#C62828` |
| Map markers | `lib/features/rides/active_ride_screen.dart` | pickup red (default), drop green, driver yellow |

## Light and dark mode

The app follows the phone setting (`ThemeMode.system`). Riders can switch with **Account → Dark mode**. The choice is kept while the app runs and resets to the system setting on the next launch, because `ThemeModeController` is not persisted.

To force one mode, change `build()` in `ThemeModeController`:

```dart title="lib/app/theme_controller.dart"
@override
ThemeMode build() => ThemeMode.light;   // was ThemeMode.system
```

## Fonts

The apps use the platform font (Roboto on Android, San Francisco on iOS). To use your own font:

1. Add the font files to the app, for example `apps/customer_app/assets/fonts/Inter-Regular.ttf` and `Inter-SemiBold.ttf`.
2. Declare them in `apps/customer_app/pubspec.yaml`:

```yaml title="apps/customer_app/pubspec.yaml"
flutter:
  uses-material-design: true
  assets:
    - assets/branding/
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-SemiBold.ttf
          weight: 600
```

3. Set the family in `packages/ui_kit/lib/src/theme/app_typography.dart`:

```dart title="packages/ui_kit/lib/src/theme/app_typography.dart"
static const String? fontFamily = 'Inter';   // was null
```

Because `AppTypography` is shared, declare the same font in the Driver App and Admin Panel `pubspec.yaml` too, or those apps fall back to the platform font.

## Spacing and corners

`packages/ui_kit/lib/src/theme/app_spacing.dart` defines the spacing scale (`xs` 4 → `xxxl` 48) and corner radii (`AppRadius.sm` 8, `md` 12, `lg` 16, `xl` 24). Change them there to make the whole suite tighter or rounder.

:::note Admin "App theme" colour
**Admin → Settings → App theme & versions → Customer app colour** is stored in Firestore but the app does not apply it at runtime. Colours change only through `BrandConfig` and a new build.
:::

Run `flutter run` again after a theme change. Hot reload does not rebuild `const` brand values reliably, so use a hot **restart** (<kbd>Shift</kbd> + <kbd>R</kbd>).

**Next:** [Google Maps & Location →](doc:app-customer/maps-location)
