---
title: Web Portal Overview
description: The Go4Foodie customer website. A server-rendered Next.js 16 site for take-away ordering, table QR ordering, table bookings, private events and gift cards, connected to your Firebase backend.
---

The **Web Portal** (`website/`) is the restaurant's public website. Guests browse the live menu, order take-away (now or for later), order from their table by scanning its QR code, book a table or request a private event, and buy gift cards and coupons. Everything they create appears in the Admin Panel and in the Restaurant and Owner apps right away.

![Website home](/docs/go4foodie/images/web-home.jpg "Home page")
![Website home (full page)](/docs/go4foodie/images/web-home-full.jpg "Home page sections")
![Menu](/docs/go4foodie/images/web-menu.jpg "Menu")

## Tech stack

| Part | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, server-side rendering), React 19, TypeScript |
| Styling | Tailwind CSS 4, dark ink/cream/orange theme; fonts Fraunces, Manrope, Julius Sans One and Forum (`next/font`) |
| Data | Server-side `fetch` to your backend (`ADMIN_API_URL`) for the menu and table lookups, plus same-origin `/api/*` proxy routes for everything the browser sends |
| Auth | None. Guests order and book with name, email and phone. No accounts, no cookies |
| Payments | Razorpay Checkout, Stripe Payment Element, PayPal Buttons, loaded on demand in the browser ([Payments](doc:web/payments)) |
| Hosting | **Firebase App Hosting** (recommended) or any Node.js server ([Deployment](doc:web/deployment)) |

## How it talks to the backend

```text
Browser ──same origin──▶ website /api/* route handlers ──server-side fetch──▶ ADMIN_API_URL/api/*
Next.js server pages (/, /menu, /order) ─────────────────server-side fetch──▶ ADMIN_API_URL/api/*
```

- The browser **never calls the backend host directly**. It only calls the website's own `/api/*` routes, which forward the request to `ADMIN_API_URL` (your API Hosting site, which rewrites `/api/**` to the `api` Cloud Function). There is no CORS setup and the backend URL stays hidden.
- No secrets live in the website. Payment **public** keys are fetched at runtime from `POST /api/payment`.
- There is no polling and no realtime. The only live lookup is table availability when the guest changes the date.

## Pages

| Route | Page | Rendering |
|---|---|---|
| `/` | Home: header, hero, marquee, **menu preview** (first 6 live items), kitchen, stories, testimonials, visit, **gift card** section, footer | Dynamic SSR (menu fetched per request) |
| `/menu` | Full menu with category filter and search (`MenuExplorer`) | `force-dynamic` |
| `/order` | Online ordering: **Take Away** or **Dine-In** (table booking) | `force-dynamic` |
| `/order?table=<code>` | **Table QR ordering**: the table banner, menu and *Send to Kitchen* | `force-dynamic` |
| `/table-reservation` | **Table Booking** or **Private Event** request | Static shell + client flow |
| `/about` | About the restaurant | Static |
| `/privacy`, `/terms` | Privacy policy and terms (needed for Google Play) | Static |
| `/sitemap.xml`, `/robots.txt` | SEO metadata routes, built from `NEXT_PUBLIC_SITE_URL` | Static |

The header and hero buttons open the gift-card dialog. Header links: **Menu**, **About**, **Contact** (scrolls to the footer).

![About](/docs/go4foodie/images/web-about.jpg "About page")
![Mobile home](/docs/go4foodie/images/web-mobile-home.jpg "Home on a phone")
![Mobile menu](/docs/go4foodie/images/web-mobile-menu.jpg "Menu on a phone")

## API routes (proxies)

| Website route | Forwards to | On network error |
|---|---|---|
| `GET /api/availability?date=` | `GET /api/reservations/availability?date=` | `502` *Availability unavailable* |
| `POST /api/orders` | `POST /api/orders` | `502` *Ordering is temporarily unavailable. Please try again shortly.* |
| `POST /api/reservations` | `POST /api/reservations` | `502` *Reservations are temporarily unavailable. Please try again shortly.* |
| `POST /api/gift-cards` | `POST /api/gift-cards` | `502` *Gift cards are temporarily unavailable. Please try again shortly.* |
| `GET /api/payment` | `GET /api/payment` | `200` `{razorpay:false, stripe:false, paypal:false}` |
| `POST /api/payment` | `POST /api/payment` | `502` *Payment is temporarily unavailable.* |
| `POST /api/payment/capture` | `POST /api/payment/capture` | `502` *Payment is temporarily unavailable.* |

Each proxy forwards the body unchanged with `Content-Type: application/json` and `cache: 'no-store'`, and returns the backend's status code and JSON as they are. Server pages call `GET /api/menu` and `GET /api/tables/{code}` directly. The endpoints are described in [Public API](doc:api/public).

## Menu fallback

The menu comes from **Admin → Menu** (available items in active categories). If the backend is unreachable or returns no items, `/`, `/menu` and `/order` fall back to the **static sample menu** in `lib/content.ts`, so the site never shows an empty page. Orders placed from the fallback menu still work when their item names match your real menu items. Always check that a fresh deployment shows **your** dishes.

**Next:** [Installation Steps →](doc:web/installation-steps)
