---
title: Languages
description: The Customer app's English and Hindi translations in ARB files, how to edit texts and how to add another language.
---

The Customer app uses Flutter's standard localisation (`flutter_localizations` + `intl`) with **ARB** files. It ships **English** and **Hindi**. Customers switch under **Account → Language**; the choice is saved on the device.

| File | Purpose |
|---|---|
| `apps/customer_app/l10n.yaml` | Generator settings: ARB folder `lib/l10n`, template `app_en.arb`, class `AppLocalizations` |
| `lib/l10n/app_en.arb` | English strings (the template) |
| `lib/l10n/app_hi.arb` | Hindi strings |
| `lib/l10n/app_localizations*.dart` | Generated code; do not edit by hand |

## Edit a text

Change the value in **both** ARB files and run the app; code generation runs automatically because `generate: true` is set in `pubspec.yaml`.

```json title="lib/l10n/app_en.arb"
{
  "appName": "Go4Market",
  "applyCoupon": "Apply coupon",
  …
}
```

## Add a language (example: Gujarati)

1. Copy `app_en.arb` to `lib/l10n/app_gu.arb` and translate every value. Keep the keys and placeholders (`{amount}` etc.) unchanged.
2. Run `flutter gen-l10n` (or simply `flutter run`). `AppLocalizations.supportedLocales` now includes `gu`, and `app.dart` already passes `supportedLocales` to `MaterialApp`.
3. Add the option to the language picker on the Account screen (search `lib/screens/profile` for the Hindi option and add yours next to it).
4. Make sure the language exists and is **Active** in **Admin → Settings → Languages**.

:::note Arabic and RTL in the app
Flutter mirrors layouts automatically for RTL locales. If you add Arabic, test screens with custom paddings and icons that indicate direction. The website and panels already ship Arabic with full RTL ([Languages & Translations](doc:admin/languages)).
:::

:::warning Not every text is in the ARB files
A few texts are written directly in Dart (for example the Refer & Earn share message and the force-update dialog). Search `lib/` for English sentences when you translate.
:::

**Next:** [Sign-in: Email, Google & Phone OTP →](doc:app-customer/auth-methods)
