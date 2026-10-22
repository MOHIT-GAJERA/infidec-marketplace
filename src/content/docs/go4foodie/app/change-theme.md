---
title: Change Theme
description: Change the brand colours, the light and dark palettes and the fonts of the Go4Foodie mobile app.
---

All colours and fonts are in **`lib/core/theme.dart`**. All three modes (Customer, Restaurant and Owner) share one theme.

![Profile](/docs/go4foodie/images/app-profile.webp "Profile with the Dark mode switch")
![Customer home](/docs/go4foodie/images/app-customer-home.webp "Customer home")

## Brand colours

The brand constants come from the Go4Foodie logo: deep-green ink, cream and orange.

```dart title="lib/core/theme.dart"
static const ink = Color(0xFF0A1C18);          // dark background, text on orange buttons
static const inkSoft = Color(0xFF0F2621);
static const cream = Color(0xFFF7F1E8);        // light text on dark screens
static const goldBrand = Color(0xFFF5761E);    // primary orange: filled buttons, colour seed
static const goldDeep = Color(0xFFE0541A);
static const goldSoft = Color(0xFFFFB067);
static const brandGreen = Color(0xFF0B5E46);
static const brandGreenBright = Color(0xFF2FA57E);
```

**Filled buttons** use `goldBrand` with `ink` text. The Material colour scheme is seeded from `goldBrand`.

## Light and dark palettes

Most screens use the semantic tokens of `AppColors.light` and `AppColors.dark`. Change both:

| Token | Light | Dark | Used for |
|---|---|---|---|
| `bg` | `#F2F6F4` | `#0A1C18` | Screen background |
| `surface` / `surface2` | `#FFFFFF` / `#F5F9F7` | `#0F2621` / `#15312A` | Cards, sheets, input fields |
| `border` | `#DCE7E2` | `#1F3F36` | Card and input borders |
| `fg` / `muted` | `#0D1F1A` / `#6A7F78` | `#F7F1E8` / `#94A9A1` | Text / secondary text |
| `accent` | `#E8640F` | `#F5761E` | Active tab, links, prices, focus ring |
| `accentSoft` | `#FDEDDF` | `#3A2416` | Selected chips, nav indicator |
| `success` / `warn` / `danger` / `info` | `#2E9E57` / `#CF8A1E` / `#D9483F` / `#3B7FE4` | `#4FBD7C` / `#E6A93F` / `#F0766B` / `#6AA5F5` | Status badges, table states, errors |

Check the contrast: `ink` text on your primary colour must stay readable (contrast ratio of at least 4.5:1).

The welcome screen and the onboarding slides always use the dark brand colours (`ink`, `cream`, `goldBrand`), whatever theme the user picked.

## Dark / light mode

The app starts in **dark mode**. Users switch with **Profile → Dark mode**, and the choice is saved on the phone (`themeMode`). To start in light mode instead, change the default in `lib/core/session.dart`:

```dart title="lib/core/session.dart"
final themeModeProvider = StateProvider<ThemeMode>((ref) {
  final v = ref.watch(prefsProvider).getString('themeMode');
  return v == 'dark' ? ThemeMode.dark : ThemeMode.light;   // default light
});
```

## Fonts

The app uses Google Fonts, the same faces as the website and the Admin Panel:

```dart title="lib/core/theme.dart"
final text = GoogleFonts.manropeTextTheme(base.textTheme)   // body text, buttons, chips
...
GoogleFonts.fraunces(fontSize: 22, fontWeight: FontWeight.w600)  // headings, app bar titles, display()
```

Replace `manropeTextTheme` / `GoogleFonts.manrope` and `GoogleFonts.fraunces` with any other Google Font, for example `GoogleFonts.interTextTheme` and `GoogleFonts.playfairDisplay`.

:::tip Bundle the fonts for offline first launch
`google_fonts` downloads the fonts on first use. To ship them inside the app, put the `.ttf` files in `assets/fonts/`, declare them in `pubspec.yaml` and set `GoogleFonts.config.allowRuntimeFetching = false;` in `main()`.
:::

## Shapes

Cards, inputs and dialogs use a 16 px corner radius (`BorderRadius.circular(16)` in `buildTheme`). Buttons and chips use `StadiumBorder()`, and bottom sheets have 24 px top corners.

Hot-restart (`R`) to see your changes.

**Next:** [Customer App →](doc:app/customer)
