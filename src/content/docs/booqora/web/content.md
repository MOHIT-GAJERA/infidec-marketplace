---
title: Editing Content
description: Edit the Marketing Website copy in src/content — features, industries, plans, integrations, FAQs and blog posts — and add new pages, screenshots and photos.
---

Almost all the text on the Marketing Website lives in four typed TypeScript files in `booqora_website/src/content/`. The pages read these files at build time, so adding or changing a feature, industry, plan or blog post is a **data change**, not a code change. Run `npm run dev` while you edit and the browser refreshes on save ([Build & Deploy](doc:web/deployment)).

| File | Controls |
|---|---|
| `features.ts` | `/features`, `/features/<slug>`, the Features menu, the footer product columns |
| `industries.ts` | `/industries`, `/industries/<slug>`, the Industries menu, the footer, the About page |
| `catalog.ts` | `/pricing`, `/integrations`, the home integrations section, home and pricing FAQs, plan offers in JSON-LD |
| `posts.ts` | `/blog`, `/blog/<slug>` |

TypeScript checks every entry. If you leave out a required field, `npm run build` stops with an error that names the file and line.

## Features — `features.ts`

Each item in the `features` array is one feature:

| Field | Used for |
|---|---|
| `slug` | URL `/features/<slug>` and links from `related` / industries |
| `href` | Optional. Sends the menu link elsewhere (used by `mobile-app` → `/mobile-app` and `integrations` → `/integrations`). Entries with `href` get **no** feature page |
| `name`, `short`, `icon`, `tint` | Menu and card title, one-line summary, `lucide-react` icon, Tailwind gradient for the icon tile |
| `seoTitle`, `metaDescription`, `keywords` | Page `<title>`, meta description, keywords, Open Graph and Twitter tags |
| `eyebrow`, `headline`, `headlineAccent`, `lead` | Hero text (the accent part is shown in the gradient) |
| `shot` | Hero screenshot: `public/shots/<shot>.webp` (no extension) |
| `highlights` | Grid of short title / body cards |
| `sections` | Long sections with `title`, `body`, `bullets` and an optional `shot` |
| `faqs` | Questions shown on the page and output as FAQPage JSON-LD |
| `related` | Slugs of other features shown at the bottom |

The order of the array is the order in menus and the footer: the footer shows the first seven under **Product** and the rest under **More features**. The `/features` page groups slugs into four themes in the `groups` constant at the top of `src/app/features/page.tsx`; add a new slug there too.

## Industries — `industries.ts`

| Field | Used for |
|---|---|
| `slug` | URL `/industries/<slug>` and the photo file name |
| `name`, `short` | Menu, cards, footer |
| `photoAlt` | Alt text of the photo `public/industries/<slug>.webp` |
| `seoTitle`, `metaDescription`, `keywords` | Page metadata |
| `headline`, `headlineAccent`, `lead` | Hero |
| `examples` | "Perfect for renting" chips |
| `challenges` | Problem cards (`title`, `body`) |
| `howItHelps` | Solution cards; `feature` is a feature slug and links to that feature page |
| `faqs` | Page FAQs and FAQPage JSON-LD |
| `art` | Required by the type (one or more of the `ItemArt` values) but not drawn on the current pages |

## Plans, integrations and FAQs — `catalog.ts`

- **`plans`** — `key`, `name`, `tagline`, `monthly` (in rupees), `seats`, `features` and `popular` (adds the "Most popular" highlight). The yearly price is calculated by `yearlyMonthly()` as 20% off; `inr()` formats the amount. Keep the plans in step with **Settings → Account and billing** in the Rental Platform ([Plans & Billing](doc:admin/billing)).
- **`integrations`** — mirrors the app catalogue in the platform ([App Store (Integrations)](doc:admin/apps)). `category` groups the cards; `color` tints the tile; `beta: true` adds a Beta badge; `builtIn: true` marks the payment providers.
- **`pricingFaqs`** and **`homeFaqs`** — `{ q, a }` pairs for the pricing page and the home page.

:::warning Keep prices honest
The pricing page, the home page and the SoftwareApplication JSON-LD all read `plans`. If you change your prices, change them here **and** in the platform's billing settings.
:::

## Blog posts — `posts.ts`

A post has `slug`, `title`, `description`, `category`, `date` (ISO, e.g. `2026-11-10`), `readMinutes`, `keywords`, `art` (`"launch"`, `"pricing"` or `"calendar"` — the drawn cover) and `body`. The body is a list of blocks:

| Block | Renders |
|---|---|
| `{ t: "p", c: "…" }` | Paragraph |
| `{ t: "h2", c: "…" }`, `{ t: "h3", c: "…" }` | Headings |
| `{ t: "ul", c: ["…", "…"] }`, `{ t: "ol", c: [...] }` | Bullet or numbered list |
| `{ t: "tip", c: "…" }` | Highlighted tip box |

The first post in the array is shown large at the top of `/blog`.

## Add a new page

:::steps
### Add the entry
Copy an existing object in `features.ts`, `industries.ts` or `posts.ts`, paste it where you want it in the array and give it a new, lower-case, hyphenated `slug`.

### Write the copy
Fill in every field. Keep `metaDescription` / `description` to about 150–160 characters for search results.

### Add the image
- Feature: put a 16:10-ish desktop screenshot in `public/shots/<name>.webp` and set `shot: "<name>"`.
- Industry: put a landscape photo at `public/industries/<slug>.webp` (the name must match the slug).
- Blog post: choose one of the three `art` covers. No image file is needed.

### Link it
For a feature, add the slug to a group in `src/app/features/page.tsx` and, if you like, to other features' `related`. Industries and posts appear in menus and indexes automatically.

### Check and build
Run `npm run dev`, open the new URL, then `npm run build`. The new page is pre-rendered by `generateStaticParams` and added to `sitemap.xml` automatically.
:::

## Screenshots and photos

- **`public/shots/`** holds real screenshots of the Rental Platform (`dashboard`, `orders`, `order`, `calendar`, `customers`, `inventory`, `product`, `documents`, `online-store`, `storefront`, `reports`, `apps`, `assistant`, `settings`) and the Mobile App (`m-home`, `m-orders`, `m-order`, `m-calendar`, `m-inventory`, `m-payment`, `m-invoice`, `m-more`). Replace a file with your own capture of the **same name** to update every page that uses it. Desktop shots are shown in `BrowserFrame`, phone shots in `PhoneFrame`.
- **`public/industries/`** holds one photo per industry. The included photos are from Unsplash (Unsplash License); replace them with your own if you prefer.
- Use `.webp` and keep files small. The export does not resize images (`images.unoptimized`), so what you upload is what visitors download.

:::tip Rebrand screenshots
After you re-brand the Rental Platform, retake the screenshots so the website shows your logo and colours.
:::

**Next:** [Branding, Images & SEO →](doc:web/branding-seo)
