---
title: Languages & RTL
description: How the website's English, Hindi, Gujarati and Arabic translations work, how RTL is applied, and how to edit or add strings.
---

The website ships four languages: **English** (default), **हिन्दी**, **ગુજરાતી** and **العربية** with a full right-to-left layout. Visitors switch in the header; the choice is saved in the browser and, for signed-in users, on their profile (`users/{uid}.lang`).

![Website in Hindi](/docs/go4market/images/web-login-hi.webp "The sign-in page in Hindi")
![Website in Arabic](/docs/go4market/images/web-home-ar.webp "The home page in Arabic, laid out right to left")

## How strings are organised

Strings live in typed classes, one file per area, in `apps/website/lib/l10n/`:

```text
s_account.dart  s_auth.dart  s_cart.dart  s_catalog.dart  s_common.dart
s_content.dart  s_home.dart  s_orders.dart  s_product.dart
```

Each getter carries all four translations inline:

```dart title="lib/l10n/s_cart.dart (pattern)"
String get title => _t('Your cart', 'आपका कार्ट', 'તમારું કાર્ટ', 'سلتك');   // _t = l.tr(en, hi, gu, ar)
```

Use them in widgets as `context.l.cart.title`. Because every translation is a required argument, a **missing translation is a compile error**, so nothing silently stays in English.

## RTL

When the active language is in `kRtlLangs` (Arabic), the app:

- wraps the UI in a right-to-left `Directionality`, mirroring layouts, icons and paddings;
- sets `<html lang="ar" dir="rtl">` and the `og:locale` meta tag;
- keeps prices with ₹ and Latin digits.

## Which languages appear

The picker shows languages that are both in `kSupportedLangs` **and** active in **Admin → Settings → Languages** (`languages/{code}.active`). Deactivate a language there to hide it without a rebuild.

## Add a language

1. Add the code to `kSupportedLangs` (and to `kRtlLangs` if it is RTL) and its names to `kLangNative` / `kLangEnglish` in `l10n.dart`.
2. Add a parameter for the language to `tr()` and fill in every getter in the `s_*.dart` files. The compiler lists every getter you have missed.
3. Create the language in the Admin panel and set it active.

See also [Languages & Translations](doc:admin/languages) for the panels and apps.

**Next:** [Checkout & Payment Return →](doc:web/payments)
