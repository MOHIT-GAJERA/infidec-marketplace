---
title: AI (Google Gemini)
description: Generate product descriptions, SEO text and translations with Google Gemini.
---

**Admin → System Settings → AI** (Super Admin only).

| Field | Notes |
|---|---|
| Gemini API Key | Create one at [aistudio.google.com](https://aistudio.google.com) → *Get API key* |
| Model | `gemini-2.5-flash` (fast, low cost — recommended) or `gemini-2.5-pro` (best quality) |
| Product content generation | Shows **Generate with AI** in the product form (description and SEO) |
| Auto translate | Shows **Translate** on multilingual fields (names, descriptions, pages) |
| Smart search / Recommendations | Reserved switches for upcoming AI features |

## How it works

The panel calls the callable functions `generateProductContent` and `translateFields`. The key is read on the server from `settings/private_ai` and never reaches the browser.

:::tip Restrict the key
In Google Cloud Console → APIs & Services → Credentials, restrict the key to the **Generative Language API**. The Gemini free tier is enough for most catalogues; see [costs](doc:admin/third-party-costs).
:::

Always review generated text before publishing — AI can be wrong about ingredients, sizes or claims.
