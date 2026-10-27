# Infidec Marketplace – Product Store

Marketplace for ready-made health, food & wellness app source code and Figma UI kits.
Built with **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages statically prerendered)
npm start          # serve the production build
```

Set your real domain for canonical URLs, sitemap, Open Graph and JSON-LD:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://www.your-domain.com
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Home – hero search, featured products, stats, UI kits, testimonials, why-us, FAQ |
| `/products` | Catalog with search, category, price and rating filters + sorting (`?q=` / `?category=` supported) |
| `/products/[slug]` | Product detail – preview, license & installation picker, overview, features, license table, FAQs, reviews |
| `/installation` | Installation plan comparison table, benefits, requirements, CTA |
| `/contact-us` | Validated contact form (posts to `/api/contact`) |
| `/faqs`, `/login` | FAQ page, login screen (`noindex`) |
| `/privacy-policy`, `/refund-policy`, `/license-terms`, `/terms-and-conditions`, `/help-center`, `/documentation`, `/blogs`, `/exclusive-license` | Content pages (`src/data/pages.ts`) |

## Project structure

```
src/
  app/                 routes, sitemap.ts, robots.ts, manifest.ts, icons
  components/          Header, Footer, ProductCard, ProductsExplorer, PurchaseBox, Faq, …
  data/                products.ts (catalog), content.ts, installation.ts, pages.ts
  lib/                 site.ts (brand config, nav, ₹ formatter), thumbs.ts
scripts/
  generate-thumbs.mts  builds vector product thumbnails into public/thumbs (runs on predev/prebuild)
public/
  main-logo.png        brand logo (colours in globals.css are derived from it)
  images/*.webp        photos generated with Higgsfield (GPT Image 2.5) – hero, product covers, section backgrounds
design/                original design references (git-ignored)
```

Product photos are mapped in `productImages` inside `src/data/products.ts`; products without a photo fall back to
the generated SVG artwork.

To add a product, append it to `src/data/products.ts` – the card, detail page, thumbnail, sitemap entry and
structured data are generated automatically.

## Brand colours (from `main-logo.png`)

| Token | Hex | Use |
| --- | --- | --- |
| `brand-600` | `#1e6b16` | primary buttons, links, prices |
| `brand-800` | `#0f3d0c` | deep green (logo "Bites") |
| `brand-400` | `#6cb42c` | lime accents |
| `accent-500` | `#f47b0a` | logo orange – stars, highlights |
| `accent-600` | `#c2570c` | orange text (AA contrast) |

## SEO & performance notes

- Per-page metadata, canonical URLs, Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, web manifest.
- JSON-LD: Organization, WebSite (SearchAction), BreadcrumbList, ItemList, Product (Offer + AggregateRating), FAQPage, Service.
- Every page is statically prerendered; CSS is inlined (`experimental.inlineCss`) to remove the render-blocking request.
- Native system font stack (no web-font download) so the hero heading paints in the first frame.
- Product artwork is served as small SVG images (tiny decorative text stays out of the "legible font size" audit);
  above-the-fold thumbnails are inlined as data URIs so the LCP image needs no extra request.
- Offscreen home sections use `content-visibility: auto`.

Measure Lighthouse against the **production build** (`npm run build && npm start`), not `npm run dev`.

## Accounts, cart & checkout

| Route | What it does |
| --- | --- |
| `/register` | Sign-up: first/last name, email, phone (+country code), company (optional), country, password + confirm (strength rules), terms, newsletter opt-in |
| `/login` | Email + password, show/hide password, "remember me" (30 days), returns to `?next=` |
| `/forgot-password` | Reset via support email (self-service reset needs an email provider) |
| `/cart` | Items with licence + installation plan, remove, GST 18 %, total |
| `/checkout` | Billing details (pre-filled from account), GSTIN, address, state/PIN, payment method, terms → places order |
| `/order-success` | Confirmation with order details |
| `/account` | Profile, order history with download links, logout |

- **Guests** who click *Add to Cart* / *Buy Now* are sent to login; their selection is remembered and added to the cart
  right after they log in or register. `/cart`, `/checkout`, `/account`, `/order-success` are protected by `src/proxy.ts`.
- **Security:** passwords hashed with scrypt; sessions are HMAC-signed, `httpOnly`, `SameSite=Lax` cookies
  (`AUTH_SECRET`); prices are recalculated on the server (`src/lib/pricing.ts`) so a tampered cart can't change the charge;
  `?next=` redirects are restricted to same-site paths.
- **Storage:** users and orders are saved as JSON in `.data/` (`src/lib/db.ts`). This works on a single Node server
  (`npm start`, VPS, Docker). For serverless hosting (e.g. Vercel) replace `db.ts` with a real database.
- **Payments:** checkout currently runs in *demo mode* – orders are confirmed without charging. To go live, create a
  Razorpay/Stripe order in `src/app/api/orders/route.ts`, mark it `paid` from the gateway webhook, and set
  `NEXT_PUBLIC_PAYMENT_MODE=live`.

Copy `.env.example` to `.env.local` and set `AUTH_SECRET` before deploying.

## Cookie banner, currency & social links

- **Cookie consent** (`src/components/CookieConsent.tsx`): shown on first visit; *Accept* / *Decline* is saved in
  `localStorage` (`bow_cookie_consent`). Load analytics/marketing scripts only after consent – listen for the
  `bow:consent` window event or check `consent === "accepted"` from `useStore()`. Policy page: `/cookies-policy`.
- **Currency** (`src/components/CurrencySwitcher.tsx`, footer): USD / INR display, remembered per visitor.
  Conversion rate is `USD_RATE` in `src/lib/site.ts`. Checkout and orders are always charged in INR (USD visitors see an
  "≈ $" line). Server HTML and structured data stay in INR.
- **Social links**: edit the `social` list in `src/lib/site.ts` (also used for Organization `sameAs` structured data).

## TODO before going live

- Set `AUTH_SECRET` (see `.env.example`).
- Connect a payment gateway (see *Payments* above) and an email provider for order emails / password reset.
- `src/app/api/contact/route.ts` validates input but only logs it – connect your email/CRM provider.
- Replace the placeholder email / phone / WhatsApp number in `src/lib/site.ts`.

## Product documentation (`/docs`)

Docs-site style documentation per product, same routing as the reference docs:

| Route | What |
|---|---|
| `/docs` | List of documented products |
| `/docs/<product>` | Product docs landing page (`/docs/qwikmart`, `/docs/go4foodie`, `/docs/go4ride`, `/docs/classiadshub`) |
| `/docs/<product>/docs/<section>/<page>` | A documentation page (e.g. `/docs/qwikmart/docs/admin/overview`) |
| `/docs/<product>/search-index.json` | Static search index for the Ctrl + K search dialog |

- **Content** — one Markdown file per page in `src/content/docs/<product>/<section>/<page>.md`, with front matter
  (`title`, `description`). Supported syntax: headings, lists, tables, code fences (```` ```bash title="file" ````),
  images (`![alt](/docs/<product>/images/x.jpg "caption")`), callouts (`:::note|tip|warning|danger Title … :::`),
  numbered steps (`:::steps` + `### Step`), link cards (`:::cards`), checklists (`- [x]`), and internal links
  `[text](doc:admin/overview#anchor)`. Parser: `src/lib/docs/markdown.ts`.
- **Sidebar order / sections / tabs** — `src/lib/docs/products.ts` (also drives Previous / Next and the sitemap).
  A page must be listed there **and** have a `.md` file; `next build` prerenders every page.
- **Images** — `public/docs/<product>/images/` (screenshots; `app-*` files render as a phone gallery).
- **Add a product's docs** — add an entry to `docsProducts` in `src/lib/docs/products.ts` and a folder in
  `src/content/docs/<slug>/`. Optional per product: `quickStart` (landing-page steps) and `installSlug`
  (target of the *Installation Guide* button); both default to the QwikMart values.

### Documented products

| Product | Docs | Product page data | Images |
|---|---|---|---|
| QwikMart | `/docs/qwikmart` (`src/content/docs/qwikmart/`) | `src/data/qwikmart.ts` | `public/images/qwikmart*`, `public/docs/qwikmart/` |
| Go4Foodie | `/docs/go4foodie` (`src/content/docs/go4foodie/`) | `src/data/go4foodie.ts` | `public/images/go4foodie*`, `public/docs/go4foodie/` |
| Go4Ride | `/docs/go4ride` (`src/content/docs/go4ride/`) | `src/data/go4ride.ts` | `public/images/go4ride*`, `public/docs/go4ride/` |
| ClassiAds-Hub | `/docs/classiadshub` (`src/content/docs/classiadshub/`) | `src/data/classiadshub.ts` | `public/images/classiadshub*`, `public/docs/classiadshub/` |

Go4Foodie screenshots were captured from the live demo with names, e-mails and phone numbers replaced by fictional
demo values (display-only), so no real customer data appears in the docs or product images.

Go4Ride screenshots were captured from the Firebase Emulator Suite with fictional demo data (riders, drivers, rides and sample KYC documents marked *SAMPLE*), so no live customer data appears in the docs or product images.

ClassiAds-Hub screenshots were captured from the live demo (classiadshub.web.app) with its fictional demo accounts; list rows left behind by automated QA runs were hidden or cropped out (display-only), so no real customer data appears in the docs or product images.
- Components: `src/components/docs/` (top bar, sidebar, table of contents, search, Markdown blocks).
