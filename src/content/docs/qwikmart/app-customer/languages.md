---
title: Manage Languages
description: The app ships with English, Hindi and Arabic (RTL). Add languages and edit texts from the Admin Panel — no rebuild needed.
---

The Customer App's texts come from two places:

| Source | Where | When to use it |
|---|---|---|
| **Admin Panel** (recommended) | **Admin → Settings → Languages** → stored in Firestore `translations/{code}_customer_app` | Add a language, translate or correct any text — live for every user without a new app release |
| **Built-in files** | `customer_app/assets/l10n/en.json`, `hi.json`, `ar.json` | The default texts compiled into the app (also used in the offline demo) |

A text saved in the Admin Panel **wins** over the built-in file. Any key that has no text in the selected language falls back to **English**.

## Add a language (no rebuild)

:::steps
### Add it in the panel
**Admin → Settings → Languages → Supported Languages List** → pick the language (or **Add Language** with a code such as `mr`) → **Save**. RTL is set automatically for Arabic, Urdu, Persian and Hebrew.

### Translate the app texts
**Edit** the language → **Edit Customer App** → **Copy missing keys from English** → translate the values → **Save Translations**.

### Done
On the next start the app shows the new language in **Profile → Language**. The full guide is in [Languages & Translations](doc:admin/languages).
:::

Only **active** languages from the Admin Panel are listed in the app. If no language has been added in the panel yet, the app offers the three built-in ones. If a user's language is switched off in the panel, the app falls back to the panel's **default** language.

## Change a text

- **Without a release:** open the language in **Admin → Languages → Edit Customer App**, search the key, change the value and save. Users see the change after reopening the app.
- **In the source:** edit the value in `assets/l10n/<code>.json` and hot-restart. Keys must be identical in every file.

Placeholders use braces: `"items_count": "{n} items"`. In code: `context.tr('items_count', {'n': 3})`. Keep placeholders unchanged when translating.

:::tip Keep the Admin key list in sync
The Admin Panel's **Sample** / **Copy missing keys** list for the Customer App is generated from `customer_app/assets/l10n/en.json` when the Admin Panel is built (`admin/scripts/sync-app-strings.mjs`, run automatically by `npm run build`). After you add new keys to `en.json`, rebuild and redeploy the Admin Panel so translators see them.
:::

## Bundle a language in the app (optional)

To ship a language inside the app (for example for the offline demo), copy `en.json` to `assets/l10n/<code>.json`, translate it and register the locale in `lib/core/l10n/app_localizations.dart` (`supportedLocales` and `languages`). This needs a new build.

## How it is loaded

`lib/core/l10n/remote_l10n.dart` reads `languages` (active ones, default first) and `translations/<code>_customer_app` from Firestore at start-up, then rebuilds the app so the texts appear without a restart. Nothing is loaded when `USE_MOCK=true`.

Catalogue content (product names, categories, banners, pages, FAQs) comes from the Admin Panel in the selected language, falling back to English.

**Next:** [About, Policy & Contact Pages →](doc:app-customer/content-pages)
