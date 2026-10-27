---
title: Theme Colours & Fonts
description: Change the brand colours, component shapes and font of the ClassiAds-Hub app in lib/core/theme/app_theme.dart.
---

The whole app uses one Material 3 theme defined in **`lib/core/theme/app_theme.dart`**. The colours match the website and Admin Panel.

![Home](/docs/classiadshub/images/app-home.webp "Home in the default navy / amber theme")
![Profile](/docs/classiadshub/images/app-profile.webp "Profile")

## Brand colours

```dart title="mobile/lib/core/theme/app_theme.dart"
class AppTheme {
  // Brand palette (shared with web + admin).
  static const Color seed = Color(0xFF272757);              // Primary
  static const Color secondary = Color(0xFF505081);         // Secondary
  static const Color accent = Color(0xFFFFBF00);            // Accent / buttons
  static const Color backgroundLight = Color(0xFFE4E4EE);   // Background Light
  static const Color textDark = Color(0xFF0F0E47);          // Text Dark
  ...
}
```

| Constant | Default | Used for |
|---|---|---|
| `seed` | `#272757` navy | `colorScheme.primary`, app bar icons, the centre **+** (Post ad) button, selected bottom-nav item, links, focused input border |
| `secondary` | `#505081` | `colorScheme.secondary`, the "sold" status colour |
| `accent` | `#FFBF00` amber | `colorScheme.tertiary`, highlight text on the home banner, the "Under review" banner |
| `backgroundLight` | `#E4E4EE` | Scaffold background of most screens |
| `textDark` | `#0F0E47` | Titles and body text; text on amber (`onTertiary`) |

Change the five values and hot-restart. The `ColorScheme` is generated with `ColorScheme.fromSeed(seedColor: seed)` and then `primary`, `secondary` and `tertiary` are overridden with your exact values, so tints (chips, indicator, outlines) follow automatically.

:::warning Some colours are written directly in screens
A few widgets use literal colours instead of the theme, for example `Color(0xFF272757)` in the OTP, nearby and verification screens, the green `#1F8A6B` for "approved" / verified, the red `#D64545` for "rejected" and the **VERIFIED** badge, and the status colours in `my_ads_screen.dart` and `job_applications_screen.dart`. After changing the palette, search `lib/` for `0xFF272757` and other hex values and replace them with `AppTheme.seed` or your new colour.
:::

## Component styles

`_build()` in the same file sets the shapes for the whole app:

| Theme part | Default |
|---|---|
| `appBarTheme` | White background, `textDark` foreground, no elevation, left-aligned title |
| `cardTheme` | White, no elevation, 16 px radius |
| `inputDecorationTheme` | Filled white, 12 px radius, `outlineVariant` border, 1.6 px primary border on focus |
| `filledButtonTheme` / `outlinedButtonTheme` | Full width (`Size.fromHeight(52)`), 12 px radius, 16 px semi-bold text |
| `chipTheme` | 20 px radius (filter chips on search) |
| `navigationBarTheme` | White, 64 px high, labels always shown |
| `snackBarTheme` | Floating, 10 px radius |

The bottom bar itself is a `BottomAppBar` with a notched centre button, built in `lib/features/shell/app_shell.dart` (Home · Chat · **+** · My Ads · Profile).

## Dark mode

`AppTheme.dark()` exists, but `main.dart` forces light mode:

```dart title="mobile/lib/main.dart"
theme: AppTheme.light(),
darkTheme: AppTheme.dark(),
// Screens are styled with the light palette (AppTheme.backgroundLight /
// textDark are hard-coded), so dark mode renders mixed light/dark
// surfaces. Ship light-only until the screens use theme colours.
themeMode: ThemeMode.light,
```

Many screens use `AppTheme.backgroundLight` and `AppTheme.textDark` directly, so switching to `ThemeMode.system` gives mixed light and dark surfaces. Keep light mode unless you update those screens. A `ThemeModeController` (`lib/features/settings/theme_controller.dart`) that stores `system | light | dark` is included but not connected to any screen.

## Fonts

The app uses the **default Material font** (Roboto on Android, San Francisco on iOS). No font files are bundled. To use your own font:

1. Put the files in `mobile/assets/fonts/`.
2. Declare them in `pubspec.yaml`:

```yaml title="mobile/pubspec.yaml"
flutter:
  fonts:
    - family: Nunito
      fonts:
        - asset: assets/fonts/Nunito-Regular.ttf
        - asset: assets/fonts/Nunito-Bold.ttf
          weight: 700
```

3. Set it on the theme:

```dart title="mobile/lib/core/theme/app_theme.dart"
return ThemeData(
  useMaterial3: true,
  fontFamily: 'Nunito',
  colorScheme: scheme,
  ...
);
```

The Admin Panel uses Nunito, so this keeps the app consistent with it.

**Next:** [API Configuration →](doc:app/api-configuration)
