---
title: Gemini AI
description: Choose the AI provider for the "Generate draft with AI" button on the blog form, add a Google Gemini API key, or switch AI off.
---

**Admin → Settings → Gemini AI** (*"AI content generation settings"*) controls the AI helper in the Admin Panel. Today it is used by one button: **Generate draft with AI** on the blog post form (**Forms & Blogs → Blogs → Create/Edit**, see [Blogs & FAQs](doc:admin/blogs)).

![Gemini AI](/docs/classiadshub/images/admin-settings-gemini-ai.jpg "Settings → Gemini AI")

## Fields

Group `ai`.

| Field | Key | Values |
|---|---|---|
| **Provider** | `provider` | **Draft templates (no key)** (`stub`, default), **Google Gemini** (`gemini`), **Disabled** (`disabled`) |
| **Gemini API key** | `gemini_api_key` | Password field. Saved as a **secret**, so it is never returned by the public `GET /config` |

**Save** writes `settings/ai` (*"Settings saved."*).

## Get a Gemini API key

:::steps
### Create the key
Open Google AI Studio (aistudio.google.com) → **Get API key** → **Create API key**, and pick a Google Cloud project (your Firebase project is fine).

### Paste it
Choose **Provider: Google Gemini**, paste the key into **Gemini API key** and click **Save**.

### Test
Open a blog post, type a **Title**, and click **Generate draft with AI**.
:::

## How generation works

The button calls `POST /admin/ai/generate` with `{ prompt: <title>, type: "blog" }` (also accepts `title` and `description` types). The **Forms & Blogs** permission is required.

| Provider | Result |
|---|---|
| **Google Gemini** with a key | The API calls the `gemini-2.0-flash` model (`generateContent`) with the prompt *"Write a blog for a classifieds marketplace: {title}"* and returns the text |
| **Draft templates (no key)**, or Gemini without a key, or an empty Gemini reply | A short template: a heading from the title and a note *"…Add a Gemini API key in Settings → Gemini AI for full generation."* |
| **Disabled** | Error *"AI content generation is disabled."* |

The blog form turns the reply into HTML (`## ` lines become headings, blank-line-separated blocks become paragraphs) and **appends** it to the current body, so nothing you wrote is lost. Review and edit the draft before publishing. If you see *"Enter a title first."*, fill in the title.

:::note Cost and limits
Gemini usage is billed (or rate-limited on the free tier) on the Google account that owns the key. See [Third-Party Service Costs](doc:admin/third-party-costs). Gemini is called from the Cloud Function. The key is only loaded into this admin page (in a password field) and is never sent to website or app visitors.
:::

**Next:** [System Status, Logs & Dummy Data →](doc:admin/system-status)
