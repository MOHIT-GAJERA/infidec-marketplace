---
title: Theme Colours & Font
description: Change the brand colours and font used by the Customer app (and every other Go4Market client) in the shared g4m_core package.
---

All Flutter clients take their palette from one file in the shared package, so a colour change applies to the Customer app, the Partner app, the website and the panels at once.

## Brand colours

```dart title="packages/g4m_core/lib/src/theme/brand.dart"
abstract final class G4MColors {
  static const primary = Color(0xFF0B8A4F);      // brand green: buttons, links
  static const primaryDeep = Color(0xFF0A4A33);  // deep green: headings, dark surfaces
  static const primarySoft = Color(0xFFE6F4EC);  // soft green backgrounds
  static const accent = Color(0xFFF7860F);       // orange: offers, badges, hot CTAs
  static const accentSoft = Color(0xFFFFF1E2);
  static const background = Color(0xFFF7FAF8);
  static const surface = Color(0xFFFFFFFF);
  static const ink = Color(0xFF0F1A14);
  static const inkMuted = Color(0xFF5B6B62);
  static const line = Color(0xFFE3EBE6);
  // success, warning, danger, info, dark-mode surfaces, gradients, pastel tiles …
}
```

Change the values, keeping enough contrast for text on `primary` buttons (white text needs a fairly dark primary). Also update `heroGradient` and `accentGradient` in the same file.

## Theme and font

- `packages/g4m_core/lib/src/theme/theme.dart` builds the shared `ThemeData` (light and dark) with **Plus Jakarta Sans** from `google_fonts`, rounded radii (12 / 16 / 24) and the motion timings.
- `apps/customer_app/lib/core/theme.dart` (`appTheme()`) adds the Customer app's tweaks on top.

To change the font, replace `GoogleFonts.plusJakartaSansTextTheme(...)` in `theme.dart` with another Google Font (for example `GoogleFonts.interTextTheme(...)`).

:::tip Bundle the font for offline first launch
`google_fonts` downloads the font on first use. To ship it in the app, add the `.ttf` files under `assets/fonts/`, declare them in `pubspec.yaml`, and set `GoogleFonts.config.allowRuntimeFetching = false`.
:::

## Module colours

Each module has its own colour (`modules/{id}.themeColor`), set in **Admin → Settings → Modules** without a rebuild. The app uses it for the home hero, category tiles and highlights when that module is selected.

## Light and dark mode

The app follows the system setting by default. Customers can choose **Light**, **Dark** or **System** under **Account → Theme**.

## Native colours

| File | Value |
|---|---|
| `android/app/src/main/res/values/colors.xml` | `g4m_primary`: the notification accent colour |
| `pubspec.yaml` → `flutter_native_splash` | Splash background colours ([Splash Screen](doc:app-customer/splash-screen)) |

```bash
flutter clean && flutter run
```

**Next:** [Languages →](doc:app-customer/languages)
