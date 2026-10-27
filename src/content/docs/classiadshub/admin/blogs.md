---
title: Blogs & FAQs
description: Write and publish blog posts with a cover image, category, tags, SEO fields and an AI draft helper, manage blog categories, and maintain the FAQ list.
---

The **Admin → Forms & Blogs** menu has three pages:

| Menu item | Page title | Firestore collection |
|---|---|---|
| **Blogs** | *Blogs* | `blog_posts` (cover images in Storage `blog/`) |
| **Blog Category** | *Blog Category* | `blog_categories` |
| **FAQs** | *FAQ* | `faqs` |

Staff need the **blogs** permission for all three.

## Blogs

![Blogs](/docs/classiadshub/images/admin-blogs.jpg "Admin → Forms & Blogs → Blogs")

The list shows posts newest first. Filter by **Category** and search by title.

| Column | Shows |
|---|---|
| **Title** | Post title |
| **Category** | Blog category name |
| **Slug** | URL part: the post is at `/blog/<slug>` on the website |
| **Description** | The excerpt |
| **Image** | Cover image |
| **Tags** | Comma-separated tags |
| **Views** | Times the post was opened on the website or the app |
| **Useful** / **Not Useful** | Feedback counters (`POST /api/v1/blog/{id}/feedback`) |
| **Status** | *Published* or *Draft* |
| **Date** | Publish date (or creation date for drafts) |
| **Action** | **Edit**, **Delete** |

**Delete** asks *Delete "<title>"?* and removes the post and its cover image.

### Add or edit a post

Click **Add Blog** (page **Create Blogs**) or the edit icon (**Edit Blog**).

![Blog form](/docs/classiadshub/images/admin-blog-form.jpg "Edit Blog")

| Field | Notes |
|---|---|
| Language tabs | **English** plus every active language. Title, description, tags and the three meta fields can be translated |
| **Title** | Required, up to 191 characters |
| **Slug** | Optional. Generated from the title when empty. If the slug is already used, a random 4-character suffix is added |
| **Image** | The cover image (JPG, PNG, WebP, GIF or SVG up to 5 MB). Marked required for new posts |
| **Category** | A blog category |
| **Tags** | Type a tag and press Enter |
| **Status** | *Published* (default) or *Draft* |
| **Description** | The post body, written in the rich-text editor: *Paragraph / Heading 1–3*, undo, redo, bold, italic, underline, lists, clear formatting, link, and an HTML source view (`</>`) |
| **Generate draft with AI** | Sends the title to `POST /api/v1/admin/ai/generate` and appends the returned draft to the body |
| **SEO Details** | **Meta Title**, **Meta Description**, **Meta Keywords** and **Schema (JSON-LD)** |

Click **Submit** (or **Update**). The API is `POST` / `PUT /api/v1/admin/blog` (multipart). On save:

- The **excerpt** (the *Description* column and the list text on the website) is built automatically from the first 200 characters of the body text.
- `published_at` is set the first time a post is saved as *Published*.
- Your account is stored as the author (shown as *By <name>* on the website).

:::tip AI drafts
With **Settings → Gemini AI → Provider** set to *Google Gemini* and an API key, the button writes a real draft. With *Draft templates (no key)* it inserts a short placeholder paragraph; with *Disabled* it shows an error. See [Gemini AI](doc:admin/ai-settings).
:::

### Where posts appear

| Place | What is shown |
|---|---|
| Website `/blog` | Published posts, newest first, with cover, category and excerpt (12 per page) |
| Website `/blog/<slug>` | Title, author, publish time, cover image and the full HTML body |
| App **Profile → Blog** | The same list and detail screens |

Only posts with status `published` are public. Drafts are visible in the Admin Panel only.

:::note What the clients do not use yet
The meta fields are returned by `GET /api/v1/blog/<slug>`, but the bundled website sets only the page title from the post title, and the JSON-LD schema is stored without being output. Translations are saved in `translations` while the public API returns the English text. The **Useful / Not Useful** feedback endpoint exists in the API; the bundled clients do not show these buttons.
:::

## Blog Category

![Blog categories](/docs/classiadshub/images/admin-blog-categories.jpg "Admin → Forms & Blogs → Blog Category")

A simple list with **Name**, **Slug**, **Active** toggle and **Action**. **Add Blog Category** opens a dialog:

| Field | Notes |
|---|---|
| **Name** | Required, translatable |
| **Slug** | *Generated from the name when empty*. Must be unique |
| **Sort order** | Lower comes first |

Active categories are public at `GET /api/v1/blog/categories` with the number of published posts in each. Posts can be filtered with `GET /api/v1/blog?category=<slug>`.

## FAQs

![FAQs](/docs/classiadshub/images/admin-faqs.jpg "Admin → Forms & Blogs → FAQs")

The list shows **Questions**, **Answers**, an **Active** toggle and **Action**. Drag rows to change the order. **Create FAQ** opens a dialog with **Question** (required, up to 500 characters) and **Answer** (required, up to 5000 characters), both translatable.

Active FAQs are public at `GET /api/v1/faqs` (`id`, `question`, `answer`, in display order).

:::warning The FAQs link on the website and in the app
The website footer (**Quick Links → FAQs**) and the app (**Profile → FAQs**) open the CMS page **`/page/faq`**, which loads the page with key `faq` from the `pages` collection. They do not read the FAQ list above. Either create a `faq` page (see [CMS Pages](doc:admin/pages#pages-without-a-settings-card)) or change those links to a screen that reads `/faqs`.
:::

**Next:** [CMS Pages →](doc:admin/pages)
