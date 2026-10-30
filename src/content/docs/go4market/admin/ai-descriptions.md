---
title: AI Descriptions (Gemini)
description: Generate short and long product descriptions with Google Gemini from the product editor, or fall back to a built-in template.
---

The product editor in the Admin and Seller panels has a **Generate with AI** button. It calls the `generateDescription` callable with the product name, category and keywords, and fills in the **short** and **long** description.

| Mode | When | Result |
|---|---|---|
| **Gemini** | `GEMINI_API_KEY` is set in `functions/.env` | Gemini 2.5 Flash writes a short and a long description (`source: gemini`) |
| **Template** | No key | A structured description built from the name, category and keywords (`source: template`) |

## Enable Gemini

1. Create an API key at [aistudio.google.com](https://aistudio.google.com) → **Get API key**.
2. Add it to `functions/.env`:

```bash title="functions/.env"
GEMINI_API_KEY=<your-gemini-api-key>
```

3. Redeploy: `firebase deploy --only functions:generateDescription,functions:getSystemStatus --project <your-project-id>`.
4. **Admin → System health** now shows Gemini as configured.

## Use it

1. Open **Catalogue → Add product** (or edit one).
2. Enter the name and category, and optionally some keywords (for example *organic, cold-pressed, 1 litre*).
3. Click **Generate with AI**, review the text, edit if needed and save.

:::warning Always review AI text
Check facts such as ingredients, dosage (pharmacy) and warranty before publishing. The model only knows what you give it.
:::

**Next:** [Languages & Translations →](doc:admin/languages)
