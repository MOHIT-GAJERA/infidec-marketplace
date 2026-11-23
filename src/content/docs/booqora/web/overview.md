---
title: Website Overview
description: The Booqora Marketing Website, a statically exported Next.js 16 site on Firebase Hosting with feature, industry, pricing and blog pages and login links to the Rental Platform.
---

The Marketing Website (`booqora_website/`) is the public face of Booqora. It explains the product, shows real screenshots, lists the plans and sends visitors to the [Rental Platform](doc:admin/overview) to sign up or log in. It is a **Next.js 16** app written in TypeScript and styled with **Tailwind CSS 4**, but it is **exported as plain static files** (`output: "export"`), so there is no Node.js server to run. The files are served by **Firebase Hosting**.

The live copy runs at `https://booqora-infidec.web.app`, the default Hosting site of the author's Firebase project. When you install it, it is deployed to a site in **your own** project (`<your-project-id>`) and, later, your own domain.

![Marketing website home](/docs/booqora/images/website-home.webp "The home page with the hero, product screenshots and the Start free trial button")

## How it fits with the rest of Booqora

| Part | Where it lives | Hosting site |
|---|---|---|
| Marketing Website | `booqora_website/` (Next.js) | `website` target (e.g. `<your-project-id>.web.app`) |
| Rental Platform | `booqora_platform/` (Flutter Web) | `platform` target (e.g. `<your-platform-site>.web.app`) |
| Online Store | Inside the platform at `/s/<workspace-slug>` | Same as the platform |

The website does **not** read Firestore and does not use Firebase Authentication. It only links to the platform:

| Button | Goes to |
|---|---|
| **Log in** (header, footer, contact page) | `site.loginUrl` → `<platform>/login` |
| **Start free trial** (header and every call-to-action band) | `site.signupUrl` → `<platform>/signup` |
| **Privacy policy** (footer) | `site.privacyUrl` → `<platform>/privacy` |

All three are built from `PLATFORM_URL` in `src/lib/site.ts`. Change it once and these buttons follow; the 404 page has its own hard-coded login link ([Branding, Images & SEO](doc:web/branding-seo)).

## Pages

| Route | Page | Content source |
|---|---|---|
| `/` | Home: hero, industries strip, feature bento grid, "how it works", mobile app band, industries, integrations, FAQ | `src/app/page.tsx`, `homeFaqs` |
| `/features` | All features, grouped into four themes | `src/content/features.ts` |
| `/features/<slug>` | 11 feature pages (see below) | `features.ts` |
| `/industries` | All industries with photos | `src/content/industries.ts` |
| `/industries/<slug>` | 6 industry pages (see below) | `industries.ts` |
| `/pricing` | Plans with a monthly / yearly toggle and pricing FAQs | `catalog.ts` → `plans`, `pricingFaqs` |
| `/integrations` | The app catalogue grouped by category | `catalog.ts` → `integrations` |
| `/mobile-app` | Mobile App screens and FAQs | `src/app/mobile-app/page.tsx` |
| `/about` | Values and the industries served | `src/app/about/page.tsx` |
| `/contact` | Contact cards and a contact form | `src/app/contact/page.tsx` |
| `/blog` | Rental guides index | `src/content/posts.ts` |
| `/blog/<slug>` | 3 guides | `posts.ts` |
| any other URL | 404 page "This page has been rented out" | `src/app/not-found.tsx` |

**Feature pages (11):** `online-booking`, `inventory-management`, `order-management`, `rental-calendar`, `payments`, `documents`, `customer-management`, `reports`, `barcode-scanning`, `team-and-security`, `bora-assistant`. The menu also lists **Mobile app** and **Integrations**, which link to their own pages (`/mobile-app`, `/integrations`) instead of `/features/<slug>`.

**Industry pages (6):** `camera-av-rental`, `party-event-rental`, `bike-scooter-rental`, `tool-equipment-rental`, `sports-outdoor-rental`, `furniture-decor-rental`.

**Guides (3):** `how-to-start-a-rental-business`, `rental-pricing-strategy`, `prevent-double-bookings`.

![Features page](/docs/booqora/images/website-features.webp "The features overview grouped into four themes")
![Feature page](/docs/booqora/images/website-feature-page.webp "A feature page with highlights, sections, screenshots and FAQs")

![Industry page](/docs/booqora/images/website-industry.webp "An industry page with challenges and how Booqora helps")
![Pricing page](/docs/booqora/images/website-pricing.webp "Pricing with the monthly / yearly toggle")
![Blog](/docs/booqora/images/website-blog.webp "The rental guides index")

## The contact form

The site has no backend, so the contact form does **not** post anywhere. On submit it builds a `mailto:` link to `site.email` with the name, e-mail, phone, business, topic and message, and opens the visitor's own e-mail app. Set `email` in `src/lib/site.ts` to your real support inbox.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 (`@tailwindcss/turbopack`), `tw-animate-css` |
| Components | shadcn/ui on Base UI (`src/components/ui/*`), `lucide-react` icons |
| Animation | `motion` (scroll reveals, floating chips, parallax; respects reduced motion) |
| Fonts | Plus Jakarta Sans (headings) and Inter (body) via `next/font/google` |
| Output | Static export to `out/`, images unoptimised |
| SEO | Metadata API, JSON-LD, generated `sitemap.xml` and `robots.txt` |
| Hosting | Firebase Hosting, target `website` |

## Highlights

- Real screenshots of the Rental Platform and Mobile App in browser and phone frames.
- Every feature and industry page is generated from one typed data file, so adding a page is a data change ([Editing Content](doc:web/content)).
- Structured data on every page: Organization, WebSite, SoftwareApplication with plan offers, BreadcrumbList, FAQPage and Article.
- Responsive header with drop-down menus on desktop and a slide-in menu panel on mobile.
- Security headers and long-cache rules in `firebase.json` ([Build & Deploy](doc:web/deployment)).

![Mobile view](/docs/booqora/images/website-mobile.webp "The website on a phone")

**Next:** [File Structure →](doc:web/file-structure)
