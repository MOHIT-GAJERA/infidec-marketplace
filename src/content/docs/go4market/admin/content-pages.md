---
title: Blogs, FAQs & Pages
description: Manage the blog and its categories, FAQs, and the legal and policy pages (about, terms, privacy, refund, shipping, cancellation, seller and delivery policies).
---

Content is written in **Markdown** in the Admin panel and rendered by the website and apps.

## Blogs

- **Content → Blog categories** (`/content/blog-categories`): name and slug.
- **Content → Blogs** (`/content/blogs`): title, slug, excerpt, cover image (1200 × 630), category, tags, Markdown body, author, **published** flag and date.

Published posts appear at `/blog` and `/blog/<slug>` on the website and are listed in the XML sitemap.

## FAQs

**Content → FAQs** (`/content/faqs`): question, answer, **category** (for example *Orders*, *Payments*, *Membership*), order and active flag. They appear on the website at `/faq` and in the app's Help screens. Use the category to group FAQs, such as subscription FAQs.

## Pages & policies

**Content → Pages & policies** (`/content/pages`) edits documents in `pages/{slug}`:

| Slug | Shown at | Purpose |
|---|---|---|
| `about` | `/page/about` | About your marketplace |
| `terms` | `/page/terms` | Terms of use |
| `privacy` | `/page/privacy` | Privacy policy, also required by Google Play |
| `refund` | `/page/refund` | Refund policy |
| `shipping` | `/page/shipping` | Shipping and delivery policy |
| `cancellation` | `/page/cancellation` | Cancellation policy |
| `seller-policy` | Seller registration | Terms every seller must accept (`policiesAccepted: true`) |
| `delivery-policy` | Delivery registration | Terms for delivery partners |

The seller and delivery policies can also be edited from **Sellers → Seller policies** and **Delivery → Partner policies**.

:::warning Review the legal pages before launch
The seeded pages are templates that mention Go4Market and a sample address. Replace them with text that fits your business and jurisdiction. Your Play Store privacy policy URL is `https://<your-domain>/page/privacy`.
:::

**Next:** [Payment Gateways →](doc:admin/payment-gateways)
