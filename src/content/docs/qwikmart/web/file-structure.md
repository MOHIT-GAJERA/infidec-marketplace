---
title: File Structure
description: Find your way around the website codebase.
---

```text title="web/"
src/
  app/                    Routes (App Router) — one folder per URL, see the Overview page
    layout.tsx            Root layout: providers, header, footer, cookie bar
    globals.css           Tailwind layers, design tokens, rich-text (.prose-sb) styles
  components/
    layout/               TopBar, Header, Footer, ContactModal, CookieBar, Providers
    home/                 Home section renderer (banners, sliders, categories, brands)
    product/              ProductCard, product listing + filters, product detail parts
    checkout/             Address picker, payment method list, bill summary
    account/              Account shell, order cards
    map/                  Leaflet maps (tracking, address pin)
    ui.tsx                Buttons, Modal, Breadcrumbs, EmptyState, Spinner…
    icons.tsx             Payment logos, store badges, social icons
  lib/
    api.ts / api-types.ts Data layer entry point — the UI only talks to `api`
    fb/                   Firebase implementation: catalog, cart, orders, account, chats, content
    mock/                 In-browser demo implementation
    firebase.ts           Firebase init, emulator wiring, FUNCTIONS_REGION
    auth.ts               Guest / phone / e-mail sign-in flows
    payments.ts           Razorpay, Stripe, Cashfree, redirect gateway hand-off
    push.ts               Optional web push
    i18n.ts               English / Arabic (RTL) / Hindi UI strings
  store/                  zustand stores: location, auth profile, cart, UI
public/                   Static images, firebase-messaging-sw.js
apphosting.yaml           App Hosting runtime + build environment
.env.example              Environment template
```

## Where to change common things

| Change | File |
|---|---|
| Colours, fonts | `tailwind.config.*`, `src/app/globals.css` |
| UI texts | `src/lib/i18n.ts` |
| Header / footer layout | `src/components/layout/` |
| Product card | `src/components/product/ProductCard.tsx` |
| Logo & favicon | `public/`, `src/app/icon.png`, `src/app/apple-icon.png` |
| Share image (Open Graph) | `src/app/opengraph-image.png`, `twitter-image.png` |
| Content (home, pages, footer contact details) | Admin Panel — no code change |

**Next:** [Configuration & Theming →](doc:web/configuration)
