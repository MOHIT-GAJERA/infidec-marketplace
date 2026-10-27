---
title: Overview
description: The ClassiAds-Hub website — a statically exported Next.js 16 marketplace that talks to the Firebase `api` Cloud Function and Firebase Authentication.
---

The **website** (`web/`) is the public marketplace and the user dashboard. Visitors browse and search ads, open ad pages, chat with sellers, make offers and follow sellers. Signed-in users post and manage ads, buy subscription plans and featured-ad boosts, apply to jobs and request seller verification.

It uses the same backend as the Mobile App and the Admin Panel: every page calls the `api` Cloud Function (`/api/v1/*`) and signs users in with Firebase Authentication. An account created on the website works in the app, and the other way round.

![Website home](/docs/classiadshub/images/web-home.jpg "Website home page")
![Home on a phone](/docs/classiadshub/images/web-mobile-home.jpg "The same page at phone width")

:::note Plans and featured ads are sold on the website only
The Mobile App has no in-app purchases. Subscription packages and featured-ad boosts are bought on the website through hosted checkout pages. See [Plans, Featured Ads & Checkout](doc:web/checkout).
:::

## Tech stack

| Part | Technology |
|---|---|
| Framework | **Next.js 16.2** (App Router) with `output: "export"`, React 19.2, TypeScript 5 |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`), brand tokens in `src/app/globals.css`, Geist font via `next/font/google` |
| Data | `fetch` to the `api` Cloud Function. The client unwraps the `{ success, data, message, meta, errors }` envelope (`src/lib/api.ts`) |
| Auth | Firebase JS SDK 12 — e-mail or phone + password (through the API), session kept in browser local storage |
| Hosting | Firebase Hosting, target `web` (static files in `web/out`) |
| Runtime dependencies | Only `next`, `react`, `react-dom` and `firebase` |

There is no server-side code in the website. All pages are static HTML shells that load their data in the browser. Dynamic pages (ads, categories, sellers, blog posts, jobs, CMS pages, ad edit) are exported once as a `_` placeholder page, and Firebase Hosting rewrites every matching URL to it. See [File Structure](doc:web/file-structure#dynamic-routes) and [Deployment](doc:web/deployment).

## Pages

| Route | Page | Login |
|---|---|---|
| `/` | Home — banner slider, **Popular Categories**, feature sections, **All Advertisements** | No |
| `/search` | Search results with category, price and condition filters, sort and pagination | No |
| `/category/<slug>` | Category landing with sub-category chips | No |
| `/nearby` | **Ads near you** — browser location + radius | No |
| `/ad/<slug>` | Ad detail — gallery, specifications, **Chat**, **Make an Offer**, favourite, seller card, report | No (actions need login) |
| `/seller/<id>` | Seller profile — follow, live ads, ratings & reviews | No |
| `/login`, `/register`, `/verify-otp`, `/forgot-password` | Accounts | No |
| `/post-ad` | **Post an Ad** form | Yes |
| `/dashboard/...` | Overview, My Ads (+ edit), Favorites, Chat, Notifications, Subscriptions, Transactions, Reviews, Job Applications, Verification, Profile | Yes |
| `/checkout`, `/checkout/result` | Checkout and payment result | Yes |
| `/blog`, `/blog/<slug>` | Blog | No |
| `/jobs`, `/jobs/<slug>` | Jobs and **Apply Now** | No (apply needs login) |
| `/page/<key>` | CMS pages: `about`, `contact`, `privacy`, `terms`, `refund` | No |
| `/sitemap.xml`, `/robots.txt` | Generated at build time | — |

## Header and footer

Every page shares the same layout (`src/app/layout.tsx`):

- **Header, top row**: logo, **All Categories** drop-down with a category search box, the **Search any advertisement…** field and the amber search button, **Add Location** (opens `/nearby`), **Login | Register** or the user avatar menu (**Dashboard, My Ads, Favorites, Chat, Subscriptions, Sign out**), the amber **Ad Listing** button (opens `/post-ad`) and the language selector.
- **Header, second row**: the first 7 root categories and an **Other** link to `/search`.
- **Footer**: logo and tagline, social icons, **Quick Links** (About Us, Contact Us, Subscription, Our Blog, FAQs), **Get in touch** (e-mail, phone), copyright, Privacy Policy and Terms & Conditions links.

:::warning Some header and footer items are fixed in code
The footer e-mail and phone number, the social icon links (`#`), the Google Play / App Store badge links (`#`) and the two hero banners are written in the source code. They do not come from the Admin Panel. The language selector lists the languages from **Admin → Settings → Languages** (active languages), but choosing one only changes the flag shown — the website texts are English only. Change these in code as described in [Configuration](doc:web/configuration).
:::

## How a page loads data

1. The static HTML shell loads and Firebase restores the saved session (`authReady` in `src/lib/firebase.ts`).
2. The page calls the API with `useApi()` or `clientApi()`. When a user is signed in, the Firebase ID token is sent as `Authorization: Bearer <token>`.
3. On Firebase Hosting the API base is the same-origin `/api/v1` (Hosting rewrite to the `api` function). On `localhost` the website calls the function URL directly.
4. Errors come back as `ApiError` with the server message and field errors, shown in red boxes on forms.

## Live demo

- Website: `https://classiadshub.web.app`
- Admin Panel: `https://classiadshub-admin.web.app`

Demo logins are shared on request.

**Next:** [Installation Steps →](doc:web/installation-steps)
