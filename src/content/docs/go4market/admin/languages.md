---
title: Languages & Translations
description: English, Hindi, Gujarati and Arabic (RTL) on the website and panels, how the language list and translation overrides work, and how to add a language.
---

## What is translated where

| Client | Languages | RTL | Where the strings live |
|---|---|---|---|
| **Website** | English, हिन्दी, ગુજરાતી, العربية | Yes, full RTL for Arabic | `apps/website/lib/l10n/s_*.dart` |
| **Admin, Seller, Delivery panels** | English, हिन्दी, ગુજરાતી, العربية | Yes, full RTL for Arabic | `apps/panel/lib/l10n/dict*.dart` |
| **Customer app** | English, हिन्दी | – | `apps/customer_app/lib/l10n/app_en.arb`, `app_hi.arb` |
| **Partner app** | English, हिन्दी | – | `apps/partner_app/lib/core/l10n.dart` |

![Admin dashboard in Hindi](/docs/go4market/images/admin-dashboard-hi.webp "The Admin dashboard in Hindi")
![Admin dashboard in Arabic, right-to-left](/docs/go4market/images/admin-dashboard-ar.webp "The Admin dashboard in Arabic with the full right-to-left layout")
![Orders in Arabic](/docs/go4market/images/admin-orders-ar.webp "All orders in Arabic: filters, table and pagination mirrored")

## The language list

**Admin → Settings → Languages** (`/settings/languages`) manages `languages/{code}`:

| Field | Notes |
|---|---|
| Language code | ISO code such as `en`, `hi`, `gu`, `ar` (fixed after creation) |
| Name (English), Native name | Shown in the language pickers |
| Right-to-left (RTL) | For Arabic, Urdu, Hebrew… |
| Default language | Only one at a time; **Make default** switches it |
| Active (`active` on the document) | Only languages with `active: true` are offered; the seeded four are active |

The pickers in the website top bar, the panels' top bar and the panels' login screen list the **active** languages that the client also has built-in strings for. The choice is remembered in the browser (`g4m.lang`) and on the user's profile (`users/{uid}.lang`).

## Runtime overrides (developer hook)

The website listens to the Firestore document `translations/{code}` and keeps its `strings` map in memory. The helper `L.k(key, en, hi, gu, ar)` in `apps/website/lib/l10n/l10n.dart` returns the admin override for `key` when one exists, otherwise the built-in translation.

```json title="translations/hi"
{
  "strings": {
    "cart.title": "मेरी टोकरी"
  }
}
```

:::warning Overrides are opt-in per string
In v1.0 the shipped website strings use `tr()`, not `k()`, so an override has no visible effect until a developer switches the strings you want editable to `k()` with a stable key. The panels and apps do not read overrides.
:::

The row action **Upload translations JSON** stores a file in Storage at `i18n/<code>.json` and links it on the language document (`translationsUrl`). No client loads that file automatically; use it as an archive for translators, or load it in your own code.

## Add a new language (developer)

1. **Website**: add the code to `kSupportedLangs` (and `kRtlLangs` if RTL) in `apps/website/lib/l10n/l10n.dart`, then add the translation for every getter in the `s_*.dart` files. A missing translation is a compile error, so nothing is left in English by accident.
2. **Panels**: add the language to `apps/panel/lib/l10n/l10n.dart` and add a column to the `dict*.dart` maps (each English key maps to `[hi, gu, ar]`). Missing keys fall back to English.
3. **Customer app**: add `lib/l10n/app_<code>.arb` and run `flutter gen-l10n` (runs automatically on build).
4. **Partner app**: extend the `tr()` helper in `lib/core/l10n.dart`.
5. Create the language in **Settings → Languages** and set it **Active**.

:::tip Numbers and charts in Arabic
Prices keep the ₹ symbol and Latin digits in Arabic, and charts stay left-to-right so time axes read naturally.
:::

**Next:** [SEO, Sitemap & Social Links →](doc:admin/seo-social)
