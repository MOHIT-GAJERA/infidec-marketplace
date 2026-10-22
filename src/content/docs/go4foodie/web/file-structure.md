---
title: File Structure
description: Find your way around the Go4Foodie website codebase.
---

```text title="website/"
app/                          Routes (App Router)
  layout.tsx                  Root layout: fonts (Fraunces, Manrope, Julius Sans One, Forum), metadata, Open Graph
  globals.css                 Tailwind 4 theme tokens (@theme colours & fonts), buttons, base styles
  page.tsx                    / — home page sections
  menu/page.tsx               /menu — full menu (force-dynamic)
  order/page.tsx              /order and /order?table=<code> — online ordering (force-dynamic)
  table-reservation/page.tsx  /table-reservation — table booking & private events
  about/ privacy/ terms/      Static pages
  sitemap.ts, robots.ts       SEO metadata routes
  icon.png, apple-icon.png, favicon.ico
  api/                        Same-origin proxy route handlers → ADMIN_API_URL
    availability/route.ts     GET  → /api/reservations/availability
    orders/route.ts           POST → /api/orders
    reservations/route.ts     POST → /api/reservations
    gift-cards/route.ts       POST → /api/gift-cards
    payment/route.ts          GET, POST → /api/payment
    payment/capture/route.ts  POST → /api/payment/capture
components/
  Header, Hero, Marquee, Menu, MenuCard, MenuExplorer, Kitchen, Stories,
  Testimonials, Visit, About, Contact, Footer, Reveal, Stars
  GiftCard.tsx                Gift card / coupon purchase dialog (Amount → Details → Delivery → Review)
  ReservationFlow.tsx         Table booking & private event wizard
  order/
    OrderFlow.tsx             Take Away (Menu → Pickup → Details) and Dine-In (Reservation → Details)
    TableOrderFlow.tsx        Table QR ordering (menu → details → Send to Kitchen)
    MenuStep.tsx              Menu picker + cart
    ScheduleStep.tsx          Schedule Now / Schedule Later (date + slot)
    DineInStep.tsx            Party size, date, live slot availability
    styles.ts                 Shared form classes
lib/
  admin-api.ts                ADMIN_API_URL (server only)
  menu-api.ts                 getLiveMenu() + static fallback
  content.ts                  Static content: nav links, hero dish, marquee, sample menu, stories
  order.ts                    Business hours, lead/prep minutes, slot & date helpers
  payment.ts                  pay(): provider chooser, Razorpay / Stripe / PayPal checkout
  site.ts                     siteUrl (NEXT_PUBLIC_SITE_URL) and the og:image URL
public/                       Logos, front image, og-image.png, background videos (menu, restaurant, reservation)
apphosting.yaml               App Hosting run config + environment
firebase.json, .firebaserc    App Hosting backend id + project (local-source deploys)
next.config.mjs               Image formats + allowed remote image hosts
```

## Where to change common things

| Change | File |
|---|---|
| Colours, fonts | `app/globals.css` (`@theme` tokens), `app/layout.tsx` (font imports) |
| Logo, favicon, share image | `public/go4foodie-logo*.png`, `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `public/og-image.png` |
| Site title and description (SEO) | `metadata` in `app/layout.tsx` |
| Header links | `NAV_LINKS` in `lib/content.ts` |
| Hero, marquee, stories, sample menu | `lib/content.ts` |
| Address, phone, email, opening hours | `components/Visit.tsx`, `components/Footer.tsx` |
| Social links | `components/Footer.tsx` |
| About / privacy / terms text | `app/about/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx` |
| Business hours, pickup lead time, prep time, days ahead | `lib/order.ts` (keep them in sync with the backend, see [Ordering Flows](doc:web/ordering#business-rules)) |
| Booking times on `/table-reservation`, occasions, event types, spaces | Constants at the top of `components/ReservationFlow.tsx` |
| Gift card amounts | `AMOUNTS` in `components/GiftCard.tsx` |
| Menu, prices, availability | Admin Panel → Menu (no code change) |

**Next:** [Configuration & Theming →](doc:web/configuration)
