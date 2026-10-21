---
title: Configuration & Theming
description: What you control from the Admin Panel and what you change in code — colours, logo, texts, SEO.
---

## Managed in the Admin Panel (no deployment needed)

| Website element | Admin Panel |
|---|---|
| Home page sections per zone (Quick / eCommerce) | Home Builder |
| Categories, products, brands, prices, stock | Catalogue |
| Zones shown in the location popup, delivery time & fees | Zones |
| Footer contact details, company name, social icons | System Settings → General |
| "Get it on Google Play / App Store" badges | System Settings → App → store URLs |
| Payment methods at checkout | System Settings → Payment Gateways |
| About, Privacy, Terms, Refund, Delete Account pages | Pages |
| Blog, FAQ | Blog, FAQs |
| Cookie banner on/off | System Settings → General → Cookie consent |
| Maintenance notice | System Settings → Maintenance |

## Changed in code (requires a new deployment)

### Brand colours

The primary colour is defined in the Tailwind config and CSS tokens:

```js title="web/tailwind.config.ts (excerpt)"
colors: {
  primary: { DEFAULT: '#0E9623', dark: '#0B7A1C', 50: '#E6F4E9', 100: '#CCE9D2' },
},
```

### Logo, favicon, share image

Replace the files in `public/` (logo) and `src/app/` (`icon.png`, `apple-icon.png`, `favicon.ico`, `opengraph-image.png`, `twitter-image.png`), keeping names and sizes.

### Texts

UI strings for English, Arabic and Hindi are in `src/lib/i18n.ts`. The site is **light mode only**.

### SEO

Page titles and descriptions come from the product/category/page data (SEO fields in the Admin Panel). Set `NEXT_PUBLIC_SITE_URL` to your domain so canonical URLs and share images are correct.

**Next:** [Deployment Guide →](doc:web/deployment)
