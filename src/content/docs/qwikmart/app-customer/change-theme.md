---
title: Change Theme Colour & Font
description: Change the brand colours, the home-screen gradients and the font of the Customer App.
---

All colours and the font are defined in **`lib/core/theme.dart`**.

## Brand colours

```dart title="lib/core/theme.dart"
class AppColors {
  static const primary = Color(0xFF0E9623);      // buttons, active tab, prices
  static const primaryDark = Color(0xFF0B7A1C);  // pressed states, headings
  static const primary50 = Color(0xFFE6F4E9);    // light backgrounds, chips
  ...
  // Home header gradients for the Quick / eCommerce toggle
  static const quickGradient = [Color(0xFFEBEC8D), Color(0xFFF8F9E9), Color(0xFFFFFFFF)];
  static const ecommerceGradient = [Color(0xFFFDE2D6), Color(0xFFFFF4EE), Color(0xFFFFFFFF)];
}
```

Change `primary`, `primaryDark` and `primary50` to your brand colour, a darker shade and a very light tint. Check contrast: white text on `primary` should be readable (contrast ratio ≥ 4.5:1).

The app supports **light and dark mode** (Profile → Theme); the dark palette is in the same file (`darkBg`, `darkSurface`, …).

## Font

The app uses **Plus Jakarta Sans** from Google Fonts:

```dart title="lib/core/theme.dart"
textTheme: GoogleFonts.plusJakartaSansTextTheme(base.textTheme),
```

Replace `plusJakartaSansTextTheme` with any Google Font, e.g. `GoogleFonts.poppinsTextTheme` or `GoogleFonts.interTextTheme`.

:::tip Bundle the font for offline first launch
`google_fonts` downloads the font on first use. To ship it inside the app, put the `.ttf` files in `assets/fonts/`, declare them in `pubspec.yaml` and set `GoogleFonts.config.allowRuntimeFetching = false;`.
:::

Hot-restart (`R`) to see the changes.

**Next:** [Onboarding Images & Text →](doc:app-customer/onboarding)
