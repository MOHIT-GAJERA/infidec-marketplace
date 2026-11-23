---
title: Theme Colours & Fonts
description: Change the Booqora Mobile App's brand colours in lib/core/theme.dart and swap the Inter and Plus Jakarta Sans fonts loaded through google_fonts.
---

All colours and fonts of the Mobile App come from one file: `booqora_mobile/lib/core/theme.dart`. It has two classes:

- `AppColors`: named colour constants used everywhere in the UI.
- `AppTheme`: builds the Material 3 `ThemeData` (buttons, inputs, cards, chips, tabs, dialogs, snack bars) from those colours.

`lib/main.dart` applies `AppTheme.light()` and adjusts the app bar. The app has a single light theme; there is no dark mode.

## Brand colours

```dart title="booqora_mobile/lib/core/theme.dart"
class AppColors {
  static const primary = Color(0xFF6431DD);     // logo violet
  static const primaryDeep = Color(0xFF351DB1); // logo indigo
  static const primarySoft = Color(0xFFEFE9FD);
  static const lavender = Color(0xFFC2A3F9);    // logo swoosh
  static const ink = Color(0xFF1C0938);         // wordmark
  static const inkSoft = Color(0xFF4B3F66);
  static const muted = Color(0xFF7A7090);
  static const border = Color(0xFFE6E1F0);
  static const bg = Color(0xFFF7F5FC);
  // success, warning, danger, info + their *Soft variants
}
```

| Colour | Used for |
|---|---|
| `primary` | Buttons, links, selected tab, focused input border, switches, seed of the Material colour scheme |
| `primaryDeep` | Secondary colour, chip text, gradients |
| `primarySoft` | Chip background, highlighted cards (for example the payment link card) |
| `lavender` | Accents such as the scanner laser and illustration details |
| `ink` | Main text, app bar icons, snack bars, the splash and onboarding background |
| `inkSoft`, `muted` | Secondary text, hints, labels |
| `border`, `bg` | Dividers, card borders and the page background |
| `success`, `warning`, `danger`, `info` | Status pills, banners and metrics. Change only if your brand needs it |

There are also two gradients:

```dart title="booqora_mobile/lib/core/theme.dart"
static const brandGradient = LinearGradient(
  colors: [Color(0xFF7B3FF2), primary, primaryDeep], // …
);
static const heroGradient = LinearGradient(
  colors: [Color(0xFF1C0938), Color(0xFF2B1270), Color(0xFF351DB1)], // …
);
```

`brandGradient` fills the centre **+** button, gradient buttons, selected chips and Bora chat bubbles. `heroGradient` is the dark background of the animated splash, onboarding, intro and the hero cards on Home, Help and the product detail header.

To rebrand, change the hex values and the gradient stops, then hot-restart (`R`). Everything that uses `AppColors` updates.

:::tip Keep contrast
`primary` is used for white button text and `ink` for body text on `bg`. Check both pairs for at least 4.5:1 contrast after you change them.
:::

## Hard-coded colours to check

A few colours are written directly in widgets rather than in `AppColors`:

| File | What |
|---|---|
| `lib/widgets/shell.dart` | Colours of the six quick-create actions (New order, Add product, …) |
| `lib/features/more/more_page.dart` | Gradient pairs of the module tiles (Calendar, Customers, …) |
| `lib/features/settings/settings_page.dart`, `online_store/online_store_page.dart` | Icon colours of each settings and store section |
| `lib/features/welcome/welcome_pages.dart` | Aurora orbs on the splash, onboarding and intro |
| `lib/data/payments.dart` | Razorpay checkout fallback colour `#6431DD` |
| `pubspec.yaml` | Native splash colour `#1C0938` ([Splash, Onboarding & Intro](doc:app/splash-onboarding)) |

Search for `Color(0x` in `lib/` to find them all.

:::note Documents and the Online Store use the workspace colour
Invoice PDFs and the Online Store take their brand colour from the workspace settings, not from `theme.dart`. Each business sets it in the app or on the Rental Platform.
:::

## Fonts

The app uses two Google Fonts through the `google_fonts` package:

- **Inter** for body text (`GoogleFonts.interTextTheme()`).
- **Plus Jakarta Sans** for headings and titles (`GoogleFonts.plusJakartaSans(...)`).

Swap them in `AppTheme._text()`:

```dart title="booqora_mobile/lib/core/theme.dart"
static TextTheme _text() {
  final body = GoogleFonts.poppinsTextTheme();
  TextStyle? head(TextStyle? s) =>
      GoogleFonts.outfit(textStyle: s, fontWeight: FontWeight.w700, color: AppColors.ink, letterSpacing: -0.2);
  // … also change titleMedium (plusJakartaSans) and titleSmall (inter)
}
```

Any font on [fonts.google.com](https://fonts.google.com) works. The method name is the font name in lower camel case.

### Runtime fetching

`lib/main.dart` sets `GoogleFonts.config.allowRuntimeFetching = true`. Fonts are downloaded on first use and cached on the device. Until the download finishes (or if the phone is offline on first launch), the system font is shown.

To bundle the fonts instead:

1. Download the `.ttf` files and put them in an `assets/fonts/` folder.
2. Add the folder under `flutter: assets:` in `pubspec.yaml`. `google_fonts` picks up bundled files with matching names automatically.
3. Optionally set `allowRuntimeFetching = false` so the app never downloads fonts.

## Text size

`lib/main.dart` respects the phone's font size setting but caps it at 125% (`clamp(maxScaleFactor: 1.25)`) to keep layouts intact. Raise or remove the cap if you test the layouts with larger text.

**Next:** [App Features Tour →](doc:app/features-tour)
