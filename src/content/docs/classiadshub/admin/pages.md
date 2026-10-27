---
title: CMS Pages
description: Edit the About Us, Terms & Conditions, Privacy Policy, Refund Policy and Contact Us pages from the Settings hub, and see where each page is linked on the website and in the app.
---

The static content pages are edited from the **Settings** hub, not from a separate menu. Open **Admin → Settings** and click one of the page cards:

| Settings card | Subtitle | Page key | Website URL |
|---|---|---|---|
| **About Us** | *About us page content* | `about` | `/page/about` |
| **Terms & Conditions** | *Terms and conditions content* | `terms` | `/page/terms` |
| **Privacy Policy** | *Privacy policy content* | `privacy` | `/page/privacy` |
| **Refund Policy** | *Refund policy content* | `refund` | `/page/refund` |
| **Contact Us** | *Contact details and page* | `contact` | `/page/contact` |

Pages are stored in the Firestore collection `pages`, one document per key. Staff need the **settings** permission.

![About Us page editor](/docs/classiadshub/images/admin-settings-about-us.jpg "Admin → Settings → About Us")

## Edit a page

The editor header shows the card title and *Shown on the website at /page/<key> and in the apps*.

:::steps
### Open the card
**Admin → Settings**, then type *policy* or *about* in **Search settings** if needed, and click the card (for example **Privacy Policy**).

### Change the title
**Title** is the heading shown on the page and the browser tab title on the website.

### Write the content
**Content** uses the rich-text editor: *Paragraph / Heading 1 / Heading 2 / Heading 3*, undo, redo, **B**, *I*, U, bullet and numbered lists, clear formatting, insert link, and the `</>` HTML source view. The word count is shown under the editor.

### Save
Click **Save**. The toast says *"Page saved."* The first save of a key creates the document (`POST /api/v1/admin/crud/pages`); later saves update it (`PUT /api/v1/admin/crud/pages/{id}`). Every save sets `is_published: true`.
:::

![Privacy Policy](/docs/classiadshub/images/admin-settings-privacy.jpg "Privacy Policy")
![Terms & Conditions](/docs/classiadshub/images/admin-settings-terms.jpg "Terms & Conditions")
![Refund Policy](/docs/classiadshub/images/admin-settings-refund.jpg "Refund Policy")
![Contact Us](/docs/classiadshub/images/admin-settings-contact-us.jpg "Contact Us")

## Where the pages appear

| Client | Links |
|---|---|
| Website footer | **Quick Links**: *About Us* (`/page/about`), *Contact Us* (`/page/contact`), *FAQs* (`/page/faq`). Bottom bar: *Privacy Policy*, *Terms & Conditions* |
| App **Profile** menu | *FAQs*, *Contact us*, *About us*, *Terms & Conditions*, *Privacy Policy*, *Refund Policy* |

Both load a page with `GET /api/v1/pages/<key>`:

```json title="GET /api/v1/pages/about"
{
  "success": true,
  "data": { "id": 1, "key": "about", "title": "About Us", "body": "<p>…</p>", "is_published": true, "updated_at": "…" },
  "message": "Page."
}
```

- The website page `/page/<key>` renders the body as HTML (headings, paragraphs, lists, links, bold and italic are styled). Plain text without tags is shown with its line breaks.
- The app renders the same HTML in its page screen. When the page cannot be loaded it shows a short sample text instead.
- An unknown or unpublished key returns 404; the website shows *Page not found*.
- `GET /api/v1/pages` lists all published pages (key, title, updated date).

:::tip Store-listing URLs
Google Play and the App Store need a public privacy policy URL. Use `https://www.yourcompany.com/page/privacy` once the website is deployed. Account deletion instructions can live in the privacy or terms page as well (see [Profile, Verification & Account Deletion](doc:app/profile)).
:::

## Contact Us

The **Contact Us** card edits only the **content** of `/page/contact` (for example your address, opening hours and a map link). The phone numbers, email and address shown elsewhere come from **Settings → Settings → Company Details** (see [General, Web & SEO](doc:admin/settings)).

The API also has a public contact form endpoint, `POST /api/v1/contact` (name, email, subject, message), which saves messages in `user_queries` for **Customers & Roles → User Queries**. The bundled `/page/contact` page shows the CMS content only and has no form.

## Pages without a settings card

The website and the app link **FAQs** to `/page/faq`, but there is no **FAQ** card in the Settings hub (the **Forms & Blogs → FAQs** list is separate, see [Blogs & FAQs](doc:admin/blogs#faqs)). Until a `faq` page exists, the website shows *Page not found* and the app shows its sample text. Create it once through the API with an admin token:

```bash title="Create the faq page"
curl -X POST "https://www.yourcompany.com/api/v1/admin/crud/pages" \
  -H "Authorization: Bearer YOUR_ADMIN_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"faq","title":"FAQs","body":"<h2>How do I post an ad?</h2><p>…</p>","is_published":true}'
```

After that you can edit it with `PUT /api/v1/admin/crud/pages/{id}`, or add a card for it in `admin/src/lib/settings-config.ts`:

```ts title="admin/src/lib/settings-config.ts"
{ slug: "faq", title: "FAQs", subtitle: "FAQ page content", icon: "info", kind: "page", pageKey: "faq" },
```

The same pattern works for any other page key you want to link from your own menus.

**Next:** [Chats & Chat Templates →](doc:admin/chat)
