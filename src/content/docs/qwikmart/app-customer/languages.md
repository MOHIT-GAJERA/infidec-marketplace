---
title: Manage Languages
description: The app ships with English, Hindi and Arabic (RTL). Edit texts or add a language.
---

App texts live in JSON files — one per language, with identical keys:

```text
customer_app/assets/l10n/en.json
customer_app/assets/l10n/hi.json
customer_app/assets/l10n/ar.json     (right-to-left)
```

Placeholders use braces: `"items_count": "{n} items"`. In code: `context.tr('items_count', {'n': 3})`.

## Change a text

Edit the value in each JSON file, then hot-restart.

## Add a language

:::steps
### Create the file
Copy `en.json` to e.g. `assets/l10n/mr.json` and translate every value (keep the keys).

### Register it
In `lib/core/l10n/app_localizations.dart` add the locale and its display name:

```dart
static const supportedLocales = [Locale('en'), Locale('ar'), Locale('hi'), Locale('mr')];
static const languages = <String, String>{'en': 'English', 'ar': 'العربية', 'hi': 'हिन्दी', 'mr': 'मराठी'};
```

### Add it in the panel
**Admin → Languages → Add** (code `mr`, RTL off). Product names, categories and pages can then be entered (or AI-translated) in that language.
:::

Customers switch language in **Profile → Language**. Catalogue content (product names, categories, banners, pages) comes from the Admin Panel in the selected language, falling back to English.

**Next:** [About, Policy & Contact Pages →](doc:app-customer/content-pages)
