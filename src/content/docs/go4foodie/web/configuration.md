---
title: Configuration & Theming
description: What the Admin Panel and the backend control, what you change in the website code, and the environment of the App Hosting backend.
---

## Managed in the Admin Panel (no deployment needed)

| Website element | Admin Panel |
|---|---|
| Menu items, prices, descriptions, ratings, tags, images | [Menu](doc:admin/menu) |
| Which items and categories are shown | Menu → item **Available** switch, **category on/off** |
| Tables that accept QR orders, their QR codes | [Tables](doc:admin/tables) (status **Active** / **Inactive**) |
| Reservations you confirm, seat or complete | [Reservations](doc:admin/reservations) |
| Gift card and coupon status | [Gift Cards](doc:admin/gift-cards) |

## Configured on the backend (redeploy the function)

| Setting | Where | Effect on the website |
|---|---|---|
| Payment gateways | Secrets `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_SECRET` + `RAZORPAY_KEY_ID`, `STRIPE_PUBLISHABLE_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_ENV` and the currencies | Which buttons the payment chooser shows ([Payments](doc:web/payments)) |
| `LOCAL_TZ` | `functions/.env.<project-id>` | Timezone used for "today", pickup slots and the 30-minute cut-off |
| `WEBSITE_URL` | `functions/.env.<project-id>` | Base URL encoded in the table QR codes (`<WEBSITE_URL>/order?table=<code>`) |
| `MAIL_*` | `functions/.env.<project-id>` + secret `MAIL_PASSWORD` | Confirmation emails for orders, bookings and gift cards ([SMTP](doc:admin/smtp-settings)) |

See [Environment Configuration](doc:installation/environment-configuration).

## Website environment

| Variable | Availability | Use |
|---|---|---|
| `ADMIN_API_URL` | Runtime | Backend API host. All server fetches and the `/api/*` proxies use it |
| `NEXT_PUBLIC_SITE_URL` | Build + runtime | `metadataBase`, canonical URL, Open Graph / Twitter image (`/og-image.png`), JSON-LD, sitemap, robots |

On App Hosting they are set in `apphosting.yaml`:

```yaml title="website/apphosting.yaml"
runConfig:
  minInstances: 0        # 1 removes cold starts (small idle cost)
  maxInstances: 4
  cpu: 1
  memoryMiB: 512

env:
  # Backend API (Cloud Function behind Firebase Hosting) — same /api/* paths as the old admin.
  - variable: ADMIN_API_URL
    value: https://yourrestaurant-1a2b3.web.app
    availability: [RUNTIME]
  # Public site origin (sitemap, canonical URLs, metadata). Change when the custom domain is connected.
  - variable: NEXT_PUBLIC_SITE_URL
    value: https://www.yourrestaurant.com
    availability: [BUILD, RUNTIME]
```

The file in the source points to our demo hosts. **Replace both values** before your first deploy.

## Changed in code (requires a new deployment)

### Brand colours

The theme tokens are in `app/globals.css` (Tailwind 4 `@theme`):

```css title="website/app/globals.css (excerpt)"
@theme {
  --color-ink: #0a1c18;        /* page background */
  --color-ink-soft: #0f2621;
  --color-ink-800: #15312a;
  --color-cream: #f7f1e8;      /* headings, text on dark */
  --color-gold: #f5761e;       /* primary buttons, accents */
  --color-gold-deep: #e0541a;  /* button hover */
  --color-gold-soft: #ffb067;
  --color-sage: #2e8b67;
  --color-muted: #93a69f;      /* body text */
  --color-brand: #e2470f;
}
```

The site uses a dark theme only. The same palette is used in the mobile app and in the Admin Panel.

### Fonts

`app/layout.tsx` loads **Fraunces** (display), **Manrope** (sans), **Julius Sans One** and **Forum** with `next/font/google`. Replace them there. The CSS variables `--font-display`, `--font-sans`, `--font-julius` and `--font-forum` pick them up.

### Logo, favicon, share image

Replace `public/go4foodie-logo.png`, `public/go4foodie-logo-light.png`, `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` and `public/og-image.png`. Keep the names and sizes.

### Texts, contact details and opening hours

Marketing texts, the hero, the stories and the sample menu are in `lib/content.ts` and the components. The address, phone, email and opening hours shown on the site are written in `components/Visit.tsx` and `components/Footer.tsx`. They are **not** read from Admin → Settings, so change them in code.

### Currency symbol

Prices and payment buttons on the website show `$`. If you charge in another currency, update the formatting in the components and in `lib/payment.ts`, and set the gateway currencies on the backend.

### Images

Menu images use plain `<img>` tags, so any image URL works (including `/api/uploads/…` on your API host or Cloud Storage URLs). Marketing images use `next/image`. Their remote hosts must be listed in `next.config.mjs` (`images.unsplash.com` and `loremflickr.com` are already allowed).

### SEO

Set `NEXT_PUBLIC_SITE_URL` to your real domain, so that canonical URLs, the sitemap (`/` and `/menu`) and share images are correct. Edit the title and description in `metadata` in `app/layout.tsx`.

**Next:** [Ordering Flows →](doc:web/ordering)
