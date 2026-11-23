---
title: SEO & Sharing
description: Set the Online Store page title and meta description, understand what search engines and social networks see for a Flutter Web store, and share your booking page link.
---

The **SEO** section controls how your booking page is named in search results and browser tabs. This page also covers the ways to share the store and what to expect from search engines.

## Search engine listing

**Online store → SEO** (`/online-store/seo`, saved as `settings.seo`).

| Field | Limit | Default |
|---|---|---|
| **Page title** | 60 characters | The company name entered when the workspace was created |
| **Meta description** | 160 characters | Empty |

A **Search preview** card shows a Google-style result: a favicon letter, the title, the store URL and the description, updating as you type. Click **Save** to store the values and mirror them to `publicStores/<slug>` as `seoTitle` and `seoDescription`.

## Where the values are used

| Value | Where it appears |
|---|---|
| Page title (`seoTitle`) | The browser tab title of the store home page. Falls back to the store name if empty |
| Product pages | The tab title becomes "<product> · <store name>" |
| Meta description (`seoDescription`) | Saved in the public store document |

:::warning Flutter Web and search engines
The Online Store is part of a Flutter Web single-page app. The tab title is set by JavaScript after the store loads (`Browser.setTitle`), and the HTML that search engines and social networks first receive is the platform's `web/index.html`. That file has the fixed `<title>`, `description` and Open Graph (`og:title`, `og:description`, `og:image`) tags for Booqora itself. As a result:

- link previews on WhatsApp, Facebook, LinkedIn or Slack show the **platform's** title, description and icon, not your store's;
- the store's meta description is not inserted into the page in the current code;
- search engines that render JavaScript may pick up the store title, but rankings for the store are limited.

For better results, put the store on your own website with the [embed code](doc:store/website#website-integration) and handle SEO there, or edit the tags in `booqora_platform/web/index.html` before you build (they apply to the whole platform).
:::

## Sharing the store

Your store link is:

```text
https://<your-platform-domain>/s/<workspace-slug>
```

Ways to get and share it:

- **Online store → Overview**: the Booking page card shows the URL with a copy button.
- **Online store → Booking page**: the **Share your booking page** card has **Copy link** and **Open**, with the tip "Add it to your Instagram bio, WhatsApp status, Google Business profile or email signature."
- **View online store** in the header of every Online store section opens the live store.
- **Website integration**: an iframe embed and a styled **Book now** button for WordPress, Shopify, Squarespace or any site ([Website & Branding](doc:store/website#website-integration)).
- **Product links**: each product has its own URL, `/s/<workspace-slug>/p/<product-id>`, which you can copy from the browser and share directly.

:::tip Use your own domain
Connect a custom domain to the platform's Hosting site in the Firebase console so your store link reads, for example, `https://book.yourcompany.com/s/<slug>`. Then add that domain to `ALLOWED_RETURN` in `functions/index.js` so Stripe and PayPal can return to it ([Online Store Payments](doc:store/payments)).
:::

## Checklist before you share

- [ ] Products marked **Show in store** and priced ([Products](doc:admin/products))
- [ ] Logo uploaded and company email and phone set ([Settings](doc:admin/settings))
- [ ] Brand colour, hero text and announcement set ([Website & Branding](doc:store/website), [Online Store Overview](doc:store/overview))
- [ ] Checkout payment mode and terms decided ([Checkout & Fulfillment](doc:store/checkout))
- [ ] SMTP configured so customers receive the booking email ([Email & SMTP](doc:admin/email-smtp))
- [ ] A test booking placed from a private browser window

**Next:** [App Prerequisites →](doc:app/prerequisites)
