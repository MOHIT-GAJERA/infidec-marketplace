---
title: Web Portal Overview
description: The QwikMart customer website — a Next.js storefront connected directly to your Firebase project.
---

The **Web Portal** (`web/`) is the customer website: the same catalogue, cart, wallet and orders as the Customer App, in the browser. Customers can sign in with phone OTP or e-mail and their cart, orders and wallet are shared with the app.

![Website home](/docs/qwikmart/images/web-home.jpg "Website home page")

## Tech stack

| Part | Technology |
|---|---|
| Framework | **Next.js 15** (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, light theme |
| Data | Firebase JS SDK 12 — Firestore reads + Cloud Functions callables (`asia-south1`) |
| Auth | Firebase Authentication — anonymous guest, phone OTP (invisible reCAPTCHA), e-mail/password |
| Maps | Leaflet + OpenStreetMap (no API key) |
| Payments | Razorpay Checkout, Stripe Payment Element, Cashfree SDK, redirect gateways, Wallet, COD |
| Hosting | Firebase App Hosting (recommended) or any Node.js 22 server |

## Pages

| Route | Page |
|---|---|
| `/` and `/[zone]` (e.g. `/mumbai`) | Home — banners, categories and product sliders from the Home Builder |
| `/categories`, `/category/[slug]` | Category browsing with filters (brand, price, attributes) and sorting |
| `/products?q=` | Search results |
| `/product/[slug]` | Product detail — variants, reviews, similar products |
| `/cart`, `/checkout`, `/checkout/success` | Cart, checkout (address, delivery type, coupon, wallet, payment) |
| `/orders`, `/orders/[id]` | Order history, live status, tracking map, delivery OTP, invoice, return |
| `/wallet`, `/refer-earn`, `/favorites`, `/addresses`, `/profile`, `/notifications` | Account |
| `/support` | Support chat |
| `/blog`, `/blog/[slug]`, `/faq`, `/pages/[slug]` | Content (About, Privacy, Terms, Refund, Delete Account) |
| `/login` | Phone OTP / e-mail login and registration |

The footer **Contact Us** link opens a popup form; messages arrive in Admin → Contact Messages.

## Data modes

| `NEXT_PUBLIC_USE_MOCK` | Firebase config | Result |
|---|---|---|
| `false` | set | Live Firebase data (production) |
| `true` | — | In-browser demo data with a "DEMO DATA" badge |
| `false` | missing in a production build | Firebase calls fail visibly (no silent demo fallback) |

**Next:** [Installation Steps →](doc:web/installation-steps)
