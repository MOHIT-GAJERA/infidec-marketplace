---
title: Languages & Currency
description: Add languages (with RTL and a default), edit translation strings, understand how translated content is stored, and choose the default currency.
---

Two settings pages: **Languages** and **Default Currency Settings** (cards in **Admin → Settings**). Currencies themselves are created in [Location → Currencies](doc:admin/locations#currencies).

## Languages

*"Manage languages and translations"*. Data: the `languages` collection.

![Languages](/docs/classiadshub/images/admin-settings-languages.jpg "Settings → Languages")

| Column | Shows |
|---|---|
| **Name** | Language name, with a **Default** badge |
| **Code** | e.g. `en`, `ar`, `hi` |
| **RTL** | Yes / No |
| **Active** | Toggle |
| **Action** | **Strings**, Edit, Delete |

**Create Language** fields:

| Field | Notes |
|---|---|
| **Name** | Required, e.g. *Arabic* |
| **Code** | Required, unique, max 8 characters, e.g. `ar` |
| **Right-to-left** | For Arabic, Hebrew, Urdu, Persian |
| **Default language** | Turning it on clears the flag on all other languages |

Active languages are returned by the public `GET /languages`. The website header and the app's **Language** screen list them (the app shows the code and *RTL*). The user's choice is saved as their `preferred_language`.

### Translation strings

Click **Strings** on a language to open **Translations — {language}**. Each row shows the key, the English text (from the `en` strings) and an input for this language.

- **Filter keys…** narrows the list.
- Type a new key (e.g. `home.title`) and click **Add key** to add one.
- **Save** replaces the whole string map of this language in `translations/{code}` (*"Translations saved."*). The dialog waits until the existing strings are loaded, so a save never wipes them.

The public endpoint `GET /translations/{code}` returns the default language's strings merged with this language's strings, plus `fallback` (the default code).

:::note What the clients use today
The shipped website and Flutter app have their interface text built in (English). They list the languages and save the user's choice, but they do not download `GET /translations/{code}` yet. To translate the interface, load these strings in the clients, or translate the built-in text in the source.
:::

### Translated content

When **two or more** languages are active, the Admin Panel shows language tabs on the forms that support translation, such as categories, custom fields, [packages](doc:admin/packages#translations), countries, states, FAQs, report reasons, tips, verification fields, blog categories and featured sections. On a non-English tab you fill in only the translatable fields (name, description…). They are saved in the record's `translations` map, e.g.:

```json title="Firestore: categories/12"
{
  "name": "Mobiles",
  "translations": { "ar": { "name": "هواتف" } }
}
```

The public API currently returns the base (English) fields only. The `translations` map is stored in Firestore, ready for when you add localized output to the API or clients.

:::tip Default Language field
**System Settings → Default Language** (`general.default_language`) is a separate setting for the clients. The fallback for `GET /translations` comes from the language marked **Default** here. Keep both the same.
:::

## Default Currency

Card **Default Currency Settings**, *"Default currency configuration"*.

![Default Currency Settings](/docs/classiadshub/images/admin-settings-currency.jpg "Settings → Default Currency Settings")

One field: **Default currency** (*"Used for new ads, packages and price display"*), listing every currency as `USD — US Dollar`. Click **Save**:

1. `general.default_currency` is set. New ads posted without a currency get this code.
2. That currency gets the **Default** flag in [Currencies](doc:admin/locations#currencies) (others lose it).

*"Default currency saved."* Existing ads, packages and plans keep their own currency; nothing is converted. New packages start with `USD` in the form; pick your currency there.

**Next:** [Login, OTP & Notification Settings →](doc:admin/otp-notifications)
