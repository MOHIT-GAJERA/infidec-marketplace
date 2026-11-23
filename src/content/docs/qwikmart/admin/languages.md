---
title: Languages & Translations
description: Add languages and translate every text of the website, Customer App and Delivery Boy App from the Admin Panel — no app rebuild needed.
---

QwikMart is multilingual. You manage languages and their texts in **Admin → Settings → Languages** (sidebar). The website, the Customer App and the Delivery Boy App read them from Firestore when they start, so a new language or a corrected text reaches users **without rebuilding or re-publishing the apps**.

Out of the box the website and both apps contain **English**, **Hindi** and **Arabic (RTL)** texts. You can add any other language from the built-in list of 36 languages (or any valid code such as `pt-br`).

## How it works

| Firestore document | Contents | Used for |
|---|---|---|
| `languages/{code}` | `name`, `is_rtl`, `is_default`, `status` (`active` / `inactive`) | The language pickers and text direction in the website and apps |
| `translations/{code}_website` | `data: { key: text }` | Website texts |
| `translations/{code}_customer_app` | `data: { key: text }` | Customer App texts |
| `translations/{code}_delivery_app` | `data: { key: text }` | Delivery Boy App texts |

Both collections are publicly readable and can only be written by staff with the **Languages** permission (see `firestore.rules`).

When a text is shown, QwikMart uses, in order:

1. The text saved in the Admin Panel for the selected language.
2. The text built into the app/website for that language (English, Hindi, Arabic).
3. The **English** text.

So an empty or missing key never shows a blank — it falls back to English.

:::note Catalogue content is separate
Product names, categories, banners, pages, FAQs and promo-code texts are entered **per language** on their own edit screens (or filled with **Generate with AI** — see [AI (Google Gemini)](doc:admin/ai-settings)). The Languages screen only controls the **interface** texts (buttons, labels, messages).
:::

## Add a language

:::steps
### Open Languages
**Admin → Settings → Languages** in the sidebar.

### Pick the language
Click **Supported Languages List** and choose a language — the name, code and RTL setting are filled in for you (Arabic, Urdu, Persian and Hebrew are set to right-to-left). Or click **Add Language** and type a name and a code (`fr`, `pt-br`, …).

### Save as Active
Leave **Active** on and click **Save**. The language now appears in the language picker of the website and both apps.

### Translate the texts
Click **Edit** on the language and open **Edit Website**, **Edit Customer App** or **Edit Delivery Boy App** (see below). Until you translate a text, English is shown.
:::

## Translate the texts

The translation editor opens one platform for one language. The tabs at the top switch between **Customer App**, **Rider App**, **Website** and **Admin Panel**.

| Tool | What it does |
|---|---|
| **Key / Value** view | One row per text. Search by key or text, tick **Only empty** to see what is still missing, **Add key** for a new key |
| **JSON** view | Edit all texts as JSON; **Format** and **Validate** check the syntax |
| **Copy missing keys from English** | Adds every key that this language does not have yet, with the English text — then translate them one by one |
| **Import JSON / Export JSON** | Translate offline (or with a translation agency) and upload the file back |
| **Sample** | Downloads the complete English key list of the platform |
| **Save Translations** | Writes `translations/{code}_{platform}`. Users get the new texts the next time they open the app or reload the website |

Placeholders in braces must stay as they are, for example `"items_count": "{n} items"` → `"{n} artikelen"`.

:::tip Sample files
The **Download Sample Files** bar on the Languages list gives the English key list of each platform. The key lists are generated from the real app and website texts every time the Admin Panel is built (`npm run build` runs `scripts/sync-web-strings.mjs` and `scripts/sync-app-strings.mjs`), so they always match the code you deploy.
:::

:::note Admin Panel tab
The **Admin Panel** tab stores a starter set of keys for your own customisation. The Admin, Store and Delivery Boy **web panels** themselves are shown in English.
:::

## Default language, deactivate and delete

- **Edit → Set as a default language** makes it the language new visitors and app users start with. There is always exactly one default language; it cannot be deactivated or deleted.
- **Deactivate** hides a language from all pickers. Users who had chosen it are switched to the default language.
- **Delete** removes the language **and** all its translations (all platforms). This cannot be undone — export the JSON first if you may need it again.

## Where users switch language

| Where | How |
|---|---|
| Website | Language selector in the top bar and on the **Profile** page |
| Customer App | **Profile → Language** |
| Delivery Boy App | **Profile → Language** |

Right-to-left languages flip the layout automatically. The user's choice is remembered on the device.

## Permissions

The Languages screen needs the `language.list`, `language.create`, `language.update` and `language.delete` permissions — see [Staff, Roles & Permissions](doc:admin/roles-permissions).

## Troubleshooting

| Problem | Fix |
|---|---|
| A new language does not appear in the app | Check that it is **Active**. The app reads the list at start-up — close and reopen it |
| A text still shows in English | The key is empty or missing for that language — open the editor, tick **Only empty**, fill it and save |
| A text I changed does not update | Translations are loaded once per app start / page load — restart the app or reload the page |
| The offline demo ignores my translations | With `USE_MOCK=true` (apps) or `NEXT_PUBLIC_USE_MOCK=true` (website) nothing is loaded from Firestore; only the built-in English, Hindi and Arabic texts are used |

**Next:** [Wallet, Referral & Delivery →](doc:admin/wallet-referral-delivery)
